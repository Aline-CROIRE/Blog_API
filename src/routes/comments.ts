import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { authenticateToken, requireVerification } from '../middleware/auth';
import { validateCreateComment, validateId } from '../middleware/validation';
import { validatePostId } from '../middleware/validatePostId';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Post not found
 */
router.get('/:postId', validatePostId, CommentController.getComments);

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Add a new comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Great post!
 *     responses:
 *       201:
 *         description: Comment added
 *       401:
 *         description: Unauthorized
 */

router.post('/:postId', authenticateToken, requireVerification, validateCreateComment, validatePostId, CommentController.addComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment text.
 *     responses:
 *       200:
 *         description: Comment updated
 *       404:
 *         description: Comment not found
 */
router.put(
  '/:id',
  authenticateToken,
  requireVerification,
  validateId,
  CommentController.updateComment
);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */
router.delete(
  '/:id',
  authenticateToken,
  requireVerification,
  validateId,
  CommentController.deleteComment
);

/**
 * @swagger
 * /api/comments/my/comments:
 *   get:
 *     summary: Get comments made by the current user
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's comments
 */
router.get('/my/comments', authenticateToken, CommentController.getMyComments);

export default router;
