import { Router } from 'express';
import { authenticate } from '../Middleware/authMiddleware.js';
import { validateRequest } from '../Middleware/validateRequest.js';
import {
  AuthController,
  registerValidation,
  loginValidation,
} from '../Controllers/AuthController.js';
import { JobController, createJobValidation } from '../Controllers/JobController.js';
import {
  ApplicationController,
  createApplicationValidation,
  updateApplicationValidation,
} from '../Controllers/ApplicationController.js';
import { AIController, aiValidation } from '../Controllers/AIController.js';

const router = Router();

router.post('/auth/register', registerValidation, validateRequest, AuthController.register);
router.post('/auth/login', loginValidation, validateRequest, AuthController.login);
router.get('/auth/profile', authenticate, AuthController.profile);

router.get('/jobs', JobController.list);
router.get('/jobs/:id', JobController.getById);
router.post('/jobs', authenticate, createJobValidation, validateRequest, JobController.create);

router.get('/applications/stats', authenticate, ApplicationController.stats);
router.get('/applications', authenticate, ApplicationController.list);
router.get('/applications/:id', authenticate, ApplicationController.getById);
router.post(
  '/applications',
  authenticate,
  createApplicationValidation,
  validateRequest,
  ApplicationController.create
);
router.patch(
  '/applications/:id',
  authenticate,
  updateApplicationValidation,
  validateRequest,
  ApplicationController.update
);

router.post(
  '/ai/cover-letter',
  authenticate,
  aiValidation.coverLetter,
  validateRequest,
  AIController.coverLetter
);
router.post(
  '/ai/cv-improve',
  authenticate,
  aiValidation.improveCV,
  validateRequest,
  AIController.improveCV
);
router.post('/ai/job-fit', authenticate, aiValidation.jobFit, validateRequest, AIController.jobFit);

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));

export default router;
