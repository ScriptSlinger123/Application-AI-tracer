import { JobRepository } from '../Repositories/JobRepository.js';
import { AppError } from '../Utils/AppError.js';
import { Job } from '../Models/Job.js';

const jobRepo = new JobRepository();

export class JobService {
  async listJobs() {
    const rows = await jobRepo.findAll();
    return rows.map((r) => Job.fromRow(r).toJSON());
  }

  async getJob(id) {
    const row = await jobRepo.findById(id);
    if (!row) throw new AppError('Job not found', 404);
    return Job.fromRow(row).toJSON();
  }

  async createJob(dto) {
    const row = await jobRepo.create(dto);
    return Job.fromRow(row).toJSON();
  }
}
