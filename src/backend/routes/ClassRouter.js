const express = require('express');
const ClassController = require('../controllers/ClassController');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Classes
 *     description: Operations related to classes
 */

/**
 * @openapi
 * /api/admin/class:
 *   get:
 *     summary: Get a list of all classes
 *     description: Returns a list of all classes.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: A list of classes.
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
 *                         description: The class ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The class name.
 *                         example: Math 101
 *   post:
 *     summary: Create a new class
 *     description: Adds a new class to the database.
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The class name.
 *                 example: Math 101
 *     responses:
 *       200:
 *         description: Class created successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/class/{id}:
 *   get:
 *     summary: Get a class by ID
 *     description: Returns the details of a class.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the class.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a class
 *     description: Updates the information of a class by ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the class to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Class updated successfully.
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a class
 *     description: Deletes a class by ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the class to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted successfully.
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/class-teacher:
 *   get:
 *     summary: Get all classes with teachers
 *     description: Returns a list of all classes along with their respective teachers.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: A list of classes with teachers.
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
 *                       classId:
 *                         type: integer
 *                         description: The class ID.
 *                         example: 1
 *                       className:
 *                         type: string
 *                         description: The class name.
 *                         example: Math 101
 *                       teacherName:
 *                         type: string
 *                         description: The teacher's name.
 *                         example: John Doe
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @openapi
 * /api/admin/class/isDelete/true:
 *   get:
 *     summary: Get deleted classes
 *     description: Returns a list of classes with isDelete status true.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of deleted classes.
 *       404:
 *         description: No classes found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/class/isDelete/false:
 *   get:
 *     summary: Get non-deleted classes
 *     description: Returns a list of classes with isDelete status false.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of non-deleted classes.
 *       404:
 *         description: No classes found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/class/isDelete/{id}:
 *   put:
 *     summary: Toggle isDelete status of a class
 *     description: Updates the isDelete status of a class by ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the class.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class isDelete status toggled successfully.
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/class/templates/update:
 *   post:
 *     summary: Get class form template with data
 *     description: Returns a form template for class information pre-filled with data.
 *     tags: [Classes]
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
 *         description: Class form template with data.
 *       500:
 *         description: Server error
 */

router.get('/class', ClassController.index);
router.post('/class',ensureAuthenticated, checkPermission(2), ClassController.create);
router.get('/class/:id', ClassController.getByID);
router.get('/class-teacher', ensureAuthenticated, ClassController.getAllWithTeacher);

router.put('/class/:id',ensureAuthenticated, checkPermission(2), ClassController.update);
router.delete('/class/:id',ensureAuthenticated, checkPermission(3), ClassController.delete);

router.get('/class/isDelete/true', ClassController.isDeleteToTrue);
router.get('/class/isDelete/false', ClassController.isDeleteToFalse);
router.post('/class/templates/update',ensureAuthenticated, checkPermission(2), ClassController.getExcelWithData);

router.put('/class/isDelete/:id',ensureAuthenticated, checkPermission(2), ClassController.IsDelete);

module.exports = router;
