import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { useJob } from '../hooks/useJobs.js';
import { applicationService } from '../services/applicationService.js';
import { aiService } from '../services/aiService.js';
import { formatDate } from '../utils/formatDate.js';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: job, isLoading, error } = useJob(id);

  const [highlights, setHighlights] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [fitResult, setFitResult] = useState(null);
  const [cvBullets, setCvBullets] = useState('Led team projects\nBuilt REST APIs');
  const [improvedBullets, setImprovedBullets] = useState(null);
  const [aiLoading, setAiLoading] = useState('');
  const [applyNotes, setApplyNotes] = useState('');

  const applyMutation = useMutation({
    mutationFn: () =>
      applicationService.create({
        job_id: id,
        notes: applyNotes || null,
        cv_version: '1',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/applications');
    },
  });

  const runCoverLetter = async () => {
    setAiLoading('cover');
    try {
      const result = await aiService.coverLetter({ job_id: id, highlights });
      setCoverLetter(result.coverLetter);
    } catch (e) {
      setCoverLetter(`Error: ${e.message}`);
    } finally {
      setAiLoading('');
    }
  };

  const runJobFit = async () => {
    setAiLoading('fit');
    try {
      const result = await aiService.jobFit({ job_id: id, resume_summary: highlights });
      setFitResult(result);
    } catch (e) {
      setFitResult({ score: 0, rationale: e.message, mock: true });
    } finally {
      setAiLoading('');
    }
  };

  const runCvImprove = async () => {
    setAiLoading('cv');
    try {
      const bullets = cvBullets.split('\n').filter(Boolean);
      const result = await aiService.improveCV({ bullets, target_role: job?.title });
      const items = Array.isArray(result.improved)
        ? result.improved
        : result.improved
          ? [result.improved]
          : [];
      setImprovedBullets(items);
    } catch (e) {
      setImprovedBullets([e.message]);
    } finally {
      setAiLoading('');
    }
  };

  if (isLoading) return <p className="text-slate-500">Loading job…</p>;

  if (error || !job) {
    return (
      <>
        <p className="text-red-600">{error?.message || 'Job not found'}</p>
        <Link to="/jobs" className="text-brand-600 hover:underline">
          Back to jobs
        </Link>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/jobs" className="text-sm text-brand-600 hover:underline">
        ← Back to jobs
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-lg text-slate-600">
          {job.company}
          {job.location ? ` · ${job.location}` : ''}
        </p>
        <p className="mt-1 text-sm text-slate-400">Posted {formatDate(job.created_at)}</p>
      </div>

      <Card title="Description">
        <p className="whitespace-pre-wrap text-slate-700">{job.description || 'No description.'}</p>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-brand-600 hover:underline"
          >
            View original posting
          </a>
        )}
      </Card>

      <Card title="Apply">
        <textarea
          className="mb-3 w-full rounded-lg border border-slate-200 p-3 text-sm"
          rows={3}
          placeholder="Notes for this application (optional)"
          value={applyNotes}
          onChange={(e) => setApplyNotes(e.target.value)}
        />
        <Button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
          {applyMutation.isPending ? 'Submitting…' : 'Submit application'}
        </Button>
        {applyMutation.isError && (
          <p className="mt-2 text-sm text-red-600">{applyMutation.error.message}</p>
        )}
      </Card>

      <Card title="AI Assistant">
        <p className="mb-3 text-sm text-slate-500">
          Works with OpenAI when configured; otherwise shows demo responses.
        </p>
        <textarea
          className="mb-3 w-full rounded-lg border border-slate-200 p-3 text-sm"
          rows={2}
          placeholder="Your highlights / resume summary"
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={runCoverLetter} disabled={!!aiLoading}>
            {aiLoading === 'cover' ? 'Generating…' : 'Cover letter'}
          </Button>
          <Button variant="secondary" onClick={runJobFit} disabled={!!aiLoading}>
            {aiLoading === 'fit' ? 'Scoring…' : 'Job fit score'}
          </Button>
        </div>

        {coverLetter && (
          <div className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            {coverLetter}
          </div>
        )}

        {fitResult && (
          <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50 p-4">
            <p className="text-2xl font-bold text-brand-700">{fitResult.score}/100</p>
            <p className="mt-1 text-sm text-slate-700">{fitResult.rationale}</p>
            {fitResult.mock && <p className="mt-1 text-xs text-slate-500">Demo mode</p>}
          </div>
        )}
      </Card>

      <Card title="Improve CV bullets">
        <textarea
          className="mb-3 w-full rounded-lg border border-slate-200 p-3 font-mono text-sm"
          rows={4}
          value={cvBullets}
          onChange={(e) => setCvBullets(e.target.value)}
        />
        <Button variant="secondary" onClick={runCvImprove} disabled={!!aiLoading}>
          {aiLoading === 'cv' ? 'Improving…' : 'Improve bullets'}
        </Button>
        {improvedBullets && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {improvedBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
