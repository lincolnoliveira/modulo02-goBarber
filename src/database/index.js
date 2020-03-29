import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

// vai importar todos os módulos da aplicação
import User from '../app/models/User';

// vetor com os models importados
const models = [User];

class Database {
    constructor() {
        this.init();
    }

    init() {
        // cria conexão com o banco
        this.connection = new Sequelize(databaseConfig);
        // roda o init para cada model, passando a conexão (é o parâmetro sequelize no model)
        models.map((model) => model.init(this.connection));
    }
}

export default new Database();
