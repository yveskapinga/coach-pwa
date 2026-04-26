const API_URL = '/api'; // même domaine en production

function getToken() {
  return localStorage.getItem('token') || '';
}

async function api(path, opts = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...opts.headers,
    },
  });
  const data = res.status !== 204 ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const auth = {
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
  logout: () => api('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }) }),
  resetRequest: (body) => api('/auth/reset-request', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => api('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
};

export const days = {
  list: (page = 1, limit = 20) => api(`/days?page=${page}&limit=${limit}`),
  today: (date) => api(`/days/today?date=${encodeURIComponent(date)}`),
  create: (body) => api('/days', { method: 'POST', body: JSON.stringify(body) }),
  get: (id) => api(`/days/${id}`),
  morning: (id, body) => api(`/days/${id}/morning`, { method: 'POST', body: JSON.stringify(body) }),
  execution: (id, body) => api(`/days/${id}/execution`, { method: 'PATCH', body: JSON.stringify(body) }),
  evening: (id, body) => api(`/days/${id}/evening`, { method: 'POST', body: JSON.stringify(body) }),
  gratitude: (id, body) => api(`/days/${id}/gratitude`, { method: 'POST', body: JSON.stringify(body) }),
  score: (id) => api(`/days/${id}/score`),
};

export const concepts = {
  suggest: (type, q) => api(`/concepts/suggest?type=${encodeURIComponent(type)}&q=${encodeURIComponent(q)}`),
};

export const analytics = {
  patterns: () => api('/patterns'),
};

export const push = {
  subscribe: (body) => api('/push/subscribe', { method: 'POST', body: JSON.stringify(body) }),
};
