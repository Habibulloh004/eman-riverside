import apiClient from "./client";

export interface MapIconType {
  id: number;
  name: string;
  name_ru: string;
  name_uz: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface MapIcon {
  id: number;
  name: string;
  name_ru: string;
  name_uz: string;
  lat: number;
  lng: number;
  type_id: number;
  type?: MapIconType;
  created_at: string;
  updated_at: string;
}

interface MapIconListResponse {
  items: MapIcon[];
  total: number;
}

interface MapIconTypeListResponse {
  items: MapIconType[];
  total: number;
}

export interface CreateMapIconRequest {
  name: string;
  name_ru: string;
  name_uz: string;
  lat: number;
  lng: number;
  type_id: number;
}

export interface CreateMapIconTypeRequest {
  name: string;
  name_ru: string;
  name_uz: string;
  icon: string;
}

export const mapIconsApi = {
  // Public
  listPublic: () =>
    apiClient.get<MapIconListResponse>("/api/map-icons"),

  // Admin - types
  listTypes: () =>
    apiClient.get<MapIconTypeListResponse>("/api/admin/map-icon-types"),

  createType: (data: CreateMapIconTypeRequest) =>
    apiClient.post<MapIconType>("/api/admin/map-icon-types", data),

  updateType: (id: number, data: CreateMapIconTypeRequest) =>
    apiClient.put<MapIconType>(`/api/admin/map-icon-types/${id}`, data),

  deleteType: (id: number) =>
    apiClient.delete(`/api/admin/map-icon-types/${id}`),

  uploadTypeIcon: (file: File) =>
    apiClient.upload("/api/admin/map-icon-types/upload", file),

  // Admin - markers
  list: () =>
    apiClient.get<MapIconListResponse>("/api/admin/map-icons"),

  create: (data: CreateMapIconRequest) =>
    apiClient.post<MapIcon>("/api/admin/map-icons", data),

  update: (id: number, data: CreateMapIconRequest) =>
    apiClient.put<MapIcon>(`/api/admin/map-icons/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/api/admin/map-icons/${id}`),
};
