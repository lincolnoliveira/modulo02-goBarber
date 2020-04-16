import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
    async index(req, res) {
        // verificando se o provider é provider
        const isProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!isProvider) {
            return res.status(401).json({
                error: 'Somente provedores podem pesquisar as notificações.',
            });
        }

        // método de procura no BD é diferente, já que estamos usando o
        // mongoose/mongoDb
        const notifications = await Notification.find({
            user: req.userId,
        })
            .sort({ createdAt: 'desc' })
            .limit(5);

        return res.json(notifications);
    }

    async update(req, res) {
        // método mongoose que consulta e atualiza
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, // chave a ser buscada
            { read: true }, // campo e valor atualizado
            { new: true } // retorna registro atualizado
        );
        return res.json(notification);
    }
}

export default new NotificationController();
