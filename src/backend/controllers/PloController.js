
const ProgramModel = require('../models/ProgramModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const PloModel = require('../models/PloModel');
const PloCloModel = require('../models/PloCloModel');
const PoPloModel = require('../models/PoPloModel');

const PloController = {
  index: async (req, res) => {
    try {
      const plos = await PloModel.findAll();
      res.status(200).json(plos);
    } catch (error) {
      console.error('Error getting all PLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Create a new PLO
  create: async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ message: 'No data provided' });
      }
      const newPLO = await PloModel.create(data);
      res.status(201).json(newPLO);
    } catch (error) {
      console.error('Error creating PLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get PLO by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'No ID provided' });
      }
      const plo = await PloModel.findOne({ where: { plo_id: id } });
      if (!plo) {
        return res.status(404).json({ message: 'PLO not found' });
      }
      res.status(200).json(plo);
    } catch (error) {
      console.error('Error fetching PLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update PLO
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'No ID provided' });
      }
      if (!data) {
        return res.status(400).json({ message: 'No data provided' });
      }
      const [updated] = await PloModel.update(data, { where: { plo_id: id } });
      if (!updated) {
        return res.status(404).json({ message: 'PLO not found' });
      }
      res.status(200).json({ message: 'PLO updated successfully' });
    } catch (error) {
      console.error('Error updating PLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete PLO
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'No ID provided' });
      }
      await PoPloModel.destroy({ where: { plo_id: id } });
      await PloCloModel.destroy({where: { plo_id: id } });
      const deleted = await PloModel.destroy({ where: { plo_id: id } });
      if (!deleted) {
        return res.status(404).json({ message: 'PLO not found' });
      }
      res.status(200).json({ message: 'PLO deleted successfully' });
    } catch (error) {
      console.error('Error deleting PLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteMultiple: async (req, res) => {
    const { plo_id } = req.query;
    try {
      await PloCloModel.destroy({where: { plo_id: plo_id } });
      await PoPloModel.destroy({ where: { plo_id: plo_id } });
      const deletedCount = await PloModel.destroy({ where: { plo_id: plo_id } });
      if (!deletedCount) {
        return res.status(404).json({ message: 'PLO not found' });
      }
      res.json({ message: 'PLO deleted successfully' });
    } catch (error) {
      console.error('Error deleting PLO:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // isDeleteToTrue: async (req, res) => {
  //   try {
  //     const pos = await PO.findAll({ where: { isDelete: true } });
  //     res.json(pos);
  //   } catch (error) {
  //     console.error('Error finding deleted POs:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  // Get PLOs where isDelete is true
  isDeleteTotrue: async (req, res) => {
    try {
      const plos = await PloModel.findAll({ where: { isDelete: true } });
      res.status(200).json(plos);
    } catch (error) {
      console.error('Error fetching PLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get PLOs where isDelete is false
  isDeleteTofalse: async (req, res) => {
    try {
      const plos = await PloModel.findAll({ where: { isDelete: false } });
      res.status(200).json(plos);
    } catch (error) {
      console.error('Error fetching PLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Toggle isDelete status for a PLO
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'No ID provided' });
      }
      const plo = await PloModel.findOne({ where: { plo_id: id } });
      if (!plo) {
        return res.status(404).json({ message: 'PLO not found' });
      }
      const updatedIsDeleted = !plo.isDelete;
      await PloModel.update({ isDelete: updatedIsDeleted }, { where: { plo_id: id } });
      res.status(200).json({ message: `isDelete status toggled to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  
  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { plo_id } = data;
      if (!Array.isArray(plo_id) || plo_id.length === 0) {
        return res.status(400).json({ message: 'No PlO ids provided' });
      }

      const plos = await PloModel.findAll({ where: { plo_id: plo_id } });
      if (plos.length !== plo_id.length) {
        return res.status(404).json({ message: 'One or more PLOs not found' });
      }

      const updatedPlos = await Promise.all(plos.map(async (plo) => {
        const updatedIsDeleted = !plo.isDelete;
        await plo.update({ isDelete: updatedIsDeleted });
        return { plo_id: plo.plo_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'PLO delete statuses toggled', updatedPlos });
    } catch (error) {
      console.error('Error toggling PLO delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const plo = await PloModel.findOne({ where: { plo_id: id } });
      if (!plo) {
        return res.status(404).json({ message: 'plo not found' });
      }
      const updatedIsDeleted = !plo.isDelete;
      await PloModel.update({ isDelete: updatedIsDeleted }, { where: { plo_id: id } });

      res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });


    } catch (error) {
      console.error('Error toggling PlO delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  

  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PLO');

    worksheet.columns = [
      { header: 'Mã chương trình', key: 'program_id', width: 20 },
      { header: 'Tên PLO', key: 'poName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="PoForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  getFormUpdate: async (req, res) => {
    try {
      const { id } = req.body.data;
      // console.log(id);
      const pos = await PloModel.findAll({ where: { plo_id: id } });

      if (!pos || pos.length === 0) {
        return res.status(404).json({ message: 'PLOs not found' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('PLO');

      worksheet.columns = [
        { header: 'Mã plo (int)', key: 'plo_id', width: 20 },
        { header: 'Mã chương trình (int)', key: 'program_id', width: 20 },
        { header: 'Tên PLO', key: 'ploName', width: 20 },
        { header: 'Mô tả', key: 'description', width: 30 },
      ];

      // Add rows to the worksheet
      pos.forEach(element => {
        worksheet.addRow({
          plo_id: element.plo_id,
          program_id: element.program_id,
          ploName: element.ploName,
          description: element.description
        });
      });

      await worksheet.protect('yourpassword', {
        selectLockedCells: true,
        selectUnlockedCells: true
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1 || colNumber === 2) {
            cell.protection = { locked: true };
          } else {
            cell.protection = { locked: false };
          }
        });
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="PloForm.xlsx"');

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error generating PLO update form:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  processSaveTemplatePlo: async (req, res) => {
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

    const worksheet = workbook.getWorksheet('PLO');
    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          program_id: row.getCell(1).value,
          ploName: row.getCell(2).value,
          description: row.getCell(3).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    try {
      const createdPos = await PloModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdPos });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  processUpdateTemplatePlo: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
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

    const worksheet = workbook.getWorksheet('PLO');
    const updateData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        updateData.push({
          plo_id: row.getCell(1).value,
          program_id: row.getCell(2).value,
          ploName: row.getCell(3).value,
          description: row.getCell(4).value,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      await Promise.all(updateData.map(async (data) => {
        const updatedRows = await PloModel.update(
          {
            program_id: data.program_id,
            ploName: data.ploName,
            description: data.description
          },
          { where: { plo_id: data.plo_id } }
        );

        if (updatedRows[0] === 0) {
          console.warn(`No PLO found with ID ${data.plo_id} for update`);
        }
      }));

      return res.status(200).json({ message: 'PLOs updated successfully' });
    } catch (error) {
      console.error('Error updating PLOs:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = PloController;