import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

export const Cliente = sequelize.define('Cliente', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false // Obligatorio. Se puede llenar con el displayName de Google
  },
  cuit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING, // Mejor STRING que NUMBER para formatos internacionales
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Fundamental para evitar clientes duplicados si entran con el mismo Gmail
  },
  uid_firebase: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true // Se llenará cuando se logueen con Google
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'clientes',
  timestamps: true // Crea createdAt y updatedAt automáticamente
});