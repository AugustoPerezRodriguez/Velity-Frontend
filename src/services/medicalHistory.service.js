import { apiGet } from './apiClient';

export async function getMedicalHistory() {
  return apiGet('/api/medical-history');
}

export async function getFilteredMedicalHistory(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) params.set('category', filters.category);
  if (filters.year) params.set('year', String(filters.year));
  if (filters.critical !== undefined && filters.critical !== '') {
    params.set('critical', String(filters.critical));
  }

  const query = params.toString();
  return apiGet(`/api/medical-history/filter${query ? `?${query}` : ''}`);
}

export async function getMedicalRecord(id) {
  return apiGet(`/api/medical-history/${id}`);
}
