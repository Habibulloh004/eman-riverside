import apiClient from './client';

export interface Project {
  id: number;
  type_ru: string;
  type_uz: string;
  area_ru: string;
  area_uz: string;
  description_ru: string;
  description_uz: string;
  image: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectListResponse {
  items: Project[];
  total: number;
}

export interface CreateProjectRequest {
  type_ru: string;
  type_uz: string;
  area_ru: string;
  area_uz: string;
  description_ru: string;
  description_uz: string;
  image: string;
  sort_order: number;
  is_published: boolean;
}

export const projectsApi = {
  // Public
  listPublic: () => {
    return apiClient.get<ProjectListResponse>('/api/projects');
  },

  // Admin
  list: () => {
    return apiClient.get<ProjectListResponse>('/api/admin/projects');
  },

  get: (id: number) =>
    apiClient.get<Project>(`/api/admin/projects/${id}`),

  create: (data: CreateProjectRequest) =>
    apiClient.post<Project>('/api/admin/projects', data),

  update: (id: number, data: CreateProjectRequest) =>
    apiClient.put<Project>(`/api/admin/projects/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/api/admin/projects/${id}`),

  upload: (file: File) =>
    apiClient.upload('/api/admin/projects/upload', file),
};
