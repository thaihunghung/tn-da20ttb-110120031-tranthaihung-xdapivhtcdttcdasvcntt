const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TeacherModel = require('./TeacherModel');
const MetaAssessmentModel = require('./MetaAssessmentModel');

const AssessmentModel = sequelize.define('Assessment', {
  assessment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  meta_assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MetaAssessmentModel,
      key: 'meta_assessment_id'
    }
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  totalScore: {
    type: DataTypes.DOUBLE(8, 2),
    defaultValue: 0.00
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
  tableName: 'assessments'
});
AssessmentModel.belongsTo(TeacherModel, { foreignKey: 'teacher_id' });
AssessmentModel.belongsTo(MetaAssessmentModel, { foreignKey: 'meta_assessment_id' });

module.exports = AssessmentModel;
