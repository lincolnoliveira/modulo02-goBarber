// biblioteca de validação
// não tem um export default, então importa tudo para este Yup
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    // semelhante a um middleware
    async store(req, res) {
        // defino o shape do objeto que vou querer
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Campos inválidos.' });
        }
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
        // defino o shape do objeto que vou querer
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            password: Yup.string().min(6),
            oldPassword: Yup.string()
                // teste dependente do password. Se password existe, field.required
                .when('password', (password, field) =>
                    password ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                // semelhante, se há password, tem que ter confirmPassword com o mesmo valor de password
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Campos inválidos.' });
        }

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
