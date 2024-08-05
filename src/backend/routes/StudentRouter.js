const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const checkPermission = require('../middlewares/permissionMiddleware');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Students
 *     description: Operations related to students
 */

/**
 * @openapi
 * /api/admin/students:
 *   get:
 *     summary: Get a list of all students
 *     description: Returns a list of all students.
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     summary: Create a new student
 *     description: Adds a new student to the database.
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham
 *     responses:
 *       200:
 *         description: Student created successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: Returns the details of a student.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a student
 *     description: Updates the information of a student by ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a student
 *     description: Deletes a student by ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/class/{id}:
 *   get:
 *     summary: Get students by class ID
 *     description: Returns a list of students based on the class ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the class.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of students in the class.
 *       404:
 *         description: No students found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/isDelete/true:
 *   get:
 *     summary: Get deleted students
 *     description: Returns a list of students with isDelete status true.
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of deleted students.
 *       404:
 *         description: No students found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/isDelete/false:
 *   get:
 *     summary: Get non-deleted students
 *     description: Returns a list of students with isDelete status false.
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of non-deleted students.
 *       404:
 *         description: No students found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/isDelete/{id}:
 *   put:
 *     summary: Toggle isDelete status of a student
 *     description: Updates the isDelete status of a student by ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student isDelete status toggled successfully.
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/{id}/learning-outcome:
 *   get:
 *     summary: Get learning outcomes for a student
 *     description: Returns the learning outcomes for a specific student by ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Learning outcomes of the student.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student-course/{id}:
 *   get:
 *     summary: Get students by course ID
 *     description: Returns a list of students based on the course ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of students in the course.
 *       404:
 *         description: No students found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/students/getAllByStudentCode:
 *   post:
 *     summary: Get students by student code
 *     description: Returns a list of students based on the provided student code.
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentCode:
 *                 type: string
 *                 description: The student code.
 *                 example: "SC123"
 *     responses:
 *       200:
 *         description: List of students with the given student code.
 *       404:
 *         description: No students found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/templates/post:
 *   get:
 *     summary: Get student form template
 *     description: Returns a form template for student information.
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Student form template.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/student/templates/update:
 *   post:
 *     summary: Get student form template with data
 *     description: Returns a form template for student information pre-filled with data.
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["75"]
 *     responses:
 *       200:
 *         description: Student form template with data.
 *       500:
 *         description: Server error
 */

router.get('/students', StudentController.index);
router.post('/students/getAllByStudentCode', StudentController.getAllByStudentCode);
router.post('/student', ensureAuthenticated, checkPermission(3),StudentController.create);
router.get('/student/:id', StudentController.getByID);
router.get('/student/class/:id',ensureAuthenticated, StudentController.getAllByClassId);

router.put('/student/:id',ensureAuthenticated, checkPermission(2), StudentController.update);
router.delete('/student/:id',ensureAuthenticated, checkPermission(3), StudentController.delete);

router.get('/student/isDelete/true', ensureAuthenticated,StudentController.isDeleteToTrue);
router.get('/student/isDelete/false', ensureAuthenticated,StudentController.isDeleteToFalse);
router.put('/student/isDelete/:id',ensureAuthenticated, checkPermission(2), StudentController.isDelete);

router.get('/student/learning-outcome/:id', StudentController.learningOutcomes);
router.get('/student-course/:id',ensureAuthenticated, StudentController.getFormStudentByClass);

router.get('/student/templates/post', StudentController.getFormStudent);
router.post('/student/templates/update',ensureAuthenticated, checkPermission(2), StudentController.getFormStudentWithData);

module.exports = router;
