import File from '../models/File';

class FileController {
    async store(req, res) {
        // vai pegar originalname e filename da req e colocar nas variáveis do modelo
        const { originalname: name, filename: path } = req.file;

        // insere novo registro no BD
        const file = await File.create({
            name,
            path,
        });
        return res.json(file);
    }
}

export default new FileController();
