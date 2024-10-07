const express = require('express');
const router = express.Router();
const PO = require('../controllers/PoController');
const checkPermission = require('../middlewares/permissionMiddleware');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
/**
 * @openapi
 * tags:
 *   - name: Pos
 *     description: Operations related to Pos management
 */
// get: /pos
/**
 * @openapi
 * /api/admin/pos:
 *   get:
 *     tags:
 *       - Pos
 *     summary: Get all Pos
 *     description: Retrieve a list of all Pos.
 *     responses:
 *       '200':
 *         description: Successfully retrieved list of Pos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po'
 */
// post: /po
/**
 * @openapi
 * /api/admin/po:
 *   post:
 *     tags:
 *       - Pos
 *     summary: Create a new Po
 *     description: Create a new Po.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Po'
 *     responses:
 *       '201':
 *         description: Successfully created a new Po
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Po'
 */
// get: /po/:id
/**
 * @openapi
 * /api/admin/po/{id}:
 *   get:
 *     tags:
 *       - Pos
 *     summary: Get a Po by ID
 *     description: Retrieve a Po by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Po to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved the Po
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Po'
 *       '404':
 *         description: Po not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// put: /po/:id
/**
 * @openapi
 * /api/admin/po/{id}:
 *   put:
 *     tags:
 *       - Pos
 *     summary: Update a Po
 *     description: Update an existing Po.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Po to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Po'
 *     responses:
 *       '200':
 *         description: Successfully updated the Po
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Po'
 *       '404':
 *         description: Po not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// delete: /po/:id
/**
 * @openapi
 * /api/admin/po/{id}:
 *   delete:
 *     tags:
 *       - Pos
 *     summary: Delete a Po
 *     description: Delete a Po by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Po to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted the Po
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '404':
 *         description: Po not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// delete: /pos/multiple
/**
 * @openapi
 * /api/admin/pos/multiple:
 *   delete:
 *     tags:
 *       - Pos
 *     summary: Delete multiple Pos
 *     description: Delete multiple Pos by their IDs.
 *     parameters:
 *       - name: po_id
 *         in: query
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Array of Po IDs to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted the Pos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '404':
 *         description: One or more Pos not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// get: /pos/isDelete/true
/**
 * @openapi
 * /api/admin/pos/isDelete/true:
 *   get:
 *     tags:
 *       - Pos
 *     summary: Get all deleted Pos
 *     description: Retrieve a list of all Pos marked as deleted.
 *     responses:
 *       '200':
 *         description: Successfully retrieved list of deleted Pos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po'
 */
// get: /pos/isDelete/false
/**
 * @openapi
 * /api/admin/pos/isDelete/false:
 *   get:
 *     tags:
 *       - Pos
 *     summary: Get all active Pos
 *     description: Retrieve a list of all Pos not marked as deleted.
 *     responses:
 *       '200':
 *         description: Successfully retrieved list of active Pos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Po'
 */
// put: /pos/softDelete
/**
 * @openapi
 * /api/admin/pos/softDelete:
 *   put:
 *     tags:
 *       - Pos
 *     summary: Soft delete multiple Pos
 *     description: Toggle the delete status of multiple Pos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of Po IDs to toggle delete status
 *     responses:
 *       '200':
 *         description: Successfully toggled delete statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 updatedPos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       po_id:
 *                         type: integer
 *                       isDelete:
 *                         type: boolean
 *       '400':
 *         description: No PoModel ids provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '404':
 *         description: One or more PoModels not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// put: /po/:id/softDelete
/**
 * @openapi
 * /api/admin/po/{id}/softDelete:
 *   put:
 *     tags:
 *       - Pos
 *     summary: Toggle soft delete status of a Po by ID
 *     description: Toggle the soft delete status of a Po by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Unique identifier of the Po to toggle delete status
 *     responses:
 *       '200':
 *         description: Successfully toggled the delete status of the Po
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Toggled isDelete status to true"
 *       '404':
 *         description: Po not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Po not found"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

router.get('/pos',ensureAuthenticated, PO.index);
router.post('/po', ensureAuthenticated, checkPermission(3), PO.create);
router.get('/po/:id', ensureAuthenticated, PO.getByID);
router.put('/po/:id', ensureAuthenticated, checkPermission(3), PO.update);
router.delete('/po/:id', ensureAuthenticated, checkPermission(3), PO.delete);
router.delete('/pos/multiple', ensureAuthenticated, checkPermission(3), PO.deleteMultiple);
router.get('/pos/isDelete/true', ensureAuthenticated, PO.isDeleteToTrue);
router.get('/pos/isDelete/false', ensureAuthenticated, PO.isDeleteToFalse);
router.put('/pos/softDelete', ensureAuthenticated, checkPermission(3), PO.softDeleteMultiple);
router.put('/po/:id/softDelete', ensureAuthenticated, checkPermission(3), PO.toggleSoftDeleteById);



//api dư
router.get('/po/templates/post', ensureAuthenticated, PO.getFormPost);
router.post('/po/templates/update', ensureAuthenticated, checkPermission(3), PO.getFormUpdate);

module.exports = router;

