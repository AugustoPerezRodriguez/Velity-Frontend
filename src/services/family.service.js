import { apiGet } from './apiClient';

export async function getFamilyMembers() {
  return apiGet('/api/family');
}

export async function getFamilySummary() {
  return apiGet('/api/family/summary');
}

export async function getFamilyMember(id) {
  return apiGet(`/api/family/${id}`);
}

export async function getFamilyMemberPermissions(id) {
  return apiGet(`/api/family/${id}/permissions`);
}
