const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SemesterModel = sequelize.define('semester', {
  semester_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descriptionShort: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  descriptionLong: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  codeSemester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
}, {
  tableName: 'semesters',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});


module.exports = SemesterModel;
