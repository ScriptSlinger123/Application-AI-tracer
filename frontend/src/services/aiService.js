import { apiRequest } from './api.js';

export const aiService = {
  coverLetter: (payload) =>
    apiRequest('/ai/cover-letter', { method: 'POST', body: JSON.stringify(payload) }),
  improveCV: (payload) =>
    apiRequest('/ai/cv-improve', { method: 'POST', body: JSON.stringify(payload) }),
  cvImprove: (payload) =>
    apiRequest('/ai/cv-improve', { method: 'POST', body: JSON.stringify(payload) }),
  jobFit: (payload) => apiRequest('/ai/job-fit', { method: 'POST', body: JSON.stringify(payload) }),
};
