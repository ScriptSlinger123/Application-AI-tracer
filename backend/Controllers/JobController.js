import { JobService } from '../Services/JobService.js';

const jobService = new JobService();

export async function listJobs(req, res, next) {
  try {
    const data = await jobService.listJobs(req.query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await jobService.getJob(req.params.id);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req, res, next) {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}
