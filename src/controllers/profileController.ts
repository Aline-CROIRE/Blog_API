import { Response } from 'express';
import { UserModel } from '../models/user';
import { AuthRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Profile controller
 * Handles user profile-related requests
 */
export class ProfileController {
  /**
   * Get current user profile
   * GET /api/profile
   */
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
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

  /**
   * Update current user profile
   * PUT /api/profile
   */
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { username, email } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Check if username/email already exists (excluding current user)
    if (username && username !== req.user.username) {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser && existingUser.id !== req.user.id) {
        res.status(400).json({
          success: false,
          error: 'Username already exists'
        });
        return;
      }
    }

    if (email && email !== req.user.email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
        return;
      }
    }

    const updatedUser = await UserModel.updateProfile(req.user.id, { username, email });

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    };

    res.json(response);
  });
}