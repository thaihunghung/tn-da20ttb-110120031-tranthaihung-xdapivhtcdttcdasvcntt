const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CloModel = require('./CloModel');
const PloModel = require('./PloModel');

const PloCloModel = sequelize.define('map_plo_clo', {
  id_plo_clo: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  plo_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: PloModel,
      key: 'plo_id'
    }
  },
  clo_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: CloModel,
      key: 'clo_id'
    }
  },
  isDelete: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'map_plo_clos'
});
PloCloModel.belongsTo(PloModel, { foreignKey: 'plo_id'});
PloCloModel.belongsTo(CloModel, { foreignKey: 'clo_id'});

module.exports = PloCloModel;
