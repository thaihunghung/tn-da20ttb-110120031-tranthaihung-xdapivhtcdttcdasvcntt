const express = require('express');
const router = express.Router();
const PO_PLO = require('../controllers/Po_PloController');
const checkPermission = require('../middlewares/permissionMiddleware');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Po-plo
 *     description: Operations related to Plo-Clo management
 */
/**
 * @openapi
 * /api/admin/po-plo:
 *   get:
 *     tags:
 *       - Po-plo
 *     summary: Retrieve all PoPlo records
 *     description: Fetches all PoPlo records from the database.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all PoPlo records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_po_plo:
 *                     type: integer
 *                     description: Unique identifier for the PoPlo
 *                   po_id:
 *                     type: integer
 *                     description: ID of the related Po
 *                   plo_id:
 *                     type: integer
 *                     description: ID of the related Plo
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @openapi
 * /api/admin/po-plo:
 *   post:
 *     tags:
 *       - Po-plo
 *     summary: Save PoPlo records
 *     description: Saves multiple PoPlo records to the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataSave:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     po_id:
 *                       type: integer
 *                       description: ID of the related Po
 *                     plo_id:
 *                       type: integer
 *                       description: ID of the related Plo
 *     responses:
 *       '200':
 *         description: Successfully saved PoPlo records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data saved successfully"
 *                 status:
 *                   type: string
 *                   example: "success"
 *       '400':
 *         description: No data provided for saving
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No data provided for saving"
 *                 status:
 *                   type: string
 *                   example: "failure"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: string
 *                   example: "error"
 */

/**
 * @openapi
 * /api/admin/po-plo:
 *   delete:
 *     tags:
 *       - Po-plo
 *     summary: Delete PoPlo records
 *     description: Deletes multiple PoPlo records from the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataDelete:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_po_plo:
 *                       type: integer
 *                       description: Unique identifier for the PoPlo to be deleted
 *     responses:
 *       '200':
 *         description: Successfully deleted PoPlo records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data deleted successfully"
 *                 status:
 *                   type: string
 *                   example: "success"
 *       '400':
 *         description: No data provided for deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No data provided for deletion"
 *                 status:
 *                   type: string
 *                   example: "failure"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 status:
 *                   type: string
 *                   example: "error"
 */

router.get('/po-plo', ensureAuthenticated, PO_PLO.getAll);
router.post('/po-plo', ensureAuthenticated, checkPermission(3), PO_PLO.SavePoPlo);
router.delete('/po-plo', ensureAuthenticated, checkPermission(3), PO_PLO.DeletePoPlo);

module.exports = router;
