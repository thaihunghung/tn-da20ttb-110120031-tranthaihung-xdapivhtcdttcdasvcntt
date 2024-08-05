const TeacherModel = require("../models/TeacherModel");
const ExcelJS = require('exceljs');
const path = require('path');
const sequelize = require("../config/database");
const fs = require('fs');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const generateUniqueTeacherCode = async () => {
  let isUnique = false;
  let teacherCode;

  while (!isUnique) {
    teacherCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingTeacher = await TeacherModel.findOne({ where: { teacherCode } });
    if (!existingTeacher) {
      isUnique = true;
    }
  }

  return teacherCode;
};

const permissionMapping = [
  { id: 1, name: "Giáo viên" },
  { id: 2, name: "Quản trị viên" },
  { id: 3, name: "Siêu quản trị viên" },
];

const getPermissionName = (permissionId) => {
  const permission = permissionMapping.find(p => p.id === permissionId);
  return permission ? permission.name : "Unknown";
};

const TeacherController = {
  // Lấy tất cả các giáo viên
  index: async (req, res) => {
    try {
      const { page, size, search } = req.query;
  
      const attributes = ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher', 'imgURL'];
      const whereClause = {
        isDelete: false,
        isBlock: false
      };
  
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { teacherCode: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { typeTeacher: { [Op.like]: `%${search}%` } }
        ];
      }
  
      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);
  
        const { count, rows: teachers } = await TeacherModel.findAndCountAll({
          attributes: attributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });
  
        const teachersWithPermissionName = teachers.map(teacher => ({
          ...teacher.dataValues,
          permissionName: getPermissionName(teacher.permission)
        }));
  
        return res.json({
          total: count,
          teachers: teachersWithPermissionName
        });
      } else {
        const teachers = await TeacherModel.findAll({
          attributes: attributes,
          where: whereClause
        });
  
        const teachersWithPermissionName = teachers.map(teacher => ({
          ...teacher.dataValues,
          permissionName: getPermissionName(teacher.permission)
        }));
  
        return res.json(teachersWithPermissionName);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getAllStore: async (req, res) => {
    try {
      const { page, size } = req.query;
  
      const attributes = ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher', 'imgURL'];
      const whereClause = {
        isBlock: true,
        isDelete: false,
      };
  
      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);
  
        const { count, rows: teachers } = await TeacherModel.findAndCountAll({
          attributes: attributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });
  
        const teachersWithPermissionName = teachers.map(teacher => ({
          ...teacher.dataValues,
          permissionName: getPermissionName(teacher.permission)
        }));
  
        return res.json({
          total: count,
          teachers: teachersWithPermissionName
        });
      } else {
        const teachers = await TeacherModel.findAll({
          attributes: attributes,
          where: whereClause
        });
  
        const teachersWithPermissionName = teachers.map(teacher => ({
          ...teacher.dataValues,
          permissionName: getPermissionName(teacher.permission)
        }));
  
        return res.json(teachersWithPermissionName);
      }
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  // Tạo một giáo viên mới
  create: async (req, res) => {
    try {
      const { email, password, name, typeTeacher, teacherCode } = req.body;

      // Check if the email already exists
      const existingEmail = await TeacherModel.findOne({ where: { email: email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      let uniqueTeacherCode = teacherCode;

      if (!teacherCode) {
        // Generate a unique 6-digit teacherCode if not provided in the request
        uniqueTeacherCode = await generateUniqueTeacherCode();
      } else {
        // Check if the provided teacherCode already exists
        const existingCode = await TeacherModel.findOne({ where: { teacherCode: teacherCode } });
        if (existingCode) {
          return res.status(400).json({ message: 'Teacher code already exists' });
        }
      }

      const data = {
        email,
        password,
        name,
        teacherCode: uniqueTeacherCode,
        typeTeacher
      };

      const newTeacher = await TeacherModel.create(data);
      res.json({
        message: "Tạo giáo viên thành công",
        teacher_id: newTeacher.teacher_id,
        email: newTeacher.email,
        name: newTeacher.name,
        permission: newTeacher.permission,
        typeTeacher: newTeacher.typeTeacher,
      });
    } catch (error) {
      console.error('Lỗi khi tạo giáo viên mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy thông tin của một giáo viên dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const attributes = ['teacher_id', 'name', 'teacherCode', 'email', 'permission', 'typeTeacher','imgURL'];
      const whereClause = {
        isDelete: false,
        isBlock: false,
        teacher_id: id
      };
      const teachers = await TeacherModel.findOne({
        attributes: attributes,
        where: whereClause,
      });

      return res.json({
        teachers,
        permissionName: getPermissionName(teachers.permission)
      });

    } catch (error) {
      console.error('Lỗi khi tìm kiếm giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một giáo viên dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      
      console.log("vcvc", data)
      // Find the teacher by ID
      const teacherDetail = await TeacherModel.findOne({ where: { teacher_id: id } });
      if (!teacherDetail) {
        return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
      }

      // Update the teacher's details
      await teacherDetail.update(data);

      res.json({ message: `Cập nhật thành công thông tin giáo viên thành công` });
    } catch (error) {
      console.error('Lỗi khi cập nhật giáo viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  blockTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isBlock: 1 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been blocked.' });
    } catch (error) {
      console.error('Error blocking teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  blockTeachers: async (req, res) => {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing data array' });
      }

      const ids = data.map(item => item.id);

      if (ids.length === 0) {
        return res.status(400).json({ error: 'No valid teacher ids provided' });
      }

      await TeacherModel.update({ isBlock: 1 }, { where: { teacher_id: ids } });

      res.status(200).json({ message: 'Teachers have been blocked.' });
    } catch (error) {
      console.error('Error blocking teachers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  unblockTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isBlock: 0 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been unblocked.' });
    } catch (error) {
      console.error('Error unblocking teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  unblockTeachers: async (req, res) => {
    try {
      const { data } = req.body;
      const teacherIds = data.map(item => item.id);
      
      await TeacherModel.update({ isBlock: 0 }, { where: { teacher_id: teacherIds } });
      res.status(200).json({ message: 'Teacher has been unblocked.' });
    } catch (error) {
      console.error('Error unblocking teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isDelete: 1 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been deleted.' });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteTeachers: async (req, res) => {
    try {
      const { data } = req.body;
      const teacherIds = data.map(item => item.id);
      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing data array' });
      }
      
      await TeacherModel.update(
        { isDelete: 1 },
        { where: { teacher_id: teacherIds } }
      );

      res.status(200).json({ message: 'Teachers have been deleted.' });
    } catch (error) {
      console.error('Error deleting teachers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  restoreTeacher: async (req, res) => {
    try {
      const teacherId = req.params.id;
      await TeacherModel.update({ isDelete: 0 }, { where: { teacher_id: teacherId } });
      res.status(200).json({ message: 'Teacher has been restored.' });
    } catch (error) {
      console.error('Error restoring teacher:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  //excel
  getFormTeacher: async (req, res) => {
    console.log("vao")
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách giáo viên');

    worksheet.columns = [
      { header: 'Mã giáo viên', key: 'teacherCode', width: 15 },
      { header: 'Tên giáo viên', key: 'name', width: 32 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Teacher.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  getFormTeacherWithData: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing data array' });
      }

      const ids = data.map(item => item.id);

      if (ids.length === 0) {
        return res.status(400).json({ error: 'No valid teacher codes provided' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Teacher');

      const teachers = await TeacherModel.findAll({
        attributes: ['teacher_id', 'teacherCode', 'email', 'name', 'typeTeacher'],
        where: {
          isDelete: false,
          isBlock: false,
          teacher_id: ids
        }
      });

      worksheet.columns = [
        { header: 'Mã giáo viên', key: 'teacherCode', width: 15 },
        { header: 'Tên giáo viên', key: 'name', width: 32 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Loại giáo viên', key: 'typeTeacher', width: 20 },
      ];

      teachers.forEach(teacher => {
        worksheet.addRow({
          teacherCode: teacher.teacherCode.toString(),
          name: teacher.name,
          email: teacher.email,
          typeTeacher: teacher.typeTeacher,
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Teacher.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  saveTeacherExcel: async (req, res) => {
    if (req.files) {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      const insertPromises = [];
      const emailsSet = new Set();
      const idsSet = new Set();

      worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
        if (rowNumber !== 1) { // Skip the header row
          let email = row.getCell(3).value;
          let teacherCode = row.getCell(1).value;

          if (email && typeof email === 'object' && email.hasOwnProperty('text')) {
            email = email.text;
          }

          if (!email || emailsSet.has(email)) {
            console.error(`Duplicate or invalid email found at row ${rowNumber}: ${email}`);
            return; // Skip this row
          }

          if (!teacherCode || idsSet.has(teacherCode)) {
            console.error(`Duplicate or invalid teacherCode found at row ${rowNumber}: ${teacherCode}`);
            teacherCode = await generateUniqueTeacherCode();
          }

          emailsSet.add(email);
          idsSet.add(teacherCode);

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(teacherCode.toString(), salt);

          const sql = `INSERT INTO teachers (teacherCode, name, email, password)
                 VALUES (?, ?, ?, ?)`;
          const values = [
            teacherCode,
            row.getCell(2).value,
            email,
            hashedPassword
          ];

          insertPromises.push(sequelize.query(sql, { replacements: values })
            .catch(error => {
              console.error(`Error inserting row ${rowNumber}: ${error.message}`);
            }));
        }
      });

      await Promise.all(insertPromises);
      console.log('All data has been inserted into the database!');
      fs.unlinkSync(filePath);  // Remove the uploaded file after processing
      res.status(200).json({ message: "Dữ liệu đã được lưu thành công vào cơ sở dữ liệu." });
    } else {
      res.status(400).send('No file uploaded.');
    }
  }
};

module.exports = TeacherController;
