// importando apenas a parte de roteamento do express
// const { Router } = require('express');
import { Router } from 'express';
import UserController from './app/controllers/UserController';

const routes = new Router();

// rota post, para incluir, passa a função store do controller, como um middleware
routes.post('/users', UserController.store);

// module.exports = routes;
export default routes;
