import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../Repositories/UserRepository.js';
import { AppError } from '../Utils/AppError.js';

const userRepo = new UserRepository();

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new AppError('JWT_SECRET not configured', 500);
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export class AuthService {
  async register({ name, email, password }) {
    if (!name?.trim() || !email?.trim() || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }
    if (password.length < 6) throw new AppError('Password must be at least 6 characters', 400);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ name: name.trim(), email: email.trim(), passwordHash });
    const token = signToken(user);
    return { user, token };
  }

  async login({ email, password }) {
    if (!email?.trim() || !password) throw new AppError('Email and password are required', 400);

    const user = await userRepo.findByEmail(email.trim());
    if (!user) throw new AppError('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const { password_hash, ...safeUser } = user;
    const token = signToken(safeUser);
    return { user: safeUser, token };
  }

  async getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}
