/**
 * React Query Hooks for Corpus Features
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { corpusService } from '@/services/api';
import type { CorpusEntry } from '@/types';
import type { ApiResponse } from '@/services/api/base';

// Query Keys
export const corpusKeys = {
  all: ['corpus'] as const,
  entries: () => [...corpusKeys.all, 'entries'] as const,
  entriesList: (options?: any) => [...corpusKeys.entries(), 'list', options] as const,
  entry: (id: string) => [...corpusKeys.entries(), 'detail', id] as const,
  entryBySlug: (slug: string) => [...corpusKeys.entries(), 'slug', slug] as const,
  search: (query: string) => [...corpusKeys.entries(), 'search', query] as const,
};

/**
 * Hook to fetch corpus entries
 */
export function useCorpusEntries(options?: {
  status?: 'published' | 'draft';
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: corpusKeys.entriesList(options),
    queryFn: async () => {
      const response = await corpusService.fetchEntries(options);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get a corpus entry by slug
 */
export function useCorpusEntryBySlug(slug: string) {
  return useQuery({
    queryKey: corpusKeys.entryBySlug(slug),
    queryFn: async () => {
      const response = await corpusService.getEntryBySlug(slug);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get a corpus entry by ID
 */
export function useCorpusEntry(id: string) {
  return useQuery({
    queryKey: corpusKeys.entry(id),
    queryFn: async () => {
      const response = await corpusService.getEntryById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to create a corpus entry
 */
export function useCreateCorpusEntry(
  options?: UseMutationOptions<ApiResponse<CorpusEntry>, Error, Omit<CorpusEntry, 'id' | 'created_at' | 'updated_at'>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry) => {
      const response = await corpusService.createEntry(entry);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: corpusKeys.entries() });
    },
    ...options,
  });
}

/**
 * Hook to update a corpus entry
 */
export function useUpdateCorpusEntry(
  options?: UseMutationOptions<ApiResponse<CorpusEntry>, Error, { id: string; updates: Partial<CorpusEntry> }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await corpusService.updateEntry(id, updates);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: corpusKeys.entry(id) });
      queryClient.invalidateQueries({ queryKey: corpusKeys.entries() });
    },
    ...options,
  });
}

/**
 * Hook to delete a corpus entry
 */
export function useDeleteCorpusEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await corpusService.deleteEntry(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: corpusKeys.entry(deletedId) });
      queryClient.invalidateQueries({ queryKey: corpusKeys.entries() });
    },
  });
}

/**
 * Hook to search corpus entries
 */
export function useSearchCorpus(query: string) {
  return useQuery({
    queryKey: corpusKeys.search(query),
    queryFn: async () => {
      const response = await corpusService.searchEntries(query);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: query.length > 2, // Only search if query is meaningful
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
