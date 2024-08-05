const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProgramModel = require('./ProgramModel');

const PloModel = sequelize.define('PLO', {
  plo_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ploName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  program_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: ProgramModel,
      key: 'program_id'
    },
  },
  isDelete: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'plos'
});

module.exports = PloModel;
