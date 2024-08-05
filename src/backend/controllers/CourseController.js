const sequelize = require("../config/database");
const AcademicYearModel = require("../models/AcademicYearModel");
const AssessmentItemModel = require("../models/AssessmentItemModel");
const AssessmentModel = require("../models/AssessmentModel");
const ClassModel = require("../models/ClassModel");
const CloModel = require("../models/CloModel");
const CourseEnrollmentModel = require("../models/CourseEnrollmentModel");
const CourseModel = require("../models/CourseModel");
const RubricsItemModel = require("../models/RubricItemModel");
const SemesterAcademicYearModel = require("../models/SemesterAcademicYearModel");
const SemesterModel = require("../models/SemesterModel");
const SubjectModel = require("../models/SubjectModel");
const TeacherModel = require("../models/TeacherModel");
const { Sequelize } = require('sequelize');

const CourseController = {

  // Lấy tất cả các khóa học
  index: async (req, res) => {
    try {
      const { page, size } = req.query;

      const courseAttributes = ['course_id', 'course_name', 'createdAt', 'updatedAt', 'isDelete'];
      const whereClause = { isDelete: false };

      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);

        const { count, rows: courses } = await CourseModel.findAndCountAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: { isDelete: false }
          },
          {
            model: TeacherModel,
            attributes: ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher', 'imgURL'],
            where: { isDelete: false }
          },
          {
            model: SubjectModel,
            attributes: ['subject_id', 'subject_name'],
            where: { isDelete: false }
          },
          {
            model: SemesterAcademicYearModel,
            attributes: ['semester_id', 'academic_year'],
            where: { isDelete: false }
          }],
          attributes: courseAttributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });

        return res.json({
          total: count,
          courses: courses
        });
      } else {
        const courses = await CourseModel.findAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: { isDelete: false }
          },
          {
            model: TeacherModel,
            attributes: ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher', 'imgURL'],
            where: { isDelete: false }
          },
          {
            model: SubjectModel,
            attributes: ['subject_id', 'subject_name'],
            where: { isDelete: false }
          },
          {
            model: SemesterAcademicYearModel,
            attributes: ['semester_id', 'academic_year'],
            where: { isDelete: false }
          }],
          attributes: courseAttributes,
          where: whereClause
        });

        return res.json(courses);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },
  getAll: async (req, res) => {
    const { teacher_id, permission } = req.body;

    // Xây dựng bộ lọc truy vấn động
    const teacherFilter = teacher_id && permission == 1 ? 'and t.teacher_id = :teacher_id' : '';
    try {
      const results = await sequelize.query(
        `SELECT
            c.course_id,
            c.courseName,
            c.courseCode,
            s.subject_id,
            s.subjectName,
            t.teacher_id,
            t.name AS teacherName
        FROM
            courses c
        JOIN
            subjects s ON c.subject_id = s.subject_id
        JOIN
            teachers t ON c.teacher_id = t.teacher_id
        where c.isDelete = 0
        ${teacherFilter}
           
        ORDER BY
            c.course_id;
        `,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { teacher_id }
        }
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching average scores per subject:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Tạo một khóa học mới
  create: async (req, res) => {
    const {
      academic_year_id,
      class_id,
      courseCode,
      courseName,
      semester_id,
      subject_id,
      teacher_id
    } = req.body.data;

    console.log(req.body);
    try {
      // Kiểm tra sự tồn tại của cặp semester_id và academic_year_id
      let semesterAcademicYear = await SemesterAcademicYearModel.findOne({
        where: {
          semester_id,
          academic_year_id
        }
      });

      // Nếu không tồn tại, tạo mới
      if (!semesterAcademicYear) {
        semesterAcademicYear = await SemesterAcademicYearModel.create({
          semester_id,
          academic_year_id,
          isDelete: 0
        });
      }

      await CourseModel.create({
        academic_year_id,
        class_id,
        courseCode,
        courseName,
        id_semester_academic_year: semesterAcademicYear.id_semester_academic_year,
        semester_id,
        subject_id,
        teacher_id
      });

      res.json({ message: `Tạo thành công khóa học` });
    } catch (error) {
      console.error('Lỗi khi cập nhật khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  getAllWithCourseEnrollment: async (req, res) => {
    try {
      const courses = await CourseModel.findAll({
        attributes: {
          include: [
            [Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM course_enrollments AS ce
                        WHERE ce.course_id = course.course_id
                        AND ce.isDelete = FALSE
                    )`), 'enrollmentCount']
          ]
        },
        include: [
          {
            model: ClassModel,
            where: { isDelete: false },
          },
          {
            model: TeacherModel,
            attributes: ['teacher_id', 'name', 'email', 'typeTeacher', 'teacherCode', 'permission', 'imgURL'],
            where: { isDelete: false },
          },
          {
            model: SubjectModel,
            where: { isDelete: false },
          },
          {
            model: SemesterAcademicYearModel,
            where: { isDelete: false },

            include: [
              {
                model: SemesterModel,
                where: { isDelete: false },
              },
              {
                model: AcademicYearModel,
                where: { isDelete: false },
              }
            ]
          },
        ],
        where: { isDelete: false },
        order: [['course_id', 'DESC']]
      });

      res.json(courses);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // Lấy một khóa học theo ID
  getByID: async (req, res) => {
    try {
      console.log("aaaaa");
      const { id } = req.params;
      const course = await CourseModel.findAll({
        attributes: {
          include: [
            [Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM course_enrollments AS ce
                        WHERE ce.course_id = course.course_id
                        AND ce.isDelete = FALSE
                    )`), 'enrollmentCount']
          ]
        },
        include: [
          {
            model: ClassModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: TeacherModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: SubjectModel,
            where: { isDelete: false },
            required: true
          },
          {
            model: SemesterAcademicYearModel,
            where: { isDelete: false },
            required: true,
            include: [
              {
                model: SemesterModel,
                where: { isDelete: false },
                required: true
              },
              {
                model: AcademicYearModel,
                where: { isDelete: false },
                required: true
              }
            ]
          },
        ],
        where: {
          isDelete: false,
          course_id: id
        }

      });
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }
      res.json(course);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  getByIDTeacher: async (req, res) => {
    try {
      const { id_teacher } = req.params;
      const courses = await CourseModel.findAll({ where: { teacher_id: id_teacher, isDelete: false } });
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }

      res.json({ course: courses });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },


  getByIdWithCourseEnrollment: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findAll({
        include: [
          {
            model: ClassModel,
            where: { isDelete: false }
          },
          {
            model: TeacherModel,
            where: { isDelete: false }
          },
          {
            model: SubjectModel,
            where: { isDelete: false }
          },
          {
            model: SemesterAcademicYearModel,
            where: { isDelete: false }
          }
        ],
        where: {
          isDelete: false,
          course_id: id
        }
      });

      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }

      const enrollmentCount = await CourseEnrollmentModel.count({
        where: {
          course_id: id,
          isDelete: false
        }
      });

      res.json({ course, enrollmentCount });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Cập nhật một khóa học
  update: async (req, res) => {
    const { id } = req.params;
    const {
      academic_year_id,
      class_id,
      courseCode,
      courseName,
      semester_id,
      subject_id,
      teacher_id
    } = req.body.data;

    console.log(req.body);
    try {
      const course = await CourseModel.findOne({ where: { course_id: id } });
      if (!course) {
        return res.status(404).json({ message: 'Không tìm thấy khóa học' });
      }

      // Kiểm tra sự tồn tại của cặp semester_id và academic_year_id
      let semesterAcademicYear = await SemesterAcademicYearModel.findOne({
        where: {
          semester_id,
          academic_year_id
        }
      });

      // Nếu không tồn tại, tạo mới
      if (!semesterAcademicYear) {
        semesterAcademicYear = await SemesterAcademicYearModel.create({
          semester_id,
          academic_year_id,
          isDelete: 0
        });
      }

      // Cập nhật khóa học với id_semester_academic_year mới
      await CourseModel.update({
        academic_year_id,
        class_id,
        courseCode,
        courseName,
        id_semester_academic_year: semesterAcademicYear.id_semester_academic_year,
        semester_id,
        subject_id,
        teacher_id
      }, { where: { course_id: id } });

      res.json({ message: `Cập nhật thành công khóa học có id: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Delete course
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await CourseModel.destroy({ where: { course_id: id } });
      res.json({ message: 'Successfully deleted course' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get courses with isDelete = true
  isDeleteToTrue: async (req, res) => {
    try {
      const { page, size } = req.query;

      console.log("req.query", req.query)
      const courseAttributes = ['course_id', 'courseName','courseCode', 'createdAt', 'updatedAt', 'isDelete'];
      const whereClause = { isDelete: true };

      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);

        const { count, rows: courses } = await CourseModel.findAndCountAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: { isDelete: false }
          },
          {
            model: TeacherModel,
            attributes: ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher', 'imgURL'],
            where: { isDelete: false }
          },
          {
            model: SubjectModel,
            attributes: ['subject_id', 'subjectName'],
            where: { isDelete: false }
          },
          // {
          //   model: SemesterAcademicYearModel,
          //   attributes: ['semester_id', 'academic_year'],
          //   where: { isDelete: false }
          //   }
          ],
          attributes: courseAttributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });

        return res.json({
          total: count,
          courses: courses
        });
      } else {
        const courses = await CourseModel.findAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: { isDelete: false }
          },
          {
            model: TeacherModel,
            attributes: ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher', 'imgURL'],
            where: { isDelete: false }
          },
          {
            model: SubjectModel,
            attributes: ['subject_id', 'subject_name'],
            where: { isDelete: false }
          },
          {
            model: SemesterAcademicYearModel,
            attributes: ['semester_id', 'academic_year'],
            where: { isDelete: false }
          }],
          attributes: courseAttributes,
          where: whereClause
        });

        return res.json(courses);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },
  // Get courses with isDelete = false
  isDeleteToFalse: async (req, res) => {
    try {
      const courses = await CourseModel.findAll({ where: { isDelete: false } });
      if (!courses) {
        return res.status(404).json({ message: 'No courses found' });
      }
      res.json(courses);
    } catch (error) {
      console.error('Error finding courses with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a course
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseModel.findOne({ where: { course_id: id } });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const updatedIsDeleted = !course.isDelete;
      await CourseModel.update({ isDelete: updatedIsDeleted }, { where: { course_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = CourseController;
