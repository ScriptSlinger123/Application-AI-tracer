import { JobRepository } from '../Repositories/JobRepository.js';
import { AppError } from '../Utils/AppError.js';

const jobRepo = new JobRepository();

export class JobService {
  async listJobs(query) {
    return jobRepo.findAll({
      search: query.search,
      limit: Number(query.limit) || 50,
      offset: Number(query.offset) || 0,
    });
  }

  async getJob(id) {
    const job = await jobRepo.findById(id);
    if (!job) throw new AppError('Job not found', 404);
    return job;
  }

  async createJob(body) {
    const { title, company, location, description, url, source } = body;
    if (!title?.trim() || !company?.trim()) {
      throw new AppError('Title and company are required', 400);
    }
    return jobRepo.create({
      title: title.trim(),
      company: company.trim(),
      location: location?.trim() || null,
      description: description?.trim() || null,
      url: url?.trim() || null,
      source: source || 'manual',
    });
  }
}
