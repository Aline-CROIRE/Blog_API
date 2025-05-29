import { Response } from 'express';
import { CommentModel } from '../models/comment';
import { BlogPostModel } from '../models/BlogPost';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { emailService } from '../services/emailService';

/**
 * Comment controller
 * Handles all comment-related requests
 */
export class CommentController {
  /**
   * Add comment to post (authenticated users)
   * POST /api/comments/:postId
   */
  static addComment = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // 1. Find the post by ID
    const post = await BlogPostModel.getById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
      });
      return;
    }

    // 2. Create the comment using logged-in user's ID and post ID
    const comment = await CommentModel.create({
      content,
      author_id: req.user.id,
      post_id: postId,
    });

    // 3. Notify post author by email (if different from commenter)
    if (post.author_id !== req.user.id) {
      const postAuthor = await BlogPostModel.getAuthorDetails(post.author_id);
      if (postAuthor?.email) {
        await emailService.sendCommentNotification(
          postAuthor.email,
          postAuthor.username,
          post.title,
          req.user.username,
          content
        );
         console.log(`Notification email sent to ${postAuthor.email}`);
      } else {
        console.error('Post author not found');
      }
    }

    // 4. Send response
    const response: ApiResponse = {
      success: true,
      message: 'Comment added successfully',
      data: { comment },
    };

    res.status(201).json(response);
  });

  /**
   * Get comments for a post
   * GET /api/comments/:postId
   */
  static getComments = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.postId);

    const post = await BlogPostModel.getById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        error: 'Post not found',
      });
      return;
    }

    const comments = await CommentModel.getByPostId(postId);

    const response: ApiResponse = {
      success: true,
      data: { comments },
    };

    res.json(response);
  });

  /**
   * Update comment (author or admin)
   * PUT /api/comments/:id
   */
  static updateComment = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const existingComment = await CommentModel.getById(commentId);
    if (!existingComment) {
      res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
      return;
    }

    if (existingComment.author_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Permission denied',
      });
      return;
    }

    const comment = await CommentModel.update(commentId, content);

    const response: ApiResponse = {
      success: true,
      message: 'Comment updated successfully',
      data: { comment },
    };

    res.json(response);
  });

  /**
   * Delete comment (author or admin)
   * DELETE /api/comments/:id
   */
  static deleteComment = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const commentId = parseInt(req.params.id);

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const existingComment = await CommentModel.getById(commentId);
    if (!existingComment) {
      res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
      return;
    }

    if (existingComment.author_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Permission denied',
      });
      return;
    }

    await CommentModel.delete(commentId);

    const response: ApiResponse = {
      success: true,
      message: 'Comment deleted successfully',
    };

    res.json(response);
  });

  /**
   * Get current user's comments
   * GET /api/comments/my-comments
   */
  static getMyComments = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const comments = await CommentModel.getByAuthor(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: { comments },
    };

    res.json(response);
  });
}
