import { AISuggestionRepository } from '../Repositories/AISuggestionRepository.js';
import { ApplicationRepository } from '../Repositories/ApplicationRepository.js';
import { JobRepository } from '../Repositories/JobRepository.js';
import { AppError } from '../Utils/AppError.js';

const aiRepo = new AISuggestionRepository();
const appRepo = new ApplicationRepository();
const jobRepo = new JobRepository();

export class AIService {
  #hasOpenAI() {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async #chatCompletion(system, user) {
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new AppError(`AI provider error: ${text}`, 502);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || '';
  }

  async generateCoverLetter({ userId, jobId, applicantName, highlights }) {
    const job = await jobRepo.findById(jobId);
    if (!job) throw new AppError('Job not found', 404);

    if (!this.#hasOpenAI()) {
      return {
        coverLetter: this.#mockCoverLetter(job, applicantName, highlights),
        mock: true,
      };
    }

    const system =
      'You write concise, professional cover letters. Output only the letter body, no subject line.';
    const user = `Applicant: ${applicantName || 'Candidate'}
Job: ${job.title} at ${job.company}
Location: ${job.location || 'N/A'}
Description: ${job.description || 'N/A'}
Highlights: ${highlights || 'Relevant experience in the field'}

Write a tailored cover letter under 300 words.`;

    const coverLetter = await this.#chatCompletion(system, user);
    return { coverLetter, mock: false };
  }

  async improveCV({ bullets, targetRole }) {
    if (!this.#hasOpenAI()) {
      return {
        improved: bullets.map(
          (b, i) =>
            `• Led cross-functional initiative resulting in measurable impact — ${b.replace(/^[-•]\s*/, '')}`
        ),
        mock: true,
      };
    }

    const system = 'You improve resume bullet points. Return a JSON array of strings only.';
    const user = `Role: ${targetRole || 'Software Engineer'}
Bullets: ${JSON.stringify(bullets)}`;

    const raw = await this.#chatCompletion(system, user);
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      if (Array.isArray(parsed)) return { improved: parsed, mock: false };
    } catch {
      /* fall through */
    }
    return { improved: raw.split('\n').filter(Boolean), mock: false };
  }

  async jobFitScore({ userId, jobId, resumeSummary }) {
    const job = await jobRepo.findById(jobId);
    if (!job) throw new AppError('Job not found', 404);

    if (!this.#hasOpenAI()) {
      const score = 65 + Math.floor(Math.random() * 25);
      return {
        score,
        rationale: this.#mockFitRationale(job, score),
        mock: true,
      };
    }

    const system =
      'You assess job fit. Reply with JSON: {"score": number 0-100, "rationale": "one short paragraph"}';
    const user = `Job: ${job.title} at ${job.company}
Description: ${job.description}
Candidate summary: ${resumeSummary || 'General software professional'}`;

    const raw = await this.#chatCompletion(system, user);
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      return {
        score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
        rationale: parsed.rationale || '',
        mock: false,
      };
    } catch {
      return { score: 70, rationale: raw, mock: false };
    }
  }

  async saveCoverLetterSuggestion(applicationId, userId, coverLetter, score = null) {
    const app = await appRepo.findByIdForUser(applicationId, userId);
    if (!app) throw new AppError('Application not found', 404);
    return aiRepo.create({
      application_id: applicationId,
      cover_letter_text: coverLetter,
      ai_score: score,
    });
  }

  #mockCoverLetter(job, name, highlights) {
    return `Dear Hiring Manager,

I am writing to express my interest in the ${job.title} position at ${job.company}. ${
      highlights || 'My background aligns well with the responsibilities outlined in your posting.'
    }

I would welcome the opportunity to discuss how my experience can contribute to your team.

Sincerely,
${name || 'Applicant'}

[Demo mode — set OPENAI_API_KEY for AI-generated letters]`;
  }

  #mockFitRationale(job, score) {
    return `Based on the role at ${job.company} and a typical candidate profile, estimated fit is ${score}/100. Enable OPENAI_API_KEY for personalized analysis.`;
  }
}
