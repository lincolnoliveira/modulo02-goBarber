import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
    // o storage poderia ser um CDN como da amazon ou digital ocean,
    // mas no nosso caso será arquivo físico na máquina
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb) => {
            // vai alterar o nome do arquivo original para incluir um id único
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err); // se der erro, chama a função callback cb com o erro
                // se tudo certo, chama o cb com null (err), um hexa aleatório e a extensão
                return cb(null, res.toString('hex') + extname(file.originalname))
            })
        }
    })
}