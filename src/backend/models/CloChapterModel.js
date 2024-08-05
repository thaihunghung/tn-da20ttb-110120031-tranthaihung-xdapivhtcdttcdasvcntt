const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CloModel = require('./CloModel');
const ChapterModel = require('./ChapterModel');

const MapCloChapterModel = sequelize.define('MapCloChapter', {
  id_clo_chapter: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CloModel,
      key: 'clo_id'
    }
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ChapterModel,
      key: 'chapter_id'
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
  tableName: 'map_clo_chapters'
});

MapCloChapterModel.belongsTo(ChapterModel, { foreignKey: 'chapter_id'});
MapCloChapterModel.belongsTo(CloModel, { foreignKey: 'clo_id'});
module.exports = MapCloChapterModel;
