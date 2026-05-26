import { AiSuggestionRepository } from '../Repositories/AiSuggestionRepository.js';
import { JobRepository } from '../Repositories/JobRepository.js';

const aiRepo = new AiSuggestionRepository();
const jobRepo = new JobRepository();

async function callOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn('[OpenAI] API error:', errText);
    return null;
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}

function mockCoverLetter({ jobTitle, company, userName }) {
  return `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${jobTitle} position. With a proven track record in software development and a passion for building user-focused products, I believe I would be a valuable addition to your team.

[Demo mode: Set OPENAI_API_KEY for AI-generated cover letters.]

Sincerely,
${userName || 'Applicant'}`;
}

function mockCvImprove(bullets) {
  const text = bullets || 'Led cross-functional projects and improved delivery speed.';
  return {
    improved: `• ${text.replace(/^[-•]\s*/, '')} — quantified impact and aligned with role requirements.`,
    tips: ['Add metrics where possible', 'Lead with action verbs', 'Tailor bullets to the job description'],
  };
}

function mockJobFit(job, profile) {
  const score = 72;
  return {
    score,
    rationale: `[Demo] Based on keyword overlap between the role at ${job?.company || 'the company'} and your profile (${profile?.slice(0, 80) || 'general experience'}...), estimated fit is ${score}/100. Configure OPENAI_API_KEY for detailed analysis.`,
  };
}

export class AIService {
  async generateCoverLetter(userId, { jobTitle, company, jobDescription, applicationId, userName }) {
    const prompt = `Write a professional cover letter (250-350 words) for ${userName || 'the applicant'} applying to ${jobTitle} at ${company}. Job description: ${jobDescription || 'Not provided'}. Return only the letter text.`;

    let text = await callOpenAI([
      { role: 'system', content: 'You are a career coach writing concise, professional cover letters.' },
      { role: 'user', content: prompt },
    ]);

    if (!text) text = mockCoverLetter({ jobTitle, company, userName });

    if (applicationId) {
      await aiRepo.create({
        applicationId,
        coverLetterText: text,
      }).catch(() => {});
    }

    return { coverLetter: text, mock: !process.env.OPENAI_API_KEY };
  }

  async improveCv({ bullets }) {
    const bulletText = Array.isArray(bullets) ? bullets.join('\n') : bullets;
    const prompt = `Improve these resume bullets. Return JSON: {"improved": ["bullet1","bullet2"], "tips": ["tip1","tip2"]}. Bullets:\n${bulletText}`;

    let result = null;
    const raw = await callOpenAI([
      { role: 'system', content: 'Respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ]);

    if (raw) {
      try {
        result = JSON.parse(raw.replace(/```json\n?|\n?```/g, ''));
      } catch {
        result = { improved: raw, tips: [] };
      }
    }

    if (!result) result = mockCvImprove(bullets);
    return { ...result, mock: !process.env.OPENAI_API_KEY };
  }

  async jobFit(userId, { jobId, jobDescription, profileSummary, applicationId }) {
    let job = null;
    if (jobId) {
      job = await jobRepo.findById(jobId);
    }

    const prompt = `Rate job fit 0-100. Return JSON: {"score": number, "rationale": "short paragraph"}. Job: ${JSON.stringify({ title: job?.title, company: job?.company, description: jobDescription || job?.description })}. Candidate: ${profileSummary || 'Software professional'}`;

    let result = null;
    const raw = await callOpenAI([
      { role: 'system', content: 'Respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ]);

    if (raw) {
      try {
        result = JSON.parse(raw.replace(/```json\n?|\n?```/g, ''));
      } catch {
        result = mockJobFit(job, profileSummary);
      }
    }

    if (!result) result = mockJobFit(job, profileSummary);

    if (applicationId && typeof result.score === 'number') {
      await aiRepo.create({
        applicationId,
        aiScore: result.score,
        coverLetterText: result.rationale,
      }).catch(() => {});
    }

    return { ...result, mock: !process.env.OPENAI_API_KEY };
  }
}
