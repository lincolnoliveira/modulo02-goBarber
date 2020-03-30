import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;
        // procura usuário
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Usuário ou senha incorretos.' });
        }
        // verifica a senha
        if (!(await user.checkPassword(password))) {
            return res
                .status(401)
                .json({ error: 'Usuário ou senha incorretos.' });
        }

        const { id, name } = user;

        // retornará um user diminuído e o token
        return res.json({
            user: { id, name, email },
            // parâmetros do jwt:
            //   payload (informação a ser recuperada de dentro do token): apenas o id
            //   uma string que deve ser única no mundo! sugestão: no md5online, coloca uma frase grande e usa o md5 resultante
            //   data de expiração
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
