const express = require('express');
const SemesterController = require('../controllers/SemesterController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Semesters
 *     description: Operations related to semesters
 */

/**
 * @openapi
 * /api/admin/semester:
 *   get:
 *     summary: Get a list of all semesters
 *     description: Returns a list of all semesters.
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: A list of semesters.
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
 *                         description: The semester ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The semester name.
 *                         example: Fall 2024
 *   post:
 *     summary: Create a new semester
 *     description: Adds a new semester to the database.
 *     tags: [Semesters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The semester name.
 *                 example: Fall 2024
 *     responses:
 *       200:
 *         description: Semester created successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/semester/{id}:
 *   get:
 *     summary: Get a semester by ID
 *     description: Returns the details of a semester.
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the semester.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Semester details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a semester
 *     description: Updates the information of a semester by ID.
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the semester to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Semester'
 *     responses:
 *       200:
 *         description: Semester updated successfully.
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a semester
 *     description: Deletes a semester by ID.
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the semester to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Semester deleted successfully.
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/semester/isDelete/true:
 *   get:
 *     summary: Get deleted semesters
 *     description: Returns a list of semesters with isDelete status true.
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: List of deleted semesters.
 *       404:
 *         description: No semesters found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/semester/isDelete/false:
 *   get:
 *     summary: Get non-deleted semesters
 *     description: Returns a list of semesters with isDelete status false.
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: List of non-deleted semesters.
 *       404:
 *         description: No semesters found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/semester/isDelete/{id}:
 *   put:
 *     summary: Toggle isDelete status of a semester
 *     description: Updates the isDelete status of a semester by ID.
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the semester.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Semester isDelete status toggled successfully.
 *       404:
 *         description: Semester not found
 *       500:
 *         description: Server error
 */

router.get('/semester', SemesterController.index);
router.post('/semester', ensureAuthenticated, checkPermission(2),SemesterController.create);
router.get('/semester/:id', SemesterController.getByID);

router.put('/semester/:id',ensureAuthenticated, checkPermission(2), SemesterController.update);
router.delete('/semester/:id', ensureAuthenticated, checkPermission(2),SemesterController.delete);

router.get('/semester/isDelete/true', SemesterController.isDeleteToTrue);
router.get('/semester/isDelete/false', SemesterController.isDeleteToFalse);
router.put('/semester/isDelete/:id',ensureAuthenticated, checkPermission(2), SemesterController.isDelete);

module.exports = router;
