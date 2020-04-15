import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

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
}

export default new AppointmentController();
