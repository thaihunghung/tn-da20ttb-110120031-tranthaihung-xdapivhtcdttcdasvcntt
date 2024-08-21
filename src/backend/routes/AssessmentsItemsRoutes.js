const express = require('express');
const router = express.Router();
const assessmentItemsController = require('../controllers/AssessmentItemsController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   - name: assessment-item
 *     description: Operations related to assessment-item management
 */


router.post('/assessment-item', ensureAuthenticated, assessmentItemsController.create);
router.put('/assessment-item/:id', ensureAuthenticated, assessmentItemsController.update);




module.exports = router;