const { Op } = require("sequelize");
const ClassModel = require("../models/ClassModel");
const TeacherModel = require("../models/TeacherModel");
const ExcelJS = require('exceljs');
const path = require('path');

const ClassController = {
  // Lấy tất cả các lớp học
  index: async (req, res) => {
    try {
      const classes = await ClassModel.findAll({ where: { isDelete: false } });
      res.json(classes);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },
  getAllWithTeacher: async (req, res) => {
    try {
      const { page, size, search } = req.query;
  
      const attributes = ['class_id', 'teacher_id', 'className', 'classNameShort', 'classCode', 'isDelete'];
      const whereClause = { isDelete: false };
  
      if (search) {
        whereClause[Op.or] = [
          { className: { [Op.like]: `%${search}%` } },
          { classCode: { [Op.like]: `%${search}%` } },
          { '$teacher.name$': { [Op.like]: `%${search}%` } }
        ];
      }
  
      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);
  
        const { count, rows: classes } = await ClassModel.findAndCountAll({
          include: [{
            model: TeacherModel,
            attributes: ['name']
          }],
          attributes: attributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });
  
        return res.json({
          total: count,
          classes: classes
        });
      } else {
        const classes = await ClassModel.findAll({
          include: [{
            model: TeacherModel,
            attributes: ['name']
          }],
          attributes: attributes,
          where: whereClause
        });
  
        return res.json(classes);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },  

  // Lấy một lớp học theo ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const classes = await ClassModel.findAll({
        include: [{
          model: TeacherModel,
          attributes: ['name']
        }],
        attributes: ['class_id', 'teacher_id', 'className', 'classCode', 'isDelete'],// Lọc ra các trường cần lấy
        where: {
          isDelete: false,
          class_id: id
        }
      });
      if (!classes) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      res.json(classes);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },
  getExcelWithData: async (req, res) => {
    try {
      const { data } = req.body;

      if (!data || !Array.isArray(data.id) || data.id.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing id array' });
      }

      const { id } = data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students Form');

      const classes = await ClassModel.findAll({
        include: [{
          model: TeacherModel,
          attributes: ['name']
        }],
        attributes: ['class_id', 'teacher_id', 'className', 'classCode', 'isDelete'],// Lọc ra các trường cần lấy
        where: {
          isDelete: false,
          class_id: id
        }
      });

      worksheet.columns = [
        { header: 'id', key: 'id', width: 15 },
        { header: 'Mã lớp', key: 'classCode', width: 15 },
        { header: 'Tên lớp', key: 'className', width: 32 },
        { header: 'GVCV', key: 'nameTeacher', width: 20 },
      ];

      classes.forEach(item => {
        worksheet.addRow({
          id: item.class_id,
          classCode: item.classCode,
          className: item.className,
          nameTeacher: item.teacher.name,
          email: item.email
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

  // Tạo một lớp học mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newClass = await ClassModel.create(data);
      res.json(newClass);
    } catch (error) {
      console.error('Lỗi khi tạo lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },
  // Cập nhật một lớp học
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      console.log("data", data)
      const classObj = await ClassModel.findOne({ where: { class_id: id, isDelete: false } });
      if (!classObj) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      await ClassModel.update(data, { where: { class_id: id } });
      res.json({ message: `Cập nhật thành công lớp học có id: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  // Xóa một lớp học
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const classObj = await ClassModel.findOne({ where: { class_id: id, isDelete: false } });
      if (!classObj) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      await ClassModel.update({ isDelete: true }, { where: { class_id: id } });
      res.json({ message: 'Xóa lớp học thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  },

  isDeleteToTrue: async (req, res) => {
    try {
      const { page, size } = req.query;

      const attributes = ['class_id', 'teacher_id', 'className', 'classCode', 'isDelete'];
      const whereClause = { isDelete: true };

      if (page && size) {
        const offset = (page - 1) * size;
        const limit = parseInt(size, 10);

        const { count, rows: classes } = await ClassModel.findAndCountAll({
          include: [{
            model: TeacherModel,
            attributes: ['name']
          }],
          attributes: attributes,
          where: whereClause,
          offset: offset,
          limit: limit
        });

        return res.json({
          total: count,
          classes: classes
        });
      } else {
        const classes = await ClassModel.findAll({
          include: [{
            model: TeacherModel,
            attributes: ['name']
          }],
          attributes: attributes,
          where: whereClause
        });

        return res.json(classes);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  isDeleteToFalse: async (req, res) => {
    try {
      const classes = await ClassModel.findAll({ where: { isDelete: false } });
      if (!classes) {
        return res.status(404).json({ message: 'Không tìm thấy classes' });
      }
      res.json(classes);
    } catch (error) {
      console.error('Lỗi tìm kiếm classes:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  IsDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const classes = await ClassModel.findOne({ where: { class_id: id } });
      if (!classes) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học' });
      }
      const updatedIsDeleted = !classes.isDelete;
      await ClassModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của lớp học:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }

};

module.exports = ClassController;
