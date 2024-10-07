const express = require('express');
const RubricItemController = require('../controllers/RubricItemController');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 */
//get: /rubric-items
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * /api/admin/rubric-items:
 *   get:
 *     tags:
 *       - Rubric-items
 *     summary: Get all rubric items
 *     description: Retrieve a list of all rubric items.
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of rubric items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RubricItem'
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
//post: /rubric-item
/**
 * @openapi
 * /rubric-item:
 *   post:
 *     tags:
 *       - Rubric-items
 *     summary: Create a new rubric item
 *     description: Create a new rubric item in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/components/schemas/RubricItem'
 *     responses:
 *       '201':
 *         description: Successfully created a new rubric item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricItem'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
//get: /rubric-item/:id
/**
 * @openapi
 * /api/admin/rubric-item/{id}:
 *   get:
 *     tags:
 *       - Rubric-items
 *     summary: Get a rubric item by ID
 *     description: Retrieve a single rubric item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the rubric item to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved the rubric item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RubricItem'
 *       '404':
 *         description: Rubric item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
//post: /rubric-item/checkScore
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-item/checkScore:
 *   post:
 *     tags:
 *       - Rubric-items
 *     summary: Check and create rubric item
 *     description: Check if the total max score does not exceed 10 and create a new rubric item.
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
 *                     type: integer
 *                     description: The ID of the rubric associated with the rubric item
 *                   chapter_id:
 *                     type: integer
 *                     description: The ID of the chapter associated with the rubric item
 *                   clo_id:
 *                     type: integer
 *                     description: The ID of the CLO associated with the rubric item
 *                   plo_id:
 *                     type: integer
 *                     description: The ID of the PLO associated with the rubric item
 *                   description:
 *                     type: string
 *                     description: Description of the rubric item
 *                   maxScore:
 *                     type: number
 *                     format: double
 *                     description: Maximum score for the rubric item
 *                   stt:
 *                     type: integer
 *                     description: Sort order of the rubric item
 *                   isDelete:
 *                     type: boolean
 *                     description: Trạng thái xóa.
 *     responses:
 *       '201':
 *         description: Rubric item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   $ref: '#/components/schemas/RubricItem'
 *       '400':
 *         description: Failed to save due to total maxScore exceeding 10
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// put: /rubric-item/:id
/**
 * @openapi
 * 
 * /api/admin/rubric-item/{id}:
 *   put:
 *     tags:
 *       - Rubric-items
 *     summary: Update a rubric item by ID
 *     description: Update the details of a rubric item by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the rubric item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RubricItem'
 *     responses:
 *       '200':
 *         description: Successfully updated rubric item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '404':
 *         description: Rubric item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// delete: /rubric-item/:id
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-item/{id}:
 *   delete:
 *     tags:
 *       - Rubric-items
 *     summary: Delete a rubric item by ID
 *     description: Delete a rubric item based on its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the rubric item to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted rubric item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Successfully deleted rubric item
 *       '404':
 *         description: Rubric item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Rubric item not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */
// delete: /rubric-items/multiple
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-items/multiple:
 *   delete:
 *     tags:
 *       - Rubric-items
 *     summary: Delete multiple rubric items
 *     description: Deletes multiple rubric items based on the provided IDs.
 *     parameters:
 *       - in: query
 *         name: rubricsitem_id
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: List of rubric item IDs to be deleted
 *         required: true
 *     responses:
 *       '200':
 *         description: Successfully deleted multiple rubric items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Successfully deleted multiple rubric items
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
 *                   example: Internal server error
 */
// put: /rubric-items/softDelete
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-items/softDelete:
 *   put:
 *     tags:
 *       - Rubric-items
 *     summary: Soft delete multiple rubric items
 *     description: Toggles the soft delete status of multiple rubric items based on their IDs. 
 *                  The soft delete status will be toggled, meaning items will be marked as deleted or restored.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   rubricsitem_id:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: List of rubric item IDs to be soft deleted
 *                     example: [1, 2, 3]
 *             required:
 *               - data
 *     responses:
 *       '200':
 *         description: Successfully toggled the soft delete status of multiple rubric items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: RubricItemModel delete statuses toggled
 *                 updatedRubricItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rubricsitem_id:
 *                         type: integer
 *                       isDelete:
 *                         type: boolean
 *                   description: List of rubric items with updated delete statuses
 *       '400':
 *         description: Bad request due to invalid IDs or exceeding maxScore limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to save total maxScore exceeds 10
 *       '404':
 *         description: One or more rubric items not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: One or more RubricItemModels not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
// put: /rubric-item/:id/softDelete
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-item/{id}/softDelete:
 *   put:
 *     tags:
 *       - Rubric-items
 *     summary: Toggle soft delete status of a rubric item
 *     description: Toggles the soft delete status of a rubric item by its ID. If the item is currently soft deleted, it will be restored if the total maxScore does not exceed 10. If the item is not soft deleted, it will be marked as deleted.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the rubric item to toggle soft delete status
 *     responses:
 *       '200':
 *         description: Successfully toggled the soft delete status of the rubric item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Toggled isDelete status to true
 *       '400':
 *         description: Failed to toggle status due to total maxScore exceeding 10
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Failed to save Total maxScore exceeds 10
 *       '404':
 *         description: Rubric item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: RubricItem not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
// get: /rubric-items/isDelete/true
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-items/isDelete/true:
 *   get:
 *     tags:
 *       - Rubric-items
 *     summary: Get all rubric items that are marked as deleted
 *     description: Retrieve all rubric items where the `isDelete` field is set to true, indicating that these items are marked as deleted.
 *     responses:
 *       '200':
 *         description: Successfully retrieved rubric items that are marked as deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RubricItem'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
// get: /rubric-items/isDelete/false
/**
 * @openapi
 * tags:
 *   - name: Rubric-items
 *     description: Operations related to Rubric-items management
 * 
 * /api/admin/rubric-items/isDelete/false:
 *   get:
 *     tags:
 *       - Rubric-items
 *     summary: Get all rubric items that are not marked as deleted
 *     description: Retrieve all rubric items where the `isDelete` field is set to false, indicating that these items are not marked as deleted.
 *     responses:
 *       '200':
 *         description: Successfully retrieved rubric items that are not marked as deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RubricItem'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */

router.get('/rubric-items', ensureAuthenticated, RubricItemController.index);
router.post('/rubric-item', ensureAuthenticated, RubricItemController.create);
router.get('/rubric-item/:id', ensureAuthenticated, RubricItemController.getByID);
router.post('/rubric-item/checkScore', ensureAuthenticated, RubricItemController.checkScore);

router.put('/rubric-item/:id', ensureAuthenticated, RubricItemController.update);
router.delete('/rubric-item/:id', ensureAuthenticated, RubricItemController.delete);

router.delete('/rubric-items/multiple', ensureAuthenticated, RubricItemController.deleteMultiple);
router.put('/rubric-items/softDelete', ensureAuthenticated, RubricItemController.softDeleteMultiple);
router.put('/rubric-item/:id/softDelete', ensureAuthenticated, RubricItemController.toggleSoftDeleteById);

router.get('/rubric-items/isDelete/true', ensureAuthenticated, RubricItemController.isDeleteTotrue);
router.get('/rubric-items/isDelete/false', ensureAuthenticated, RubricItemController.isDeleteTofalse);

module.exports = router;

