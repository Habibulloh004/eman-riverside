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

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
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

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<ChangePasswordResponse>('/api/admin/password', data),
};
