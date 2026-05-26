import { Card } from '../common/Card.jsx';
import { formatDate } from '../../utils/formatDate.js';

export function JobCard({ job }) {
  return (
    <Card className="h-full transition hover:border-brand-200 hover:shadow-md">
      <h3 className="font-semibold text-slate-900">{job.title}</h3>
      <p className="text-sm font-medium text-brand-600">{job.company}</p>
      {job.location && <p className="mt-1 text-sm text-slate-500">{job.location}</p>}
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{job.description}</p>
      <p className="mt-3 text-xs text-slate-400">{formatDate(job.created_at)}</p>
    </Card>
  );
}
