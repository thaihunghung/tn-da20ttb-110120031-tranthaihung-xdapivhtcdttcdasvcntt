const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TeacherModel = require('./TeacherModel');

const RefreshTokenModel = sequelize.define('refresh_token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  expired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'refresh_tokens'
});

RefreshTokenModel.belongsTo(TeacherModel, {
  foreignKey: 'teacher_id'
});

module.exports = RefreshTokenModel;
