import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/common/Card.jsx';
import { ApplicationRow } from '../components/dashboard/ApplicationRow.jsx';
import { applicationService } from '../services/applicationService.js';

export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationService.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => applicationService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-500">Track status, notes, and progress</p>
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">{error.message}</p>}

      <Card className="overflow-hidden p-0">
        {applications.length === 0 ? (
          <p className="p-6 text-slate-500">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {applications.map((app) => (
              <ApplicationRow
                key={app.id}
                application={app}
                onStatusChange={(status) => updateMutation.mutate({ id: app.id, status })}
                updating={updateMutation.isPending}
              />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
