const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TeacherModel = require('./TeacherModel');

const ClassModel = sequelize.define('class', {
  class_id : {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  className: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  classNameShort: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  classCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  teacher_id  : {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'classes',
});

ClassModel.belongsTo(TeacherModel, {
  foreignKey: 'teacher_id'
});

module.exports = ClassModel;
