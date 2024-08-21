const ProgramModel = require('../models/ProgramModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const PloModel = require('../models/PloModel');
const PoModel = require('../models/PoModel');
const PoPloModel = require('../models/PoPloModel');

const protectWorksheet = async (worksheet, lockedColumnKeys = []) => {
  await worksheet.protect('yourpassword', {
    selectLockedCells: true,
    selectUnlockedCells: true
  });
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (lockedColumnKeys.includes(worksheet.getColumn(colNumber).key)) {
        cell.protection = { locked: true };
      } else {
        cell.protection = { locked: false };
      }
    });
  });

  // Bảo vệ worksheet

};

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

    // Tạo worksheet Program
    const programWorksheet = workbook.addWorksheet('Program');
    programWorksheet.columns = [
      { header: 'Mã chương trình', key: 'program_id', width: 20 },
      { header: 'Tên chương trình', key: 'programName', width: 20 },
      { header: 'Mô tả (Html)', key: 'description', width: 65 },
    ];
    programWorksheet.addRow({ program_id: 'IT', programName: 'Chương trình mẫu', description: '<p>Mô tả HTML mẫu</p>' });
    await protectWorksheet(programWorksheet, ['program_id']);

    // Tạo worksheet PO
    const poWorksheet = workbook.addWorksheet('PO');
    poWorksheet.columns = [
      { header: 'Tên Mục tiêu', key: 'poName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 65 },
      { header: 'Mã chương trình', key: 'program_id', width: 20 },
    ];
    poWorksheet.addRow({ poName: 'PO1', description: 'PO1', program_id: 'IT' });

    // Tạo worksheet PLO
    const ploWorksheet = workbook.addWorksheet('PLO');
    ploWorksheet.columns = [
      { header: 'Tên Chuẩn đầu ra', key: 'ploName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 65 },
      { header: 'Mã chương trình', key: 'program_id', width: 20 },
    ];
    ploWorksheet.addRow({ ploName: 'PLO1', description: '', program_id: 'IT' });

    // Tạo worksheet PLO_PO
    const ploPoWorksheet = workbook.addWorksheet('PLO_PO');

    ploPoWorksheet.columns = [
      { header: 'PLO', key: 'ploName', width: 20 },
      { header: 'PO', key: 'poName', width: 20 },

    ];

    ploPoWorksheet.addRow({ ploName: 'PLO1', poName: 'PLO2' });

    // Bảo vệ các worksheet
    const protectOptions = {
      selectLockedCells: true,
      selectUnlockedCells: true
    };

    await Promise.all([
      programWorksheet.protect('yourpassword', protectOptions),
    ]);

    // Đặt header cho file Excel
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
  
    const ProgramWorksheet = workbook.getWorksheet('Program');
    const PoWorksheet = workbook.getWorksheet('PO');
    const PloWorksheet = workbook.getWorksheet('PLO');
    const PloPoWorksheet = workbook.getWorksheet('PLO_PO');
  
    const jsonProgramData = [];
    const jsonPoData = [];
    const jsonPloData = [];
    const jsonPloPoData = [];
  
    // Read Program data
    ProgramWorksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonProgramData.push({
          program_id: row.getCell(1).value,
          programName: row.getCell(2).value,
          description: row.getCell(3).value,
        });
      }
    });
  
    // Read PO data
    const program_id_PoWorksheet = [];
    PoWorksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const id = row.getCell(3).value;
        if (id) {
          program_id_PoWorksheet.push(id);
        }
      }
    });
  
    PoWorksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonPoData.push({
          poName: row.getCell(1).value,
          description: row.getCell(2).value,
          program_id: program_id_PoWorksheet[0],
        });
      }
    });
  
    // Read PLO data
    const program_id_PloWorksheet = [];
    PloWorksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const id = row.getCell(3).value;
        if (id) {
          program_id_PloWorksheet.push(id);
        }
      }
    });
  
    PloWorksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonPloData.push({
          ploName: row.getCell(1).value,
          description: row.getCell(2).value,
          program_id: program_id_PloWorksheet[0],
        });
      }
    });
  
    // Read PLO_PO data
    PloPoWorksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonPloPoData.push({
          ploName: row.getCell(1).value,
          poName: row.getCell(2).value,
        });
      }
    });
  
    const fetchPloPoIds = async (ploName, poName) => {
      try {
        const plo = await PloModel.findOne({ where: { ploName } });
        const po = await PoModel.findOne({ where: { poName } });
  
        if (plo && po) {
          return {
            plo_id: plo.plo_id,
            po_id: po.po_id,
          };
        }
        return null;
      } catch (error) {
        console.error('Error fetching PLO or PO:', error);
        return null;
      }
    };
  
    try {
      // Save Programs first
      const createdPrograms = await ProgramModel.bulkCreate(jsonProgramData);
  
      // Save Plo and Po simultaneously
      const [createdPlos, createdPos] = await Promise.all([
        PloModel.bulkCreate(jsonPloData),
        PoModel.bulkCreate(jsonPoData),
      ]);
  
      // Get ids for Plo and Po
      const ploIds = createdPlos.map(plo => plo.plo_id);
      const poIds = createdPos.map(po => po.po_id);
  
      // Map ploName and poName to their corresponding ids
      const ploPoIds = await Promise.all(
        jsonPloPoData.map(async (item) => {
          const ids = await fetchPloPoIds(item.ploName, item.poName);
          return ids;
        })
      );
  
      // Filter out null values
      const filteredPloPoIds = ploPoIds.filter(id => id !== null);
  
      // Save PloPo relationships
      await PoPloModel.bulkCreate(filteredPloPoIds);
  
      fs.unlinkSync(filePath);
      res.status(201).json({ message: 'Data saved successfully', data: createdPrograms });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  
  }
}

module.exports = programController;
