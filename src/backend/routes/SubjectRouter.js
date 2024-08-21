const express = require('express');
const SubjectController = require('../controllers/SubjectController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Subjects
 *     description: Operations related to subject management
 */
// get: /subjects
/**
 * @openapi
 * /api/admin/subjects:
 *   get:
 *     summary: Get a list of subjects with optional filtering
 *     description: Returns a list of subjects based on optional filtering parameters. You can filter subjects by teacher ID, deletion status, or course ID.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teacher_id
 *         in: query
 *         description: Filter subjects by teacher ID
 *         required: false
 *         schema:
 *           type: integer
 *       - name: isDelete
 *         in: query
 *         description: Filter subjects by deletion status (true or false)
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: course_id
 *         in: query
 *         description: Find subject based on course ID. If provided, will return the subject associated with the given course ID.
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of subjects matching the filtering criteria, with associated CLOs and Chapters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subject_id:
 *                     type: integer
 *                   teacher_id:
 *                     type: integer
 *                   isDelete:
 *                     type: boolean
 *                   CLO:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         clo_id:
 *                           type: integer
 *                         cloName:
 *                           type: string
 *                         description:
 *                           type: string
 *                   CHAPTER:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         chapter_id:
 *                           type: integer
 *                         chapterName:
 *                           type: string
 *                         description:
 *                           type: string
 *       404:
 *         description: Subject not found or no subjects match the criteria.
 *       500:
 *         description: Server error
 */
// get: /subject/:id
/**
 * @openapi
 * /api/admin/subject/{id}:
 *   get:
 *     summary: Get details of a subject by ID
 *     description: Returns details of a subject, with optional inclusion of CLOs, Chapters, or only their IDs.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the subject
 *         required: true
 *         schema:
 *           type: integer
 *       - name: include_clos
 *         in: query
 *         description: Whether to include CLOs in the response
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - name: include_chapters
 *         in: query
 *         description: Whether to include Chapters in the response
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - name: only_clo_ids
 *         in: query
 *         description: Whether to return only CLO IDs
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - name: only_chapter_ids
 *         in: query
 *         description: Whether to return only Chapter IDs
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: Details of the subject, including optional CLOs, Chapters, or their IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   type: object
 *                   properties:
 *                     subject_id:
 *                       type: integer
 *                     teacher_id:
 *                       type: integer
 *                     isDelete:
 *                       type: boolean
 *                 clos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clo_id:
 *                         type: integer
 *                       cloName:
 *                         type: string
 *                       description:
 *                         type: string
 *                 chapters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chapter_id:
 *                         type: integer
 *                       chapterName:
 *                         type: string
 *                       description:
 *                         type: string
 *                 clo_ids:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 chapter_ids:
 *                   type: array
 *                   items:
 *                     type: integer
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */
// get: /subject/:id/rubrics
/**
 * @openapi
 * /api/admin/subject/{id}/rubrics:
 *   get:
 *     summary: Get rubrics related to a subject by ID
 *     description: Returns a list of rubrics for a given subject, optionally filtered by teacher ID.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the subject
 *         required: true
 *         schema:
 *           type: integer
 *       - name: teacher_id
 *         in: query
 *         description: Optional teacher ID to filter the rubrics
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of rubrics related to the subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rubric_id:
 *                     type: integer
 *                   rubricName:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isDelete:
 *                     type: boolean
 *       404:
 *         description: Subject or rubrics not found
 *       500:
 *         description: Internal server error
 */
// put: /subject/:id
/**
 * @openapi
 * /api/admin/subject/{id}:
 *   put:
 *     summary: Update an existing subject
 *     description: Updates the details of an existing subject in the system based on the provided subject ID.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the subject to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher_id:
 *                 type: integer
 *               subjectName:
 *                 type: string
 *               subjectCode:
 *                 type: string
 *               description:
 *                 type: string
 *               numberCredits:
 *                 type: integer
 *               numberCreditsTheory:
 *                 type: integer
 *               numberCreditsPractice:
 *                 type: integer
 *               typesubject:
 *                 type: string
 *                 enum:
 *                   - Đại cương
 *                   - Cơ sở ngành
 *                   - Chuyên ngành
 *                   - Thực tập và Đồ án
 *               isDelete:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// delete: /subject/:id
/**
 * @openapi
 * /api/admin/subject/{id}:
 *   delete:
 *     summary: Delete an existing subject
 *     description: Deletes a subject from the system by its ID. This operation also removes related CLOs (Course Learning Objectives), Chapters, and their associations.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the subject to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// post: /subject
/**
 * @openapi
 * /api/admin/subject:
 *   post:
 *     summary: Create a new subject
 *     description: Creates a new subject in the system.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher_id:
 *                 type: integer
 *               subjectName:
 *                 type: string
 *               subjectCode:
 *                 type: string
 *               description:
 *                 type: string
 *               numberCredits:
 *                 type: integer
 *               numberCreditsTheory:
 *                 type: integer
 *               numberCreditsPractice:
 *                 type: integer
 *               typesubject:
 *                 type: string
 *                 enum:
 *                   - Đại cương
 *                   - Cơ sở ngành
 *                   - Chuyên ngành
 *                   - Thực tập và Đồ án
 *               isDelete:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject_id:
 *                   type: integer
 *                 teacher_id:
 *                   type: integer
 *                 subjectName:
 *                   type: string
 *                 subjectCode:
 *                   type: string
 *                 description:
 *                   type: string
 *                 numberCredits:
 *                   type: integer
 *                 numberCreditsTheory:
 *                   type: integer
 *                 numberCreditsPractice:
 *                   type: integer
 *                 typesubject:
 *                   type: string
 *                   enum:
 *                     - Đại cương
 *                     - Cơ sở ngành
 *                     - Chuyên ngành
 *                     - Thực tập và Đồ án
 *                 isDelete:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Internal server error
 */
// get: /subjects/isDelete/false
/**
 * @openapi
 * /api/admin/subjects/isDelete/false:
 *   get:
 *     summary: Get non-deleted subjects
 *     description: Retrieves a list of subjects that are not marked as deleted.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of subjects that are not deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subject_id:
 *                     type: integer
 *                   teacher_id:
 *                     type: integer
 *                   subjectName:
 *                     type: string
 *                   subjectCode:
 *                     type: string
 *                   description:
 *                     type: string
 *                   numberCredits:
 *                     type: integer
 *                   numberCreditsTheory:
 *                     type: integer
 *                   numberCreditsPractice:
 *                     type: integer
 *                   typesubject:
 *                     type: string
 *                     enum:
 *                       - Đại cương
 *                       - Cơ sở ngành
 *                       - Chuyên ngành
 *                       - Thực tập và Đồ án
 *                   isDelete:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// get: /subjects/isDelete/true
/**
 * @openapi
 * /api/admin/subjects/isDelete/true:
 *   get:
 *     summary: Get deleted subjects
 *     description: Retrieves a list of subjects that are marked as deleted.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of subjects that are deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subject_id:
 *                     type: integer
 *                   teacher_id:
 *                     type: integer
 *                   subjectName:
 *                     type: string
 *                   subjectCode:
 *                     type: string
 *                   description:
 *                     type: string
 *                   numberCredits:
 *                     type: integer
 *                   numberCreditsTheory:
 *                     type: integer
 *                   numberCreditsPractice:
 *                     type: integer
 *                   typesubject:
 *                     type: string
 *                     enum:
 *                       - Đại cương
 *                       - Cơ sở ngành
 *                       - Chuyên ngành
 *                       - Thực tập và Đồ án
 *                   isDelete:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// delete: /subjects/multiple
/**
 * @openapi
 * /api/admin/subjects/multiple:
 *   delete:
 *     summary: Delete multiple subjects
 *     description: Deletes multiple subjects from the system based on an array of subject IDs. This operation also removes related CLOs (Course Learning Objectives), Chapters, and their associations.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: subject_id
 *         in: query
 *         description: Comma-separated list of subject IDs to delete
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *           collectionFormat: csv
 *     responses:
 *       200:
 *         description: Successfully deleted multiple subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: One or more subjects not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// put/subjects/softDelete
/**
 * @openapi
 * /api/admin/subjects/softDelete:
 *   put:
 *     summary: Soft delete multiple subjects
 *     description: Toggles the soft delete status for multiple subjects. If a subject is marked as deleted, it will be restored, and vice versa.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
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
 *                   subject_id:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: List of subject IDs to toggle soft delete status
 *                     example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Successfully toggled soft delete statuses of subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedsubjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subject_id:
 *                         type: integer
 *                       isDelete:
 *                         type: boolean
 *       400:
 *         description: Bad request, no subject IDs provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: One or more subjects not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// put: /subject/:id/softDelete
/**
 * @openapi
 * /api/admin/subject/{id}/softDelete:
 *   put:
 *     summary: Toggle soft delete status of a subject by ID
 *     description: Toggles the soft delete status of a specific subject identified by its ID. If the subject is marked as deleted, it will be restored, and vice versa.
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the subject to toggle soft delete status
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully toggled the soft delete status of the subject
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Subject not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// get: /subject/templates/post
/**
 * @openapi
 * /api/admin/subject/templates/post:
 *   get:
 *     summary: Get Excel template for adding subjects
 *     description: Downloads an Excel template file that can be used for posting new subjects. The template includes columns for subject details.
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: Excel template file for adding subjects
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


router.get('/subjects',ensureAuthenticated, SubjectController.getSubjects);
router.get('/subject/:id', ensureAuthenticated, SubjectController.getByID);
router.get('/subject/:id/rubrics', ensureAuthenticated, SubjectController.getRubricsBySubjectId);
router.put('/subject/:id', ensureAuthenticated, SubjectController.update);
router.delete('/subject/:id', ensureAuthenticated, SubjectController.delete);
router.post('/subject', ensureAuthenticated, SubjectController.create);
router.get('/subjects/isDelete/false', ensureAuthenticated, SubjectController.isDeleteTofalse);
router.get('/subjects/isDelete/true', ensureAuthenticated, SubjectController.isDeleteTotrue);
router.delete('/subjects/multiple', ensureAuthenticated, SubjectController.deleteMultiple);
router.put('/subjects/softDelete', ensureAuthenticated, SubjectController.softDeleteMultiple);
router.put('/subject/:id/softDelete', ensureAuthenticated, SubjectController.toggleSoftDeleteById);
router.get('/subject/templates/post', ensureAuthenticated, SubjectController.getFormPost);
router.post('/subject/templates/update', ensureAuthenticated, SubjectController.getFormUpdate);

// router.get('/subjects', SubjectController.index);
// router.get('/subjects/teacher/:teacher_id', SubjectController.isDeleteTofalseByteacher);
// router.get('/subjects/archive/teacher/:teacher_id', SubjectController.isDeleteTotrueByteacher);
// router.get('/subject/getSubjectIdByCourseId/:course_id', SubjectController.getByCourseId);
// router.get('/subject/:id/find-clo-ids', SubjectController.getArrayIDCloBySubjectId);
// router.get('/subject/:id/find-chapter-ids', SubjectController.getArrayIDChapterBySubjectId);
// router.get('/subject/:subject_id/rubrics', SubjectController.getByrubricsbySubjectId);
// router.get('/subject/:subject_id/rubrics/teacher/:teacher_id', SubjectController.getByrubricsbySubjectIdTeacherId);
module.exports = router;