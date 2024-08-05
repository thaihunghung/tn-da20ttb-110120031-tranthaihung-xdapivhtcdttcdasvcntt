const express = require('express');
const router = express.Router();
const assessmentsController = require('../controllers/AssessmentsController');

/**
 * @openapi
 * tags:
 *   - name: assessments
 *     description: Operations related to assessment management
 */

// get: /assessment
/**
 * @openapi
 * /api/admin/assessment:
 *   get:
 *     summary: Get a list of all assessments
 *     description: Returns a list of all assessments, or filtered by teacher_id, description, and/or isDelete if provided.
 *     tags: [assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teacher_id
 *         in: query
 *         description: Filter assessments by teacher ID.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 123
 *       - name: description
 *         in: query
 *         description: Filter assessments by description.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Test description"
 *       - name: isDelete
 *         in: query
 *         description: Filter assessments by delete status.
 *         required: false
 *         schema:
 *           type: boolean
 *           example: false
 *     responses:
 *       200:
 *         description: A list of assessments.
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
 *                       course_id:
 *                         type: integer
 *                         description: The ID of the course.
 *                         example: 1
 *                       description:
 *                         type: string
 *                         description: Description of the assessment.
 *                         example: "Test description"
 *                       assessmentCount:
 *                         type: integer
 *                         description: Total number of assessments.
 *                         example: 10
 *                       studentCount:
 *                         type: integer
 *                         description: Number of students.
 *                         example: 50
 *                       zeroScoreCount:
 *                         type: integer
 *                         description: Number of assessments with a zero score.
 *                         example: 5
 *                       status:
 *                         type: number
 *                         format: float
 *                         description: Percentage of zero score assessments.
 *                         example: 50
 *       404:
 *         description: No assessments found.
 *       500:
 *         description: Server error
 */
// get: /assessment/:id/items
/**
 * @openapi
 * /api/admin/assessment/{id}/items:
 *   get:
 *     summary: Get details of a specific assessment with related rubric items and assessment items
 *     description: Fetches a specific assessment by ID, including associated course details, student details, rubric details, rubric items, and assessment items.
 *     tags: [assessments]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the assessment to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the assessment with associated rubric items and assessment items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment_id:
 *                   type: integer
 *                   description: The ID of the assessment.
 *                   example: 1
 *                 course:
 *                   type: object
 *                   properties:
 *                     courseCode:
 *                       type: string
 *                       description: Code of the course.
 *                       example: CS101
 *                     courseName:
 *                       type: string
 *                       description: Name of the course.
 *                       example: Introduction to Computer Science
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentCode:
 *                         type: string
 *                         description: Code of the student.
 *                         example: S123
 *                       name:
 *                         type: string
 *                         description: Name of the student.
 *                         example: Alice Johnson
 *                       class:
 *                         type: object
 *                         properties:
 *                           classNameShort:
 *                             type: string
 *                             description: Short name of the class.
 *                             example: CS-A
 *                 rubric:
 *                   type: object
 *                   properties:
 *                     rubric_id:
 *                       type: integer
 *                       description: The ID of the rubric.
 *                       example: 1
 *                     isDelete:
 *                       type: boolean
 *                       description: Status of the rubric (deleted or not).
 *                       example: false
 *                     rubricItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rubricsItem_id:
 *                             type: integer
 *                             description: The ID of the rubric item.
 *                             example: 1
 *                           clo:
 *                             type: object
 *                             properties:
 *                               clo_id:
 *                                 type: integer
 *                                 description: The ID of the CLO.
 *                                 example: 1
 *                               cloName:
 *                                 type: string
 *                                 description: Name of the CLO.
 *                                 example: CLO1
 *                               description:
 *                                 type: string
 *                                 description: Description of the CLO.
 *                                 example: CLO1 Description
 *                           chapter:
 *                             type: object
 *                             properties:
 *                               chapter_id:
 *                                 type: integer
 *                                 description: The ID of the chapter.
 *                                 example: 1
 *                               chapterName:
 *                                 type: string
 *                                 description: Name of the chapter.
 *                                 example: Chapter 1
 *                               description:
 *                                 type: string
 *                                 description: Description of the chapter.
 *                                 example: Chapter 1 Description
 *                           plo:
 *                             type: object
 *                             properties:
 *                               plo_id:
 *                                 type: integer
 *                                 description: The ID of the PLO.
 *                                 example: 1
 *                               ploName:
 *                                 type: string
 *                                 description: Name of the PLO.
 *                                 example: PLO1
 *                               description:
 *                                 type: string
 *                                 description: Description of the PLO.
 *                                 example: PLO1 Description
 *                           assessmentItems:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 assessment_item_id:
 *                                   type: integer
 *                                   description: The ID of the assessment item.
 *                                   example: 1
 *                                 score:
 *                                   type: integer
 *                                   description: Score for the assessment item.
 *                                   example: 85
 *       404:
 *         description: Assessment or related data not found.
 *       500:
 *         description: Server error
 */
// post: /assessment
/**
 * @openapi
 * /api/admin/assessment:
 *   post:
 *     summary: Create a new assessment
 *     description: Creates a new assessment record in the database.
 *     tags: [assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher_id:
 *                 type: integer
 *                 description: ID of the teacher associated with the assessment.
 *                 example: 1
 *               student_id:
 *                 type: integer
 *                 description: ID of the student being assessed.
 *                 example: 1
 *               rubric_id:
 *                 type: integer
 *                 description: ID of the rubric used for the assessment.
 *                 example: 1
 *               course_id:
 *                 type: integer
 *                 description: ID of the course in which the assessment is conducted.
 *                 example: 1
 *               totalScore:
 *                 type: number
 *                 format: double
 *                 description: Total score given in the assessment.
 *                 example: 85.50
 *               description:
 *                 type: string
 *                 description: Description of the assessment.
 *                 example: Mid-term exam
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the assessment.
 *                 example: 2024-06-10
 *               place:
 *                 type: string
 *                 description: Place where the assessment took place.
 *                 example: Room 101
 *     responses:
 *       200:
 *         description: The newly created assessment record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment_id:
 *                   type: integer
 *                   description: The ID of the newly created assessment.
 *                   example: 1
 *                 teacher_id:
 *                   type: integer
 *                   description: ID of the teacher associated with the assessment.
 *                   example: 1
 *                 student_id:
 *                   type: integer
 *                   description: ID of the student being assessed.
 *                   example: 1
 *                 rubric_id:
 *                   type: integer
 *                   description: ID of the rubric used for the assessment.
 *                   example: 1
 *                 course_id:
 *                   type: integer
 *                   description: ID of the course in which the assessment is conducted.
 *                   example: 1
 *                 totalScore:
 *                   type: number
 *                   format: double
 *                   description: Total score given in the assessment.
 *                   example: 85.50
 *                 description:
 *                   type: string
 *                   description: Description of the assessment.
 *                   example: Mid-term exam
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date of the assessment.
 *                   example: 2024-06-10
 *                 place:
 *                   type: string
 *                   description: Place where the assessment took place.
 *                   example: Room 101
 *                 isDelete:
 *                   type: integer
 *                   description: Status of the assessment (deleted or not).
 *                   example: 0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the assessment was created.
 *                   example: 2024-07-15T10:00:00Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the assessment was last updated.
 *                   example: 2024-07-15T10:00:00Z
 *       500:
 *         description: Server error
 */
// get: /assessment/:id
/**
 * @openapi
 * /api/admin/assessment/{id}:
 *   get:
 *     summary: Get a specific assessment by ID
 *     description: Returns a specific assessment record based on the provided assessment ID.
 *     tags: [assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assessment to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: The requested assessment record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment_id:
 *                   type: integer
 *                   description: The ID of the assessment.
 *                   example: 1
 *                 teacher_id:
 *                   type: integer
 *                   description: ID of the teacher associated with the assessment.
 *                   example: 1
 *                 student_id:
 *                   type: integer
 *                   description: ID of the student being assessed.
 *                   example: 1
 *                 rubric_id:
 *                   type: integer
 *                   description: ID of the rubric used for the assessment.
 *                   example: 1
 *                 course_id:
 *                   type: integer
 *                   description: ID of the course in which the assessment is conducted.
 *                   example: 1
 *                 totalScore:
 *                   type: number
 *                   format: double
 *                   description: Total score given in the assessment.
 *                   example: 85.50
 *                 description:
 *                   type: string
 *                   description: Description of the assessment.
 *                   example: Mid-term exam
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Date of the assessment.
 *                   example: 2024-07-15T00:00:00Z
 *                 place:
 *                   type: string
 *                   description: Place where the assessment took place.
 *                   example: Room 101
 *                 isDelete:
 *                   type: tinyint
 *                   description: Status of the assessment (deleted or not).
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the assessment was created.
 *                   example: 2024-07-15T10:00:00Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the assessment was last updated.
 *                   example: 2024-07-15T10:00:00Z
 *       404:
 *         description: Assessment not found
 *       500:
 *         description: Server error
 */
// put: /assessment/:id
/**
 * @openapi
 * /api/admin/assessment/{id}:
 *   put:
 *     summary: Update a specific assessment by ID
 *     description: Updates the details of a specific assessment record based on the provided assessment ID.
 *     tags: [assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assessment to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher_id:
 *                 type: integer
 *                 description: ID of the teacher associated with the assessment.
 *                 example: 1
 *               student_id:
 *                 type: integer
 *                 description: ID of the student being assessed.
 *                 example: 1
 *               rubric_id:
 *                 type: integer
 *                 description: ID of the rubric used for the assessment.
 *                 example: 1
 *               course_id:
 *                 type: integer
 *                 description: ID of the course in which the assessment is conducted.
 *                 example: 1
 *               totalScore:
 *                 type: number
 *                 format: double
 *                 description: Total score given in the assessment.
 *                 example: 10.00
 *               description:
 *                 type: string
 *                 description: Description of the assessment.
 *                 example: Kết thúc môn
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the assessment.
 *                 example: 2024-06-10
 *               place:
 *                 type: string
 *                 description: Place where the assessment took place.
 *                 example: Auditorium A
 *               isDelete:
 *                 type: tinyint
 *                 description: Status of the assessment (deleted or not).
 *                 example: false
 *     responses:
 *       200:
 *         description: The updated assessment record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assessment_id:
 *                   type: integer
 *                   description: The ID of the assessment.
 *                   example: 1
 *                 teacher_id:
 *                   type: integer
 *                   description: ID of the teacher associated with the assessment.
 *                   example: 1
 *                 student_id:
 *                   type: integer
 *                   description: ID of the student being assessed.
 *                   example: 1
 *                 rubric_id:
 *                   type: integer
 *                   description: ID of the rubric used for the assessment.
 *                   example: 1
 *                 course_id:
 *                   type: integer
 *                   description: ID of the course in which the assessment is conducted.
 *                   example: 1
 *                 totalScore:
 *                   type: number
 *                   format: double
 *                   description: Total score given in the assessment.
 *                   example: 10.00
 *                 description:
 *                   type: string
 *                   description: Description of the assessment.
 *                   example: Kết thúc môn
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date of the assessment.
 *                   example: 2024-06-10
 *                 place:
 *                   type: string
 *                   description: Place where the assessment took place.
 *                   example: Auditorium A
 *                 isDelete:
 *                   type: tinyint
 *                   description: Status of the assessment (deleted or not).
 *                   example: false
 *       404:
 *         description: Assessment not found
 *       500:
 *         description: Server error
 */
// delete: /assessment/:id
/**
 * @openapi
 * /api/admin/assessment/{id}:
 *   delete:
 *     summary: Delete a specific assessment by ID
 *     description: Deletes a specific assessment record based on the provided assessment ID. The record is soft deleted if the `isDelete` field is used.
 *     tags: [assessments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assessment to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the assessment.
 *       404:
 *         description: Assessment not found
 *       500:
 *         description: Server error
 */
// put: /assessments/softDeleteByDescription
/**
 * @openapi
 * /api/admin/assessments/softDeleteByDescription:
 *   put:
 *     summary: Toggle soft delete status of assessments by descriptions
 *     description: Toggles the `isDelete` status of assessments based on the provided list of descriptions.
 *     tags: [assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "100000 - IT02_Thống kê và phân tích dữ liệu DA20TTB_d_2018-1-1"
 *               isDelete:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - descriptions
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
 *                   example: "Toggled isDelete status"
 *                 updated:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assessment_id:
 *                         type: integer
 *                         example: 1025
 *                       isDelete:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: Descriptions array is required and cannot be empty.
 *       404:
 *         description: No assessments found for the provided descriptions.
 *       500:
 *         description: Server error
 */
// get: /assessment/isDelete/true
/**
 * @openapi
 * /api/admin/assessment/isDelete/true:
 *   get:
 *     summary: Get all assessments that are marked as deleted
 *     description: Retrieves all assessments where `isDelete` is set to `true`.
 *     tags: [assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of assessments that are marked as deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   assessment_id:
 *                     type: integer
 *                   teacher_id:
 *                     type: integer
 *                   student_id:
 *                     type: integer
 *                   rubric_id:
 *                     type: integer
 *                   course_id:
 *                     type: integer
 *                   totalScore:
 *                     type: number
 *                     format: double
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   place:
 *                     type: string
 *                   isDelete:
 *                     type: integer
 *       500:
 *         description: Server error
 */
// get: /assessment/isDelete/false
/**
 * @openapi
 * /api/admin/assessment/isDelete/false:
 *   get:
 *     summary: Get all assessments that are not marked as deleted
 *     description: Retrieves all assessments where `isDelete` is set to `false`.
 *     tags: [assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of assessments that are not marked as deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   assessment_id:
 *                     type: integer
 *                   teacher_id:
 *                     type: integer
 *                   student_id:
 *                     type: integer
 *                   rubric_id:
 *                     type: integer
 *                   course_id:
 *                     type: integer
 *                   totalScore:
 *                     type: number
 *                     format: double
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   place:
 *                     type: string
 *                   isDelete:
 *                     type: integer
 *       500:
 *         description: Server error
 */
// patch: /assessments/updateByDescription
/**
 * @openapi
 * /api/admin/assessments/updateByDescription:
 *   patch:
 *     summary: Update assessments by description
 *     description: Updates assessments that match the given description with the provided update data.
 *     tags: [assessments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description to match assessments.
 *               updateData:
 *                 type: object
 *                 description: The data to update matching assessments with.
 *                 properties:
 *                   rubric_id:
 *                     type: integer
 *                   course_id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   place:
 *                     type: string
 *     responses:
 *       200:
 *         description: Successfully updated assessments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rubric_id:
 *                     type: integer
 *                   course_id:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   place:
 *                     type: string
 *       404:
 *         description: No assessments found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
/**
 * @openapi
 * /api/admin/assessments/deleteByDescription:
 *   delete:
 *     summary: Delete assessments by descriptions
 *     description: Deletes the assessments based on the provided list of descriptions.
 *     tags: [assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "100000 - IT02_Thống kê và phân tích dữ liệu DA20TTB_d_2018-1-1"
 *             required:
 *               - descriptions
 *     responses:
 *       200:
 *         description: Successfully deleted the assessments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully deleted assessments"
 *                 deletedCount:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Descriptions array is required and cannot be empty.
 *       404:
 *         description: No assessments found for the provided descriptions.
 *       500:
 *         description: Server error
 */



//cập nhật mới 
router.get('/assessment/checkTeacher', assessmentsController.checkTeacherInAssessment);


router.get('/assessment', assessmentsController.getAssessments);


router.patch('/assessment/:id/totalScore', assessmentsController.updateStotalScore);
router.get('/assessment/:id', assessmentsController.getByID);
router.get('/assessment/:id/items', assessmentsController.GetitemsByID);
router.post('/assessment', assessmentsController.create);

router.put('/assessment/:id', assessmentsController.update);
router.delete('/assessment/:id', assessmentsController.delete);

router.delete('/assessments/multiple', assessmentsController.deleteMultiple);

router.delete('/assessment/teacher/:teacherId', assessmentsController.deleteByTeacherId);







// router.get('/assessment/isDelete/true', assessmentsController.isDeleteTotrue);
// router.get('/assessment/isDelete/false', assessmentsController.isDeleteTofalse);


// router.put('/assessments/softDeleteByDescription', assessmentsController.toggleSoftDeleteByGeneralDescription);
// router.patch('/assessments/updateByDescription', assessmentsController.updateByDescription);
// router.delete('/assessments/deleteByDescription', assessmentsController.deleteByDescription);



//router.put('/assessment/:id/updateStotalScore', assessmentsController.updateStotalScore);
// router.get('/assessments/teacher/:teacher_id', assessmentsController.GetByUser);
// router.get('/assessments/:description/teacher/:teacher_id', assessmentsController.GetByDescriptionByUser);
module.exports = router; 