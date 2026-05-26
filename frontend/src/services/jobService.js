import { apiRequest } from './api.js';

export const jobService = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    const query = qs.toString();
    return apiRequest(`/jobs${query ? `?${query}` : ''}`).then((data) => data.jobs ?? data);
  },
  get: (id) => apiRequest(`/jobs/${id}`),
  getById: (id) => apiRequest(`/jobs/${id}`),
  create: (payload) => apiRequest('/jobs', { method: 'POST', body: JSON.stringify(payload) }),
};
