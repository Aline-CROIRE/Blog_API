import { Response } from 'express';
import { BlogPostModel } from '../models/BlogPost';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Blog post controller
 * Handles all blog post-related requests
 */
export class PostController {
  /**
   * Get all published posts (public)
   * GET /api/posts
   */
  static getPosts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const author = req.query.author as string;

    const result = await BlogPostModel.getPublished({ page, limit, search, author });

    const totalPages = Math.ceil(result.total / limit);

    const response: ApiResponse = {
      success: true,
      data: { posts: result.posts },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: result.total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };

    res.json(response);
  });

  /**
   * Get single post by ID (public)
   * GET /api/posts/:id
   */
  static getPost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id);

    const post = await BlogPostModel.getById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        error: 'Post not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: { post }
    };

    res.json(response);
  });

  /**
   * Create new blog post (authenticated users)
   * POST /api/posts
   */
  static createPost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, content, excerpt, status, featured_image, tags } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Only admin can publish directly, users create drafts
    const postStatus = req.user.role === 'admin' ? (status || 'draft') : 'draft';

    const post = await BlogPostModel.create({
      title,
      content,
      excerpt,
      author_id: req.user.id,
      status: postStatus,
      featured_image,
      tags
    });

    const response: ApiResponse = {
      success: true,
      message: 'Post created successfully',
      data: { post }
    };

    res.status(201).json(response);
  });

  /**
   * Update blog post (author or admin)
   * PUT /api/posts/:id
   */
  static updatePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id);
    const { title, content, excerpt, status, featured_image, tags } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Check if post exists
    const existingPost = await BlogPostModel.getById(postId, true);
    if (!existingPost) {
      res.status(404).json({
        success: false,
        error: 'Post not found'
      });
      return;
    }

    // Check permission (author or admin)
    if (existingPost.author_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Permission denied'
      });
      return;
    }

    // Only admin can change status to published
    const updateData: any = { title, content, excerpt, featured_image, tags };
    if (req.user.role === 'admin' && status) {
      updateData.status = status;
    }

    const post = await BlogPostModel.update(postId, updateData);

    const response: ApiResponse = {
      success: true,
      message: 'Post updated successfully',
      data: { post }
    };

    res.json(response);
  });

  /**
   * Delete blog post (author or admin)
   * DELETE /api/posts/:id
   */
  static deletePost = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const postId = parseInt(req.params.id);

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Check if post exists
    const existingPost = await BlogPostModel.getById(postId, true);
    if (!existingPost) {
      res.status(404).json({
        success: false,
        error: 'Post not found'
      });
      return;
    }

    // Check permission (author or admin)
    if (existingPost.author_id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Permission denied'
      });
      return;
    }

    await BlogPostModel.delete(postId);

    const response: ApiResponse = {
      success: true,
      message: 'Post deleted successfully'
    };

    res.json(response);
  });

  /**
   * Get current user's posts
   * GET /api/posts/my-posts
   */
  static getMyPosts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const posts = await BlogPostModel.getByAuthor(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: { posts }
    };

    res.json(response);
  });
}