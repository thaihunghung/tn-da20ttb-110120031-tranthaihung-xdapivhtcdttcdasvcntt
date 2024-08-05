const { Op, Sequelize } = require('sequelize');
const AssessmentModel = require('../models/AssessmentModel');
const AssessmentItemModel = require('../models/AssessmentItemModel');


const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const AssessmentItemsController = {
  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const AssessmentItem = await AssessmentItemModel.bulkCreate(data);
      res.status(201).json(AssessmentItem);
    } catch (error) {
      console.error('Lỗi tạo AssessmentItem:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updated = await AssessmentItemModel.update(data, { where: { assessmentItem_id: id } });
      if (updated[0] === 0) {
        return res.status(404).json({ message: 'items not found' });
      }
      res.json(updated);
    } catch (error) {
      console.error('Lỗi cập nhật items:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = AssessmentItemsController;
