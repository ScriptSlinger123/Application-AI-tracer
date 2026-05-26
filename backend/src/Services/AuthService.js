import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../Repositories/UserRepository.js';
import { AppError } from '../Utils/AppError.js';
import { User } from '../Models/User.js';

const userRepo = new UserRepository();

export class AuthService {
  #jwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('JWT_SECRET is not configured', 500);
    return secret;
  }

  signToken(userId) {
    return jwt.sign({ sub: userId }, this.#jwtSecret(), { expiresIn: '7d' });
  }

  verifyToken(token) {
    return jwt.verify(token, this.#jwtSecret());
  }

  async register({ name, email, password }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new AppError('Email already registered', 409);

    const password_hash = await bcrypt.hash(password, 12);
    const row = await userRepo.create({ name, email, password_hash });
    const user = User.fromRow(row);
    const token = this.signToken(user.id);
    return { user: user.toJSON(), token };
  }

  async login({ email, password }) {
    const row = await userRepo.findByEmail(email);
    if (!row) throw new AppError('Invalid email or password', 401);

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) throw new AppError('Invalid email or password', 401);

    const user = User.fromRow(row);
    const token = this.signToken(user.id);
    return { user: user.toJSON(), token };
  }

  async getProfile(userId) {
    const row = await userRepo.findById(userId);
    if (!row) throw new AppError('User not found', 404);
    return User.fromRow(row).toJSON();
  }
}
