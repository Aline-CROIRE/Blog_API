import { Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Authentication controller
 * Handles all authentication-related requests
 */
export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const result = await AuthService.register({ username, email, password });

    const response: ApiResponse = {
      success: true,
      message: result.message,
      data: { user: result.user }
    };

    res.status(201).json(response);
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    const response: ApiResponse = {
      success: true,
      message: result.message,
      data: {
        user: result.user,
        token: result.token
      }
    };

    res.json(response);
  });

  /**
   * Verify email
   * POST /api/auth/verify-email
   */
  static verifyEmail = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { token } = req.body;

    const result = await AuthService.verifyEmail(token);

    const response: ApiResponse = {
      success: true,
      message: result.message
    };

    res.json(response);
  });

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { email } = req.body;

    const result = await AuthService.forgotPassword(email);

    const response: ApiResponse = {
      success: true,
      message: result.message
    };

    res.json(response);
  });

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  static resetPassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    const result = await AuthService.resetPassword(token, newPassword);

    const response: ApiResponse = {
      success: true,
      message: result.message
    };

    res.json(response);
  });

  /**
   * Logout user (client-side token removal)
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // Since we're using stateless JWT tokens, logout is handled client-side
    // This endpoint exists for consistency and future token blacklisting
    
    const response: ApiResponse = {
      success: true,
      message: 'Logged out successfully'
    };

    res.json(response);
  });

  /**
   * Refresh token
   * POST /api/auth/refresh
   */
  static refreshToken = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // For now, we'll generate a new token with the same payload
    // In production, you might want to implement refresh token rotation
    
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const newToken = AuthService.generateToken(req.user.id, req.user.role);

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: { token: newToken }
    };

    res.json(response);
  });

  /**
   * Get current user info
   * GET /api/auth/me
   */
  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: { user: req.user }
    };

    res.json(response);
  });
}