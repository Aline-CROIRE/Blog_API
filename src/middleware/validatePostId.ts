import { param } from 'express-validator';
import { handleValidationErrors } from './validation';

export const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidationErrors,
];

export const validatePostId = [
  param('postId').isInt({ min: 1 }).withMessage('Post ID must be a positive integer'),
  handleValidationErrors,
];
