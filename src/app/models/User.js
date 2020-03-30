import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL, // campo que ñ será armazenado no BD
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        // adciona um hook, como um trigger, a ser executado qdo ação for executada
        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                // gera o hash a partir da passwor passada. 8 é o nº de iterações de hash(?)
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    checkPassword(password) {
        // verifica se a senha plana passada confere com o hash armazenado
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
