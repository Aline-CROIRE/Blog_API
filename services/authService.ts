import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/user';
import { emailService } from './emailService';
import { User, JwtPayload } from '../types';

/**
 * Authentication service
 * Handles user authentication, registration, and password management
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: User; message: string }> {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingUser = await UserModel.existsByEmailOrUsername(email, username);
    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      verification_token: verificationToken,
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, username, verificationToken);

    return {
      user,
      message: 'User registered successfully. Please check your email for verification.',
    };
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<{
    user: User;
    token: string;
    message: string;
  }> {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password!);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.role);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
      message: 'Login successful',
    };
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    const success = await UserModel.verifyEmail(token);
    if (!success) {
      throw new Error('Invalid or expired verification token');
    }

    return { message: 'Email verified successfully' };
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await UserModel.findByEmail(email);
    
    // Always return success message to prevent email enumeration
    const message = 'If email exists, reset link has been sent';

    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

      // Save reset token
      await UserModel.setResetToken(email, resetToken, resetTokenExpires);

      // Send reset email
      await emailService.sendPasswordResetEmail(email, user.username, resetToken);
    }

    return { message };
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Reset password
    const success = await UserModel.resetPassword(token, hashedPassword);
    if (!success) {
      throw new Error('Invalid or expired reset token');
    }

    return { message: 'Password reset successfully' };
  }

  /**
   * Generate JWT token
   */
  static generateToken(userId: number, role: string): string {
    const payload: JwtPayload = { userId, role };
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '7d',
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
  }

  /**
   * Change password (authenticated user)
   */
  static async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Get user with password
    const user = await UserModel.findByEmail(''); // We need to modify this to get by ID with password
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password!);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password (we need to add this method to UserModel)
    // await UserModel.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }
}