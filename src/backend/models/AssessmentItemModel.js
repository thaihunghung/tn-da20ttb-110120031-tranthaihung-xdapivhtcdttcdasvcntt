const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const AssessmentModel = require('./AssessmentModel');
const RubricsItemModel = require('./RubricItemModel');

const AssessmentItemModel = sequelize.define('AssessmentItem', {
  assessmentItem_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AssessmentModel,
      key: 'assessment_id'
    }
  },
  rubricsItem_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RubricsItemModel,
      key: 'rubricsItem_id'
    }
  },
  assessmentScore: {
    type: DataTypes.DOUBLE(8,2),
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
  tableName: 'assessmentItems'
});
AssessmentItemModel.belongsTo(AssessmentModel, { foreignKey: 'assessment_id' });
AssessmentItemModel.belongsTo(RubricsItemModel, { foreignKey: 'rubricsItem_id' });

module.exports = AssessmentItemModel;
