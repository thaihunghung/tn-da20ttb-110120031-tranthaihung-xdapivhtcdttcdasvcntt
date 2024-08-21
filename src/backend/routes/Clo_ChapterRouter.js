const express = require('express');
const router = express.Router();
const CLO_CHAPTER = require('../controllers/Clo_ChapterController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Clo-Chapter
 *     description: Operations related to clo-chapter management
 */
/**
 * @openapi
 * /api/admin/clo-chapter:
 *   get:
 *     summary: Retrieve CLO-Chapter information
 *     description: Retrieves CLO-Chapter data based on the given CLO ID or Chapter IDs. If no parameters are provided, all CLO-Chapters are returned.
 *     tags: [Clo-Chapter]
 *     parameters:
 *       - name: clo_id
 *         in: query
 *         description: ID of the CLO to filter the chapters.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: chapter_ids
 *         in: query
 *         description: Comma-separated list of Chapter IDs to retrieve CLO-Chapter mappings.
 *         required: false
 *         schema:
 *           type: string
 *           example: "[1,2,3]"
 *     responses:
 *       200:
 *         description: Successful response with CLO-Chapter data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clo_id:
 *                     type: integer
 *                   chapter_id:
 *                     type: integer
 *       404:
 *         description: No data found for the provided parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No chapters found for the given CLO ID
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
 * /api/admin/clo-chapter:
 *   post:
 *     summary: Save CLO-Chapter data
 *     description: Saves multiple CLO-Chapter entries in the database. Requires an array of data to be saved.
 *     tags: [Clo-Chapter]
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
 *                     chapter_id:
 *                       type: integer
 *             example:
 *               dataSave:
 *                 - clo_id: 1
 *                   chapter_id: 2
 *                 - clo_id: 2
 *                   chapter_id: 3
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
 * /api/admin/clo-chapter:
 *   delete:
 *     summary: Delete CLO-Chapter data
 *     description: Deletes multiple CLO-Chapter entries from the database based on the provided IDs.
 *     tags: [Clo-Chapter]
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
 *                     id_clo_chapter:
 *                       type: integer
 *             example:
 *               dataDelete:
 *                 - id_clo_chapter: 1
 *                 - id_clo_chapter: 2
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

router.get('/clo-chapter', ensureAuthenticated, CLO_CHAPTER.getCloChapter);
router.post('/clo-chapter', ensureAuthenticated, CLO_CHAPTER.SaveCloChapter);
router.delete('/clo-chapter', ensureAuthenticated, CLO_CHAPTER.DeleteCloChapter);


// router.get('/clo-chapter/clo/:clo_id/find-chapter', CLO_CHAPTER.GetChapterCloByCloId);
// router.post('/clo-chapter/id_Chapters', CLO_CHAPTER.GetChapterCloByCloIds);
module.exports = router;
