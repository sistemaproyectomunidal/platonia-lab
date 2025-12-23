/**
 * React Query Hooks for Socratic Questions
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { socraticService } from '@/services/api';
import type { SocraticQuestion } from '@/types';
import type { ApiResponse } from '@/services/api/base';

// Query Keys
export const socraticKeys = {
  all: ['socratic'] as const,
  questions: () => [...socraticKeys.all, 'questions'] as const,
  questionsList: (options?: any) => [...socraticKeys.questions(), 'list', options] as const,
  question: (id: string) => [...socraticKeys.questions(), 'detail', id] as const,
  questionsByAxis: (axis: string) => [...socraticKeys.questions(), 'axis', axis] as const,
  random: (count: number, axis?: string) => [...socraticKeys.questions(), 'random', count, axis] as const,
};

/**
 * Hook to fetch socratic questions
 */
export function useSocraticQuestions(options?: {
  axis?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: socraticKeys.questionsList(options),
    queryFn: async () => {
      const response = await socraticService.fetchQuestions(options);
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
 * Hook to get a single question
 */
export function useSocraticQuestion(id: string) {
  return useQuery({
    queryKey: socraticKeys.question(id),
    queryFn: async () => {
      const response = await socraticService.getQuestionById(id);
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
 * Hook to get questions by axis
 */
export function useSocraticQuestionsByAxis(axis: string) {
  return useQuery({
    queryKey: socraticKeys.questionsByAxis(axis),
    queryFn: async () => {
      const response = await socraticService.getQuestionsByAxis(axis);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: !!axis,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get random questions
 */
export function useRandomSocraticQuestions(count: number = 3, axis?: string) {
  return useQuery({
    queryKey: socraticKeys.random(count, axis),
    queryFn: async () => {
      const response = await socraticService.getRandomQuestions(count, axis);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (shorter for randomness)
  });
}

/**
 * Hook to create a question
 */
export function useCreateSocraticQuestion(
  options?: UseMutationOptions<
    ApiResponse<SocraticQuestion>,
    Error,
    { text: string; axis: string; tension?: string; level?: number; context?: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question) => {
      const response = await socraticService.createQuestion(question);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socraticKeys.questions() });
    },
    ...options,
  });
}

/**
 * Hook to update a question
 */
export function useUpdateSocraticQuestion(
  options?: UseMutationOptions<ApiResponse<SocraticQuestion>, Error, { id: string; updates: Partial<SocraticQuestion> }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await socraticService.updateQuestion(id, updates);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: socraticKeys.question(id) });
      queryClient.invalidateQueries({ queryKey: socraticKeys.questions() });
    },
    ...options,
  });
}

/**
 * Hook to delete a question
 */
export function useDeleteSocraticQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await socraticService.deleteQuestion(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: socraticKeys.question(deletedId) });
      queryClient.invalidateQueries({ queryKey: socraticKeys.questions() });
    },
  });
}
