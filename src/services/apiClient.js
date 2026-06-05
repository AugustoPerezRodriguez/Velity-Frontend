import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function parseResponse(response) {
  let body;

  try {
    body = await response.json();
  } catch {
    throw new Error('Invalid server response');
  }

  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return body.data;
}

export async function apiClient(endpoint, options = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
}

export async function apiGet(endpoint) {
  return apiClient(endpoint, { method: 'GET' });
}

export async function apiPut(endpoint, data) {
  return apiClient(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiPost(endpoint, data) {
  return apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiDelete(endpoint) {
  return apiClient(endpoint, { method: 'DELETE' });
}
