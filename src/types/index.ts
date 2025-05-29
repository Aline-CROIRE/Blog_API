import { Request } from 'express';

/**
 * User interface definition
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  is_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Blog post interface definition
 */
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author_id: number;
  author_name?: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Comment interface definition
 */
export interface Comment {
  id: number;
  content: string;
  author_id: number;
  author_name?: string;
  post_id: number;
  created_at: Date;
}

/**
 * Extended Express Request with user information
 */
export interface AuthRequest extends Request {
  user?: User;
}

/**
 * API Response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
  status?: string;
}

/**
 * JWT payload interface
 */
export interface JwtPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}   

 