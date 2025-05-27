import pool from '../config/database';
import { User } from '../types';

/**
 * User model for database operations
 * Handles all user-related database queries
 */
export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: {
    username: string;
    email: string;
    password: string;
    verification_token: string;
  }): Promise<User> {
    const { username, email, password, verification_token } = userData;
    
    const result = await pool.query(
      `INSERT INTO users (username, email, password, verification_token) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role, is_verified, created_at`,
      [username, email, password, verification_token]
    );

    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, username, email, role, is_verified, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    return result.rows[0] || null;
  }

  /**
   * Check if user exists by email or username
   */
  static async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    return result.rows.length > 0;
  }

  /**
   * Verify user email
   */
  static async verifyEmail(token: string): Promise<boolean> {
    const result = await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id',
      [token]
    );

    return result.rows.length > 0;
  }

  /**
   * Set password reset token
   */
  static async setResetToken(email: string, token: string, expires: Date): Promise<boolean> {
    const result = await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING id',
      [token, expires, email]
    );

    return result.rows.length > 0;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE users 
       SET password = $1, reset_token = NULL, reset_token_expires = NULL 
       WHERE reset_token = $2 AND reset_token_expires > NOW() 
       RETURNING id`,
      [newPassword, token]
    );

    return result.rows.length > 0;
  }

  /**
   * Update user profile
   */
  static async updateProfile(id: number, data: { username?: string; email?: string }): Promise<User | null> {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    let paramCount = 0;

    if (data.username) {
      paramCount++;
      fields.push(`username = $${paramCount}`);
      values.push(data.username);
    }

    if (data.email) {
      paramCount++;
      fields.push(`email = $${paramCount}`);
      values.push(data.email);
    }

    if (fields.length === 0) return null;

    paramCount++;
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, username, email, role, is_verified, created_at, updated_at`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Update user role (admin only)
   */
  static async updateRole(id: number, role: string): Promise<boolean> {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id',
      [role, id]
    );

    return result.rows.length > 0;
  }

  /**
   * Get all users (admin only)
   */
  static async getAll(): Promise<User[]> {
    const result = await pool.query(
      'SELECT id, username, email, role, is_verified, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return result.rows;
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rows.length > 0;
  }
}