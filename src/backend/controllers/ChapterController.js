const ChapterModel = require('../models/ChapterModel');
const SubjectModel = require('../models/SubjectModel');
const RubricItemModel = require('../models/RubricItemModel');
const CloChapterModel = require('../models/CloChapterModel');



const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const ChapterController = {
  index: async (req, res) => {
    try {
      const { subject_id, isDelete } = req.query;

      if (subject_id && isDelete !== undefined) {
        // Handle request for archived chapters by subject ID
        const chapters = await ChapterModel.findAll({
          where: { subject_id: subject_id, isDelete: JSON.parse(isDelete) },
          include: [{
            model: SubjectModel,
            attributes: ['subject_id', 'subjectName']
          }]
        });

        if (chapters.length === 0) {
          return res.status(404).json({ message: 'No chapters found' });
        }

        return res.status(200).json(chapters);
      } else if (subject_id) {
        const chapters = await ChapterModel.findAll({
          where: { subject_id: subject_id, isDelete: false },
          include: [{
            model: SubjectModel,
            attributes: ['subject_id', 'subjectName']
          }]
        });

        if (chapters.length === 0) {
          return res.status(404).json({ message: 'No chapters found' });
        }

        return res.status(200).json(chapters);
      } else {
        const chapters = await ChapterModel.findAll();
        return res.status(200).json(chapters);
      }
    } catch (error) {
      console.error('Error handling chapter requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const newChapter = await ChapterModel.create(data);
      res.status(201).json(newChapter);
    } catch (error) {
      console.error('Error creating chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.status(200).json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  GetChapterBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const chapter = await ChapterModel.findAll({
        where: { subject_id: subject_id, isDelete: false },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id', 'subjectName']
        }]
      });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.status(200).json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  GetChapterArchiveBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const chapter = await ChapterModel.findAll({
        where: { subject_id: subject_id, isDelete: true },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id', 'subjectName']
        }]
      });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.status(200).json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedChapter = await ChapterModel.update(data, { where: { chapter_id: id } });
      res.status(200).json({ message: `Successfully updated chapter with ID: ${id}` });
    } catch (error) {
      console.error('Error updating chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await ChapterModel.destroy({ where: { chapter_id: id } });
      res.status(200).json({ message: 'Successfully deleted chapter' });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteMultiple: async (req, res) => {
    const { chapter_id } = req.query;
    try {
      const chapterIds = chapter_id.map(id => parseInt(id));
      for (const id of chapterIds) {
        await CloChapterModel.destroy({ where: { chapter_id: id } });
        await RubricItemModel.destroy({ where: { chapter_id: id } });
      }
      await ChapterModel.destroy({ where: { chapter_id: chapter_id } });
      res.status(200).json({ message: 'Successfully deleted multiple chapters' });
    } catch (error) {
      console.error('Error deleting multiple chapters:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll({ where: { isDelete: true } });
      if (!chapters) {
        return res.status(404).json({ message: 'No chapters found' });
      }
      res.status(200).json(chapters);
    } catch (error) {
      console.error('Error finding chapters with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll({ where: { isDelete: false } });
      if (!chapters) {
        return res.status(404).json({ message: 'No chapters found' });
      }
      res.status(200).json(chapters);
    } catch (error) {
      console.error('Error finding chapters with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedIsDeleted = !chapter.isDelete;
      await ChapterModel.update({ isDelete: updatedIsDeleted }, { where: { chapter_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedIsDeleted = !chapter.isDelete;
      await ChapterModel.update({ isDelete: updatedIsDeleted }, { where: { chapter_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { chapter_id } = data;
      if (!Array.isArray(chapter_id) || chapter_id.length === 0) {
        return res.status(400).json({ message: 'No chapter ids provided' });
      }

      const chapters = await ChapterModel.findAll({ where: { chapter_id: chapter_id } });
      if (chapters.length !== chapter_id.length) {
        return res.status(404).json({ message: 'One or more chapters not found' });
      }

      const updatedChapters = await Promise.all(chapters.map(async (chapter) => {
        const updatedIsDeleted = !chapter.isDelete;
        await chapter.update({ isDelete: updatedIsDeleted });
        return { chapter_id: chapter.chapter_id, isDelete: updatedIsDeleted };
      }));

      res.status(200).json({ message: 'Chapter delete statuses toggled', updatedChapters });
    } catch (error) {
      console.error('Error toggling chapter delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CHAPTER');

    worksheet.columns = [
      { header: 'Tên chapter', key: 'chapterName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 100 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="chapter.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  getFormUpdate: async (req, res) => {
    try {
      const { data } = req.body;
      if (!data || !data.id) {
        return res.status(400).json({ message: 'Missing chapter ID in request body' });
      }

      const id = data.id;
      const chapters = await ChapterModel.findAll({ where: { chapter_id: id } });

      if (!chapters || chapters.length === 0) {
        return res.status(404).json({ message: 'Chapter not found' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('CHAPTER');

      worksheet.columns = [
        { header: 'mã Chapter', key: 'chapter_id', width: 20 },
        { header: 'Tên chapter', key: 'chapterName', width: 20 },
        { header: 'Mô tả', key: 'description', width: 100 },
      ];

      chapters.forEach(element => {
        worksheet.addRow({
          chapter_id: element.chapter_id,
          chapterName: element.chapterName,
          description: element.description
        });
      });

      await worksheet.protect('yourpassword', {
        selectLockedCells: true,
        selectUnlockedCells: true
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          cell.protection = { locked: colNumber === 1 };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="chapterForm.xlsx"');
      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error generating chapterModel update form:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  processSaveTemplateChapter: async (req, res) => {
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

    const worksheet = workbook.getWorksheet('CHAPTER');
    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          subject_id: subject_id,
          chapterName: row.getCell(1).value,
          description: row.getCell(2).value,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      const createdChapter = await ChapterModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdChapter });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  processUpdateTemplateChapter: async (req, res) => {
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

    const worksheet = workbook.getWorksheet('CHAPTER');
    const updateData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        updateData.push({
          subject_id: subject_id,
          chapter_id: row.getCell(1).value,
          chapterName: row.getCell(2).value,
          description: row.getCell(3).value,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      await Promise.all(updateData.map(async (data) => {
        const updatedRows = await ChapterModel.update(
          {
            chapterName: data.chapterName,
            description: data.description
          },
          { where: { chapter_id: data.chapter_id } }
        );

        if (updatedRows[0] === 0) {
          console.warn(`No ChapterModel found with ID ${data.chapter_id} for update`);
        }
      }));

      res.status(200).json({ message: 'ChapterModels updated successfully' });
    } catch (error) {
      console.error('Error updating ChapterModels:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = ChapterController;