const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const passport = require('passport');

const path = require('path');
const StudentController = require('../controllers/StudentController');
const ProgramsController = require('../controllers/ProgramsController');
const PoController = require('../controllers/PoController');
const PloController = require('../controllers/PloController');
const CloController = require('../controllers/CloController');
const ChapterController = require('../controllers/ChapterController');
const SubjectController = require('../controllers/SubjectController');
const AssessmentsController = require('../controllers/AssessmentsController');
const CourseEnrollmentController = require('../controllers/CourseEnrollmentController');
const TeacherController = require('../controllers/TeacherController');
const MetaAssessmentController = require('../controllers/MetaAssessmentController');
 
const uploadDirectory = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/program', upload.any(), ProgramsController.processSaveTemplate);
router.post('/po', upload.any(), PoController.processSaveTemplatePo);
router.post('/plo', upload.any(), PloController.processSaveTemplatePlo);
router.post('/student', upload.any(), StudentController.saveStudentExcel);
router.post('/teacher', upload.any(), TeacherController.saveTeacherExcel);
router.post('/clo', upload.any(), CloController.processSaveTemplateClo);
router.post('/chapter', upload.any(), ChapterController.processSaveTemplateChapter);
router.post('/subject', ensureAuthenticated, upload.any(), SubjectController.processSaveTemplateSubject);
router.post('/meta-assessment', upload.any(), MetaAssessmentController.processSaveTemplateMetaAssessment);
router.post('/course-enrollment', upload.any(), CourseEnrollmentController.saveExcel);

router.put('/meta-assessment/updateDescription', upload.any(), MetaAssessmentController.updateDescriptionFromExcel);
router.put('/student/update', upload.any(), StudentController.updateStudentsFromExcel);
router.put('/po/update', upload.any(), PoController.processUpdateTemplatePo);
router.put('/plo/update', upload.any(), PloController.processUpdateTemplatePlo);
router.put('/clo/update', upload.any(), CloController.processUpdateTemplateClo);
router.put('/chapter/update', upload.any(), ChapterController.processUpdateTemplateChapter);
router.put('/subject/update', upload.any(), SubjectController.processUpdateTemplateSubject);

module.exports = router;
