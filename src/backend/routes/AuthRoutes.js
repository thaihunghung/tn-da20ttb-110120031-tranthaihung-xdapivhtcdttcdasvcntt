// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const AuthenticateController = require('../controllers/AuthenticateController');
const TokenController = require('../controllers/TokenController'); // Import TokenController
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const passport = require('passport');
const StudentController = require('../controllers/StudentController');
const authenticateStudent = require('../middlewares/studentMiddleware');

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Operations related to teacher authentication and management
 */

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register a new teacher
 *     description: Registers a new teacher with the provided details.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The teacher's username.
 *                 example: teacher123
 *               password:
 *                 type: string
 *                 description: The teacher's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Teacher registered successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Teacher login
 *     description: Authenticates a teacher and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacherCode:
 *                 type: string
 *                 description: The teacher's code.
 *                 example: 123456
 *               password:
 *                 type: string
 *                 description: The teacher's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/change-password:
 *   post:
 *     summary: Change teacher password
 *     description: Changes the password of an authenticated teacher.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The teacher's current password.
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 description: The teacher's new password.
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     description: Refreshes the JWT token for an authenticated teacher.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token.
 *                 example: refresh_token_123
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/revoke-token:
 *   post:
 *     summary: Revoke JWT token
 *     description: Revokes the JWT token for an authenticated teacher.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token to be revoked.
 *                 example: token_123
 *     responses:
 *       200:
 *         description: Token revoked successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Get authenticated teacher's user details
 *     description: Returns the details of the authenticated teacher.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The teacher's username.
 *                   example: teacher123
 *                 email:
 *                   type: string
 *                   description: The teacher's email.
 *                   example: teacher@example.com
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/logout:
 *   post:
 *     summary: Logout teacher
 *     description: Logs out the authenticated teacher.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error
 */

router.post('/register', AuthenticateController.register);
router.post('/login', AuthenticateController.login);
router.post('/change-password',ensureAuthenticated, AuthenticateController.changePassword);
router.post('/refresh-token', TokenController.refreshToken); 
router.post('/revoke-token', ensureAuthenticated, TokenController.revokeToken); 
router.post('/logout', ensureAuthenticated, AuthenticateController.logout);
router.post('/student-login', StudentController.login);
router.get('/user', ensureAuthenticated, AuthenticateController.getUser);
router.get('/student/info', authenticateStudent, StudentController.getStudentInfo);

module.exports = router;
