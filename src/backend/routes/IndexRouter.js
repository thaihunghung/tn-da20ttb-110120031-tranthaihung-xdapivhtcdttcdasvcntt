const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('../utils/swagger');
const programRoutes = require('./ProRoutes');
const ploRoutes = require('./PloRouter');
const cloRoutes = require('./CloRouter');
const subjectRoute = require('./SubjectRouter');
const courseRoute = require('./CourseRouter');
const classRoute = require('./ClassRouter')
const academicYearRoute = require('./AcademicYearRouter')
const studentRoute = require('./StudentRouter')
const semesterRoute = require('./SemesterRouter')
const teacherRoute = require('./TeacherRouter')
const chapterRoutes = require('./ChapterRouter');
const poRoutes = require('./PoRouter');
const poPloRoutes = require('./Po_PloRouter');
const ploCloRoutes = require('./Plo_CloRouter');
const rubricRoutes = require('./RubricRouter');
const rubricItemRoutes = require('./RubricItemRouter');
const cloChapterRoutes = require('./Clo_ChapterRouter');
const assessmentsRoutes = require('./AssessmentsRoutes');
const assessmentsItemsRoutes = require('./AssessmentsItemsRoutes');
const metaAssessmentsRoutes= require('./MetaAssessmentRouter');
const ChartRoute = require('./ChartRoute');

const CourseEnrollmentRoutes = require('./CourseEnrollmentRouter')
const AuthRoutes = require('./AuthRoutes')

const authRoutes = require('./AuthRoutes')

const pdfRouters = require('./PdfRouter');

const importExcelRouters = require('./importExcelRouter');

//doc
router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// router.use('/login', authRoutes)

router.use('/api/admin', programRoutes);  
router.use('/api/admin', ploRoutes);
router.use('/api/admin', cloRoutes);
router.use('/api/admin', subjectRoute);
router.use('/api/admin', courseRoute);
router.use('/api/admin', classRoute);
router.use('/api/admin', academicYearRoute);
router.use('/api/admin', studentRoute);
router.use('/api/admin', teacherRoute);
router.use('/api/admin', semesterRoute);
router.use('/api/admin', chapterRoutes);
router.use('/api/admin', poRoutes);
router.use('/api/admin', cloChapterRoutes);
router.use('/api/admin', rubricRoutes);
router.use('/api/admin', rubricItemRoutes);
router.use('/api/admin', assessmentsRoutes);
router.use('/api/admin', metaAssessmentsRoutes);

router.use('/api/admin', assessmentsItemsRoutes);
router.use('/api/admin', ChartRoute);



router.use('/api/admin', CourseEnrollmentRoutes);

router.use('/api/admin', poPloRoutes);
router.use('/api/admin', ploCloRoutes);
router.use('/api/admin', pdfRouters);
router.use('/api/admin/importExcel', importExcelRouters);
router.use('/api', AuthRoutes);





module.exports = router;
