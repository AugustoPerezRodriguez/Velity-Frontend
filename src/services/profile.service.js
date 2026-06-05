import { apiGet, apiPut } from './apiClient';

export async function getMyProfile() {
  return apiGet('/api/profile/me');
}

export async function updateMyProfile(data) {
  return apiPut('/api/profile/me', data);
}
