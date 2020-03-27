// A versão atual do Node, ainda não tem o import/export.
// A sintaxe então seria assim:
// const express = require ('express');
// const routes = require ('./routes');

// Mas dá para usar algumas bibliotecas que traduzem o código para versões mais
// antigas do javascript, como o babel e o sucrase. Vamos usar o sucrase
import express from 'express';
import routes from './routes';

class App {
    constructor(){
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.server.use(express.json());
    }

    routes(){
        this.server.use(routes);
    }
}

// sintaxe antiga:
// module.exports = new App.server/
// com o sucrase:
export default new App().server;