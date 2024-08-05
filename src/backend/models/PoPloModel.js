const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PoModel = require('./PoModel');
const PloModel = require('./PloModel');

const MapPoPloModel = sequelize.define('Map_PO_PLO', {
  id_po_plo: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  po_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: PoModel,
      key: 'po_id'
    }
  },
  plo_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: PloModel,
      key: 'plo_id'
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
  tableName: 'map_po_plos'
});


module.exports = MapPoPloModel;
