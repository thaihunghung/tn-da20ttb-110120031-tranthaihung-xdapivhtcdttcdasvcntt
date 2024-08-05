const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubjectModel = require('./SubjectModel');
const TeacherModel = require('./TeacherModel');
const RubricsItemModel = require('./RubricItemModel');

const RubricModel = sequelize.define('Rubric', {
  rubric_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SubjectModel,
      key: 'subject_id'
    }
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  rubricName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    defaultValue: null
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
  tableName: 'rubrics'
});
// RubricModel.hasMany(RubricsItemModel, { foreignKey: 'rubric_id' }); // Define the association

RubricModel.belongsTo(SubjectModel, { foreignKey: 'subject_id' });
RubricModel.belongsTo(TeacherModel, { foreignKey: 'teacher_id' });

module.exports = RubricModel;
