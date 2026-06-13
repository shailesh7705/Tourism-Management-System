const BASE_URL = 'https://tourism-management-system-uhiz.onrender.com/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },
  post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'POST', body });
  },
  put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'PUT', body });
  },
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  }
};
