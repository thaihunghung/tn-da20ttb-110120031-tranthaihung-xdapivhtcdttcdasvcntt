const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const AcademicYearModel = require('./AcademicYearModel');
const SemesterModel = require('./SemesterModel');

const SemesterAcademicYearModel = sequelize.define('SemesterAcademicYear', {
  id_semester_academic_year: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AcademicYearModel,
      key: 'academic_year_id'
    }
  },
  semester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SemesterModel,
      key: 'semester_id'
    }
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
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
  tableName: 'semester_academic_years'
});

SemesterAcademicYearModel.belongsTo(SemesterModel, { foreignKey: 'semester_id' });
SemesterAcademicYearModel.belongsTo(AcademicYearModel, { foreignKey: 'academic_year_id' });

module.exports = SemesterAcademicYearModel;
