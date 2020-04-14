import User from '../models/User';
import File from '../models/File';

class ProviderController {
    async index(req, res) {
        const providers = await User.findAll({
            where: { provider: true },
            attributes: ['id', 'name', 'avatar_id'],
            // para incluir um relacionamento
            include: [
                {
                    model: File,
                    as: 'avatar', // mesmo "as" do model User
                    attributes: ['name', 'path', 'url'],
                },
            ],
        });

        return res.json(providers);
    }
}

export default new ProviderController();
