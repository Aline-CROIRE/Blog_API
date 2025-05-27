import pool from '../config/database';
import { BlogPost, PaginationQuery } from '../types';

/**
 * BlogPost model for database operations
 * Handles all blog post-related database queries
 */
export class BlogPostModel {
  /**
   * Create a new blog post
   */
  static async create(postData: {
    title: string;
    content: string;
    excerpt?: string;
    author_id: number;
    status?: string;
    featured_image?: string;
    tags?: string[];
  }): Promise<BlogPost> {
    const { title, content, excerpt, author_id, status = 'draft', featured_image, tags } = postData;

    const result = await pool.query(
      `INSERT INTO blog_posts (title, content, excerpt, author_id, status, featured_image, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, content, excerpt, author_id, status, featured_image, tags]
    );

    return result.rows[0];
  }

  /**
   * Get published posts with pagination and search
   */
  static async getPublished(query: PaginationQuery): Promise<{
    posts: BlogPost[];
    total: number;
  }> {
    const { page = 1, limit = 10, search, author } = query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE p.status = 'published'";
    const queryParams: any[] = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      whereClause += ` AND (p.title ILIKE $${paramCount} OR p.content ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add author filter
    if (author) {
      paramCount++;
      whereClause += ` AND u.username = $${paramCount}`;
      queryParams.push(author);
    }

    // Get posts
    const postsQuery = `
      SELECT p.*, u.username as author_name 
      FROM blog_posts p 
      JOIN users u ON p.author_id = u.id 
      ${whereClause}
      ORDER BY p.created_at DESC 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    queryParams.push(limit, offset);

    const postsResult = await pool.query(postsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) 
      FROM blog_posts p 
      JOIN users u ON p.author_id = u.id 
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams.slice(0, paramCount));

    return {
      posts: postsResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  /**
   * Get post by ID
   */
  static async getById(id: number, includeUnpublished = false): Promise<BlogPost | null> {
    let query = `
      SELECT p.*, u.username as author_name 
      FROM blog_posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.id = $1
    `;

    if (!includeUnpublished) {
      query += " AND p.status = 'published'";
    }

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get posts by author
   */
  static async getByAuthor(authorId: number): Promise<BlogPost[]> {
    const result = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM blog_posts p 
       JOIN users u ON p.author_id = u.id 
       WHERE p.author_id = $1 
       ORDER BY p.created_at DESC`,
      [authorId]
    );

    return result.rows;
  }

  /**
   * Update blog post
   */
  static async update(id: number, updateData: {
    title?: string;
    content?: string;
    excerpt?: string;
    status?: string;
    featured_image?: string;
    tags?: string[];
  }): Promise<BlogPost | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) return null;

    paramCount++;
    values.push(id);

    const result = await pool.query(
      `UPDATE blog_posts 
       SET ${fields.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete blog post
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows.length > 0;
  }

  /**
   * Get all posts (admin only)
   */
  static async getAll(): Promise<BlogPost[]> {
    const result = await pool.query(
      `SELECT p.*, u.username as author_name 
       FROM blog_posts p 
       JOIN users u ON p.author_id = u.id 
       ORDER BY p.created_at DESC`
    );

    return result.rows;
  }

  /**
   * Update post status (admin only)
   */
  static async updateStatus(id: number, status: string): Promise<boolean> {
    const result = await pool.query(
      'UPDATE blog_posts SET status = $1 WHERE id = $2 RETURNING id',
      [status, id]
    );

    return result.rows.length > 0;
  }

  /**
   * Get posts count by status
   */
  static async getCountByStatus(): Promise<{ [key: string]: number }> {
    const result = await pool.query(
      'SELECT status, COUNT(*) as count FROM blog_posts GROUP BY status'
    );

    const counts: { [key: string]: number } = {};
    result.rows.forEach(row => {
      counts[row.status] = parseInt(row.count);
    });

    return counts;
  }
}