import User from '../models/User';

class UserController {
    // semelhante a um middleware
    async store(req, res) {
        // verifica se o email do usuário já está cadastrado
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (userExists) {
            return res
                .status(400)
                .json({ error: 'Usuário com este e-mail já existe.' });
        }
        // pegaria/retornaria todos os campos do body
        // const user = await User.create(req.body);
        // return res.json(user);

        // mas quer retornar apenas alguns campos
        const { id, name, email, provider } = await User.create(req.body);

        return res.json({
            id,
            name,
            email,
            provider,
        });
    }

    async update(req, res) {
        console.log(req.userId);

        return res.json({ ok: true });
    }
}

export default new UserController();
