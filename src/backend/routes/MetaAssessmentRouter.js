const express = require('express');
const MetaAssessmentController = require('../controllers/MetaAssessmentController');
const router = express.Router();


router.get('/meta-assessments', MetaAssessmentController.index);





router.post('/meta-assessment', MetaAssessmentController.create);
router.post('/meta-assessment/listStudent', MetaAssessmentController.createlistStudent);








router.get('/meta-assessment/:id', MetaAssessmentController.show);

router.patch('/meta-assessment/:id', MetaAssessmentController.updateDescription);
router.put('/meta-assessment/:id', MetaAssessmentController.update);
router.delete('/meta-assessment/:id', MetaAssessmentController.delete);
router.delete('/meta-assessments/multiple', MetaAssessmentController.deleteMultiple);





router.patch('/meta-assessments/softDeleteByGeneralDescription', MetaAssessmentController.toggleSoftDeleteByGeneralDescription);
router.patch('/meta-assessments/updateByGeneralDescription', MetaAssessmentController.updateByGeneralDescription);
router.delete('/meta-assessments/deleteByGeneralDescription', MetaAssessmentController.deleteByGeneralDescription);





router.post('/meta-assessment/templates/data', MetaAssessmentController.getFormUpdateDescriptionExcel);

// Các route khác có thể thêm vào ở đây nếu cần
// Ví dụ, các route để thay đổi trạng thái isDelete, nếu cần
// router.get('/meta-assessments/isDelete/true', MetaAssessmentController.isDeleteToTrue);
// router.get('/meta-assessments/isDelete/false', MetaAssessmentController.isDeleteToFalse);
// router.put('/meta-assessments/isDelete/:id', MetaAssessmentController.IsDelete);

module.exports = router;
