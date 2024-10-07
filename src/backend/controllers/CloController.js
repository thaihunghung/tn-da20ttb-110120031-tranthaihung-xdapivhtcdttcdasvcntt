const CloModel = require("../models/CloModel");
const SubjectModel = require("../models/SubjectModel");
const CloChapterModel = require('../models/CloChapterModel');
const PloCloModel = require('../models/PloCloModel');

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const CloController = {
  index: async (req, res) => {
    try {
      // Sử dụng query parameters để lấy subject_id và trạng thái isDelete
      const { subject_id, isDelete } = req.query; 
      // Xây dựng điều kiện where
      const whereCondition = {};
      if (subject_id) {
        whereCondition.subject_id = subject_id;
      }
      if (isDelete !== undefined) {
        whereCondition.isDelete = JSON.parse(isDelete); 
      }

      const clos = await CloModel.findAll({
        where: whereCondition
      });

      if (!clos.length) {
        return res.status(404).json({ message: 'No CLOs found' });
      }

      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting CLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newCLO = await CloModel.create(data);
      res.status(201).json(newCLO);
    } catch (error) {
      console.error('Error creating CLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      res.status(200).json(clo);
    } catch (error) {
      console.error('Error getting CLO by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      await CloModel.update(data, { where: { clo_id: id } });
      res.status(200).json({ message: `Successfully updated CLO with ID: ${id}` });
    } catch (error) {
      console.error('Error updating CLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      await CloChapterModel.destroy({ where: { clo_id: id } });
      await PloCloModel.destroy({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      await CloModel.destroy({ where: { clo_id: id } });
      res.status(200).json({ message: 'Successfully deleted CLO' });
    } catch (error) {
      console.error('Error deleting CLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteMultiple: async (req, res) => {
    const { clo_id } = req.query;
    try {
      const cloIds = clo_id.map(id => parseInt(id));
      for (const id of cloIds) {
        await CloChapterModel.destroy({ where: { clo_id: id } });
        await PloCloModel.destroy({ where: { clo_id: id } });
      }

      await CloModel.destroy({ where: { clo_id: clo_id } });

      res.status(200).json({ message: 'Xóa nhiều CLO thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều CLO:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const clos = await CloModel.findAll({ where: { isDelete: true } });
      if (!clos.length) {
        return res.status(404).json({ message: 'No deleted CLOs found' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting deleted CLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const clos = await CloModel.findAll({ where: { isDelete: false } });
      if (!clos.length) {
        return res.status(404).json({ message: 'No active CLOs found' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting active CLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'clo not found' });
      }
      const updatedIsDeleted = !clo.isDelete;
      await CloModel.update({ isDelete: updatedIsDeleted }, { where: { clo_id: id } });

      res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });


    } catch (error) {
      console.error('Error toggling CloModel delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { clo_id } = data;
      if (!Array.isArray(clo_id) || clo_id.length === 0) {
        return res.status(400).json({ message: 'No CloModel ids provided' });
      }

      const clos = await CloModel.findAll({ where: { clo_id: clo_id } });
      if (clos.length !== clo_id.length) {
        return res.status(404).json({ message: 'One or more CloModels not found' });
      }

      const updatedClos = await Promise.all(clos.map(async (clo) => {
        const updatedIsDeleted = !clo.isDelete;
        await clo.update({ isDelete: updatedIsDeleted });
        return { clo_id: clo.clo_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'CloModel delete statuses toggled', updatedClos });
    } catch (error) {
      console.error('Error toggling CloModel delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },


  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      const updatedIsDeleted = !clo.isDelete;
      await CloModel.update({ isDelete: updatedIsDeleted }, { where: { clo_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  GetCloBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const clos = await CloModel.findAll({ where: { subject_id: subject_id, isDelete: false } });
      if (!clos.length) {
        return res.status(404).json({ message: 'No CLOs found for the given subject ID' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting CLOs by subject ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  GetCloArchiveBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const clos = await CloModel.findAll({ where: { subject_id: subject_id, isDelete: true } });
      console.log(clos);
      if (!clos.length) {
        return res.status(404).json({ message: 'No CLOs found for the given subject ID' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting CLOs by subject ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CLO');

    worksheet.columns = [
      { header: 'Tên Clo', key: 'cloName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="PoForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  getFormUpdate: async (req, res) => {
    try {
      const { data } = req.body;
      if (!data || !data.id) {
        return res.status(400).json({ message: 'Invalid input data. Expected format: { data: { id: [1, 2, 3] } }' });
      }

      const { id } = data;
      const pos = await CloModel.findAll({ where: { clo_id: id } });

      if (!pos || pos.length === 0) {
        return res.status(404).json({ message: 'CloModels not found' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('CLO');

      worksheet.columns = [
        { header: 'mã Clo', key: 'clo_id', width: 20 },
        { header: 'Tên Clo', key: 'cloName', width: 20 },
        { header: 'Mô tả', key: 'description', width: 30 },
      ];

      // Add rows to the worksheet
      pos.forEach(element => {
        worksheet.addRow({
          clo_id: element.clo_id,
          cloName: element.cloName,
          description: element.description
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
      res.setHeader('Content-Disposition', 'attachment; filename="cloForm.xlsx"');

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error generating CloModel update form:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  processSaveTemplateClo: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }
    const subject_id = req.body.data;
    try {
      const subject = await SubjectModel.findByPk(subject_id);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    } catch (error) {
      console.error('Error fetching subject:', error);
      return res.status(500).json({ message: 'Error fetching subject from the database' });
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

    const worksheet = workbook.getWorksheet('CLO');
    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          subject_id: subject_id,
          cloName: row.getCell(1).value,
          description: row.getCell(2).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    try {
      const createdClos = await CloModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdClos });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  processUpdateTemplateClo: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const subject_id = req.body.data;
    try {
      const subject = await SubjectModel.findByPk(subject_id);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
    } catch (error) {
      console.error('Error fetching subject:', error);
      return res.status(500).json({ message: 'Error fetching subject from the database' });
    }
    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      console.error('Error reading the uploaded file:', error);
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('CLO');
    const updateData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        updateData.push({
          subject_id: subject_id,
          clo_id: row.getCell(1).value,
          cloName: row.getCell(2).value,
          description: row.getCell(3).value,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      await Promise.all(updateData.map(async (data) => {
        const updatedRows = await CloModel.update(
          {
            cloName: data.cloName,
            description: data.description
          },
          { where: { clo_id: data.clo_id } }
        );

        if (updatedRows[0] === 0) {
          console.warn(`No CloModel found with ID ${data.clo_id} for update`);
        }
      }));

      return res.status(200).json({ message: 'CloModels updated successfully' });
    } catch (error) {
      console.error('Error updating CloModels:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = CloController;
