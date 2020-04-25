import 'dotenv/config'; // importa vars do .env e ficam acessíveis em process.env.VARIAVEL
import Queue from './lib/Queue';

Queue.processQueue();
