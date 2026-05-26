import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card.jsx';
import { Input } from '../components/common/Input.jsx';
import { JobCard } from '../components/jobs/JobCard.jsx';
import { useJobs } from '../hooks/useJobs.js';

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const { jobs, isLoading, error } = useJobs({ search });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs Board</h1>
          <p className="text-slate-500">Browse openings and apply in one click</p>
        </div>
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <p className="text-slate-500">Loading jobs…</p>}
      {error && <p className="text-red-600">{error.message}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {jobs?.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`}>
            <JobCard job={job} />
          </Link>
        ))}
      </div>

      {!isLoading && jobs?.length === 0 && (
        <Card>
          <p className="text-slate-500">No jobs found. Run the seed script or add jobs via API.</p>
        </Card>
      )}
    </div>
  );
}
