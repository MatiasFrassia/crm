import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

export const User = sequelize.define(
    'usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    validate: {
      notEmpty: true // Protege contra cadenas vacías ("")
    }
  },
  nombre:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true // Protege contra cadenas vacías ("")
    }
  },
  apellido:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true // Protege contra cadenas vacías ("")
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true // Protege contra cadenas vacías ("")
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true // Protege contra cadenas vacías ("")
    }
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