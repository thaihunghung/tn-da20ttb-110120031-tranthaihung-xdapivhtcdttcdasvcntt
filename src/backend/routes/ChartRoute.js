const express = require('express');
const ChartController = require('../controllers/ChartController');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Charts
 *     description: Operations related to chart data
 */

/**
 * @openapi
 * /api/admin/achieved-rate/clo/percentage:
 *   get:
 *     summary: Get CLO achievement rate percentage
 *     description: Returns the achievement rate percentage for Course Learning Outcomes (CLO).
 *     tags: [Charts]
 *     responses:
 *       200:
 *         description: CLO achievement rate percentage.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 percentage:
 *                   type: number
 *                   description: The CLO achievement rate percentage.
 *                   example: 85.5
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/achieved-rate/plo/percentage:
 *   get:
 *     summary: Get PLO achievement rate percentage
 *     description: Returns the achievement rate percentage for Program Learning Outcomes (PLO).
 *     tags: [Charts]
 *     responses:
 *       200:
 *         description: PLO achievement rate percentage.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 percentage:
 *                   type: number
 *                   description: The PLO achievement rate percentage.
 *                   example: 78.2
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/subject/average/subject:
 *   get:
 *     summary: Get average scores per subject
 *     description: Returns the average scores per subject.
 *     tags: [Charts]
 *     responses:
 *       200:
 *         description: Average scores per subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   type: string
 *                   description: The subject name.
 *                   example: Mathematics
 *                 averageScore:
 *                   type: number
 *                   description: The average score.
 *                   example: 82.4
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/students/performance/{student_id}:
 *   get:
 *     summary: Get student performance by course
 *     description: Returns the performance of a student in various courses.
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: student_id
 *         required: true
 *         description: The ID of the student.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student performance by course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: integer
 *                   description: The course ID.
 *                   example: 1
 *                 courseName:
 *                   type: string
 *                   description: The course name.
 *                   example: Chemistry
 *                 score:
 *                   type: number
 *                   description: The student's score.
 *                   example: 89.5
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/arg-score:
 *   post:
 *     summary: Get average course scores
 *     description: Returns the average scores for a course.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: The ID of the course.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Average course scores.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageScore:
 *                   type: number
 *                   description: The average score for the course.
 *                   example: 85.0
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/getAverageCourseScores:
 *   post:
 *     summary: Get average course scores of students
 *     description: Returns the average scores of students in various courses.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The IDs of the students.
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Average course scores of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: integer
 *                   description: The student ID.
 *                   example: 1
 *                 averageScore:
 *                   type: number
 *                   description: The average score for the courses.
 *                   example: 84.3
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/getStudentStatistics:
 *   post:
 *     summary: Get student statistics
 *     description: Returns various statistics for a student.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 description: The ID of the student.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Student statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourses:
 *                   type: integer
 *                   description: The total number of courses.
 *                   example: 5
 *                 averageScore:
 *                   type: number
 *                   description: The average score.
 *                   example: 87.4
 *                 highestScore:
 *                   type: number
 *                   description: The highest score.
 *                   example: 95.0
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/getCloAchievedByCourse:
 *   post:
 *     summary: Get CLO achieved by course
 *     description: Returns the Course Learning Outcomes (CLO) achieved by course.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: The ID of the course.
 *                 example: 1
 *     responses:
 *       200:
 *         description: CLO achieved by course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: integer
 *                   description: The course ID.
 *                   example: 1
 *                 cloAchieved:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cloId:
 *                         type: integer
 *                         description: The CLO ID.
 *                         example: 1
 *                       achievement:
 *                         type: number
 *                         description: The achievement rate.
 *                         example: 85.0
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/getPloPercentageContainSubject:
 *   post:
 *     summary: Get PLO percentage containing subject
 *     description: Returns the Program Learning Outcomes (PLO) percentage containing a specific subject.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 description: The subject name.
 *                 example: Mathematics
 *     responses:
 *       200:
 *         description: PLO percentage containing subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   type: string
 *                   description: The subject name.
 *                   example: Mathematics
 *                 ploPercentage:
 *                   type: number
 *                   description: The PLO percentage.
 *                   example: 78.2
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/getScoreStudentByCourseAndTeacher:
 *   post:
 *     summary: Get score of student by course and teacher
 *     description: Returns the score of a student by course and teacher.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 description: The ID of the student.
 *                 example: 1
 *               courseId:
 *                 type: integer
 *                 description: The ID of the course.
 *                 example: 1
 *               teacherId:
 *                 type: integer
 *                 description: The ID of the teacher.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Score of student by course and teacher.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: integer
 *                   description: The student ID.
 *                   example: 1
 *                 courseId:
 *                   type: integer
 *                   description: The course ID.
 *                   example: 1
 *                 teacherId:
 *                   type: integer
 *                   description: The teacher ID.
 *                   example: 1
 *                 score:
 *                   type: number
 *                   description: The student's score.
 *                   example: 89.5
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/getAverageCourseScoresByStudent:
 *   post:
 *     summary: Get average course scores by student
 *     description: Returns the average course scores by student.
 *     tags: [Charts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 description: The ID of the student.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Average course scores by student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: integer
 *                   description: The student ID.
 *                   example: 1
 *                 averageScores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                         description: The course ID.
 *                         example: 1
 *                       averageScore:
 *                         type: number
 *                         description: The average score.
 *                         example: 85.0
 *       500:
 *         description: Server error
 */

router.post('/achieved-rate/clo/percentage', ChartController.getCloPercentage);
router.post('/achieved-rate/plo/percentage', ChartController.getPloPercentage);
router.get('/subject/average/subject', ChartController.averageScoresPerSubject);
router.get('/students/performance/:student_id', ChartController.getStudentPerformanceByCourse);
router.post('/course/arg-score', ChartController.getAverageCourseScores);


router.post('/getAverageCourseScores', ChartController.getAverageCourseScoresOfStudents);
router.post('/getStudentStatistics', ChartController.getStudentStatistics);
router.post('/getCloAchievedByCourse', ChartController.getCloAchievedByCourse);
router.post('/getPloPercentageContainSubject', ChartController.getPloPercentageContainSubject);
router.post('/getScoreStudentByCourseAndTeacher', ChartController.getScoreStudentByCourseAndTeacher);
router.post('/getAverageCourseScoresByStudent', ChartController.getAverageCourseScoresByStudent);

module.exports = router;