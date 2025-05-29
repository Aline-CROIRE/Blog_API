import pool from '../config/database';
import { Comment } from '../types';

/**
 * Comment model for database operations
 * Handles all comment-related database queries
 */
export class CommentModel {
  /**
   * Create a new comment
   */
  static async create(commentData: {
    content: string;
    author_id: number;
    post_id: number;
  }): Promise<Comment> {
    const { content, author_id, post_id } = commentData;

    const result = await pool.query(
      `INSERT INTO comments (content, author_id, post_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [content, author_id, post_id]
    );

    return result.rows[0];
  }

  /**
   * Get comments by post ID
   */
  static async getByPostId(postId: number): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, u.username as author_name 
       FROM comments c 
       JOIN users u ON c.author_id = u.id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at DESC`,
      [postId]
    );

    return result.rows;
  }

  /**
   * Get comment by ID
   */
  static async getById(id: number): Promise<Comment | null> {
    const result = await pool.query(
      `SELECT c.*, u.username as author_name 
       FROM comments c 
       JOIN users u ON c.author_id = u.id 
       WHERE c.id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Update comment
   */
  static async update(id: number, content: string): Promise<Comment | null> {
    const result = await pool.query(
      'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
      [content, id]
    );

    return result.rows[0] || null;
  }

  /**
   * Delete comment
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows.length > 0;
  }

  /**
   * Get comments by author
   */
  static async getByAuthor(authorId: number): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, u.username as author_name, p.title as post_title 
       FROM comments c 
       JOIN users u ON c.author_id = u.id 
       JOIN blog_posts p ON c.post_id = p.id 
       WHERE c.author_id = $1 
       ORDER BY c.created_at DESC`,
      [authorId]
    );

    return result.rows;
  }

  /**
   * Get all comments (admin only)
   */
  static async getAll(): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, u.username as author_name, p.title as post_title 
       FROM comments c 
       JOIN users u ON c.author_id = u.id 
       JOIN blog_posts p ON c.post_id = p.id 
       ORDER BY c.created_at DESC`
    );

    return result.rows;
  }

  /**
   * Get comments count
   */
  static async getCount(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) FROM comments');
    return parseInt(result.rows[0].count);
  }
}