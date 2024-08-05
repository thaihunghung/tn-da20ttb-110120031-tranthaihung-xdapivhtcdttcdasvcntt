const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const StudentModel = require('../models/StudentModel');
const CourseEnrollmentModel = require('../models/CourseEnrollmentModel');
const CourseModel = require('../models/CourseModel');
const ClassModel = require('../models/ClassModel');
const sequelize = require("../config/database");

const generateUniqueStudentCode = async () => {
  let isUnique = false;
  let studentCode;

  while (!isUnique) {
    studentCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingStudent = await StudentModel.findOne({ where: { studentCode } });
    if (!existingStudent) {
      isUnique = true;
    }
  }

  return studentCode;
};

const CourseEnrollmentController = {
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseEnrollmentModel.findAll({
        include: [
          {
            model: StudentModel,
            where: { isDelete: false }
          },
          {
            model: CourseModel,
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
      res.json(course);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm khóa học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },
  getByIDStudent: async (req, res) => {
    try {
      const { studentCode } = req.body;
      console.log("1studentCode", req.body);
      const course = await CourseEnrollmentModel.findAll({
        include: [
          {
            model: StudentModel,
            where: {
              isDelete: false,
              studentCode: studentCode
            }
          },
          {
            model: CourseModel,
            where: { isDelete: false }
          }
        ],
        where: {
          isDelete: false,
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
  getExcelCourseEnrollmentWithData: async (req, res) => {
    try {
      const { data } = req.body;
      const { id } = data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      // Lấy danh sách student_id từ CourseEnrollmentModel dựa trên id_detail_courses
      const enrollments = await CourseEnrollmentModel.findAll({
        attributes: ['student_id'],
        where: {
          course_id: id,
          isDelete: false
        }
      });

      // Trích xuất danh sách student_id
      const studentIds = enrollments.map(enrollment => enrollment.student_id);

      // Lấy thông tin sinh viên từ StudentModel dựa trên danh sách student_id
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode']
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
          student_id: studentIds
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

      // await worksheet.protect('yourpassword', {
      //   selectLockedCells: true,
      //   selectUnlockedCells: true
      // });

      // worksheet.eachRow((row, rowNumber) => {
      //   row.eachCell((cell, colNumber) => {
      //     if (colNumber === 1) {
      //       cell.protection = { locked: true };
      //     } else {
      //       cell.protection = { locked: false };
      //     }
      //   });
      // });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getAllStudentByCourseId: async (req, res) => {
    const { id } = req.params;
    console.log(`getAllStudentByCourseId, ${id}`);
    try {
      const enrollments = await CourseEnrollmentModel.findAll({
        attributes: ['student_id'],
        where: {
          course_id: id,
          isDelete: false
        }
      });

      // Trích xuất danh sách student_id
      const studentIds = enrollments.map(enrollment => enrollment.student_id);

      // Lấy thông tin sinh viên từ StudentModel dựa trên danh sách student_id
      const students = await StudentModel.findAll({
        include: [{
          model: ClassModel,
          attributes: ['classCode']
        }],
        attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
        where: {
          isDelete: false,
          student_id: studentIds
        }
      });

      // Trả về dữ liệu sinh viên
      res.status(200).json({ data: students });
    } catch (error) {
      console.error('Error fetching students by course ID:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getFormStudentWithDataByCourse: async (req, res) => {
    try {
      const { id } = req.params;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      const students = await CourseEnrollmentModel.findAll({
        include: [{
          model: StudentModel,
          attributes: ['student_id', 'class_id', 'studentCode', 'email', 'name', 'isDelete'],
          where: {
            isDelete: false,
          },
          include: [
            {
              model: ClassModel,
              attributes: ['classCode', 'classNameShort', 'className'],
              where: {
                isDelete: false,
              }
            }
          ]
        },
        {
          model: CourseModel,
          attributes: ['courseName'],
          where: {
            course_id: id,
            isDelete: false,
          },

        },],
        attributes: [],
        where: {
          isDelete: false,
        }
      });

      worksheet.columns = [
        { header: 'Mã lớp', key: 'classCode', width: 15 },
        { header: 'Tên SV', key: 'name', width: 32 },
        { header: 'MSSV', key: 'studentCode', width: 20 },
        { header: 'Email', key: 'email', width: 30 }
      ];
      const index = 0;
      students.forEach(student => {
        worksheet.addRow({
          classCode: student.Student.class.classNameShort,
          name: student.Student.name,
          studentCode: student.Student.studentCode,
          email: student.Student.email
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Student.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // save Course cụ thể theo id
  saveExcel: async (req, res) => {
    const courseId = req.body.data; // course_id

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No file uploaded.');
    }

    try {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      const emailsSet = new Set();
      const studentCodesSet = new Set();
      const insertPromises = [];
      const failedRows = [];
      const failedRowDetails = [];
      let successfulRows = 0;

      const processRow = async (row, rowNumber) => {
        if (rowNumber !== 1) { // Skip the header row
          let email = row.getCell(4).value;
          let studentCode = row.getCell(3).value;
          let classNameShort = row.getCell(1).value;

          if (email && typeof email === 'object' && email.hasOwnProperty('text')) {
            email = email.text;
          }

          if (!email || emailsSet.has(email)) {
            console.error(`Duplicate or invalid email found at row ${rowNumber}: ${email}`);
            failedRows.push(rowNumber);
            failedRowDetails.push(`Duplicate or invalid email: ${email}`);
          } else if (!studentCode || studentCodesSet.has(studentCode)) {
            console.error(`Duplicate or invalid studentCode found at row ${rowNumber}: ${studentCode}`);
            failedRows.push(rowNumber);
            failedRowDetails.push(`Duplicate or invalid studentCode: ${studentCode}`);
          } else {
            try {
              const [student] = await sequelize.query(
                `SELECT * FROM students
                                JOIN classes ON students.class_id = classes.class_id
                                WHERE classes.classNameShort = ? AND students.studentCode = ?`,
                { replacements: [classNameShort, studentCode], type: sequelize.QueryTypes.SELECT }
              );

              if (student) {
                emailsSet.add(email);
                studentCodesSet.add(studentCode);

                const insertEnrollmentSQL = `INSERT INTO course_enrollments (student_id, course_id)
                                                         VALUES (?, ?)`;
                const enrollmentValues = [
                  student.student_id,
                  courseId
                ];
                insertPromises.push(sequelize.query(insertEnrollmentSQL, { replacements: enrollmentValues })
                  .then(() => {
                    successfulRows++;
                  })
                  .catch(error => {
                    console.error(`Error inserting enrollment for row ${rowNumber}: ${error.message}`);
                    failedRows.push(rowNumber);
                    failedRowDetails.push(`Error inserting enrollment: ${error.message}`);
                  }));
              } else {
                console.error(`Student not found in class at row ${rowNumber}: ${studentCode}`);
                failedRows.push(rowNumber);
                failedRowDetails.push(`Student not found in class: ${studentCode}`);
              }
            } catch (error) {
              console.error(`Error querying database for row ${rowNumber}: ${error.message}`);
              failedRows.push(rowNumber);
              failedRowDetails.push(`Database query error: ${error.message}`);
            }
          }
        }
      };

      const processAllRows = async () => {
        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          await processRow(row, i);
        }
      };

      await processAllRows();
      await Promise.all(insertPromises);
      fs.unlinkSync(filePath); // Remove the uploaded file after processing

      // Sort failedRows in ascending order
      failedRows.sort((a, b) => a - b);
      console.log("failedRowDetails", failedRowDetails)
      return res.status(200).json({
        message: `Số dòng thêm thành công ${successfulRows} ${failedRows.length == 0 ? '' : `, Dòng thêm không thành công ${failedRows} ${failedRowDetails}`} `
      });

    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(500).json({ message: "An error occurred while processing the file." });
    }

  },
}

module.exports = CourseEnrollmentController;