import { Response } from 'express';
import { UserModel } from '../models/user';
import { BlogPostModel } from '../models/BlogPost';
import { CommentModel } from '../models/comment';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Admin controller
 * Handles all admin-related requests
 */
export class AdminController {
  /**
   * Get all users (admin only)
   * GET /api/admin/users
   */
  static getUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const users = await UserModel.getAll();

    const response: ApiResponse = {
      success: true,
      data: { users }
    };

    res.json(response);
  });

  /**
   * Update user role (admin only)
   * PUT /api/admin/users/:id/role
   */
  static updateUserRole = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (userId === req.user?.id) {
      res.status(400).json({
        success: false,
        error: 'Cannot change your own role'
      });
      return;
    }

    const success = await UserModel.updateRole(userId, role);
    if (!success) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User role updated successfully'
    };

    res.json(response);
  });

  /**
   * Delete user (admin only)
   * DELETE /api/admin/users/:id
   */
  static deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user?.id) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
      return;
    }

    const success = await UserModel.delete(userId);
    if (!success) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully'
    };

    res.json(response);
  });

  /**
   * Get all posts including drafts (admin only)
   * GET /api/admin/posts
   */
  static getAllPosts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const posts = await BlogPostModel.getAll();

    const response: ApiResponse = {
      success: true,
      data: { posts }
    };

    res.json(response);
  });

  /**
   * Update post status (admin only)
   * PUT /api/admin/posts/:id/status
   */
  static updatePostStatus = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id);
    const { status } = req.body;

    const success = await BlogPostModel.updateStatus(postId, status);
    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Post not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Post status updated successfully'
    };

    res.json(response);
  });

  /**
   * Get all comments (admin only)
   * GET /api/admin/comments
   */
  static getAllComments = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const comments = await CommentModel.getAll();

    const response: ApiResponse = {
      success: true,
      data: { comments }
    };

    res.json(response);
  });

  /**
   * Get dashboard statistics (admin only)
   * GET /api/admin/stats
   */
  static getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const [users, postCounts, commentCount] = await Promise.all([
      UserModel.getAll(),
      BlogPostModel.getCountByStatus(),
      CommentModel.getCount()
    ]);

    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(user => user.is_verified).length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      totalPosts: Object.values(postCounts).reduce((sum, count) => sum + count, 0),
      publishedPosts: postCounts.published || 0,
      draftPosts: postCounts.draft || 0,
      archivedPosts: postCounts.archived || 0,
      totalComments: commentCount
    };

    const response: ApiResponse = {
      success: true,
      data: { stats }
    };

    res.json(response);
  });
}