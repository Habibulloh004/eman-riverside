"use client";

import { useMemo } from "react";
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

  // Keep selection stable to avoid intermittent UI changes between renders/routes.
  const randomEstates = useMemo(() => {
    if (!estates) return [];

    const seen = new Set<number>();
    const uniqueEstates = estates.filter((e) => {
      const id = Number(e.id);
      if (Number.isNaN(id) || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const sorted = [...uniqueEstates].sort((a, b) => Number(b.id) - Number(a.id));

    const selected: Estate[] = [];
    const selectedIds = new Set<number>();
    const pushIfNeeded = (estate: Estate) => {
      const id = Number(estate.id);
      if (selected.length >= count || selectedIds.has(id)) return;
      selected.push(estate);
      selectedIds.add(id);
    };

    // Priority buckets: preferred -> valid floor -> any published estate from response
    sorted.filter((e) => e.estate_floor > 0 && e.estate_area >= 35).forEach(pushIfNeeded);
    sorted.filter((e) => e.estate_floor > 0).forEach(pushIfNeeded);
    sorted.forEach(pushIfNeeded);

    if (typeof window === "undefined") {
      return selected.slice(0, count);
    }

    const key = `floor-plans-selected-ids-${count}`;
    const savedRaw = sessionStorage.getItem(key);
    if (savedRaw) {
      try {
        const savedIds = JSON.parse(savedRaw) as number[];
        if (Array.isArray(savedIds) && savedIds.length > 0) {
          const pinned = savedIds
            .map((id) => sorted.find((estate) => Number(estate.id) === Number(id)))
            .filter((estate): estate is Estate => Boolean(estate))
            .slice(0, count);
          if (pinned.length === count) {
            return pinned;
          }
        }
      } catch {
        // Ignore parse errors and overwrite below
      }
    }

    const next = selected.slice(0, count);
    sessionStorage.setItem(key, JSON.stringify(next.map((estate) => Number(estate.id))));
    return next;
  }, [estates, count]);

  return { data: randomEstates, ...rest };
}

// Prefetch for SSR/ISR
export async function prefetchEstates(filters?: EstateFilters) {
  return estatesApi.list(filters);
}

export async function prefetchEstate(id: number) {
  return estatesApi.getById(id);
}
