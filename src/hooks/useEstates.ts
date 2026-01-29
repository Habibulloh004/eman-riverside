"use client";

import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { estatesApi, Estate, EstateFilters } from "@/lib/api/estates";

export const estateKeys = {
  all: ["estates"] as const,
  lists: () => [...estateKeys.all, "list"] as const,
  list: (filters?: EstateFilters) => [...estateKeys.lists(), filters] as const,
  paginated: (filters?: EstateFilters) => [...estateKeys.all, "paginated", filters] as const,
  details: () => [...estateKeys.all, "detail"] as const,
  detail: (id: number) => [...estateKeys.details(), id] as const,
};

export function useEstates(filters?: EstateFilters) {
  return useQuery({
    queryKey: estateKeys.list(filters),
    queryFn: () => estatesApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Paginated estates with keepPreviousData for smooth pagination
export function useEstatesPaginated(filters?: EstateFilters) {
  return useQuery({
    queryKey: estateKeys.paginated(filters),
    queryFn: () => estatesApi.listPaginated(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
  });
}

export function useEstate(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: estateKeys.detail(id),
    queryFn: () => estatesApi.getById(id),
    staleTime: 5 * 60 * 1000,
    initialData: () => {
      // Try to get from list cache first
      const lists = queryClient.getQueriesData<Estate[]>({ queryKey: estateKeys.lists() });
      for (const [, data] of lists) {
        if (data) {
          const estate = data.find((e) => Number(e.id) === Number(id));
          if (estate) return estate;
        }
      }
      return undefined;
    },
  });
}

export function useRandomEstates(count: number = 2) {
  const { data: estates, ...rest } = useEstates({ type: "living" });

  const randomEstates = estates
    ? [...estates].sort(() => Math.random() - 0.5).slice(0, count)
    : [];

  return { data: randomEstates, ...rest };
}

// Prefetch for SSR/ISR
export async function prefetchEstates(filters?: EstateFilters) {
  return estatesApi.list(filters);
}

export async function prefetchEstate(id: number) {
  return estatesApi.getById(id);
}
