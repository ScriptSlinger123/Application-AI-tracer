import { Router } from 'express';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import * as authController from '../Controllers/AuthController.js';
import * as jobController from '../Controllers/JobController.js';
import * as applicationController from '../Controllers/ApplicationController.js';
import * as aiController from '../Controllers/AIController.js';

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authMiddleware, authController.profile);

router.get('/jobs', jobController.listJobs);
router.get('/jobs/:id', jobController.getJob);
router.post('/jobs', authMiddleware, jobController.createJob);

router.get('/applications/stats', authMiddleware, applicationController.dashboard);
router.get('/dashboard', authMiddleware, applicationController.dashboard);
router.get('/applications', authMiddleware, applicationController.listApplications);
router.post('/applications', authMiddleware, applicationController.createApplication);
router.get('/applications/:id', authMiddleware, applicationController.getApplication);
router.patch('/applications/:id', authMiddleware, applicationController.updateApplication);

router.post('/ai/cover-letter', authMiddleware, aiController.coverLetter);
router.post('/ai/cv-improve', authMiddleware, aiController.cvImprove);
router.post('/ai/job-fit', authMiddleware, aiController.jobFit);

export default router;
