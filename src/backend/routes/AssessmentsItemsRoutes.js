const express = require('express');
const router = express.Router();
const assessmentItemsController = require('../controllers/AssessmentItemsController');

/**
 * @openapi
 * tags:
 *   - name: assessment-item
 *     description: Operations related to assessment-item management
 */


router.post('/assessment-item', assessmentItemsController.create);
router.put('/assessment-item/:id', assessmentItemsController.update);




module.exports = router;