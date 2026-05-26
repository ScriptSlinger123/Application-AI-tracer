import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card.jsx';
import { StatusChart } from '../components/dashboard/StatusChart.jsx';
import { applicationService } from '../services/applicationService.js';
import { formatDate } from '../utils/formatDate.js';

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
  offer: 'bg-emerald-100 text-emerald-800',
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => applicationService.dashboard(),
  });

  if (isLoading) return <p className="text-slate-500">Loading dashboard…</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  const { byStatus = {}, total = 0, recent = [] } = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your job search pipeline</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(byStatus).map(([status, count]) => (
          <Card key={status} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{status}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{count}</p>
          </Card>
        ))}
        <Card className="text-center sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total</p>
          <p className="mt-1 text-3xl font-bold text-brand-600">{total}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Applications by status</h2>
          <StatusChart data={byStatus} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <Link to="/applications" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">No applications yet. Browse jobs to get started.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((app) => (
                <li key={app.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">{app.jobs?.title}</p>
                    <p className="text-sm text-slate-500">{app.jobs?.company}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
