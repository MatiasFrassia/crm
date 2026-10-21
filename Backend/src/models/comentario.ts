import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection.js';
import { Oportunidad } from './oportunidad.js';
import { User } from './user.js';

export class ComentarioOportunidad extends Model {}

ComentarioOportunidad.init(
  {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_oportunidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: true, // Permitir true en caso de comentarios que solo incluyan adjuntos
    },
    archivo_adjunto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'comentarios_oportunidad',
    timestamps: true,
    updatedAt: false, // Solo registra la fecha de creación (createdAt)
  }
);

// Relación con Oportunidad
Oportunidad.hasMany(ComentarioOportunidad, { foreignKey: 'id_oportunidad', as: 'comentarios' });
ComentarioOportunidad.belongsTo(Oportunidad, { foreignKey: 'id_oportunidad' });

// Relación con Usuario (Autor del comentario)
User.hasMany(ComentarioOportunidad, { foreignKey: 'id_usuario' });
ComentarioOportunidad.belongsTo(User, { foreignKey: 'id_usuario', as: 'usuario' });