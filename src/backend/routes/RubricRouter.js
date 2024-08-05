const express = require('express');
const RubricController = require('../controllers/RubricController');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Rubrics
 *     description: Operations related to Rubric-items management
 */
// get: /rubrics
/**
 * @openapi
 * /api/admin/rubrics:
 *   get:
 *     summary: Get a list of all rubrics
 *     description: Retrieves a list of all rubrics from the system.
 *     tags: [Rubrics]
 *     responses:
 *       200:
 *         description: A list of rubrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Rubric'
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
// post: /rubric
/**
 * @openapi
 * /api/admin/rubric:
 *   post:
 *     summary: Create a new rubric
 *     description: Creates a new rubric in the system with the provided details.
 *     tags: [Rubrics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: The rubric object that needs to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricInput'
 *     responses:
 *       201:
 *         description: Rubric created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rubric'
 *       400:
 *         description: Bad request - invalid input data
 *       500:
 *         description: Internal server error
 */
// put: /rubric/:id
/**
 * @openapi
 * /api/admin/rubric/{id}:
 *   put:
 *     summary: Update a rubric by ID
 *     description: Updates an existing rubric's details using the provided ID.
 *     tags: [Rubrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the rubric to be updated
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: The rubric data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricInput'
 *     responses:
 *       200:
 *         description: Rubric updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Rubric not found
 *       500:
 *         description: Internal server error
 */
// get: /rubric/:id
/**
 * @openapi
 * /api/admin/rubric/{id}:
 *   get:
 *     summary: Get a rubric by ID
 *     description: Retrieves a rubric by its ID.
 *     tags: [Rubrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the rubric to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rubric found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rubric'
 *       404:
 *         description: Rubric not found
 *       500:
 *         description: Internal server error
 */
// get: /rubrics/isDelete/true
/**
 * @openapi
 * /api/admin/rubrics/isDelete/true:
 *   get:
 *     summary: Get all rubrics marked as deleted
 *     description: Retrieves all rubrics that are marked as deleted (isDelete=true).
 *     tags: [Rubrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of deleted rubrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rubric'
 *       500:
 *         description: Internal server error
 */
// get: /rubrics/isDelete/false
/**
 * @openapi
 * /api/admin/rubrics/isDelete/false:
 *   get:
 *     summary: Get all rubrics not marked as deleted
 *     description: Retrieves all rubrics that are not marked as deleted (isDelete=false).
 *     tags: [Rubrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of rubrics that are not deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rubric'
 *       500:
 *         description: Internal server error
 */
// get: /rubric/:id/items
/**
 * @openapi
 * /api/admin/rubric/{id}/items:
 *   get:
 *     tags: [Rubrics]
 *     summary: Get items by rubric ID
 *     description: Retrieve all items.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier of the rubric.
 *         schema:
 *           type: integer
 *       - name: isDelete
 *         in: query
 *         required: false
 *         description: Filter items by deletion status.
 *         schema:
 *           type: boolean
 *       - name: include_clos
 *         in: query
 *         required: false
 *         description: Include CLO data in the response.
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Successfully retrieved rubric items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rubric:
 *                   type: object
 *                   properties:
 *                     rubric_id:
 *                       type: integer
 *                       description: Unique identifier for the rubric
 *                     subject_id:
 *                       type: integer
 *                       description: ID of the subject associated with the rubric
 *                     teacher_id:
 *                       type: integer
 *                       description: ID of the teacher who created the rubric
 *                     rubricName:
 *                       type: string
 *                       description: Name of the rubric
 *                     comment:
 *                       type: string
 *                       description: Additional comments about the rubric
 *                     isDelete:
 *                       type: boolean
 *                       description: Deletion status of the rubric
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the rubric was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the rubric was last updated
 *                     rubricItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rubricsItem_id:
 *                             type: integer
 *                             description: Unique identifier for the rubric item
 *                           chapter_id:
 *                             type: integer
 *                             description: ID of the chapter associated with the rubric item
 *                           clo_id:
 *                             type: integer
 *                             description: ID of the CLO associated with the rubric item
 *                           rubric_id:
 *                             type: integer
 *                             description: ID of the rubric associated with the rubric item
 *                           plo_id:
 *                             type: integer
 *                             description: ID of the PLO associated with the rubric item
 *                           description:
 *                             type: string
 *                             description: Description of the rubric item
 *                           maxScore:
 *                             type: number
 *                             format: double
 *                             description: Maximum score for the rubric item
 *                           stt:
 *                             type: integer
 *                             description: Sort order of the rubric item
 *                           isDelete:
 *                             type: boolean
 *                             description: Deletion status of the rubric item
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the rubric item was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the rubric item was last updated
 *                     CloData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           clo_id:
 *                             type: integer
 *                             description: Unique identifier for the CLO
 *                           cloName:
 *                             type: string
 *                             description: Name of the CLO
 *                           description:
 *                             type: string
 *                             description: Description of the CLO
 *                           isDelete:
 *                             type: boolean
 *                             description: Deletion status of the CLO
 *                           subject_id:
 *                             type: integer
 *                             description: ID of the subject associated with the CLO
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the CLO was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the CLO was last updated
 *       '404':
 *         description: Rubric not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

// get: /rubrics/checkScore
/**
 * @openapi
 * /api/admin/rubrics/checkScore:
 *   get:
 *     tags: [Rubrics]
 *     summary: Get rubrics with their total score
 *     description: Retrieve all rubrics for a specific teacher and calculate the total score for each rubric based on rubric items. Optionally filter by deletion status.
 *     parameters:
 *       - name: teacher_id
 *         in: query
 *         required: true
 *         description: ID of the teacher to filter rubrics
 *         schema:
 *           type: integer
 *       - name: isDelete
 *         in: query
 *         required: false
 *         description: Filter rubrics by deletion status.
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Successfully retrieved rubrics with their total scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rubric:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rubric_id:
 *                         type: integer
 *                         description: Unique identifier for the rubric
 *                       subject_id:
 *                         type: integer
 *                         description: ID of the subject associated with the rubric
 *                       teacher_id:
 *                         type: integer
 *                         description: ID of the teacher who created the rubric
 *                       rubricName:
 *                         type: string
 *                         description: Name of the rubric
 *                       comment:
 *                         type: string
 *                         description: Additional comments about the rubric
 *                       isDelete:
 *                         type: boolean
 *                         description: Deletion status of the rubric
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the rubric was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the rubric was last updated
 *                       RubricItem:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rubric_id:
 *                               type: integer
 *                               description: Unique identifier for the rubric
 *                             total_score:
 *                               type: number
 *                               format: double
 *                               description: Total score of the rubric
 *       '400':
 *         description: Bad request, possibly due to missing or invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// put: /rubrics/softDelete
/**
 * @openapi
 * /api/admin/rubrics/softDelete:
 *   put:
 *     tags: [Rubrics]
 *     summary: Soft delete multiple rubrics
 *     description: Toggle the delete status of multiple rubrics by their IDs. If a rubric is not deleted, it will be marked as deleted, and vice versa.
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
 *                   rubric_id:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: List of rubric IDs to toggle delete status
 *     responses:
 *       '200':
 *         description: Successfully toggled the delete statuses of rubrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 updated:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rubric_id:
 *                         type: integer
 *                         description: ID of the rubric
 *                       isDelete:
 *                         type: boolean
 *                         description: Updated delete status of the rubric
 *       '400':
 *         description: Bad request, possibly due to missing or invalid rubric IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '404':
 *         description: Not found, one or more rubrics not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// put: /rubric/:id/softDelete
/**
 * @openapi
 * /api/admin/rubric/{id}/softDelete:
 *   put:
 *     tags: [Rubrics]
 *     summary: Toggle soft delete status of a rubric
 *     description: Toggle the soft delete status of a specific rubric by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the rubric to toggle soft delete status
 *     responses:
 *       '200':
 *         description: Successfully toggled the soft delete status of the rubric
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the new status
 *       '404':
 *         description: Rubric not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// delete: /rubric/:id
/**
 * @openapi
 * /api/admin/rubric/{id}:
 *   delete:
 *     tags: [Rubrics]
 *     summary: Delete a rubric
 *     description: Permanently delete a rubric and its associated rubric items by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the rubric to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted rubric
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '404':
 *         description: Not found, rubric not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// delete: /rubrics/multiple
/**
 * @openapi
 * /api/admin/rubrics/multiple:
 *   delete:
 *     tags: [Rubrics]
 *     summary: Delete multiple rubrics
 *     description: Permanently delete multiple rubrics and their associated rubric items by their IDs.
 *     parameters:
 *       - in: query
 *         name: rubric_id
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Array of rubric IDs to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted multiple rubrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// put: /assessments/softDelete
/**
 * @openapi
 * /api/admin/assessments/softDelete:
 *   put:
 *     summary: Soft delete multiple assessments
 *     description: Toggles the `isDelete` status for multiple assessments based on provided IDs.
 *     tags: [assessments]
 *     requestBody:
 *       required: true
 *       description: The IDs of the assessments to update.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessment_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The IDs of the assessments to update.
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Successfully toggled the delete status of the assessments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "AssessmentModel delete statuses toggled"
 *                 updated:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assessment_id:
 *                         type: integer
 *                         example: 1
 *                       isDelete:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: No assessment IDs provided.
 *       404:
 *         description: One or more assessments not found.
 *       500:
 *         description: Server error
 */

// put: /assessment/:id/softDelete
/**
 * @openapi
 * /api/admin/assessment/{id}/softDelete:
 *   put:
 *     summary: Toggle soft delete status of a specific assessment by ID
 *     description: Toggles the `isDelete` status of a specific assessment based on the provided assessment ID.
 *     tags: [assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assessment to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully toggled the delete status of the assessment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Toggled isDelete status to true"
 *       404:
 *         description: Assessment not found.
 *       500:
 *         description: Server error
 */

router.get('/rubrics', RubricController.index);
router.post('/rubric', RubricController.create);
router.get('/rubric/:id', RubricController.getByID);
router.put('/rubric/:id', RubricController.update);
router.get('/rubrics/isDelete/true', RubricController.isDeleteTotrue);
router.get('/rubrics/isDelete/false', RubricController.isDeleteTofalse);
router.get('/rubric/:id/items', RubricController.getItemsByRubricId);
router.get('/rubrics/checkScore', RubricController.getRubricsForCheckScore);
router.put('/rubrics/softDelete', RubricController.softDeleteMultiple);
router.put('/rubric/:id/softDelete', RubricController.toggleSoftDeleteById);

router.delete('/rubric/:id', RubricController.delete);
router.delete('/rubrics/multiple', RubricController.deleteMultiple);


// router.get('/rubric/:rubric_id/items/isDelete/false', RubricController.GetItemsRubricsByIdRubrics);
// router.get('/rubric/:rubric_id/items/isDelete/true', RubricController.GetItemsRubricsByIdRubricsisDeleteTrue);
// router.get('/rubrics/teacher/:teacher_id/checkScore', RubricController.GetByUserAndCheckScore); 
// router.get('/rubrics/archive/teacher/:teacher_id/checkScore', RubricController.GetisDeleteTotrueByUserAndCheckScore);
module.exports = router;