const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const TeacherModel = sequelize.define('teacher', {
  teacher_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  typeTeacher: {
    type: DataTypes.ENUM('GVCV', 'GVGD'),
    allowNull: false
  },
  teacherCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  permission: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  imgURL: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isBlock: {
    type: DataTypes.TINYINT,
    defaultValue: 0
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
  tableName: 'teachers',
  hooks: {
    beforeCreate: async (teacher) => {
      if (teacher.password) {
        const salt = await bcrypt.genSalt(10);
        teacher.password = await bcrypt.hash(teacher.password, salt);
      }
    },
    beforeUpdate: async (teacher) => {
      console.log("teacher", teacher)
      if (teacher.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        teacher.password = await bcrypt.hash(teacher.password, salt);
      }
    }
  }
});

module.exports = TeacherModel;
