const StudentModel = require("../models/StudentModel");
const fs = require('fs');
const sequelize = require("../config/database");
const ExcelJS = require('exceljs');
const path = require('path');
const ClassModel = require("../models/ClassModel");
const { Sequelize, Op } = require("sequelize");
const AcademicYearModel = require("../models/AcademicYearModel");
const SemesterModel = require("../models/SemesterModel");
const SemesterAcademicYearModel = require("../models/SemesterAcademicYearModel");
const SubjectModel = require("../models/SubjectModel");
const CourseModel = require("../models/CourseModel");
const AssessmentModel = require("../models/AssessmentModel");
const TeacherModel = require("../models/TeacherModel");
const jwt = require('jsonwebtoken');

function formatDate(dateString) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  // Return the formatted date string
  return `${day}${month}${year}`;
}

const StudentController = {
  // Lấy tất cả sinh viên
  index: async (req, res) => {
    try {
      const { page, size, search, teacher_id } = req.query;
  
      const attributes = ['student_id', 'class_id', 'studentCode', 'email', 'name', 'createdAt', 'updatedAt', 'isDelete'];
      const whereClause = { isDelete: false };
      const whereClauseTeacher = { isDelete: false };
  
      if (search) {
        whereClause[Op.or] = [
          { studentCode: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } }
        ];
      }
  
      if (teacher_id) {
        whereClauseTeacher.teacher_id = teacher_id; // Adjust according to your actual data structure
      }
  
      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);
  
        const { count, rows: students } = await StudentModel.findAndCountAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: whereClauseTeacher,
          }],
          attributes: attributes,
          where: whereClause,
          offset: offset,
          limit: limit,
          order: ['student_id']
        });
  
        return res.json({
          total: count,
          students: students
        });
      } else {
        const students = await StudentModel.findAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className']
          }],
          attributes: attributes,
          where: whereClause
        });
  
        return res.json(students);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getAllByClassId: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await StudentModel.findAll({ where: { class_id: id, isDelete: false } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getAllByStudentCode: async (req, res) => {
    try {
      const { studentCode } = req.body;
      const students = await StudentModel.findAll(
        {
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: {
              isDelete: false
            }
          }],
          where: {
            studentCode: studentCode,
            isDelete: false
          }
        });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  // Kết quả học tập
  learningOutcomes: async (req, res) => {
    try {
      const { id } = req.params;
      const results = await sequelize.query(
        `SELECT
              s.student_id,
              s.name AS studentName,
              sub.subject_id,
              sub.subjectName,
              c.course_id,
              c.courseName,
              a.totalScore AS score,
              ay.academic_year_id,
              ay.description AS academic_year,
              sem.semester_id,
              sem.descriptionShort AS semester,
              t.teacher_id,
              t.name AS teacherName,
              cl.class_id,
              cl.className,
              cl.classNameShort
          FROM
              students s
          JOIN
              course_enrollments ce ON s.student_id = ce.student_id
          JOIN
              courses c ON ce.course_id = c.course_id
          JOIN
              subjects sub ON c.subject_id = sub.subject_id
          JOIN
              semester_academic_years say ON c.id_semester_academic_year = say.id_semester_academic_year
          JOIN
              academic_years ay ON say.academic_year_id = ay.academic_year_id
          JOIN
              semesters sem ON say.semester_id = sem.semester_id
          JOIN
              assessments a ON c.course_id = a.course_id AND a.student_id = s.student_id
          JOIN
              teachers t ON c.teacher_id = t.teacher_id
          JOIN
              classes cl ON c.class_id = cl.class_id
          WHERE
              s.student_id = ${id}
              AND s.isDelete = 0
              AND c.isDelete = 0
              AND sub.isDelete = 0
              AND ce.isDelete = 0
              AND a.isDelete = 0
              AND ay.isDelete = 0
              AND sem.isDelete = 0
              AND t.isDelete = 0
              AND cl.isDelete = 0
          ORDER BY
              ay.academic_year_id, sem.semester_id, c.course_id;
          ;
        `,
        {
          type: Sequelize.QueryTypes.SELECT,

        }
      );

      res.json(results);
    } catch (error) {
      console.error('Error fetching average scores per subject:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Tạo một sinh viên mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newStudent = await StudentModel.create(data);
      res.json(newStudent);
    } catch (error) {
      console.error('Lỗi khi tạo sinh viên mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getAllWithClass: async (req, res) => {
    try {
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode', 'classNameShort'],
          where: { isDelete: false }
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: { isDelete: false }
      });

      res.json(students);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // Lấy thông tin của một sinh viên dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode', 'classNameShort', 'className'],
          include: [{
            model: TeacherModel,
            attributes: ['name', 'teacherCode', 'email']
          }]
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'date_of_birth', 'email', 'name', 'isDelete'],
        where:
          { student_id: id, isDelete: false }
      });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một sinh viên dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const studentDetails = await StudentModel.findOne({ where: { student_id: id } });
      if (!studentDetails) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
      }
      await StudentModel.update(data, { where: { student_id: id } });
      res.json({ message: `Cập nhật thành công thông tin sinh viên có ID: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Xóa một sinh viên dựa trên ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await StudentModel.destroy({ where: { student_id: id } });
      res.json({ message: 'Xóa sinh viên thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteToTrue: async (req, res) => {
    try {
      const { page, size } = req.query;

      const attributes = ['student_id', 'class_id', 'studentCode', 'email', 'name', 'createdAt', 'updatedAt', 'isDelete'];
      const whereClause = { isDelete: true };

      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);

        const { count, rows: students } = await StudentModel.findAndCountAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode', 'classNameShort', 'className'],
            where: {
              isDelete: false
            }
          }],
          attributes: attributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });

        return res.json({
          total: count,
          students: students
        });
      } else {
        const students = await StudentModel.findAll({
          include: [{
            model: ClassModel,
            attributes: ['classCode']
          }],
          attributes: attributes,
          where: whereClause
        });

        return res.json(students);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả sinh viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteToFalse: async (req, res) => {
    try {
      const students = await StudentModel.findAll({ where: { isDelete: false } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      res.json(students);
    } catch (error) {
      console.error('Lỗi tìm kiếm students:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await StudentModel.findOne({ where: { student_id: id } });
      if (!students) {
        return res.status(404).json({ message: 'Không tìm thấy students' });
      }
      const updatedIsDeleted = !students.isDelete;
      await StudentModel.update({ isDelete: updatedIsDeleted }, { where: { student_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của students:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },
  getFormStudent: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students Form');

    worksheet.columns = [
      { header: 'Mã lớp', key: 'classCode', width: 15 },
      { header: 'Tên SV', key: 'name', width: 32 },
      { header: 'MSSV', key: 'studentCode', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },
  getFormStudentWithData: async (req, res) => {
    try {
      const { data } = req.body;

      if (!data || !Array.isArray(data.id) || data.id.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing id array' });
      }

      const { id } = data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode']
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
          student_id: id
        }
      });

      worksheet.columns = [
        { header: 'id', key: 'id', width: 15 },
        { header: 'Mã lớp', key: 'classCode', width: 15 },
        { header: 'Tên SV', key: 'name', width: 32 },
        { header: 'MSSV', key: 'studentCode', width: 20 },
        { header: 'Email', key: 'email', width: 30 }
      ];

      students.forEach(student => {
        worksheet.addRow({
          id: student.student_id,
          classCode: student.class.classCode,
          name: student.name,
          studentCode: student.studentCode,
          email: student.email
        });
      });

      await worksheet.protect('yourpassword', {
        selectLockedCells: true,
        selectUnlockedCells: true
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1) {
            cell.protection = { locked: true };
          } else {
            cell.protection = { locked: false };
          }
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getFormStudentByClass: async (req, res) => {
    try {
      const { id } = req.params;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode', 'classNameShort', 'className'],
          where: {
            class_id: id,
          }
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
        }
      });

      worksheet.columns = [
        { header: 'Mã lớp', key: 'classNameShort', width: 15 },
        { header: 'Tên SV', key: 'name', width: 32 },
        { header: 'MSSV', key: 'studentCode', width: 20 },
        { header: 'Email', key: 'email', width: 30 }
      ];

      students.forEach(student => {
        worksheet.addRow({
          classNameShort: student.class.classNameShort,
          name: student.name,
          studentCode: student.studentCode,
          email: student.email
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Students.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  saveStudentExcel: async (req, res) => {
    if (req.files) {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      const insertPromises = [];
      const emailsSet = new Set();
      const studentCodesSet = new Set();

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) { // bỏ dòng đầu
          let email = row.getCell(4).value;
          let studentCode = row.getCell(3).value;

          if (email && typeof email === 'object' && email.hasOwnProperty('text')) {
            email = email.text;
          }

          if (!email || emailsSet.has(email)) {
            console.error(`Duplicate or invalid email found at row ${rowNumber}: ${email}`);
            return; // Skip this row
          }

          if (!studentCode || studentCodesSet.has(studentCode)) {
            console.error(`Duplicate or invalid studentCode found at row ${rowNumber}: ${studentCode}`);
            return; // Skip this row
          }

          emailsSet.add(email);
          studentCodesSet.add(studentCode);

          const sql = `INSERT INTO students (class_id, name, studentCode, email)
                 VALUES ((SELECT class_id FROM classes WHERE 	classNameShort = ?), ?, ?, ?)`;
          const values = [
            row.getCell(1).value,
            row.getCell(2).value,
            studentCode,
            email,
          ];
          insertPromises.push(sequelize.query(sql, { replacements: values })
            .catch(error => {
              console.error(`Error inserting row ${rowNumber}: ${error.message}`);
            }));
        }
      });

      Promise.all(insertPromises)
        .then(() => {
          console.log('All rows inserted successfully');
        })
        .catch(error => {
          console.error('Error inserting rows:', error);
        });


      await Promise.all(insertPromises);
      console.log('All data has been inserted into the database!');
      fs.unlinkSync(filePath);  // Remove the uploaded file after processing
      // res.send('Excel file has been processed and data inserted.');
      res.status(200).json({ message: "Dữ liệu đã được lưu thành công vào cơ sở dữ liệu." });
    } else {
      res.status(400).send('No file uploaded.');
    }
  },
  updateStudentsFromExcel: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet('Students Form');

      const studentUpdates = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const studentData = {
            student_id: row.getCell('A').value,
            classCode: row.getCell('B').value,
            name: row.getCell('C').value,
            studentCode: row.getCell('D').value,
            email: row.getCell('E').value
          };
          studentUpdates.push(studentData);
        }
      });

      for (const studentData of studentUpdates) {
        const student = await StudentModel.findByPk(studentData.student_id);
        if (student) {
          const classModel = await ClassModel.findOne({ where: { classCode: studentData.classCode } });
          if (classModel) {
            student.class_id = classModel.class_id;
          }
          student.name = studentData.name;
          student.studentCode = studentData.studentCode;
          student.email = studentData.email;
          await student.save();
        }
      }

      fs.unlinkSync(filePath); // Clean up the uploaded file

      res.status(200).json({ message: 'Students updated successfully' });
    } catch (error) {
      console.error('Error updating students from Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  login: async (req, res) => {
    const { studentCode, password } = req.body;
    try {
      const user = await StudentModel.findOne({ where: { studentCode } });
      if (!user) {
        return res.status(400).json({ message: 'Mã sinh viên hoặc mật khẩu không đúng' });
      }
      const formattedDate = formatDate(user.date_of_birth);

      console.log("pass", password)
      console.log("formattedDate", formattedDate)

      if (password !== formattedDate) {
        return res.status(400).json({ message: 'Mã sinh viên hoặc mật khẩu không đúng1' });
      }

      const payload = { id: user.studentCode };
      const accessTokenStudent = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });

      // Đặt token trong cookies
      res.cookie('accessTokenStudent', accessTokenStudent, { httpOnly: false, secure: true, sameSite: 'Strict', maxAge: 30 * 60 * 1000 });

      res.json({
        message: 'Đăng nhập thành công',
        accessTokenStudent,
      });
    } catch (error) {
      console.error(`Lỗi đăng nhập: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  },
  getStudentInfo: async (req, res) => {
    try {
      const student = await StudentModel.findOne({ where: { studentCode: req.user.studentCode } });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json({
        studentCode: student.studentCode,
        name: student.name,
        dateOfBirth: student.date_of_birth,
        email: student.email,
        // Add other fields as necessary
      });
    } catch (error) {
      console.error(`Error fetching student info: ${error.message}`);
      res.status(500).json({ message: 'Server error', error });
    }
  }
};

module.exports = StudentController;
