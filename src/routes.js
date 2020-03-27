// importando apenas a parte de roteamento do express

// const { Router } = require('express');
import { Router } from 'express';

const routes = new Router();

routes.get('/', (req,res) => {
    return res.json({message: 'Olá povinho!'});
})

// module.exports = routes;
export default routes;