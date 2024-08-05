const express = require('express');
const AcademicYearController = require('../controllers/AcademicYearController');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: AcademicYears
 *     description: Operations related to academic years
 */

/**
 * @openapi
 * /api/admin/academic-year:
 *   get:
 *     summary: Get a list of all academic years
 *     description: Returns a list of all academic years.
 *     tags: [AcademicYears]
 *     responses:
 *       200:
 *         description: A list of academic years.
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
 *                         description: The academic year ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The academic year name.
 *                         example: 2023-2024
 *   post:
 *     summary: Create a new academic year
 *     description: Adds a new academic year to the database.
 *     tags: [AcademicYears]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The academic year name.
 *                 example: 2023-2024
 *     responses:
 *       200:
 *         description: Academic year created successfully.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/academic-year/{id}:
 *   get:
 *     summary: Get an academic year by ID
 *     description: Returns the details of an academic year.
 *     tags: [AcademicYears]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the academic year.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Academic year details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Academic year not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update an academic year
 *     description: Updates the information of an academic year by ID.
 *     tags: [AcademicYears]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the academic year to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       200:
 *         description: Academic year updated successfully.
 *       404:
 *         description: Academic year not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an academic year
 *     description: Deletes an academic year by ID.
 *     tags: [AcademicYears]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the academic year to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Academic year deleted successfully.
 *       404:
 *         description: Academic year not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/academic-year/isDelete/true:
 *   get:
 *     summary: Get deleted academic years
 *     description: Returns a list of academic years with isDelete status true.
 *     tags: [AcademicYears]
 *     responses:
 *       200:
 *         description: List of deleted academic years.
 *       404:
 *         description: No academic years found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/academic-year/isDelete/false:
 *   get:
 *     summary: Get non-deleted academic years
 *     description: Returns a list of academic years with isDelete status false.
 *     tags: [AcademicYears]
 *     responses:
 *       200:
 *         description: List of non-deleted academic years.
 *       404:
 *         description: No academic years found.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/academic-year/isDelete/{id}:
 *   put:
 *     summary: Toggle isDelete status of an academic year
 *     description: Updates the isDelete status of an academic year by ID.
 *     tags: [AcademicYears]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the academic year.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Academic year isDelete status toggled successfully.
 *       404:
 *         description: Academic year not found
 *       500:
 *         description: Server error
 */

router.get('/academic-year', AcademicYearController.index);
router.post('/academic-year', AcademicYearController.create);
router.get('/academic-year/:id', AcademicYearController.getByID);

router.put('/academic-year/:id', AcademicYearController.update);
router.delete('/academic-year/:id', AcademicYearController.delete);

router.get('/academic-year/isDelete/true', AcademicYearController.isDeleteToTrue);
router.get('/academic-year/isDelete/false', AcademicYearController.isDeleteToFalse);

router.put('/academic-year/isDelete/:id', AcademicYearController.IsDelete);

module.exports = router;
