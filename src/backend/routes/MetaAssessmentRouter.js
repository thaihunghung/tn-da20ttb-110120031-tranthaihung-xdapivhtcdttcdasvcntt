const express = require('express');
const MetaAssessmentController = require('../controllers/MetaAssessmentController');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');


router.get('/meta-assessments', ensureAuthenticated, MetaAssessmentController.index);
router.post('/meta-assessment', ensureAuthenticated, MetaAssessmentController.create);
router.post('/meta-assessment/listStudent', ensureAuthenticated, MetaAssessmentController.createlistStudent);
router.get('/meta-assessment/:id', ensureAuthenticated, MetaAssessmentController.show);
router.patch('/meta-assessment/:id', ensureAuthenticated, MetaAssessmentController.updateDescription);
router.put('/meta-assessment/:id', ensureAuthenticated, MetaAssessmentController.update);
router.delete('/meta-assessment/:id', ensureAuthenticated, MetaAssessmentController.delete);
router.delete('/meta-assessments/multiple', ensureAuthenticated, MetaAssessmentController.deleteMultiple);
router.patch('/meta-assessments/softDeleteByGeneralDescription', ensureAuthenticated, MetaAssessmentController.toggleSoftDeleteByGeneralDescription);
router.patch('/meta-assessments/updateByGeneralDescription', ensureAuthenticated, MetaAssessmentController.updateByGeneralDescription);
router.delete('/meta-assessments/deleteByGeneralDescription', ensureAuthenticated, MetaAssessmentController.deleteByGeneralDescription);
router.post('/meta-assessment/templates/data', ensureAuthenticated, MetaAssessmentController.getFormUpdateDescriptionExcel);

// Các route khác có thể thêm vào ở đây nếu cần
// Ví dụ, các route để thay đổi trạng thái isDelete, nếu cần
// router.get('/meta-assessments/isDelete/true', MetaAssessmentController.isDeleteToTrue);
// router.get('/meta-assessments/isDelete/false', MetaAssessmentController.isDeleteToFalse);
// router.put('/meta-assessments/isDelete/:id', MetaAssessmentController.IsDelete);

module.exports = router;
