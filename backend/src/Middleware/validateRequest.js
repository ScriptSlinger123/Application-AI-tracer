import { validationResult } from 'express-validator';
import { AppError } from '../Utils/AppError.js';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, errors.array()));
  }
  next();
}
