import { useState } from 'react';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { aiService } from '../../services/aiService.js';
import { useAuth } from '../../hooks/useAuth.js';

export function AiPanel({ job }) {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [cvResult, setCvResult] = useState(null);
  const [fitResult, setFitResult] = useState(null);
  const [bullets, setBullets] = useState('Built scalable React apps; led team of 4 engineers.');
  const [loading, setLoading] = useState('');

  const run = async (key, fn) => {
    setLoading(key);
    try {
      await fn();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading('');
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold">AI Assistant</h2>
      <p className="mt-1 text-sm text-slate-500">Works in demo mode without an API key</p>

      <div className="mt-4 space-y-4">
        <div>
          <Button
            variant="secondary"
            disabled={!!loading}
            onClick={() =>
              run('cover', async () => {
                const res = await aiService.coverLetter({
                  jobTitle: job.title,
                  company: job.company,
                  jobDescription: job.description,
                });
                setCoverLetter(res.coverLetter + (res.mock ? '\n\n[Demo mode]' : ''));
              })
            }
          >
            {loading === 'cover' ? 'Generating…' : 'Generate cover letter'}
          </Button>
          {coverLetter && (
            <textarea
              readOnly
              className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm"
              rows={8}
              value={coverLetter}
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">CV bullets</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm"
            rows={2}
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
          />
          <Button
            variant="secondary"
            className="mt-2"
            disabled={!!loading}
            onClick={() =>
              run('cv', async () => {
                const res = await aiService.cvImprove({ bullets });
                setCvResult(res);
              })
            }
          >
            {loading === 'cv' ? 'Improving…' : 'Improve CV bullets'}
          </Button>
          {cvResult && (
            <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium">{cvResult.improved}</p>
              {cvResult.tips?.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-slate-600">
                  {cvResult.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div>
          <Button
            disabled={!!loading}
            onClick={() =>
              run('fit', async () => {
                const res = await aiService.jobFit({
                  jobId: job.id,
                  jobDescription: job.description,
                  profileSummary: `${user?.name} — software professional`,
                });
                setFitResult(res);
              })
            }
          >
            {loading === 'fit' ? 'Scoring…' : 'Job fit score'}
          </Button>
          {fitResult && (
            <div className="mt-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-brand-600">{fitResult.score}</div>
                <span className="text-slate-500">/ 100</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{fitResult.rationale}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
