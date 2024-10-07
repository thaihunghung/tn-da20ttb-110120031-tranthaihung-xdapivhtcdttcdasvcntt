const RubricItemModel = require('../models/RubricItemModel');
const { Sequelize, DataTypes } = require('sequelize');
const RubricModel = require('../models/RubricModel');

const RubricItemController = {

  index: async (req, res) => {
    try {
      const RubricsItem = await RubricItemModel.findAll();
      res.status(200).json(RubricsItem);
    } catch (error) {
      console.error('Error getting all RubricsItem:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newrubric = await RubricItemModel.create(data);
      res.status(201).json(newrubric);
    } catch (error) {
      console.error('Error creating rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  checkScore: async (req, res) => {
    try {
        const { data } = req.body;
        const { rubric_id } = data.data;

        // Fetch rubric items with the given rubric_id
        const RubricsItem = await RubricItemModel.findAll({
            where: { rubric_id: rubric_id, isDelete: false }
        });

        // Calculate the total maximum score
        const length = RubricsItem.length;
        if (length > 0) {
            const results = await RubricItemModel.findAll({
                attributes: [
                    'rubric_id', 
                    [Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_maxScore']
                ],
                where: { rubric_id: rubric_id, isDelete: false }
            });

            const total_maxScore = parseFloat(results[0].dataValues.total_maxScore || 0);
            const maxScore = parseFloat(data.maxScore || 0);
            const totalScore = total_maxScore + maxScore;

            if (totalScore <= 10) {
                const newRubric = await RubricItemModel.create(data.data);
                res.status(201).json({ message: "Rubric item created successfully", data: newRubric });
            } else {
                res.status(400).json({ message: "Failed to save: Total maxScore exceeds 10" });
            }
        } else {
            // Create new rubric item if no existing rubric items
            const newRubric = await RubricItemModel.create(data.data);
            res.status(201).json({ message: "Rubric item created successfully", data: newRubric });
        }
    } catch (error) {
        console.error('Error creating rubric item:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
},


  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const rubrics_item = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
      if (!rubrics_item) {
        return res.status(404).json({ message: 'rubrics_item not found' });
      }

      res.status(200).json(rubrics_item);
    } catch (error) {
      console.error('Error finding rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        console.log(data);
        
        // Lấy rubrics_item dựa trên rubricsitem_id
        const rubrics_item = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
        if (!rubrics_item) {
            return res.status(404).json({ message: 'Không tìm thấy rubrics_item' });
        }

        // Lấy rubric_id từ rubrics_item
        const rubric_id = rubrics_item.rubric_id;

        // Fetch rubric items với rubric_id hiện tại
        const RubricsItem = await RubricItemModel.findAll({
            where: { rubric_id: rubric_id, isDelete: false }
        });

        // Tính tổng điểm tối đa
        const length = RubricsItem.length;
        if (length > 0) {
            const results = await RubricItemModel.findAll({
                attributes: [
                    'rubric_id', 
                    [Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_maxScore']
                ],
                where: { rubric_id: rubric_id, isDelete: false }
            });

            const total_maxScore = parseFloat(results[0].dataValues.total_maxScore || 0);
            const maxScore = parseFloat(data.maxScore || 0);
            const totalScore = total_maxScore - (rubrics_item.maxScore || 0) + maxScore; // Cập nhật tổng điểm

            // Kiểm tra nếu tổng điểm không vượt quá 10
            if (totalScore <= 10) {
                await RubricItemModel.update(data, { where: { rubricsitem_id: id } });
                res.status(200).json({ message: `Cập nhật rubrics_item với ID: ${id} thành công` });
            } else {
                res.status(400).json({ message: "Cập nhật thất bại: Tổng maxScore vượt quá 10" });
            }
        } else {
            // Nếu không có mục rubrics hiện tại, chỉ cần cập nhật
            await RubricItemModel.update(data, { where: { rubricsitem_id: id } });
            res.status(200).json({ message: `Cập nhật rubrics_item với ID: ${id} thành công` });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật rubrics_item:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
},


  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await RubricItemModel.destroy({ where: { rubricsitem_id: id } });
      res.status(200).json({ message: 'Successfully deleted rubrics_item' });
    } catch (error) {
      console.error('Error deleting rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteMultiple: async (req, res) => {
    const { rubricsitem_id } = req.query;
    try {
      await QualityLevelsModel.destroy({ where: { rubricsitem_id: rubricsitem_id } });
      await RubricItemModel.destroy({ where: { rubricsitem_id: rubricsitem_id } });
      res.status(200).json({ message: 'Xóa nhiều rubrics_items thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều rubrics_items:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const RubricsItem = await RubricItemModel.findAll({ where: { isDelete: true } });
      if (!RubricsItem) {
        return res.status(404).json({ message: 'No RubricsItem found' });
      }
      res.status(200).json(RubricsItem);
    } catch (error) {
      console.error('Error finding RubricsItem with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const RubricsItem = await RubricItemModel.findAll({ where: { isDelete: false } });
      if (!RubricsItem) {
        return res.status(404).json({ message: 'No RubricsItem found' });
      }
      res.status(200).json(RubricsItem);
    } catch (error) {
      console.error('Error finding RubricsItem with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('isDelete', id);
      const rubrics_item = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
      if (!rubrics_item) {
        return res.status(404).json({ message: 'rubrics_item not found' });
      }
      const updatedIsDeleted = !rubrics_item.isDelete;
      await RubricItemModel.update({ isDelete: updatedIsDeleted }, { where: { rubricsitem_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const RubricItem = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
      if (!RubricItem) {
        return res.status(404).json({ message: 'RubricItem not found' });
      }

      if (RubricItem.isDelete) {
        const results = await RubricItemModel.findAll({
          attributes: ['rubric_id', [Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_maxScore']],
          where: { rubric_id: RubricItem.rubric_id, isDelete: false }
        });

        const rubricScores = results.map(result => ({
          total_maxScore: result.dataValues.total_maxScore
        }));

        const totalScore = parseFloat(rubricScores[0].total_maxScore) + parseFloat(RubricItem.maxScore);
        console.log('diem', RubricItem.rubric_id);
        if (totalScore <= 10) {
          const updatedIsDeleted = !RubricItem.isDelete;
          await RubricItemModel.update({ isDelete: updatedIsDeleted }, { where: { rubricsitem_id: id } });
          res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });
        } else {
          res.status(400).json({ success: false, message: "Failed to save: Total maxScore exceeds 10" });
        }
      } else {
        const updatedIsDeleted = !RubricItem.isDelete;
        await RubricItemModel.update({ isDelete: updatedIsDeleted }, { where: { rubricsitem_id: id } });
        res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });
      }
    } catch (error) {
      console.error('Error toggling RubricItemModel delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { rubricsitem_id } = data;
      if (!Array.isArray(rubricsitem_id) || rubricsitem_id.length === 0) {
        return res.status(400).json({ message: 'No RubricItemModel ids provided' });
      }

      const RubricItems = await RubricItemModel.findAll({ where: { rubricsitem_id: rubricsitem_id } });
      if (RubricItems.length !== rubricsitem_id.length) {
        return res.status(404).json({ message: 'One or more RubricItemModels not found' });
      }

      const rubricId = RubricItems[0].rubric_id;
      const anyItemIsDelete = RubricItems.some(item => item.isDelete);

      if (anyItemIsDelete) {
        let totalArrayScore = 0;
        for (const rubricItem of RubricItems) {
          totalArrayScore += parseFloat(rubricItem.maxScore);
        }

        const result = await RubricItemModel.findOne({
          attributes: [[Sequelize.fn('SUM', Sequelize.col('maxScore')), 'total_maxScore']],
          where: { rubric_id: rubricId, isDelete: false }
        });

        const currentTotalScore = parseFloat(result.dataValues.total_maxScore || 0);
        const newTotalScore = currentTotalScore + totalArrayScore;

        if (newTotalScore <= 10) {
          const updatedRubricItems = await Promise.all(RubricItems.map(async (RubricItem) => {
            const updatedIsDeleted = !RubricItem.isDelete;
            await RubricItem.update({ isDelete: updatedIsDeleted });
            return { rubricsitem_id: RubricItem.rubricsitem_id, isDelete: updatedIsDeleted };
          }));
          res.status(200).json({ message: 'RubricItemModel delete statuses toggled', updatedRubricItems });
        } else {
          res.status(400).json({ success: false, message: "Failed to save: Total maxScore exceeds 10" });
        }
      } else {
        const updatedRubricItems = await Promise.all(RubricItems.map(async (RubricItem) => {
          const updatedIsDeleted = !RubricItem.isDelete;
          await RubricItem.update({ isDelete: updatedIsDeleted });
          return { rubricsitem_id: RubricItem.rubricsitem_id, isDelete: updatedIsDeleted };
        }));
        res.status(200).json({ message: 'RubricItemModel delete statuses toggled', updatedRubricItems });
      }
    } catch (error) {
      console.error('Error toggling RubricItemModel delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = RubricItemController;
