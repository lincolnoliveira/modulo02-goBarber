import * as Yup from 'yup';
import {
    startOfHour,
    parseISO,
    isBefore,
    format,
    pt,
    subHours,
} from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Campos inválidos.' });
        }

        const { provider_id, date } = req.body;

        // verificando se o provider é provider
        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider) {
            return res.status(401).json({
                error: 'Somente pode-se criar apontamentos para provedores.',
            });
        }

        // obtém a data e hora (sem min, seg)
        const hourStart = startOfHour(parseISO(date));

        // verificando datas no passado
        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ erro: 'Agendamentos não podem ser para o passado.' });
        }

        // verificando se data/hora está disponível
        const isOccupied = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });
        if (isOccupied) {
            return res
                .status(400)
                .json({ erro: 'Horário de agendamento já está ocupado.' });
        }

        // criando o agendamento
        const appoint = await Appointment.create({
            user_id: req.userId, // guardado na requisição pelo middleware de autenticação, auth.js
            provider_id,
            date: hourStart, // para garantir que os agendamentos sejam em hora cheia
        });

        // notificando o provedor do novo agendamento
        const user = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia 'dd' de 'MMMM', às 'H:mm'h'",
            { locale: pt }
        );
        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        });

        return res.json(appoint);
    }

    async index(req, res) {
        // pega a query da url (após o ?), para obter a página
        // por default page será 1
        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            attributes: ['id', 'date'],
            order: ['date'],
            // 5 por página
            limit: 5,
            offset: (page - 1) * 5,
            include: [
                // para incluir relacionamentos, no caso apenas um
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        // include dentro de include...
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });

        return res.json(appointments);
    }

    async delete(req, res) {
        // vai aproveitar e buscar os dados do provedor qdo busca o agendamento
        const appoint = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
        });
        if (!appoint) {
            return res.status(400).json({
                error: 'Não encontrou o agendamento.',
            });
        }
        if (appoint.canceled_at) {
            return res.status(400).json({
                error: 'Agendamento já estava cancelado.',
            });
        }
        if (appoint.user_id !== req.userId) {
            return res.status(401).json({
                error: 'Apenas o próprio provedor pode cancelar o agendamento.',
            });
        }

        const dataLimite = subHours(appoint.date, 2);
        if (isBefore(dataLimite, new Date())) {
            return res.status(401).json({
                error: 'Limite para cancelamento: 2h antes do agendamento.',
            });
        }
        appoint.canceled_at = new Date();

        // await appoint.save();

        // em vez de mandar e-mail, vai colocá-lo na fila
        Queue.add(CancellationMail.key, { appoint });

        return res.json(appoint);
    }
}

export default new AppointmentController();
