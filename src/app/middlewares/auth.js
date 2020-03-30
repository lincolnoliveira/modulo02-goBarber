// para verificar o token
import jwt from 'jsonwebtoken';

// para usar o async/await na verificação do token
import { promisify } from 'util';

// para buscar o secret
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Sem token de autorização' });
    }

    // o split do authHeader será um vetor: ['Bearer', token]. Vou pegar só o token
    const [, token] = authHeader.split(' ');

    try {
        // estranho... vamos lá
        // o promisify vai retornar uma função, permitindo usar o await
        // então os segundos () são para a função retornada pelo promisify.
        // E o jwt.verify é quem vai verificar token vs nosso secret,
        //  retornando o payload do token, no caso o id do usuário, bem como informação
        //  de expiração do token
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        // agora incluirá o id do usuário na requisição para poder usar nas
        //  próximas funções
        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
};
