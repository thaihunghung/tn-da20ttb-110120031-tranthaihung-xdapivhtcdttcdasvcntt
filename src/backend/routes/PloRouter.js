const express = require('express');
const router = express.Router();
const PLO = require('../controllers/PloController');


/**
 * @openapi
 * tags:
 *   - name: Plos
 *     description: Operations related to Plos management
 */
/**
 * @openapi
 * /api/admin/plos:
 *   get:
 *     tags:
 *       - Plos
 *     summary: Retrieve all PLO records
 *     description: Fetches all PLO records from the database.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all PLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo'
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plo:
 *   post:
 *     tags:
 *       - Plos
 *     summary: Create a new PLO record
 *     description: Adds a new PLO record to the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plo'
 *     responses:
 *       '201':
 *         description: PLO record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plo'
 *       '400':
 *         description: Bad request - No data provided
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plo/{id}:
 *   get:
 *     tags:
 *       - Plos
 *     summary: Retrieve a PLO record by ID
 *     description: Fetches a specific PLO record based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the PLO to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved the PLO record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plo'
 *       '400':
 *         description: Bad request - No ID provided
 *       '404':
 *         description: PLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plo/{id}:
 *   put:
 *     tags:
 *       - Plos
 *     summary: Update a PLO record by ID
 *     description: Updates a specific PLO record based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the PLO to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plo'
 *     responses:
 *       '200':
 *         description: Successfully updated the PLO record
 *       '400':
 *         description: Bad request - No data provided
 *       '404':
 *         description: PLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plo/{id}:
 *   delete:
 *     tags:
 *       - Plos
 *     summary: Delete a PLO record by ID
 *     description: Deletes a specific PLO record based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the PLO to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted the PLO record
 *       '400':
 *         description: Bad request - No ID provided
 *       '404':
 *         description: PLO record not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plos/multiple:
 *   delete:
 *     tags:
 *       - Plos
 *     summary: Delete multiple PLO records
 *     description: Deletes multiple PLO records based on the provided IDs.
 *     parameters:
 *       - in: query
 *         name: plo_id
 *         required: true
 *         description: Comma-separated list of PLO IDs to delete
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *     responses:
 *       '200':
 *         description: Successfully deleted the PLO records
 *       '404':
 *         description: One or more PLO records not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plos/isDelete/true:
 *   get:
 *     tags:
 *       - Plos
 *     summary: Retrieve all PLO records where isDelete is true
 *     description: Fetches all PLO records that are marked as deleted.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all deleted PLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo'
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plos/isDelete/false:
 *   get:
 *     tags:
 *       - Plos
 *     summary: Retrieve all PLO records where isDelete is false
 *     description: Fetches all PLO records that are not marked as deleted.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all active PLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plo'
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plos/softDelete:
 *   put:
 *     tags:
 *       - Plos
 *     summary: Toggle soft delete status for multiple PLO records
 *     description: Toggles the delete status for multiple PLO records.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plo_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of PLO IDs to toggle delete status
 *             required:
 *               - plo_id
 *     responses:
 *       '200':
 *         description: Successfully toggled delete statuses for PLO records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedPlos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Plo'
 *       '400':
 *         description: Bad request - No PLO IDs provided or not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/plo/{id}/softDelete:
 *   put:
 *     tags:
 *       - Plos
 *     summary: Toggle soft delete status for a PLO record by ID
 *     description: Toggles the delete status for a specific PLO record based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the PLO to toggle delete status
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully toggled delete status for the PLO record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isDelete:
 *                   type: boolean
 *       '404':
 *         description: PLO record not found
 *       '500':
 *         description: Internal server error
 */

router.get('/plos', PLO.index);
router.post('/plo', PLO.create);
router.get('/plo/:id', PLO.getByID);
router.put('/plo/:id', PLO.update);
router.delete('/plo/:id', PLO.delete);
router.delete('/plos/multiple', PLO.deleteMultiple);
router.get('/plos/isDelete/true', PLO.isDeleteTotrue);
router.get('/plos/isDelete/false', PLO.isDeleteTofalse);
router.put('/plos/softDelete', PLO.softDeleteMultiple);
router.put('/plo/:id/softDelete', PLO.toggleSoftDeleteById);



router.get('/plo/templates/post', PLO.getFormPost);
router.post('/plo/templates/update', PLO.getFormUpdate);

module.exports = router;
