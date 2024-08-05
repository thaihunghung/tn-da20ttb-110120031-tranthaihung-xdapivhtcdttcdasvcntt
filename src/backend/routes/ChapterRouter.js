const express = require('express');
const ChapterController = require('../controllers/ChapterController');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Chapters
 *     description: Operations related to Chapters management
 */
/**
 * @openapi
 * /api/admin/chapters:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: Retrieve all chapters or chapters by subject ID
 *     description: Retrieves all chapters or filters chapters by subject ID and deletion status.
 *     parameters:
 *       - in: query
 *         name: subject_id
 *         schema:
 *           type: integer
 *         description: ID of the subject to filter chapters by
 *       - in: query
 *         name: isDelete
 *         schema:
 *           type: boolean
 *         description: Whether to include chapters marked as deleted
 *     responses:
 *       '200':
 *         description: Successfully retrieved chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       '404':
 *         description: No chapters found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/chapter:
 *   post:
 *     tags:
 *       - Chapters
 *     summary: Create a new chapter
 *     description: Creates a new chapter with the provided data.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChapterInput'
 *     responses:
 *       '201':
 *         description: Successfully created new chapter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/chapter/{id}:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: Retrieve a chapter by ID
 *     description: Retrieves a single chapter by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chapter to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved chapter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       '404':
 *         description: Chapter not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/chapter/{id}:
 *   put:
 *     tags:
 *       - Chapters
 *     summary: Update a chapter by ID
 *     description: Updates the details of a chapter by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chapter to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChapterInput'
 *     responses:
 *       '200':
 *         description: Successfully updated chapter
 *       '404':
 *         description: Chapter not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/admin/chapter/{id}:
 *   delete:
 *     tags:
 *       - Chapters
 *     summary: Delete a chapter by ID
 *     description: Deletes a chapter by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chapter to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted chapter
 *       '404':
 *         description: Chapter not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         chapter_id:
 *           type: integer
 *           example: 1
 *         subject_id:
 *           type: integer
 *           example: 101
 *         chapter_name:
 *           type: string
 *           example: "Introduction to AI"
 *         isDelete:
 *           type: boolean
 *           example: false
 *     ChapterInput:
 *       type: object
 *       properties:
 *         subject_id:
 *           type: integer
 *           example: 101
 *         chapter_name:
 *           type: string
 *           example: "Introduction to AI"
 *         isDelete:
 *           type: boolean
 *           example: false
 *       required:
 *         - subject_id
 *         - chapter_name
 */

/**
 * @openapi
 * /api/admin/chapters/multiple:
 *   delete:
 *     tags:
 *       - Chapters
 *     summary: Delete multiple chapters
 *     description: Deletes multiple chapters and related data based on chapter IDs.
 *     parameters:
 *       - in: query
 *         name: chapter_id
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: List of chapter IDs to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted multiple chapters
 *       '500':
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/chapters/isDelete/true:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: Retrieve chapters marked as deleted
 *     description: Retrieves chapters where `isDelete` is `true`.
 *     responses:
 *       '200':
 *         description: Successfully retrieved chapters marked as deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       '404':
 *         description: No chapters found
 *       '500':
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/chapters/isDelete/false:
 *   get:
 *     tags:
 *       - Chapters
 *     summary: Retrieve active chapters
 *     description: Retrieves chapters where `isDelete` is `false`.
 *     responses:
 *       '200':
 *         description: Successfully retrieved active chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       '404':
 *         description: No chapters found
 *       '500':
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/chapters/softDelete:
 *   put:
 *     tags:
 *       - Chapters
 *     summary: Soft delete multiple chapters
 *     description: Toggles the `isDelete` status for multiple chapters.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapter_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *             required:
 *               - chapter_id
 *     responses:
 *       '200':
 *         description: Successfully toggled delete status for multiple chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedChapters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chapter_id:
 *                         type: integer
 *                       isDelete:
 *                         type: boolean
 *       '400':
 *         description: No chapter IDs provided
 *       '404':
 *         description: One or more chapters not found
 *       '500':
 *         description: Server error
 */

/**
 * @openapi
 * /api/admin/chapter/{id}/softDelete:
 *   put:
 *     tags:
 *       - Chapters
 *     summary: Toggle soft delete status for a chapter
 *     description: Toggles the `isDelete` status of a single chapter by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chapter to toggle delete status
 *     responses:
 *       '200':
 *         description: Successfully toggled delete status
 *       '404':
 *         description: Chapter not found
 *       '500':
 *         description: Server error
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         chapter_id:
 *           type: integer
 *           example: 1
 *         subject_id:
 *           type: integer
 *           example: 101
 *         chapter_name:
 *           type: string
 *           example: "Introduction to AI"
 *         isDelete:
 *           type: boolean
 *           example: false
 *     ChapterInput:
 *       type: object
 *       properties:
 *         subject_id:
 *           type: integer
 *           example: 101
 *         chapter_name:
 *           type: string
 *           example: "Introduction to AI"
 *         isDelete:
 *           type: boolean
 *           example: false
 *       required:
 *         - subject_id
 *         - chapter_name
 */

router.get('/chapters', ChapterController.index);
router.post('/chapter', ChapterController.create);
router.get('/chapter/:id', ChapterController.getByID);
router.put('/chapter/:id', ChapterController.update);
router.delete('/chapter/:id', ChapterController.delete);

router.delete('/chapters/multiple', ChapterController.deleteMultiple);
router.get('/chapters/isDelete/true', ChapterController.isDeleteTotrue);
router.get('/chapters/isDelete/false', ChapterController.isDeleteTofalse);
router.put('/chapters/softDelete', ChapterController.softDeleteMultiple);
router.put('/chapter/:id/softDelete', ChapterController.toggleSoftDeleteById);

router.get('/chapter/templates/post', ChapterController.getFormPost);
router.post('/chapter/templates/update', ChapterController.getFormUpdate);


// router.get('/chapter/subject/:subject_id', ChapterController.GetChapterBySubjectId);
// router.get('/chapter/archive/subject/:subject_id', ChapterController.GetChapterArchiveBySubjectId);
module.exports = router;
