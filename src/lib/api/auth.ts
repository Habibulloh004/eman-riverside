import apiClient from './client';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expires_at: number;
}

interface MeResponse {
  username: string;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/api/auth/login', data),

  refresh: () =>
    apiClient.post<LoginResponse>('/api/auth/refresh'),

  logout: () =>
    apiClient.post('/api/auth/logout'),

  me: () =>
    apiClient.get<MeResponse>('/api/admin/me'),
};
