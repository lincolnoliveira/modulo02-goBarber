// importando apenas a parte de roteamento do express
// const { Router } = require('express');
import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

// routes.get('/', (req, res) => res.json({ message: 'Olá povinho!' }));

// Teste do loader do model, criando um usuário
// a função deve ser async para aguardar o banco fazer o insert, poder usar o await
routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'Diego Fernandes',
        email: 'diego@rocketseat.com.br',
        password_hash: '1238712387',
    });
    return res.json(user);
});

// module.exports = routes;
export default routes;
