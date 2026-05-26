import { useQuery } from '@tanstack/react-query';
import { jobService } from '../services/jobService.js';

export function useJobs({ search } = {}) {
  const query = useQuery({
    queryKey: ['jobs', search],
    queryFn: () => jobService.list({ search }),
  });
  return { jobs: query.data, ...query };
}

export function useJob(id) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobService.get(id),
    enabled: Boolean(id),
  });
}
