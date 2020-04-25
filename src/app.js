import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import 'express-async-errors'; // para o express capturar erros de async e poder passar ao sentry
import Youch from 'youch';

import sentryConfig from './config/sentry';
import routes from './routes';
import './database';

class App {
    constructor() {
        this.server = express();

        // sw de monitoramento da aplicação
        Sentry.init(sentryConfig);

        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler()); // antes da rotas
        this.server.use(express.json());
        // este middle cria um "rota" de acesso para conteúdo estático,
        // no caso, a rota /files trará os arquivos do diretótio ../tmp/uploads
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler()); // depois da rotas
    }

    // tto de erro usando o youch, vai retornar um erro em formato json para o cliente
    exceptionHandler() {
        // qdo o middleware recebe 4 parâmetros, o express sabe que é de tto de exceção
        this.server.use(async (err, req, res, next) => {
            const errors = await new Youch(err, req).toJSON();

            return res.status(500).json(errors); // erro 500, erro interno do servidor
        });
    }
}

export default new App().server;
