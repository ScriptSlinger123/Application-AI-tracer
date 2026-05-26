import { body } from 'express-validator';
import { ApplicationService } from '../Services/ApplicationService.js';
import { toCreateApplicationDTO, toUpdateApplicationDTO } from '../DTOs/ApplicationDTO.js';
import { asyncHandler } from '../Utils/asyncHandler.js';

const applicationService = new ApplicationService();

export const createApplicationValidation = [body('job_id').isUUID().withMessage('Valid job_id required')];

export const updateApplicationValidation = [
  body('status').optional().isIn(['applied', 'interview', 'rejected', 'offer']),
];

export class ApplicationController {
  static list = asyncHandler(async (req, res) => {
    const apps = await applicationService.listForUser(req.userId);
    res.json({ success: true, data: apps });
  });

  static getById = asyncHandler(async (req, res) => {
    const app = await applicationService.getForUser(req.params.id, req.userId);
    res.json({ success: true, data: app });
  });

  static create = asyncHandler(async (req, res) => {
    const dto = toCreateApplicationDTO(req.body, req.userId);
    const app = await applicationService.create(req.userId, dto);
    res.status(201).json({ success: true, data: app });
  });

  static update = asyncHandler(async (req, res) => {
    const dto = toUpdateApplicationDTO(req.body);
    const app = await applicationService.update(req.params.id, req.userId, dto);
    res.json({ success: true, data: app });
  });

  static stats = asyncHandler(async (req, res) => {
    const stats = await applicationService.getDashboardStats(req.userId);
    res.json({ success: true, data: stats });
  });
}
