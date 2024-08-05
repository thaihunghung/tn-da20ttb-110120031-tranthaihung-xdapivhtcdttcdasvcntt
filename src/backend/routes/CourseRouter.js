const express = require('express');
const CourseController = require('../controllers/CourseController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: Operations related to courses
 */

/**
 * @openapi
 * /api/admin/course:
 *   get:
 *     summary: Get a list of all courses
 *     description: Returns a list of all courses.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses.
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
 *                         description: The course ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The course name.
 *                         example: Introduction to Programming
 */

/**
 * @openapi
 * /api/admin/course-all:
 *   get:
 *     summary: Get all courses including deleted ones
 *     description: Returns a list of all courses including those marked as deleted.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of all courses.
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
 *                         description: The course ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The course name.
 *                         example: Introduction to Programming
 */

/**
 * @openapi
 * /api/admin/course/{id}:
 *   get:
 *     summary: Get a course by ID
 *     description: Returns the details of a course.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/getByTeacher/{id_teacher}:
 *   get:
 *     summary: Get courses by teacher ID
 *     description: Returns a list of courses taught by a specific teacher.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id_teacher
 *         required: true
 *         description: The ID of the teacher.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of courses taught by the teacher.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: No courses found for the teacher
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/course-enrollment/{id}:
 *   get:
 *     summary: Get a course with enrollments by course ID
 *     description: Returns the details of a course along with its enrollments.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course details with enrollments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course-course-enrollment:
 *   get:
 *     summary: Get all courses with enrollments
 *     description: Returns a list of all courses along with their enrollments.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses with enrollments.
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
 *                         description: The course ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The course name.
 *                         example: Introduction to Programming
 *                       enrollments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             studentId:
 *                               type: integer
 *                               description: The student ID.
 *                               example: 1
 *                             studentName:
 *                               type: string
 *                               description: The student name.
 *                               example: John Doe
 */

/**
 * @openapi
 * /api/admin/course:
 *   post:
 *     summary: Create a new course
 *     description: Adds a new course to the database.
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The course name.
 *                 example: Introduction to Programming
 *     responses:
 *       200:
 *         description: Course created successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/{id}:
 *   put:
 *     summary: Update a course
 *     description: Updates the information of a course by ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Deletes a course by ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/isDelete/true:
 *   get:
 *     summary: Get deleted courses
 *     description: Returns a list of courses with isDelete status true.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of deleted courses.
 *       404:
 *         description: No courses found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/isDelete/false:
 *   get:
 *     summary: Get non-deleted courses
 *     description: Returns a list of courses with isDelete status false.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of non-deleted courses.
 *       404:
 *         description: No courses found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/course/isDelete/{id}:
 *   put:
 *     summary: Toggle isDelete status of a course
 *     description: Updates the isDelete status of a course by ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the course.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course isDelete status toggled successfully.
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */


router.get('/course', CourseController.index);
router.post('/course-all', CourseController.getAll);
router.get('/course/:id', CourseController.getByID);
router.get('/course/getByTeacher/:id_teacher', CourseController.getByIDTeacher);
router.get('/course/course-enrollment/:id', CourseController.getByIdWithCourseEnrollment);
router.get('/course-course-enrollment', CourseController.getAllWithCourseEnrollment);

router.post('/course',ensureAuthenticated, checkPermission(2), CourseController.create);
router.put('/course/:id', ensureAuthenticated, checkPermission(2),CourseController.update);
router.delete('/course/:id',ensureAuthenticated, checkPermission(3),  CourseController.delete);

router.get('/course/isDelete/true', CourseController.isDeleteToTrue);
router.get('/course/isDelete/false', CourseController.isDeleteToFalse);
router.put('/course/isDelete/:id',ensureAuthenticated, checkPermission(3), CourseController.isDelete);

module.exports = router;
