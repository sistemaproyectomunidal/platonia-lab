/**
 * React Query Hooks for Podcast Features
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { podcastService } from '@/services/api';
import type { Episode } from '@/types';
import type { ApiResponse } from '@/services/api/base';

// Query Keys
export const podcastKeys = {
  all: ['podcast'] as const,
  episodes: () => [...podcastKeys.all, 'episodes'] as const,
  episodesList: (options?: any) => [...podcastKeys.episodes(), 'list', options] as const,
  episode: (id: string) => [...podcastKeys.episodes(), 'detail', id] as const,
  episodeByNumber: (num: number) => [...podcastKeys.episodes(), 'number', num] as const,
  search: (query: string) => [...podcastKeys.episodes(), 'search', query] as const,
};

/**
 * Hook to fetch podcast episodes
 */
export function usePodcastEpisodes(options?: {
  includeUnpublished?: boolean;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: podcastKeys.episodesList(options),
    queryFn: async () => {
      const response = await podcastService.fetchEpisodes(options);
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
 * Hook to get a single episode by ID
 */
export function usePodcastEpisode(id: string) {
  return useQuery({
    queryKey: podcastKeys.episode(id),
    queryFn: async () => {
      const response = await podcastService.getEpisodeById(id);
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
 * Hook to get an episode by number
 */
export function usePodcastEpisodeByNumber(episodeNumber: number) {
  return useQuery({
    queryKey: podcastKeys.episodeByNumber(episodeNumber),
    queryFn: async () => {
      const response = await podcastService.getEpisodeByNumber(episodeNumber);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: episodeNumber > 0,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to create an episode
 */
export function useCreateEpisode(
  options?: UseMutationOptions<
    ApiResponse<Episode>,
    Error,
    {
      title: string;
      description?: string;
      episode_number: number;
      audio_url?: string;
      duration?: number;
      transcript_key?: string;
      is_published?: boolean;
    }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episode) => {
      const response = await podcastService.createEpisode(episode);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodes() });
    },
    ...options,
  });
}

/**
 * Hook to update an episode
 */
export function useUpdateEpisode(
  options?: UseMutationOptions<ApiResponse<Episode>, Error, { id: string; updates: Partial<Episode> }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await podcastService.updateEpisode(id, updates);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: podcastKeys.episode(id) });
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodes() });
    },
    ...options,
  });
}

/**
 * Hook to delete an episode
 */
export function useDeleteEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await podcastService.deleteEpisode(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: podcastKeys.episode(deletedId) });
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodes() });
    },
  });
}

/**
 * Hook to toggle publish status
 */
export function useToggleEpisodePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const response = await podcastService.togglePublish(id, isPublished);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: podcastKeys.episode(id) });
      queryClient.invalidateQueries({ queryKey: podcastKeys.episodes() });
    },
  });
}

/**
 * Hook to search episodes
 */
export function useSearchEpisodes(query: string) {
  return useQuery({
    queryKey: podcastKeys.search(query),
    queryFn: async () => {
      const response = await podcastService.searchEpisodes(query);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
