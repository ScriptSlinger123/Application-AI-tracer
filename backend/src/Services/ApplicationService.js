import { ApplicationRepository } from '../Repositories/ApplicationRepository.js';
import { JobRepository } from '../Repositories/JobRepository.js';
import { AppError } from '../Utils/AppError.js';
import { Application } from '../Models/Application.js';

const appRepo = new ApplicationRepository();
const jobRepo = new JobRepository();

export class ApplicationService {
  async listForUser(userId) {
    const rows = await appRepo.findByUser(userId);
    return rows.map((r) => Application.fromRow(r).toJSON());
  }

  async getForUser(id, userId) {
    const row = await appRepo.findByIdForUser(id, userId);
    if (!row) throw new AppError('Application not found', 404);
    return Application.fromRow(row).toJSON();
  }

  async create(userId, dto) {
    const job = await jobRepo.findById(dto.job_id);
    if (!job) throw new AppError('Job not found', 404);

    try {
      const row = await appRepo.create({ ...dto, user_id: userId });
      return Application.fromRow(row).toJSON();
    } catch (err) {
      if (err.code === '23505') {
        throw new AppError('You already applied to this job', 409);
      }
      throw err;
    }
  }

  async update(id, userId, dto) {
    if (!Object.keys(dto).length) throw new AppError('No fields to update', 400);
    const row = await appRepo.update(id, userId, dto);
    if (!row) throw new AppError('Application not found', 404);
    return Application.fromRow(row).toJSON();
  }

  async getDashboardStats(userId) {
    return appRepo.statsByUser(userId);
  }
}
