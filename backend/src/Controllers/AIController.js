import { body } from 'express-validator';
import { AIService } from '../Services/AIService.js';
import { AuthService } from '../Services/AuthService.js';
import { asyncHandler } from '../Utils/asyncHandler.js';

const aiService = new AIService();
const authService = new AuthService();

export class AIController {
  static coverLetter = asyncHandler(async (req, res) => {
    const profile = await authService.getProfile(req.userId);
    const result = await aiService.generateCoverLetter({
      userId: req.userId,
      jobId: req.body.job_id,
      applicantName: profile.name,
      highlights: req.body.highlights,
    });

    if (req.body.application_id && result.coverLetter) {
      await aiService.saveCoverLetterSuggestion(
        req.body.application_id,
        req.userId,
        result.coverLetter,
        null
      );
    }

    res.json({ success: true, data: result });
  });

  static improveCV = asyncHandler(async (req, res) => {
    const bullets = Array.isArray(req.body.bullets) ? req.body.bullets : [];
    const result = await aiService.improveCV({
      bullets,
      targetRole: req.body.target_role,
    });
    res.json({ success: true, data: result });
  });

  static jobFit = asyncHandler(async (req, res) => {
    const result = await aiService.jobFitScore({
      userId: req.userId,
      jobId: req.body.job_id,
      resumeSummary: req.body.resume_summary,
    });

    if (req.body.application_id && result.score != null) {
      await aiService.saveCoverLetterSuggestion(
        req.body.application_id,
        req.userId,
        result.rationale,
        result.score
      );
    }

    res.json({ success: true, data: result });
  });
}

export const aiValidation = {
  coverLetter: [body('job_id').isUUID()],
  jobFit: [body('job_id').isUUID()],
  improveCV: [body('bullets').isArray({ min: 1 })],
};
