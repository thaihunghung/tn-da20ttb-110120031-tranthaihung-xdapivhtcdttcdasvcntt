const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const StudentModel = require('./StudentModel');
const CourseModel = require('./CourseModel');

const CourseEnrollmentModel = sequelize.define('course_enrollment', {
  id_detail_courses: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: StudentModel,
      key: 'student_id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CourseModel,
      key: 'course_id'
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
  tableName: 'course_enrollments'
});

CourseEnrollmentModel.belongsTo(StudentModel, {
  foreignKey: 'student_id'
});

CourseEnrollmentModel.belongsTo(CourseModel, {
  foreignKey: 'course_id'
});

module.exports = CourseEnrollmentModel;
