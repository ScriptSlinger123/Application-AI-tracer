import { AuthService } from '../Services/AuthService.js';
import { AppError } from '../Utils/AppError.js';

const authService = new AuthService();

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = header.slice(7);
  try {
    const payload = authService.verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
