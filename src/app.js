// A versão atual do Node, ainda não tem o import/export.
// A sintaxe então seria assim:
// const express = require ('express');
// const routes = require ('./routes');

// Mas dá para usar algumas bibliotecas que traduzem o código para versões mais
// antigas do javascript, como o babel e o sucrase. Vamos usar o sucrase
import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
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
    }
}

// sintaxe antiga:
// module.exports = new App.server/
// com o sucrase:
export default new App().server;
