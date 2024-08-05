const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ClassModel = require('./ClassModel');

const StudentModel = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ClassModel,
      key: 'class_id'
    }
  },
  studentCode: {
    type: DataTypes.STRING(9),
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING(20),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: null
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
  tableName: 'students'
});

StudentModel.belongsTo(ClassModel, {
  foreignKey: 'class_id'
});

module.exports = StudentModel;
