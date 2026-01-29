"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi, CreateGalleryRequest } from "@/lib/api/gallery";

export const galleryKeys = {
  all: ["gallery"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  list: (params?: { type?: string }) => [...galleryKeys.lists(), params] as const,
  public: (params?: { type?: string }) => [...galleryKeys.all, "public", params] as const,
  details: () => [...galleryKeys.all, "detail"] as const,
  detail: (id: number) => [...galleryKeys.details(), id] as const,
};

// Public hooks
export function useGalleryPublic(params?: { type?: string }) {
  return useQuery({
    queryKey: galleryKeys.public(params),
    queryFn: () => galleryApi.listPublic(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin hooks
export function useGalleryAdmin() {
  return useQuery({
    queryKey: galleryKeys.lists(),
    queryFn: () => galleryApi.list(),
    staleTime: 60 * 1000, // 1 minute for admin
  });
}

export function useGalleryItem(id: number) {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => galleryApi.get(id),
    staleTime: 60 * 1000,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGalleryRequest> }) =>
      galleryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

// Prefetch for SSR/ISR
export async function prefetchGalleryPublic(params?: { type?: string }) {
  return galleryApi.listPublic(params);
}
