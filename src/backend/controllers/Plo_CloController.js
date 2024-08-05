const PloCloModel = require('../models/PloCloModel');
const PloModel = require('../models/PloModel');

const Plo_CloController = {

  // Get all PloClo
  index: async (req, res) => {
    try {
      const { id_clos, clo_id } = req.query;

      if (id_clos) {
        // Handle request for multiple CLO IDs
        
        const ids = JSON.parse(id_clos);
        const ploClos = await PloCloModel.findAll({
          where: {
            clo_id: ids
          }
        });

        if (ploClos.length === 0) {
          return res.status(404).json({ message: 'No PLO-CLOs found for the given CLO IDs' });
        }

        return res.status(200).json(ploClos);
      } else if (clo_id) {
        // Handle request for a single CLO ID
        const poPlo = await PloCloModel.findAll({
          where: { clo_id: clo_id },
        });

        const ploIds = poPlo.map(item => item.plo_id);

        if (ploIds.length === 0) {
          return res.status(404).json({ message: 'No PLOs found for the given CLO ID' });
        }

        const plos = await PloModel.findAll({
          where: { plo_id: ploIds },
        });

        return res.status(200).json(plos);
      } else {
        // Handle request for all PLO-CLOs
        const poPlo = await PloCloModel.findAll();
        return res.status(200).json(poPlo);
      }
    } catch (error) {
      console.error('Error handling PLO-CLO requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  SaveCloPlo: async (req, res) => {
    try {
      const { dataSave } = req.body;

      if (dataSave && dataSave.length > 0) {
        await PloCloModel.bulkCreate(dataSave);
        res.status(200).json({ message: 'Data saved successfully', status: 'success' });
      } else {
        res.status(400).json({ message: 'No data provided for saving', status: 'failure' });
      }
    } catch (error) {
      console.error('Error in SavePoPlo:', error);
      res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
  },



  DeleteCloPlo: async (req, res) => {
    try {
      const { dataDelete } = req.body;

      if (dataDelete && dataDelete.length > 0) {
        await PloCloModel.destroy({
          where: { id_plo_clo: dataDelete.map(item => item.id_plo_clo) }
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


  GetPloCloByCloId: async (req, res) => {
    try {
      const { clo_id } = req.params
      const PoPlo = await PloCloModel.findAll({
        where: { clo_id: clo_id },
      });
      const plo_ids = PoPlo.map((item) => item.plo_id)
      const Plo = await PloModel.findAll({
        where: { plo_id: plo_ids },
      });
      res.json(Plo);
    } catch (error) {
      console.error('Error getting all PloClo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  GetPloCloByCloIds: async (req, res) => {
    try {
      const { data } = req.body;
      const { id_clos } = data;
      const cloIds = id_clos.map(item => item.clo_id);
      // console.log("dd");

      // console.log(cloIds);

      const ploClos = await PloCloModel.findAll({
        where: {
          clo_id: cloIds
        }
      });

      if (ploClos.length === 0) {
        return res.status(404).json({ message: 'No PLO-CLOs found for the given CLO IDs' });
      }

      res.status(200).json(ploClos);
    } catch (error) {
      console.error('Error fetching PLO-CLOs by CLO IDs:', error);
      res.status(500).json({ message: 'An error occurred while fetching PLO-CLOs' });
    }
  },
};

module.exports = Plo_CloController;
