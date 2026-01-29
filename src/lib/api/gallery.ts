import apiClient from './client';

export interface GalleryItem {
  id: number;
  title: string;
  title_uz: string;
  description: string;
  description_uz: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface GalleryListResponse {
  items: GalleryItem[];
  total: number;
}

export interface CreateGalleryRequest {
  title: string;
  title_uz: string;
  description: string;
  description_uz: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export const galleryApi = {
  // Public
  listPublic: (params?: { category?: string; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.type) searchParams.append('type', params.type);
    const query = searchParams.toString();
    return apiClient.get<GalleryListResponse>(`/api/gallery${query ? `?${query}` : ''}`);
  },

  // Admin
  list: (params?: { category?: string; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.type) searchParams.append('type', params.type);
    const query = searchParams.toString();
    return apiClient.get<GalleryListResponse>(`/api/admin/gallery${query ? `?${query}` : ''}`);
  },

  get: (id: number) =>
    apiClient.get<GalleryItem>(`/api/admin/gallery/${id}`),

  create: (data: CreateGalleryRequest) =>
    apiClient.post<GalleryItem>('/api/admin/gallery', data),

  update: (id: number, data: Partial<CreateGalleryRequest>) =>
    apiClient.put<GalleryItem>(`/api/admin/gallery/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/api/admin/gallery/${id}`),

  upload: (file: File) =>
    apiClient.upload('/api/admin/gallery/upload', file),

  reorder: (items: { id: number; sort_order: number }[]) =>
    apiClient.post('/api/admin/gallery/reorder', { items }),
};
