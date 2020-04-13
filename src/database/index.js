import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

// vai importar todos os módulos da aplicação
import User from '../app/models/User';
import File from '../app/models/File';

// vetor com os models importados
const models = [User, File];

class Database {
    constructor() {
        this.init();
    }

    init() {
        // cria conexão com o banco
        this.connection = new Sequelize(databaseConfig);
        // roda o init para cada model, passando a conexão (é o parâmetro sequelize no model)
        models
            // inicializa cada model com a conexão
            .map((model) => model.init(this.connection))
            // chama métodos associate dos models que o tenham
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
