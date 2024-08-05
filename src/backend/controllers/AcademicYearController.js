const AcademicYearModel = require("../models/AcademicYearModel");

const AcademicYearController = {
  // Lấy tất cả các năm học
  index: async (req, res) => {
    try {
      const academicYears = await AcademicYearModel.findAll();
      res.json(academicYears);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các năm học:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo một năm học mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const year = parseInt(data, 10);
  
      if (isNaN(year)) {
        return res.status(400).json({ message: 'Dữ liệu năm không hợp lệ' });
      }
  
      const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
      const description = `Năm học ${year}-${year + 1}`;
  
      // Check if the academic year already exists
      const existingAcademicYear = await AcademicYearModel.findOne({
        where: { startDate, endDate },
      });
  
      if (existingAcademicYear) {
        return res.status(200).json(existingAcademicYear);
      }
  
      // Create a new academic year if it doesn't exist
      const newAcademicYear = await AcademicYearModel.create({
        startDate,
        endDate,
        description,
        isDelete: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      res.status(201).json(newAcademicYear);
    } catch (error) {
      console.error('Lỗi khi tạo năm học mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  

  // Lấy thông tin của một năm học dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const academicYear = await AcademicYearModel.findOne({ where: { academic_year_id: id } });
      if (!academicYear) {
        return res.status(404).json({ message: 'Không tìm thấy năm học' });
      }
      res.json(academicYear);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm năm học:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một năm học dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const academicYear = await AcademicYearModel.findOne({ where: { academic_year_id: id } });
      if (!academicYear) {
        return res.status(404).json({ message: 'Không tìm thấy năm học' });
      }
      await AcademicYearModel.update(data, { where: { academic_year_id: id } });
      res.json({ message: `Cập nhật thành công năm học có ID: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật năm học:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Xóa một năm học dựa trên ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await AcademicYearModel.destroy({ where: { academic_year_id: id } });
      res.json({ message: 'Xóa năm học thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa năm học:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteToTrue: async (req, res) => {
    try {
      const academicYear = await AcademicYearModel.findAll({ where: { isDelete: true } });
      if (!academicYear) {
        return res.status(404).json({ message: 'Không tìm thấy academic year' });
      }
      res.json(academicYear);
    } catch (error) {
      console.error('Lỗi tìm kiếm :', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteToFalse: async (req, res) => {
    try {
      const academicYear = await AcademicYearModel.findAll({ where: { isDelete: false } });
      if (!academicYear) {
        return res.status(404).json({ message: 'Không tìm thấy academic year' });
      }
      res.json(academicYear);
    } catch (error) {
      console.error('Lỗi tìm kiếm academic year:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  IsDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const academicYear = await AcademicYearModel.findOne({ where: { class_id: id } });
      if (!academicYear) {
        return res.status(404).json({ message: 'Không tìm thấy academic year' });
      }
      const updatedIsDeleted = !academicYear.isDelete;
      await AcademicYearModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của academic year:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }
};

module.exports = AcademicYearController;
