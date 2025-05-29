import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';
import { validateProfileUpdate } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Authenticated user profile management
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get('/', authenticateToken, ProfileController.getProfile);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               bio:
 *                 type: string
 *                 example: Software developer and tech enthusiast.
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/', authenticateToken, validateProfileUpdate, ProfileController.updateProfile);

export default router;
