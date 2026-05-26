// Use /api in dev so Vite proxies to the backend (avoids CORS / connection issues)
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error(
      'Cannot reach the API. Start the backend with: cd backend && npm run dev'
    );
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json.message || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.details = json.details;
    throw err;
  }

  return json.data !== undefined ? json.data : json;
}

export { API_URL };
