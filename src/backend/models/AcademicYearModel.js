const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYearModel = sequelize.define('academic_year', {
  academic_year_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'academic_years',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = AcademicYearModel;