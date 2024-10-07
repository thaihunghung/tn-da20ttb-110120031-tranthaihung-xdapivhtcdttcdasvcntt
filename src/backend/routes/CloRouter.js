const express = require('express');
const CloController = require('../controllers/CloController');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
/**
 * @openapi
 * tags:
 *   - name: Clos
 *     description: Operations related to Clos management
 */
/**
 * @openapi
 * /api/admin/clos:
 *   get:
 *     tags:
 *       - Clos
 *     summary: Retrieve all CLO records
 *     description: Retrieves all CLO records, with optional filtering by subject_id and isDelete status.
 *     parameters:
 *       - in: query
 *         name: subject_id
 *         schema:
 *           type: integer
 *         description: Filter CLO records by subject ID
 *       - in: query
 *         name: isDelete
 *         schema:
 *           type: boolean
 *         description: Filter CLO records by delete status
 *     responses:
 *       '200':
 *         description: Successfully retrieved CLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clo'
 *       '404':
 *         description: No CLO records found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clo:
 *   post:
 *     tags:
 *       - Clos
 *     summary: Create a new CLO record
 *     description: Creates a new CLO record with the provided data.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 description: Data for the new CLO record
 *             required:
 *               - data
 *     responses:
 *       '201':
 *         description: Successfully created CLO record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clo'
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clo/{id}:
 *   get:
 *     tags:
 *       - Clos
 *     summary: Retrieve a CLO record by ID
 *     description: Retrieves a single CLO record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the CLO record to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved CLO record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clo'
 *       '404':
 *         description: CLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clo/{id}:
 *   put:
 *     tags:
 *       - Clos
 *     summary: Update a CLO record
 *     description: Updates a CLO record with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the CLO record to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 description: Data to update the CLO record with
 *             required:
 *               - data
 *     responses:
 *       '200':
 *         description: Successfully updated CLO record
 *       '404':
 *         description: CLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clo/{id}:
 *   delete:
 *     tags:
 *       - Clos
 *     summary: Delete a CLO record
 *     description: Deletes a CLO record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the CLO record to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted CLO record
 *       '404':
 *         description: CLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clos/multiple:
 *   delete:
 *     tags:
 *       - Clos
 *     summary: Delete multiple CLO records
 *     description: Deletes multiple CLO records based on provided CLO IDs.
 *     parameters:
 *       - in: query
 *         name: clo_id
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: List of CLO IDs to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted multiple CLO records
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clo/{id}/softDelete:
 *   put:
 *     tags:
 *       - Clos
 *     summary: Toggle soft delete status of a CLO record by ID
 *     description: Toggles the `isDelete` status of a CLO record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the CLO record to update
 *     responses:
 *       '200':
 *         description: Successfully toggled the `isDelete` status
 *       '404':
 *         description: CLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clos/isDelete/true:
 *   get:
 *     tags:
 *       - Clos
 *     summary: Retrieve CLO records marked as deleted
 *     description: Retrieves all CLO records where `isDelete` is true.
 *     responses:
 *       '200':
 *         description: Successfully retrieved deleted CLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clo'
 *       '404':
 *         description: No deleted CLO records found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clos/isDelete/false:
 *   get:
 *     tags:
 *       - Clos
 *     summary: Retrieve CLO records that are not marked as deleted
 *     description: Retrieves all CLO records where `isDelete` is false.
 *     responses:
 *       '200':
 *         description: Successfully retrieved active CLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clo'
 *       '404':
 *         description: No active CLO records found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/clos/softDelete:
 *   put:
 *     tags:
 *       - Clos
 *     summary: Soft delete multiple CLO records
 *     description: Toggles the `isDelete` status for multiple CLO records based on provided CLO IDs.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clo_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of CLO IDs to toggle `isDelete` status
 *             required:
 *               - clo_id
 *     responses:
 *       '200':
 *         description: Successfully toggled delete status for multiple CLO records
 *       '400':
 *         description: No CLO IDs provided or invalid data
 *       '404':
 *         description: One or more CLO records not found
 *       '500':
 *         description: Internal server error
 */

router.get('/clos', ensureAuthenticated, CloController.index);

router.post('/clo', ensureAuthenticated, CloController.create);

router.get('/clo/:id', ensureAuthenticated, CloController.getByID);

router.put('/clo/:id', ensureAuthenticated, CloController.update);

router.delete('/clo/:id', ensureAuthenticated, CloController.delete);
router.delete('/clos/multiple', ensureAuthenticated, CloController.deleteMultiple);

router.put('/clo/:id/softDelete', ensureAuthenticated, CloController.toggleSoftDeleteById);
router.put('/clos/softDelete', ensureAuthenticated, CloController.softDeleteMultiple);

router.get('/clos/isDelete/true', ensureAuthenticated, CloController.isDeleteTotrue);
router.get('/clos/isDelete/false', ensureAuthenticated, CloController.isDeleteTofalse);
//api dư
router.get('/clo/templates/post', ensureAuthenticated, CloController.getFormPost);
router.post('/clo/templates/update', ensureAuthenticated, CloController.getFormUpdate);


// router.get('/clo/subject/:id', CloController.GetCloBySubjectId);
// router.get('/clo/archive/subject/:id', CloController.GetCloArchiveBySubjectId);
module.exports = router;
