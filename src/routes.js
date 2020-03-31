// importando apenas a parte de roteamento do express
// const { Router } = require('express');
import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// rota post, para incluir, passa a função store do controller, como um middleware
routes.post('/users', UserController.store);

// rota post, para autenticar, criar uma sessão
routes.post('/sessions', SessionController.store);

// define um middleware global que verifica se está autenticado
// apesar de global, só vale para as rotas depois de sua declaração (tosco)
routes.use(authMiddleware);
routes.put('/users', UserController.update);

// module.exports = routes;
export default routes;
