import { body } from 'express-validator';
import { AuthService } from '../Services/AuthService.js';
import { toRegisterDTO, toLoginDTO } from '../DTOs/AuthDTO.js';
import { asyncHandler } from '../Utils/asyncHandler.js';

const authService = new AuthService();

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

export class AuthController {
  static register = asyncHandler(async (req, res) => {
    const dto = toRegisterDTO(req.body);
    const result = await authService.register(dto);
    res.status(201).json({ success: true, data: result });
  });

  static login = asyncHandler(async (req, res) => {
    const dto = toLoginDTO(req.body);
    const result = await authService.login(dto);
    res.json({ success: true, data: result });
  });

  static profile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.userId);
    res.json({ success: true, data: user });
  });
}
