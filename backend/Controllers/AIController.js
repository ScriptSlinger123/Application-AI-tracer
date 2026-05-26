import { AIService } from '../Services/AIService.js';
import { JobRepository } from '../Repositories/JobRepository.js';

const aiService = new AIService();
const jobRepo = new JobRepository();

export async function coverLetter(req, res, next) {
  try {
    const jobId = req.body.job_id || req.body.jobId;
    let jobTitle = req.body.jobTitle;
    let company = req.body.company;
    let jobDescription = req.body.jobDescription || req.body.highlights;

    if (jobId) {
      const job = await jobRepo.findById(jobId);
      if (job) {
        jobTitle = jobTitle || job.title;
        company = company || job.company;
        jobDescription = jobDescription || job.description;
      }
    }

    const result = await aiService.generateCoverLetter(req.user.id, {
      jobTitle,
      company,
      jobDescription,
      applicationId: req.body.application_id || req.body.applicationId,
      userName: req.user.name,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function cvImprove(req, res, next) {
  try {
    const bullets = req.body.bullets;
    const result = await aiService.improveCv({
      bullets: Array.isArray(bullets) ? bullets.join('\n') : bullets,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function jobFit(req, res, next) {
  try {
    const jobId = req.body.job_id || req.body.jobId;
    const profileSummary = req.body.profileSummary || req.body.resume_summary;
    const applicationId = req.body.application_id || req.body.applicationId;
    let jobDescriptionResolved = req.body.jobDescription;
    if (jobId && !jobDescriptionResolved) {
      const job = await jobRepo.findById(jobId);
      jobDescriptionResolved = job?.description;
    }
    const result = await aiService.jobFit(req.user.id, {
      jobId,
      jobDescription: jobDescriptionResolved,
      profileSummary,
      applicationId,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
