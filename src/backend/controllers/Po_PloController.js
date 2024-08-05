const PoPloModel = require('../models/PoPloModel'); 

const Po_PloController = {

  // Get all PoPlo
  getAll: async (req, res) => {
    try {
      const PoPlo = await PoPloModel.findAll();
      res.json(PoPlo);
    } catch (error) {
      console.error('Error getting all PoPlo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  SavePoPlo: async (req, res) => {
    try {
      const { dataSave } = req.body;
  
      if (dataSave && dataSave.length > 0) {
        await PoPloModel.bulkCreate(dataSave);
        res.status(200).json({ message: 'Data saved successfully', status: 'success' });
      } else {
        res.status(400).json({ message: 'No data provided for saving', status: 'failure' });
      }
    } catch (error) {
      console.error('Error in SavePoPlo:', error);
      res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
  },
  
  DeletePoPlo: async (req, res) => {
    try {
      const { dataDelete } = req.body;
  
      if (dataDelete && dataDelete.length > 0) {
        await PoPloModel.destroy({
          where: { id_po_plo: dataDelete.map(item => item.id_po_plo) }
        });
        res.status(200).json({ message: 'Data deleted successfully', status: 'success' });
      } else {
        res.status(400).json({ message: 'No data provided for deletion', status: 'failure' });
      }
    } catch (error) {
      console.error('Error in DeletePoPlo:', error);
      res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
  },
  
};

module.exports = Po_PloController;
