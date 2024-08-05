const SubjectModel = require("../models/SubjectModel");
const CloModel = require("../models/CloModel");
const ChapterModel = require("../models/ChapterModel");
const RubricItemModel = require("../models/RubricItemModel");
const CloChapterModel = require("../models/CloChapterModel");
const PloCloModel = require("../models/PloCloModel");

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const TeacherModel = require("../models/TeacherModel");
const RubricModel = require("../models/RubricModel");
const CourseModel = require("../models/CourseModel");
const AssessmentModel = require("../models/AssessmentModel");



const validTypes = [
  'Đại cương',
  'Cơ sở ngành',
  'Chuyên ngành',
  'Thực tập đồ án',
];

const SubjectController = {
  getSubjects: async (req, res) => {
    try {
      const { teacher_id, isDelete, course_id } = req.query;

      // Điều kiện lọc subjects
      const whereCondition = {};
      if (teacher_id) {
        whereCondition.teacher_id = teacher_id;
      }
      if (isDelete !== undefined) {
        whereCondition.isDelete = JSON.parse(isDelete); // Chuyển đổi chuỗi thành boolean
      }

      // Nếu có course_id, tìm subject dựa trên course_id
      if (course_id) {
        const course = await CourseModel.findOne({ where: { course_id } });
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        const subject = await SubjectModel.findOne({ where: { subject_id: course.subject_id } });
        if (!subject) {
          return res.status(404).json({ message: 'Subject not found' });
        }

        return res.status(200).json(subject);
      }

      // Lấy subjects theo điều kiện lọc
      const subjects = await SubjectModel.findAll({
        where: whereCondition
      });

      // Nếu không có subjects, trả về 404
      if (!subjects.length) {
        return res.status(404).json({ message: 'No subjects found' });
      }

      // Lấy CLOs và Chapters liên quan cho các subjects
      const subjectIds = subjects.map(subject => subject.subject_id);
      const Clos = await CloModel.findAll({ where: { subject_id: subjectIds } });
      const Chapters = await ChapterModel.findAll({ where: { subject_id: subjectIds } });

      for (const subject of subjects) {
        subject.dataValues.CLO = Clos.filter(clos => clos.subject_id === subject.subject_id);
        subject.dataValues.CHAPTER = Chapters.filter(chapter => chapter.subject_id === subject.subject_id);
      }

      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newSubject = await SubjectModel.create(data);
      res.status(201).json(newSubject);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const { include_clos, include_chapters, only_clo_ids, only_chapter_ids } = req.query;

      // Tìm thông tin subject
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Khởi tạo response với thông tin subject
      const response = { subject };

      // Nếu query include_clos = true, thêm CLOs vào response
      if (include_clos === 'true') {
        const clos = await CloModel.findAll({
          where: { subject_id: id, isDelete: false },
          attributes: ['clo_id', 'cloName', 'description']
        });
        response.clos = clos.length ? clos : [];
      }

      // Nếu query include_chapters = true, thêm Chapters vào response
      if (include_chapters === 'true') {
        const chapters = await ChapterModel.findAll({
          where: { subject_id: id, isDelete: false },
          attributes: ['chapter_id', 'chapterName', 'description']
        });
        response.chapters = chapters.length ? chapters : [];
      }

      // Nếu query only_clo_ids = true, chỉ trả về IDs của CLOs
      if (only_clo_ids === 'true') {
        const cloIds = await CloModel.findAll({
          where: { subject_id: id, isDelete: false },
          attributes: ['clo_id']
        });
        response.clo_ids = cloIds.map(clo => clo.clo_id);
      }

      // Nếu query only_chapter_ids = true, chỉ trả về IDs của Chapters
      if (only_chapter_ids === 'true') {
        const chapterIds = await ChapterModel.findAll({
          where: { subject_id: id, isDelete: false },
          attributes: ['chapter_id']
        });
        response.chapter_ids = chapterIds.map(chapter => chapter.chapter_id);
      }

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching subject details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  

  getArrayIDCloBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const clos = await CloModel.findAll({
        where: { subject_id: subject_id, isDelete: false },
        attributes: ['clo_id', 'cloName', 'description']
      });

      if (clos.length === 0) {
        return res.status(404).json({ message: 'No CLOs found for the given subject ID' });
      }

      const cloData = clos.map(clo => ({
        clo_id: clo.clo_id,
        cloName: clo.cloName,
        description: clo.description
      }));
      res.status(200).json(cloData);
    } catch (error) {
      console.error('Error fetching CLOs by subject ID:', error);
      res.status(500).json({ message: 'An error occurred while fetching CLOs' });
    }
  },

  getArrayIDChapterBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const Chapters = await ChapterModel.findAll({
        where: { subject_id: subject_id, isDelete: false },
        attributes: ['chapter_id', 'chapterName', 'description']
      });

      if (Chapters.length === 0) {
        return res.status(404).json({ message: 'No Chapters found for the given subject ID' });
      }
      const ChapterIds = Chapters.map(Chapter => Chapter.chapter_id);
      res.status(200).json(ChapterIds);
    } catch (error) {
      console.error('Error fetching Chapters by subject ID:', error);
      res.status(500).json({ message: 'An error occurred while fetching Chapters' });
    }
  },

  getByrubricsbySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: subject_id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      const rubric = await RubricModel.findAll({ where: { subject_id: subject_id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      res.status(200).json(rubric);
    } catch (error) {
      console.error('Error finding rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getByrubricsbySubjectIdTeacherId: async (req, res) => {
    try {
      const { subject_id, teacher_id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: subject_id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      const rubric = await RubricModel.findAll({ where: { subject_id: subject_id, teacher_id:teacher_id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      res.status(200).json(rubric);
    } catch (error) {
      console.error('Error finding rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getRubricsBySubjectId: async (req, res) => {
    try {
      const { id } = req.params;
      const { teacher_id } = req.query;

      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const whereConditions = { subject_id: id };
      if (teacher_id) {
        whereConditions.teacher_id = teacher_id;
      }

      const rubrics = await RubricModel.findAll({ where: whereConditions });
      if (!rubrics.length) {
        return res.status(404).json({ message: 'Rubrics not found' });
      }

      res.status(200).json(rubrics);
    } catch (error) {
      console.error('Error finding rubrics:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getByCourseId: async (req, res) => {
    try {
        const { course_id } = req.params;

        // Find the course by course_id
        const course = await CourseModel.findOne({ where: { course_id: course_id } });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find the subject by subject_id from the found course
        const subject = await SubjectModel.findOne({ where: { subject_id: course.subject_id } });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Send the subject as a response
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error finding subject:', error);
        res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await SubjectModel.update(data, { where: { subject_id: id } });
      res.status(200).json({ message: `Successfully updated subject with ID: ${id}` });
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      const clos = await CloModel.findAll({ where: { subject_id: subject.subject_id } });
      for (const clo of clos) {
        await CloChapterModel.destroy({ where: { clo_id: clo.clo_id } });
        await PloCloModel.destroy({ where: { clo_id: clo.clo_id } });
        await CloModel.destroy({ where: { clo_id: clo.clo_id } });
      }

      const chapters = await ChapterModel.findAll({ where: { subject_id: subject.subject_id } });
      for (const chapter of chapters) {
        await CloChapterModel.destroy({ where: { chapter_id: chapter.chapter_id } });
        await RubricItemModel.destroy({ where: { chapter_id: chapter.chapter_id } });
        await ChapterModel.destroy({ where: { chapter_id: chapter.chapter_id } });
      }

      await SubjectModel.destroy({ where: { subject_id: subject.subject_id } });
      res.status(200).json({ message: 'Successfully deleted subject' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  ,
  deleteMultiple: async (req, res) => {
    const { subject_id } = req.query;
    try {
      const subjectIds = subject_id.map(id => parseInt(id));
      for (const id of subjectIds) {

        const subject = await SubjectModel.findOne({ where: { subject_id: id } });
        if (!subject) {
          return res.status(404).json({ message: 'Subject not found' });
        }

        const clos = await CloModel.findAll({ where: { subject_id: id } });
        for (const clo of clos) {
          await CloChapterModel.destroy({ where: { clo_id: clo.clo_id } });
          await PloCloModel.destroy({ where: { clo_id: clo.clo_id } });
          await CloModel.destroy({ where: { clo_id: clo.clo_id } });
        }

        const chapters = await ChapterModel.findAll({ where: { subject_id: id } });
        for (const chapter of chapters) {
          await CloChapterModel.destroy({ where: { chapter_id: chapter.chapter_id } });
          await RubricItemModel.destroy({ where: { chapter_id: chapter.chapter_id } });
          await ChapterModel.destroy({ where: { chapter_id: chapter.chapter_id } });
        }
      }

      await SubjectModel.destroy({ where: { subject_id: subjectIds } });

      res.status(200).json({ message: 'Xóa nhiều CLO thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều CLO:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const deletedSubjects = await SubjectModel.findAll({ where: { isDelete: true } });
      res.status(200).json(deletedSubjects);
    } catch (error) {
      console.error('Error fetching deleted subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const activeSubjects = await SubjectModel.findAll({
        where: { isDelete: false }
      });
      const subjectIds = activeSubjects.map(subject => subject.subject_id);
      const Clos = await CloModel.findAll({ where: { subject_id: subjectIds } });
      const Chapter = await ChapterModel.findAll({ where: { subject_id: subjectIds } });


      for (const subject of activeSubjects) {
        const closForSubject = Clos.filter(clos => clos.subject_id === subject.subject_id);
        const ChapterForSubject = Chapter.filter(Chapter => Chapter.subject_id === subject.subject_id);
        subject.dataValues.CLO = closForSubject;
        subject.dataValues.CHAPTER = ChapterForSubject;
      }

      //activeSubjects.dataValues.CLO = Clos;
      //activeSubjects.dataValues.CHAPTER = Chapter;

      res.status(200).json(activeSubjects);
    } catch (error) {
      console.error('Error fetching active subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  isDeleteTotrueByteacher: async (req, res) => {
    try {
      const { teacher_id } = req.params;
      const deletedSubjects = await SubjectModel.findAll({ where: { isDelete: true, teacher_id: teacher_id } });
      res.status(200).json(deletedSubjects);
    } catch (error) {
      console.error('Error fetching deleted subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTofalseByteacher: async (req, res) => {
    try {
      const { teacher_id } = req.params;
      const activeSubjects = await SubjectModel.findAll({
        where: { isDelete: false, teacher_id: teacher_id }
      });
      const subjectIds = activeSubjects.map(subject => subject.subject_id);
      const Clos = await CloModel.findAll({ where: { subject_id: subjectIds } });
      const Chapter = await ChapterModel.findAll({ where: { subject_id: subjectIds } });

      for (const subject of activeSubjects) {
        const closForSubject = Clos.filter(clos => clos.subject_id === subject.subject_id);
        const ChapterForSubject = Chapter.filter(Chapter => Chapter.subject_id === subject.subject_id);
        subject.dataValues.CLO = closForSubject;
        subject.dataValues.CHAPTER = ChapterForSubject;
      }

      //activeSubjects.dataValues.CLO = Clos;
      //activeSubjects.dataValues.CHAPTER = Chapter;

      res.status(200).json(activeSubjects);
    } catch (error) {
      console.error('Error fetching active subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      const updatedIsDeleted = !subject.isDelete;
      await SubjectModel.update({ isDelete: updatedIsDeleted }, { where: { subject_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'subject not found' });
      }
      const updatedIsDeleted = !subject.isDelete;
      await SubjectModel.update({ isDelete: updatedIsDeleted }, { where: { subject_id: id } });

      res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });


    } catch (error) {
      console.error('Error toggling SubjectModel delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { subject_id } = data;
      if (!Array.isArray(subject_id) || subject_id.length === 0) {
        return res.status(400).json({ message: 'No SubjectModel ids provided' });
      }

      const subjects = await SubjectModel.findAll({ where: { subject_id: subject_id } });
      if (subjects.length !== subject_id.length) {
        return res.status(404).json({ message: 'One or more SubjectModels not found' });
      }

      const updatedsubjects = await Promise.all(subjects.map(async (subject) => {
        const updatedIsDeleted = !subject.isDelete;
        await subject.update({ isDelete: updatedIsDeleted });
        return { subject_id: subject.subject_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'SubjectModel delete statuses toggled', updatedsubjects });
    } catch (error) {
      console.error('Error toggling SubjectModel delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('SUBJECT');

    worksheet.columns = [
      { header: 'Tên Subject', key: 'subjectName', width: 30 },
      { header: 'subjectCode format:000000', key: 'subjectCode', width: 30 },
      { header: 'Mô tả', key: 'description', width: 30 },
      { header: 'Số tín chỉ', key: 'numberCredits', width: 10 },
      { header: 'STC LT', key: 'numberCreditsTheory', width: 10 },
      { header: 'STC TH', key: 'numberCreditsPractice', width: 10 },
      { header: 'Loại học phần (Đại cương, Cơ sở ngành, Chuyên ngành, Thực tập và Đồ án)', key: 'typesubject', width: 40 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="SubjectForm.xlsx"');
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
      const subjects = await SubjectModel.findAll({ where: { subject_id: id } });

      if (!subjects || subjects.length === 0) {
        return res.status(404).json({ message: 'SubjectModels not found' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SUBJECT');

      worksheet.columns = [
        { header: 'mã subject', key: 'subject_id', width: 10 },
        { header: 'Tên Subject', key: 'subjectName', width: 30 },
        { header: 'subjectCode format:000000', key: 'subjectCode', width: 30 },
        { header: 'Mô tả', key: 'description', width: 30 },
        { header: 'Số tín chỉ', key: 'numberCredits', width: 10 },
        { header: 'STC LT', key: 'numberCreditsTheory', width: 10 },
        { header: 'STC TH', key: 'numberCreditsPractice', width: 10 },
        { header: 'Loại học phần (Đại cương, Cơ sở ngành, Chuyên ngành, Thực tập và Đồ án)', key: 'typesubject', width: 40 }
      ];

      // Add rows to the worksheet
      pos.forEach(element => {
        worksheet.addRow({
          subject_id: element.subject_id,
          subjectName: element.subjectName,
          subjectCode: element.subjectCode,
          description: element.description,
          numberCredits: element.numberCredits,
          numberCreditsTheory: element.numberCreditsTheory,
          numberCreditsPractice: element.numberCreditsPractice,
          typesubject: element.typesubject
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
      res.setHeader('Content-Disposition', 'attachment; filename="SubjectForm.xlsx"');

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error generating SubjectModel update form:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  processSaveTemplateSubject: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }

    const teacher_id = req.user.teacher_id;

    const teacher = await TeacherModel.findOne({ where: { teacher_id: teacher_id } });
    if (!teacher) {
      return res.status(404).json({ message: 'TeacherModels not found' });
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

    const worksheet = workbook.getWorksheet('SUBJECT');
    const jsonData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const numberCredits = row.getCell(4).value;
        const numberCreditsTheory = row.getCell(5).value;
        const numberCreditsPractice = row.getCell(6).value;
        const typesubject = row.getCell(7).value;

        if (
          isNaN(numberCredits) ||
          isNaN(numberCreditsTheory) ||
          isNaN(numberCreditsPractice)
        ) {
          return res.status(400).json({ message: `Invalid number values at row ${rowNumber}` });
        }

        // Validate typesubject
        if (!validTypes.includes(typesubject)) {
          return res.status(400).json({ message: `Invalid type subject at row ${rowNumber}` });
        }

        jsonData.push({
          subjectName: row.getCell(1).value,
          subjectCode: row.getCell(2).value,
          description: row.getCell(3).value,
          teacher_id: teacher.teacher_id,
          numberCredits,
          numberCreditsTheory,
          numberCreditsPractice,
          typesubject,
        });
      }
    });

    fs.unlinkSync(filePath);
    try {
      const createdSubject = await SubjectModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdSubject });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  processUpdateTemplateSubject: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const subject_id = req.body.data;
    const teacher_id = req.body.teacher;

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

    const worksheet = workbook.getWorksheet('SUBJECT');
    const updateData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const numberCredits = row.getCell(4).value;
        const numberCreditsTheory = row.getCell(5).value;
        const numberCreditsPractice = row.getCell(6).value;
        const typesubject = row.getCell(7).value;

        if (
          isNaN(numberCredits) ||
          isNaN(numberCreditsTheory) ||
          isNaN(numberCreditsPractice)
        ) {
          return res.status(400).json({ message: `Invalid number values at row ${rowNumber}` });
        }

        // Validate typesubject
        if (!validTypes.includes(typesubject)) {
          return res.status(400).json({ message: `Invalid type subject at row ${rowNumber}` });
        }
        updateData.push({
          subject_id: row.getCell(1).value,
          subjectName: row.getCell(2).value,
          description: row.getCell(3).value,
          numberCredits,
          numberCreditsTheory,
          numberCreditsPractice,
          typesubject,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      await Promise.all(updateData.map(async (data) => {
        const updatedRows = await SubjectModel.update(
          {
            cloName: data.cloName,
            description: data.description
          },
          { where: { subject_id: data.subject_id } }
        );

        if (updatedRows[0] === 0) {
          console.warn(`No SubjectModel found with ID ${data.subject_id} for update`);
        }
      }));

      return res.status(200).json({ message: 'SubjectModels updated successfully' });
    } catch (error) {
      console.error('Error updating SubjectModels:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  

};

module.exports = SubjectController;
