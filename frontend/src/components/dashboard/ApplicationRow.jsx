import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate.js';

const statuses = ['applied', 'interview', 'rejected', 'offer'];

export function ApplicationRow({ application, onStatusChange, updating }) {
  const job = application.jobs;

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to={`/jobs/${application.job_id}`} className="font-medium text-slate-900 hover:text-brand-600">
          {job?.title || 'Unknown role'}
        </Link>
        <p className="text-sm text-slate-500">{job?.company}</p>
        <p className="mt-1 text-xs text-slate-400">Applied {formatDate(application.applied_at)}</p>
        {application.notes && <p className="mt-2 text-sm text-slate-600">{application.notes}</p>}
      </div>
      <select
        value={application.status}
        disabled={updating}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm capitalize focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </li>
  );
}
