import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authenticateToken, requireVerification } from '../middleware/auth';
import {
  validateCreatePost,
  validateUpdatePost,
  validatePagination,
  validateId
} from '../middleware/validation';

const router = Router();

/**
 * Blog post routes
 * All routes are prefixed with /api/posts
 */

// Public routes
router.get('/', validatePagination, PostController.getPosts);
router.get('/:id', validateId, PostController.getPost);

// Protected routes
router.post('/', authenticateToken, requireVerification, validateCreatePost, PostController.createPost);
router.put('/:id', authenticateToken, requireVerification, validateUpdatePost, PostController.updatePost);
router.delete('/:id', authenticateToken, requireVerification, validateId, PostController.deletePost);
router.get('/my/posts', authenticateToken, PostController.getMyPosts);

export default router;