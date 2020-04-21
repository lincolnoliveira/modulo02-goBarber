import { format, pt, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class CancellationMail {
    // Jeito de criar uma variável/propriedade de leitura na classe
    // ex: import c from '....CancellationMail.js';  .... console.log(c.key);
    get key() {
        // vai ser o identificador deste job
        return 'CancellationMail';
    }

    // método vai receber várias informações. Vai usar o que estiver dentro do
    // data para obter as informações do agendamento.
    async handle({ data }) {
        const { appoint } = data;
        // console.log('-------> executando o cancellation mail');
        // console.log(appoint);
        await Mail.sendMail({
            to: `${appoint.provider.name} <${appoint.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                provider: appoint.provider.name,
                user: appoint.user.name,
                date: format(
                    parseISO(appoint.date),
                    "'dia 'dd' de 'MMMM', às 'H:mm'h'",
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new CancellationMail();
