const ProgramModel = require('../models/ProgramModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const programController = {
  index: async (req, res) => {
    try {
      const programs = await ProgramModel.findAll();
      if (!programs) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json(programs);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newProgram = await ProgramModel.create(data);
      res.status(201).json({ message: 'Data saved successfully', data: newProgram });
    } catch (error) {
      console.error('Error creating program:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const program = await ProgramModel.findOne({ where: { program_id: id } });
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json(program);
    } catch (error) {
      console.error('Error fetching program:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const [updatedCount] = await ProgramModel.update(data, { where: { program_id: id } });
      if (updatedCount === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json({ message: 'Program updated successfully' });
    } catch (error) {
      console.error('Error updating program:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCount = await ProgramModel.destroy({ where: { program_id: id } });
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json({ message: 'Program deleted successfully' });
    } catch (error) {
      console.error('Error deleting program:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const program = await ProgramModel.findAll({ where: { isDelete: true } });
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json(program);
    } catch (error) {
      console.error('Error fetching program:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const program = await ProgramModel.findAll({ where: { isDelete: false } });
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.status(200).json(program);
    } catch (error) {
      console.error('Error fetching program:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  toggleIsDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const program = await ProgramModel.findOne({ where: { program_id: id } });
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      const updatedIsDeleted = !program.isDelete;
      await ProgramModel.update({ isDelete: updatedIsDeleted }, { where: { program_id: id } });
      res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFormExels: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Program');

    worksheet.columns = [
      { header: 'Tên chương trình', key: 'programName', width: 20 },
      { header: 'Mô tả (Html)', key: 'description', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ProgramsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Program');

    worksheet.columns = [
      { header: 'Tên chương trình', key: 'programName', width: 20 },
      { header: 'Mô tả (Html)', key: 'description', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ProgramsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  processSaveTemplate: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }

    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('Program');
    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          programName: row.getCell(1).value,
          description: row.getCell(2).value,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      const createdPrograms = await ProgramModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdPrograms });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  }
}

module.exports = programController;
