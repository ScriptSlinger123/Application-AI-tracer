import { apiRequest } from './api.js';

export const authService = {
  register: (payload) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  profile: () => apiRequest('/auth/profile'),
};
