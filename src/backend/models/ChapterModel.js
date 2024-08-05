const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubjectModel = require('./SubjectModel');

const ChapterModel = sequelize.define('Chapter', {
  chapter_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chapterName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SubjectModel,
      key: 'subject_id'
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
  tableName: 'chapters'
});
ChapterModel.belongsTo(SubjectModel, { foreignKey: 'subject_id' });

module.exports = ChapterModel;
