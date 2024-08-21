const express = require('express');
const router = express.Router();
const PLO_CLO = require('../controllers/Plo_CloController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
/**
 * @openapi
 * tags:
 *   - name: Plo-Clo
 *     description: Operations related to Plo-Clo management
 */
/**
 * @openapi
 * /api/admin/plo-clo:
 *   get:
 *     summary: Retrieve PLO-CLO data
 *     description: Retrieves PLO-CLO data based on given query parameters. Can handle requests for multiple CLO IDs, a single CLO ID, or all PLO-CLO records.
 *     tags: [Plo-Clo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_clos
 *         in: query
 *         description: Comma-separated list of CLO IDs to filter PLO-CLO records.
 *         required: false
 *         schema:
 *           type: string
 *           example: '[1,2,3]'  # Example of a JSON array as a string
 *       - name: clo_id
 *         in: query
 *         description: Single CLO ID to retrieve related PLO records.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1  # Example of a single CLO ID
 *     responses:
 *       200:
 *         description: Successfully retrieved PLO-CLO data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_plo_clo:
 *                     type: integer
 *                     example: 1
 *                   clo_id:
 *                     type: integer
 *                     example: 1
 *                   plo_id:
 *                     type: integer
 *                     example: 101
 *       404:
 *         description: No data found based on the provided query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No PLO-CLOs found for the given CLO IDs
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/admin/plo-clo:
 *   post:
 *     summary: Save PLO-CLO data
 *     description: Saves multiple PLO-CLO entries in the database. Requires an array of data to be saved.
 *     tags: [Plo-Clo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
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
 *                     clo_id:
 *                       type: integer
 *                     plo_id:
 *                       type: integer
 *             example:
 *               dataSave:
 *                 - clo_id: 1
 *                   plo_id: 2
 *                 - clo_id: 2
 *                   plo_id: 3
 *     responses:
 *       200:
 *         description: Data saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data saved successfully
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: No data provided for saving.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No data provided for saving
 *                 status:
 *                   type: string
 *                   example: failure
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: string
 *                   example: error
 */
/**
 * @openapi
 * /api/admin/plo-clo:
 *   delete:
 *     summary: Delete PLO-CLO data
 *     description: Deletes multiple PLO-CLO entries from the database based on the provided IDs.
 *     tags: [Plo-Clo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
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
 *                     id_plo_clo:
 *                       type: integer
 *             example:
 *               dataDelete:
 *                 - id_plo_clo: 1
 *                 - id_plo_clo: 2
 *     responses:
 *       200:
 *         description: Data deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data deleted successfully
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: No data provided for deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No data provided for deletion
 *                 status:
 *                   type: string
 *                   example: failure
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: string
 *                   example: error
 */



router.get('/plo-clo', ensureAuthenticated, PLO_CLO.index);
router.post('/plo-clo', ensureAuthenticated, PLO_CLO.SaveCloPlo);
router.delete('/plo-clo', ensureAuthenticated, PLO_CLO.DeleteCloPlo);


// router.post('/plo-clo/id_clos', PLO_CLO.GetPloCloByCloIds);
// router.get('/plo-clo/clo/:id/find-plo', PLO_CLO.GetPloCloByCloId);

module.exports = router;
