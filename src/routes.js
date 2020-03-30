// importando apenas a parte de roteamento do express
// const { Router } = require('express');
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

// rota post, para incluir, passa a função store do controller, como um middleware
routes.post('/users', UserController.store);

// rota post, para autenticar, criar uma sessão
routes.post('/sessions', SessionController.store);

// module.exports = routes;
export default routes;
