import { body } from 'express-validator';
import { JobService } from '../Services/JobService.js';
import { toCreateJobDTO } from '../DTOs/JobDTO.js';
import { asyncHandler } from '../Utils/asyncHandler.js';

const jobService = new JobService();

export const createJobValidation = [
  body('title').trim().notEmpty(),
  body('company').trim().notEmpty(),
];

export class JobController {
  static list = asyncHandler(async (req, res) => {
    const jobs = await jobService.listJobs();
    res.json({ success: true, data: jobs });
  });

  static getById = asyncHandler(async (req, res) => {
    const job = await jobService.getJob(req.params.id);
    res.json({ success: true, data: job });
  });

  static create = asyncHandler(async (req, res) => {
    const dto = toCreateJobDTO(req.body);
    const job = await jobService.createJob(dto);
    res.status(201).json({ success: true, data: job });
  });
}
