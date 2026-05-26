import { ApplicationRepository } from '../Repositories/ApplicationRepository.js';
import { JobRepository } from '../Repositories/JobRepository.js';
import { AppError } from '../Utils/AppError.js';

const appRepo = new ApplicationRepository();
const jobRepo = new JobRepository();

const VALID_STATUSES = ['applied', 'interview', 'rejected', 'offer'];

export class ApplicationService {
  async list(userId) {
    return appRepo.findByUser(userId);
  }

  async get(id, userId) {
    const app = await appRepo.findById(id, userId);
    if (!app) throw new AppError('Application not found', 404);
    return app;
  }

  async create(userId, body) {
    const jobId = body.job_id || body.jobId;
    const status = body.status;
    const cvVersion = body.cv_version || body.cvVersion;
    const notes = body.notes;
    if (!jobId) throw new AppError('job_id is required', 400);

    const job = await jobRepo.findById(jobId);
    if (!job) throw new AppError('Job not found', 404);

    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(`Invalid status. Use: ${VALID_STATUSES.join(', ')}`, 400);
    }

    return appRepo.create({
      userId,
      jobId,
      status,
      cvVersion,
      notes,
    });
  }

  async update(id, userId, body) {
    const updates = {};
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        throw new AppError(`Invalid status. Use: ${VALID_STATUSES.join(', ')}`, 400);
      }
      updates.status = body.status;
    }
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.cv_version !== undefined) updates.cv_version = body.cv_version;
    else if (body.cvVersion !== undefined) updates.cv_version = body.cvVersion;

    if (Object.keys(updates).length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    return appRepo.update(id, userId, updates);
  }

  async dashboardStats(userId) {
    const byStatus = await appRepo.statsByStatus(userId);
    const applications = await appRepo.findByUser(userId);
    const recent = applications.slice(0, 5);
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    return { byStatus, total, recent };
  }
}
