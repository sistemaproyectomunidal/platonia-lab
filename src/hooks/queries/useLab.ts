/**
 * React Query Hooks for Laboratory Features
 * Optimized hooks with caching, refetching, and error handling
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { labService } from '@/services/api';
import type { LabDemo, AIRequest, AIResponse, DemoSaveRequest } from '@/types/api';
import type { ApiResponse } from '@/services/api/base';

// Query Keys
export const labKeys = {
  all: ['lab'] as const,
  demos: () => [...labKeys.all, 'demos'] as const,
  demosList: (options?: any) => [...labKeys.demos(), 'list', options] as const,
  demo: (id: string) => [...labKeys.demos(), 'detail', id] as const,
};

/**
 * Hook to fetch lab demos
 */
export function useLabDemos(options?: {
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at';
  ascending?: boolean;
}) {
  return useQuery({
    queryKey: labKeys.demosList(options),
    queryFn: async () => {
      const response = await labService.fetchDemos(options);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get a single lab demo
 */
export function useLabDemo(id: string) {
  return useQuery({
    queryKey: labKeys.demo(id),
    queryFn: async () => {
      const response = await labService.getDemoById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to save a demo result
 */
export function useSaveDemoResult(
  options?: UseMutationOptions<ApiResponse<{ id: string }>, Error, DemoSaveRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DemoSaveRequest) => {
      const response = await labService.saveDemoResult(payload);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch demos list
      queryClient.invalidateQueries({ queryKey: labKeys.demos() });
    },
    ...options,
  });
}

/**
 * Hook to delete a lab demo
 */
export function useDeleteLabDemo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await labService.deleteDemo(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: labKeys.demo(deletedId) });
      queryClient.invalidateQueries({ queryKey: labKeys.demos() });
    },
  });
}

/**
 * Hook to generate AI response
 */
export function useGenerateAI(
  options?: UseMutationOptions<ApiResponse<AIResponse>, Error, AIRequest>
) {
  return useMutation({
    mutationFn: async (request: AIRequest) => {
      const response = await labService.generateAIResponse(request);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    ...options,
  });
}

/**
 * Legacy compatibility - maintains backward compatibility
 * @deprecated Use useGenerateAI instead
 */
export function useOpenAIChat() {
  return useGenerateAI();
}
