import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// lista dos jobs a serem carregados
const jobs = [CancellationMail];

class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }

    // inicializa as filas (queues) com todos os jobs que existem na aplicação
    // cada fila conterá o acesso ao redis e a função handle que é quem processa o job da fila
    init() {
        jobs.forEach(({ key, handle }) => {
            // cada linha do this.queue será uma chave-valor:
            // chave: key; valor: objeto com {bee, handle}
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    // Adiciona um novo item a alguma fila
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    // processa as filas
    processQueue() {
        // para cada job
        jobs.forEach((job) => {
            // obtém o bee (com acesso ao redis) e o handle
            const { bee, handle } = this.queues[job.key];
            // e manda o bee processar o handle
            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err) {
        console.log(`Fila ${job.queue.name}: FALHOU`, err);
    }
}

export default new Queue();
