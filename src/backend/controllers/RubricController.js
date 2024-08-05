const { Sequelize, DataTypes } = require('sequelize');

const RubricModel = require('../models/RubricModel');
const RubricItemModel = require('../models/RubricItemModel');
const SubjectModel = require('../models/SubjectModel');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');
const PloModel = require('../models/PloModel');
const MapCloChapterModel = require('../models/CloChapterModel');
const PloCloModel = require('../models/PloCloModel');

const RubricController = {
  // Get all rubrics
  index: async (req, res) => {
    try {
      const rubrics = await RubricModel.findAll();
      res.json(rubrics);
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new rubric
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newrubric = await RubricModel.create(data);
      res.status(201).json(newrubric);
    } catch (error) {
      console.error('Error creating rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get rubric by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      res.status(200).json(rubric);
    } catch (error) {
      console.error('Error finding rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },


  // Update rubric
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      const updatedrubric = await RubricModel.update(data, { where: { rubric_id: id } });
      res.json({ message: `Successfully updated rubric with ID: ${id}` });
    } catch (error) {
      console.error('Error updating rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Delete rubric
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }

      const  rubricItems =  await RubricItemModel.findAll({ where: { rubric_id: rubric.rubric_id } });
      for (const RubricItem of rubricItems) {
        await RubricItemModel.destroy({ where: { rubricsItem_id: RubricItem.rubricsItem_id } });
      }
      await RubricModel.destroy({ where: { rubric_id: rubric.rubric_id } });
      res.status(200).json({ message: 'Successfully deleted rubric' });
    } catch (error) {
      console.error('Error deleting rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },



  deleteMultiple: async (req, res) => {
    const { rubric_id } = req.query;
    try {
      const rubricIds = rubric_id.map(id => parseInt(id));
      for (const id of rubricIds) {        
        const RubricItems = await RubricItemModel.findAll({ where: { rubric_id: id } });
        for (const RubricItem of RubricItems) {
          await RubricItemModel.destroy({ where: { rubricsItem_id: RubricItem.rubricsItem_id } });
        }
      }

      await RubricModel.destroy({ where: { rubric_id: rubric_id } });
      res.status(200).json({ message: 'Xóa nhiều rubric thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều rubric:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },
  // Get rubrics with isDelete = true
  isDeleteTotrue: async (req, res) => {
    try {
      const rubrics = await RubricModel.findAll({ where: { isDelete: true } });
      if (!rubrics) {
        return res.status(404).json({ message: 'No rubrics found' });
      }
      res.json(rubrics);
    } catch (error) {
      console.error('Error finding rubrics with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get rubrics with isDelete = false
  isDeleteTofalse: async (req, res) => {
    try {
      const rubrics = await RubricModel.findAll({ where: { isDelete: false } });
      if (!rubrics) {
        return res.status(404).json({ message: 'No rubrics found' });
      }
      res.json(rubrics);
    } catch (error) {
      console.error('Error finding rubrics with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a rubric
  isdelete: async (req, res) => {
    try {
      const { rubric_id } = req.params;
      console.log('isDelete', rubric_id);
      const rubric = await RubricModel.findOne({ where: { rubric_id: rubric_id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      const updatedIsDeleted = !rubric.isDelete;
      await RubricModel.update({ isDelete: updatedIsDeleted }, { where: { rubric_id: rubric_id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // const RubricModel = require('../models/RubricModel');
  // const RubricItemModel = require('../models/RubricItemModel');
  GetByUserAndCheckScore: async (req, res) => {
    try {
      const { teacher_id } = req.params;
      const rubrics = await RubricModel.findAll({ where: {teacher_id: teacher_id, isDelete: false } });
      const rubricIds = rubrics.map(rubric => rubric.rubric_id);
      //console.log(rubricIds);
      const results = await RubricItemModel.findAll({
        attributes: ['rubric_id', [Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_score']],
        where: { rubric_id: rubricIds, isDelete: false },
        group: ['rubric_id']
      });

      // console.log(results);

      const rubricScores = results.map(result => ({
        rubric_id: result.rubric_id,
        total_score: result.dataValues.total_score
      }));

      for (const rubric of rubrics) {
        const rubricsItemsForRubricItem = rubricScores.filter(rubricsItem => rubricsItem.rubric_id === rubric.rubric_id);
        rubric.dataValues.RubricItem = rubricsItemsForRubricItem;
      }

      res.json({ rubric: rubrics });
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  GetisDeleteTotrueByUserAndCheckScore: async (req, res) => {
    try {
      const { teacher_id } = req.params;

      const rubrics = await RubricModel.findAll({ where: { teacher_id: teacher_id, isDelete: true } });
      const rubricIds = rubrics.map(rubric => rubric.rubric_id);
      //console.log(rubricIds);
      const results = await RubricItemModel.findAll({
        attributes: ['rubric_id', [Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_score']],
        where: { rubric_id: rubricIds, isDelete: true },
        group: ['rubric_id']
      });

      // console.log(results);

      const rubricScores = results.map(result => ({
        rubric_id: result.rubric_id,
        total_score: result.dataValues.total_score
      }));

      for (const rubric of rubrics) {
        const rubricsItemsForRubricItem = rubricScores.filter(rubricsItem => rubricsItem.rubric_id === rubric.rubric_id);
        rubric.dataValues.RubricItem = rubricsItemsForRubricItem;
      }

      res.json({ rubric: rubrics });
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getRubricsForCheckScore: async (req, res) => {
    try {
      const { teacher_id, isDelete } = req.query;

      const whereCondition = { teacher_id: teacher_id };

      if (isDelete !== undefined) {
        whereCondition.isDelete = isDelete === 'true';
      } else {
        whereCondition.isDelete = false;
      }

      const rubrics = await RubricModel.findAll({ where: whereCondition });
      const rubricIds = rubrics.map(rubric => rubric.rubric_id);

      const results = await RubricItemModel.findAll({
        attributes: ['rubric_id', [Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_score']],
        where: { rubric_id: rubricIds, isDelete: whereCondition.isDelete },
        group: ['rubric_id']
      });

      const rubricScores = results.map(result => ({
        rubric_id: result.rubric_id,
        total_score: result.dataValues.total_score
      }));

      for (const rubric of rubrics) {
        const rubricsItemsForRubricItem = rubricScores.filter(rubricsItem => rubricsItem.rubric_id === rubric.rubric_id);
        rubric.dataValues.RubricItem = rubricsItemsForRubricItem;
      }

      res.json({ rubric: rubrics });
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },





  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      const updatedIsDeleted = !rubric.isDelete;
      await RubricModel.update({ isDelete: updatedIsDeleted }, { where: { rubric_id: id } });

      res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });


    } catch (error) {
      console.error('Error toggling PlO delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { rubric_id } = data;
      if (!Array.isArray(rubric_id) || rubric_id.length === 0) {
        return res.status(400).json({ message: 'No PlO ids provided' });
      }

      const rubrics = await RubricModel.findAll({ where: { rubric_id: rubric_id } });
      if (rubrics.length !== rubric_id.length) {
        return res.status(404).json({ message: 'One or more RubricModels not found' });
      }

      const updated = await Promise.all(rubrics.map(async (rubric) => {
        const updatedIsDeleted = !rubric.isDelete;
        await rubric.update({ isDelete: updatedIsDeleted });
        return { rubric_id: rubric.rubric_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'RubricModel delete statuses toggled', updated });
    } catch (error) {
      console.error('Error toggling RubricModel delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  GetItemsRubricsByIdRubrics: async (req, res) => {
    try {
      const { rubric_id } = req.params;
      const rubric = await RubricModel.findOne({
        where: { rubric_id: rubric_id },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id', 'subjectName']
        }]
      });
      if (rubric) {

        const [rubricItems, Clos, Chapters, PloClo] = await Promise.all([
          RubricItemModel.findAll({
            where: {
              rubric_id: rubric.rubric_id, isDelete: false
            },
            include: [{
              model: CloModel,
              attributes: ['clo_id', 'cloName', 'description']
            }, {
              model: ChapterModel,
              attributes: ['chapter_id', 'chapterName', 'description']
            }, {
              model: PloModel,
              attributes: ['plo_id', 'ploName', 'description']
            }]
          }),

          // PloCloModel.findAll({ where: { clo_id: rubric.clo_id } }),
          CloModel.findAll({ where: { subject_id: rubric.subject_id } }),
          // ChapterModel.findAll({ where: { subject_id: rubric.subject_id } })
        ]);

        rubric.dataValues.rubricItems = rubricItems;
        rubric.dataValues.CloData = Clos;
        //rubric.dataValues.PloCloData = PloClo;
        //rubric.dataValues.ChapterData = Chapters;
        res.json({ rubric: rubric });
      } else {
        console.log('Rubric not found');
      }
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  GetItemsRubricsByIdRubricsisDeleteTrue: async (req, res) => {
    try {
      const { rubric_id } = req.params;
      const rubric = await RubricModel.findOne({
        where: { rubric_id: rubric_id },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id', 'subjectName']
        }]
      });
      if (rubric) {

        const [rubricItems, Clos, Chapters, PloClo] = await Promise.all([
          RubricItemModel.findAll({
            where: {
              rubric_id: rubric.rubric_id, isDelete: true
            },
            include: [{
              model: CloModel,
              attributes: ['clo_id', 'cloName', 'description']
            }, {
              model: ChapterModel,
              attributes: ['chapter_id', 'chapterName', 'description']
            }, {
              model: PloModel,
              attributes: ['plo_id', 'ploName', 'description']
            }]
          }),


          // PloCloModel.findAll({ where: { clo_id: rubric.clo_id } }),
          CloModel.findAll({ where: { subject_id: rubric.subject_id } }),
          // ChapterModel.findAll({ where: { subject_id: rubric.subject_id } })
        ]);
        // Gán kết quả cho các thuộc tính của rubric
        // const rubricIds = rubricItems.map(rubric => rubric.rubricsItem_id);

        // const qualityLevels = await qualityLevelsModel.findAll({ where: { rubricsItem_id: rubricIds } });
        // // Lặp qua mỗi rubricItem
        // for (const rubricItem of rubricItems) {
        //   const qualityLevelsForRubricItem = qualityLevels.filter(qualityLevel => qualityLevel.rubricsItem_id === rubricItem.rubricsItem_id);
        //   rubricItem.dataValues.qualityLevel = qualityLevelsForRubricItem;
        // }
        rubric.dataValues.rubricItems = rubricItems;
        rubric.dataValues.CloData = Clos;
        //rubric.dataValues.PloCloData = PloClo;
        //rubric.dataValues.ChapterData = Chapters;

        res.json({ rubric: rubric });
      } else {
        console.log('Rubric not found');
      }
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getItemsByRubricId: async (req, res) => {
    try {
      const { id } = req.params;
      const { isDelete, include_clos } = req.query;

      const rubric = await RubricModel.findOne({
        where: { rubric_id: id },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id','subjectCode', 'subjectName']
        }]
      });

      if (!rubric) {
        return res.status(404).json({ message: 'Rubric not found' });
      }
      const rubricItems = await RubricItemModel.findAll({
        where: {
          rubric_id: rubric.rubric_id,
          isDelete: isDelete === 'true'
        },
        include: [{
          model: CloModel,
          attributes: ['clo_id', 'cloName', 'description']
        }, {
          model: ChapterModel,
          attributes: ['chapter_id', 'chapterName', 'description']
        }, {
          model: PloModel,
          attributes: ['plo_id', 'ploName', 'description']
        }]
      });
      for (let item of rubricItems) {
        // Tìm các chapter liên quan đến CLO của rubricItem
        const cloChapters = await MapCloChapterModel.findAll({ where: { clo_id: item.clo_id } });
        const chapterIds = cloChapters.map(chapter => chapter.chapter_id);
        const chapters = await ChapterModel.findAll({ where: { chapter_id: chapterIds } });
        item.dataValues.chapters = chapters;
      
        // Tìm các PLO liên quan đến CLO của rubricItem
        const poPlo = await PloCloModel.findAll({ where: { clo_id: item.clo_id } });
        const ploIds = poPlo.map(plo => plo.plo_id);
        const plos = await PloModel.findAll({ where: { plo_id: ploIds } });
        item.dataValues.plos = plos;
      }
      if (include_clos === 'true') {
        const Clos = await CloModel.findAll({ where: { subject_id: rubric.subject_id, isDelete: isDelete === 'true'} });
        rubric.dataValues.CloData = Clos;
        
        // const cloChapters = await CloChapterModel.findAll({ where: { clo_id: rubric.clo_id } });

        // if (!cloChapters.length) {
        //   return res.status(404).json({ message: 'No chapters found for the given CLO ID' });
        // }

        // const chapterIds = cloChapters.map(item => item.chapter_id);
        // const chapters = await ChapterModel.findAll({ where: { chapter_id: chapterIds } });
        // return res.status(200).json(chapters);
      }

      const Clos = await CloModel.findAll({ where: { subject_id: rubric.subject_id } });
      rubric.dataValues.rubricItems = rubricItems;
      rubric.dataValues.CloData = Clos;

      return res.json({ rubric: rubric });
    } catch (error) {
      console.error('Error getting rubric items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = RubricController;
