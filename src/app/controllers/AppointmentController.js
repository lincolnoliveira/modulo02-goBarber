import * as Yup from 'yup';

import Appointment from '../models/Appointment';
import User from '../models/User';

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

        // criando o agendamento
        const appoint = await Appointment.create({
            user_id: req.userId, // guardado na requisição pelo middleware de autenticação, auth.js
            provider_id,
            date,
        });

        return res.json(appoint);
    }
}

export default new AppointmentController();
