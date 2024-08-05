const SemesterModel = require("../models/SemesterModel");

const SemesterController = {
  // Lấy tất cả các học kỳ
  index: async (req, res) => {
    try {
      const semesters = await SemesterModel.findAll();
      res.json(semesters);
    } catch (error) {
      console.error('Lỗi khi lấy tất cả các học kỳ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo một học kỳ mới
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newSemester = await SemesterModel.create(data);
      res.json(newSemester);
    } catch (error) {
      console.error('Lỗi khi tạo học kỳ mới:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Lấy thông tin của một học kỳ dựa trên ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const semester = await SemesterModel.findOne({ where: { semester_id: id } });
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy học kỳ' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm học kỳ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Cập nhật thông tin của một học kỳ dựa trên ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const semester = await SemesterModel.findOne({ where: { semester_id: id } });
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy học kỳ' });
      }
      await SemesterModel.update(data, { where: { semester_id: id } });
      res.json({ message: `Cập nhật thành công học kỳ có ID: ${id}` });
    } catch (error) {
      console.error('Lỗi khi cập nhật học kỳ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Xóa một học kỳ dựa trên ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await SemesterModel.destroy({ where: { semester_id: id } });
      res.json({ message: 'Xóa học kỳ thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa học kỳ:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteToTrue: async (req, res) => {
    try {
      const semester = await SemesterModel.findAll({ where: { isDelete: true } });
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy semester' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Lỗi tìm kiếm semester:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  isDeleteToFalse: async (req, res) => {
    try {
      const semester = await SemesterModel.findAll({ where: { isDelete: false } });
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy semester' });
      }
      res.json(semester);
    } catch (error) {
      console.error('Lỗi tìm kiếm semester:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Đảo ngược trạng thái isDelete của một lớp học
  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const semester = await SemesterModel.findOne({ where: { class_id: id } });
      if (!semester) {
        return res.status(404).json({ message: 'Không tìm thấy semester' });
      }
      const updatedIsDeleted = !semester.isDelete;
      await SemesterModel.update({ isDelete: updatedIsDeleted }, { where: { class_id: id } });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi đảo ngược trạng thái isDelete của semester:', error);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  }
};

module.exports = SemesterController;
