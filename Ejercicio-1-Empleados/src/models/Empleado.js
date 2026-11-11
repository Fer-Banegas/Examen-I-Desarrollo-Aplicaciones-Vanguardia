const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define('Empleado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio.' },
    },
  },
  puesto: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El puesto es obligatorio.' },
    },
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'El salario debe ser un número decimal.' },
      min: { args: [0.01], msg: 'El salario debe ser de al menos 0.01.' },
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'empleados',
  timestamps: false,
});

module.exports = Empleado;
