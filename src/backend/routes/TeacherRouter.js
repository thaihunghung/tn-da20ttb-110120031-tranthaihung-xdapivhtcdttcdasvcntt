const express = require('express');
const TeacherController = require('../controllers/TeacherController');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Teachers
 *     description: Operations related to teacher management
 */

/**
 * @openapi
 * /api/admin/teacher:
 *   get:
 *     summary: Get a list of all teachers
 *     description: Returns a list of all teachers.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of teachers.
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
 *                         description: The teacher ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The teacher's name.
 *                         example: John Doe
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teachers-store:
 *   get:
 *     summary: Get all teachers in the store
 *     description: Returns a list of all teachers in the store.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of teachers in the store.
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
 *                         description: The teacher ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The teacher's name.
 *                         example: John Doe
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     description: Returns the details of a teacher.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the teacher.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher:
 *   post:
 *     summary: Create a new teacher
 *     description: Adds a new teacher to the database.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The teacher's name.
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Teacher created successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher/{id}:
 *   put:
 *     summary: Update a teacher
 *     description: Updates the information of a teacher by ID.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the teacher to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully.
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher/{id}/block:
 *   patch:
 *     summary: Block a teacher by ID
 *     description: Blocks a teacher by ID.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the teacher to block.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher blocked successfully.
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teachers/block:
 *   patch:
 *     summary: Block multiple teachers
 *     description: Blocks multiple teachers.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The IDs of the teachers to block.
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Teachers blocked successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher/{id}/unblock:
 *   patch:
 *     summary: Unblock a teacher by ID
 *     description: Unblocks a teacher by ID.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the teacher to unblock.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher unblocked successfully.
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teachers/unblock:
 *   patch:
 *     summary: Unblock multiple teachers
 *     description: Unblocks multiple teachers.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The IDs of the teachers to unblock.
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Teachers unblocked successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teachers/{id}/delete:
 *   patch:
 *     summary: Delete a teacher by ID
 *     description: Soft deletes a teacher by ID.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the teacher to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher deleted successfully.
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teachers/delete:
 *   patch:
 *     summary: Delete multiple teachers
 *     description: Soft deletes multiple teachers.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The IDs of the teachers to delete.
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Teachers deleted successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teachers/{id}/restore:
 *   patch:
 *     summary: Restore a deleted teacher by ID
 *     description: Restores a soft-deleted teacher by ID.
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the teacher to restore.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher restored successfully.
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher/template/excel:
 *   get:
 *     summary: Get teacher form template
 *     description: Returns a form template for teacher information.
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: Teacher form template.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/teacher/template/data:
 *   post:
 *     summary: Get teacher form template with data
 *     description: Returns a form template for teacher information pre-filled with data.
 *     tags: [Teachers]
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
 *         description: Teacher form template with data.
 *       500:
 *         description: Server error
 */

router.get('/teacher', TeacherController.index);
router.get('/teachers-store', ensureAuthenticated, checkPermission(2), TeacherController.getAllStore);
router.get('/teacher/:id', checkPermission(3), TeacherController.getByID);
router.post('/teacher', checkPermission(3), TeacherController.create);
router.put('/teacher/:id', ensureAuthenticated, checkPermission(3),TeacherController.update);

router.patch('/teacher/:id/block', ensureAuthenticated, checkPermission(3), TeacherController.blockTeacher);
router.patch('/teachers/block', ensureAuthenticated, checkPermission(3), TeacherController.blockTeachers);
router.patch('/teacher/:id/unblock', ensureAuthenticated, checkPermission(3), TeacherController.unblockTeacher);
router.patch('/teachers/unblock', ensureAuthenticated, checkPermission(3), TeacherController.unblockTeachers);
router.patch('/teachers/:id/delete', ensureAuthenticated, checkPermission(3), TeacherController.deleteTeacher);
router.patch('/teachers/delete', ensureAuthenticated, checkPermission(3), TeacherController.deleteTeachers);
router.patch('/teachers/:id/restore', ensureAuthenticated, checkPermission(3), TeacherController.restoreTeacher);

router.get('/teacher/template/excel', ensureAuthenticated, TeacherController.getFormTeacher);
router.post('/teacher/template/data', ensureAuthenticated, TeacherController.getFormTeacherWithData);

module.exports = router;
