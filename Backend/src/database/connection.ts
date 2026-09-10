import {Sequelize} from "sequelize";

const sequelize = new Sequelize('CRM_FAPAZ', 'root', 'hpb-214-FI', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;