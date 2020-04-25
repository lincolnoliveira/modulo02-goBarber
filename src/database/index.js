import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

// vai importar todos os módulos da aplicação
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// vetor com os models importados
const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
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

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
        });
    }
}

export default new Database();
