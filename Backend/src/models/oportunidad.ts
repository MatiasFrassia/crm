import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection.js';
import { User } from './user.js';

export class Oportunidad extends Model {}

Oportunidad.init(
  {
    id_oportunidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo_oportunidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_usuario_asignado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id_usuario',
      },
    },
    cliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    producto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Fecha actual por defecto
    },
    fecha_cierre_estimado: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_facturacion_estimado: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    operacion_monto_estimado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    costo: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    precio_venta: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    margen_ganancia: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    avance_proyecto: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 1% Inicial
    },
    plazo_pago_proveedor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plazo_pago_cliente: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'oportunidades',
    timestamps: true,
  }
);

Oportunidad.belongsTo(User, { foreignKey: 'id_usuario_asignado', as: 'usuarioAsignado' });
User.hasMany(Oportunidad, { foreignKey: 'id_usuario_asignado' });