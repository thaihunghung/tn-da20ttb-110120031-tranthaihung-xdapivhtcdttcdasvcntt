const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ClassModel = require('./ClassModel');
const TeacherModel = require('./TeacherModel');
const SubjectModel = require('./SubjectModel');
const SemesterAcademicYearModel = require('./SemesterAcademicYearModel');

const CourseModel = sequelize.define('course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  class_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: ClassModel,
      key: 'class_id'
    }
  },
  teacher_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  subject_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SubjectModel,
      key: 'subject_id' 
    }
  },
  id_semester_academic_year: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SemesterAcademicYearModel,
      key: 'id_semester_academic_year' 
    }
  },
  courseName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  courseCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
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
  tableName: 'courses'
});

CourseModel.belongsTo(ClassModel, {
  foreignKey: 'class_id'
});

CourseModel.belongsTo(TeacherModel, {
  foreignKey: 'teacher_id'
});

CourseModel.belongsTo(SubjectModel, {
  foreignKey: 'subject_id'
});

CourseModel.belongsTo(SemesterAcademicYearModel, {
  foreignKey: 'id_semester_academic_year'
});

module.exports = CourseModel;
