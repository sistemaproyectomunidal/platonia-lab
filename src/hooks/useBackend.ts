/**
 * @deprecated This file is deprecated. Use hooks from @/hooks/queries instead.
 * 
 * Migration guide:
 * - useOpenAIChat() -> useGenerateAI() from @/hooks/queries/useLab
 * - useFileUpload() -> useFileUpload() from @/hooks/queries/useFiles
 * - useSaveDemoResult() -> useSaveDemoResult() from @/hooks/queries/useLab
 * - useLabDemos() -> useLabDemos() from @/hooks/queries/useLab
 * - useCorpusEntries() -> useCorpusEntries() from @/hooks/queries/useCorpus
 */

import { useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import backend, { AIResponse, DemoSaveResult } from '@/lib/backend';
import type { FileUploadResult } from '@/types/api';

/**
 * @deprecated Use useGenerateAI from @/hooks/queries/useLab instead
 */
export function useOpenAIChat() {
  return useMutation<AIResponse, Error, { prompt: string; context?: string }>({
    mutationFn: async ({ prompt, context }) => {
      const res = await backend.generateWithOpenAI(prompt, context);
      if (res.error) throw new Error(res.error);
      return res;
    },
  });
}

/**
 * @deprecated Use useFileUpload from @/hooks/queries/useFiles instead
 */
export function useFileUpload(options?: UseMutationOptions<FileUploadResult, Error, File>) {
  return useMutation<FileUploadResult, Error, File>({
    mutationFn: async (file: File) => {
      const res = await backend.uploadFile(file);
      if (res.error) throw new Error(res.error);
      return res;
    },
    ...options,
  });
}

/**
 * @deprecated Use useSaveDemoResult from @/hooks/queries/useLab instead
 */
export function useSaveDemoResult() {
  return useMutation<DemoSaveResult, Error, Parameters<typeof backend.saveDemoResult>[0]>({
    mutationFn: async (payload) => {
      const res = await backend.saveDemoResult(payload);
      if (res.error) throw new Error(res.error);
      return res;
    },
  });
}

/**
 * @deprecated Use useLabDemos from @/hooks/queries/useLab instead
 */
export function useLabDemos(limit = 10) {
  return useQuery({
    queryKey: ['lab_demos', limit],
    queryFn: async () => backend.fetchLabDemos(limit),
  });
}

/**
 * @deprecated Use useCorpusEntries from @/hooks/queries/useCorpus instead
 */
export function useCorpusEntries() {
  return useQuery({
    queryKey: ['corpus_entries'],
    queryFn: async () => backend.fetchCorpusEntries(),
  });
}
