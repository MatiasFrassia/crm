import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

export const User = sequelize.define(
    'usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre:{
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido:{
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
},
  {
    tableName: 'usuarios', // <--- 2. Nombre exacto de tu tabla en MySQL
    timestamps: false      // <--- 3. Desactiva la búsqueda de createdAt / updatedAt
  });