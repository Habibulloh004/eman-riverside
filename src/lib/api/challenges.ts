import apiClient from './client';

export interface Challenge {
  id: number;
  title: string;
  title_uz: string;
  description: string;
  description_uz: string;
  image: string;
  prize: string;
  prize_uz: string;
  start_date: string;
  end_date: string;
  max_users: number;
  sort_order: number;
  is_published: boolean;
  participants?: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeParticipant {
  id: number;
  challenge_id: number;
  phone: string;
  name: string;
  status: 'active' | 'completed' | 'cancelled';
  joined_at: string;
  completed_at: string | null;
  challenge?: Challenge;
}

export interface CreateChallengeRequest {
  title: string;
  title_uz: string;
  description: string;
  description_uz: string;
  image: string;
  prize: string;
  prize_uz: string;
  start_date: string;
  end_date: string;
  max_users: number;
  sort_order: number;
  is_published: boolean;
}

interface ChallengeListResponse {
  items: Challenge[];
  total: number;
}

interface ParticipantListResponse {
  items: ChallengeParticipant[];
  total: number;
}

export const challengesApi = {
  // Public
  listPublic: () =>
    apiClient.get<ChallengeListResponse>('/api/challenges'),

  myChallenge: (phone: string) =>
    apiClient.get<{ active: boolean; participation?: ChallengeParticipant }>(
      `/api/challenges/my?phone=${encodeURIComponent(phone)}`
    ),

  join: (id: number, data: { phone: string; name: string }) =>
    apiClient.post<{ success: boolean; message: string; participation: ChallengeParticipant; active_challenge?: number }>(
      `/api/challenges/${id}/join`, data
    ),

  cancel: (id: number, phone: string) =>
    apiClient.post<{ success: boolean; message: string }>(
      `/api/challenges/${id}/cancel`, { phone }
    ),

  // Admin
  list: () =>
    apiClient.get<ChallengeListResponse>('/api/admin/challenges'),

  get: (id: number) =>
    apiClient.get<Challenge>(`/api/admin/challenges/${id}`),

  create: (data: CreateChallengeRequest) =>
    apiClient.post<Challenge>('/api/admin/challenges', data),

  update: (id: number, data: Partial<CreateChallengeRequest>) =>
    apiClient.put<Challenge>(`/api/admin/challenges/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/api/admin/challenges/${id}`),

  upload: (file: File) =>
    apiClient.upload('/api/admin/challenges/upload', file),

  participants: (id: number) =>
    apiClient.get<ParticipantListResponse>(`/api/admin/challenges/${id}/participants`),
};
