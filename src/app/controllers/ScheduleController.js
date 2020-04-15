import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class ScheduleController {
    async index(req, res) {
        // somente prestadores de serviço têm acesso a esta lista
        const isProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });
        if (!isProvider) {
            return res
                .status(401)
                .json({ erro: 'Acesso restrito aos provedores' });
        }

        // pega a query da url (após o ?)
        // por default page será 1
        const { page = 1 } = req.query;

        const { date } = req.query;
        const parsedDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            },
            attributes: ['id', 'date'],
            order: ['date'],
            // 5 por página
            limit: 5,
            offset: (page - 1) * 5,
            include: [
                // para incluir relacionamentos, no caso apenas um
                {
                    model: User,
                    as: 'user',
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

export default new ScheduleController();
