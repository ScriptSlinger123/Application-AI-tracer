import { ApplicationService } from '../Services/ApplicationService.js';

const applicationService = new ApplicationService();

export async function listApplications(req, res, next) {
  try {
    const apps = await applicationService.list(req.user.id);
    res.json({ success: true, data: apps });
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req, res, next) {
  try {
    const app = await applicationService.get(req.params.id, req.user.id);
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function createApplication(req, res, next) {
  try {
    const app = await applicationService.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(req, res, next) {
  try {
    const app = await applicationService.update(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
}

export async function dashboard(req, res, next) {
  try {
    const stats = await applicationService.dashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
