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
        const { email, oldPassword, password } = req.body;
        const user = await User.findByPk(req.userId);

        // só vai verificar duplicidade de email se estiver mudando
        if (email && email !== user.email) {
            const exists = await User.findOne({ where: { email } });

            if (exists) {
                return res
                    .status(400)
                    .json({ error: 'Novo e-mail já está sendo usado.' });
            }
        }
        // verifica se a senha antiga passada está correta
        if (password && !oldPassword) {
            return res.status(400).json({
                error:
                    'Para modificar a senha é necessário informar a senha antiga.',
            });
        }
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(400).json({ error: 'Senha inválida.' });
        }

        const { id, name, provider } = await user.update(req.body);
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }
}

export default new UserController();
