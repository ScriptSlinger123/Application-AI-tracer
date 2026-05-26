import { apiRequest } from './api.js';

export const applicationService = {
  list: () => apiRequest('/applications'),
  get: (id) => apiRequest(`/applications/${id}`),
  create: (payload) =>
    apiRequest('/applications', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    apiRequest(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  stats: () => apiRequest('/applications/stats'),
  dashboard: () => apiRequest('/dashboard'),
};
