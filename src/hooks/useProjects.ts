"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, Project, CreateProjectRequest } from "@/lib/api/projects";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: () => [...projectKeys.lists(), "admin"] as const,
  public: () => [...projectKeys.all, "public"] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
};

// Public hooks
export function useProjectsPublic() {
  return useQuery({
    queryKey: projectKeys.public(),
    queryFn: () => projectsApi.listPublic(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin hooks
export function useProjectsAdmin() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectsApi.list(),
    staleTime: 60 * 1000, // 1 minute for admin
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.get(id),
    staleTime: 60 * 1000,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProjectRequest }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Prefetch for SSR/ISR
export async function prefetchProjectsPublic() {
  return projectsApi.listPublic();
}
