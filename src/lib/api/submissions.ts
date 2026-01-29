import apiClient from './client';

export interface Submission {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  estate_id: number | null;
  payment_plan: string;
  status: 'new' | 'contacted' | 'closed';
  notes: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

interface SubmissionsListResponse {
  items: Submission[];
  total: number;
  page: number;
  limit: number;
}

interface SubmissionStats {
  total: number;
  new: number;
  contacted: number;
  closed: number;
}

export interface CreateSubmissionRequest {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
  estate_id?: number;
  payment_plan?: string;
}

export const submissionsApi = {
  // Public
  create: (data: CreateSubmissionRequest) =>
    apiClient.post<{ success: boolean; id: number }>('/api/submissions', data),

  // Admin
  list: (params?: { status?: string; source?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.source) searchParams.append('source', params.source);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const query = searchParams.toString();
    return apiClient.get<SubmissionsListResponse>(`/api/admin/submissions${query ? `?${query}` : ''}`);
  },

  get: (id: number) =>
    apiClient.get<Submission>(`/api/admin/submissions/${id}`),

  update: (id: number, data: { status?: string; notes?: string }) =>
    apiClient.put<Submission>(`/api/admin/submissions/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/api/admin/submissions/${id}`),

  stats: () =>
    apiClient.get<SubmissionStats>('/api/admin/submissions/stats'),
};
