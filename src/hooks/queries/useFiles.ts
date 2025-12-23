/**
 * React Query Hooks for File Uploads
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { fileService } from '@/services/api';
import type { FileUpload, FileUploadResult } from '@/types/api';
import type { ApiResponse } from '@/services/api/base';

// Query Keys
export const fileKeys = {
  all: ['files'] as const,
  uploads: () => [...fileKeys.all, 'uploads'] as const,
  uploadsList: (options?: any) => [...fileKeys.uploads(), 'list', options] as const,
  upload: (id: string) => [...fileKeys.uploads(), 'detail', id] as const,
};

/**
 * Hook to upload a file
 */
export function useFileUpload(options?: UseMutationOptions<ApiResponse<FileUpload>, Error, File>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await fileService.uploadFile(file);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.uploads() });
    },
    ...options,
  });
}

/**
 * Hook to get file upload by ID
 */
export function useFileUploadById(id: string) {
  return useQuery({
    queryKey: fileKeys.upload(id),
    queryFn: async () => {
      const response = await fileService.getFileUploadById(id);
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
 * Hook to list file uploads
 */
export function useFileUploads(options?: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: fileKeys.uploadsList(options),
    queryFn: async () => {
      const response = await fileService.listFileUploads(options);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to delete a file upload
 */
export function useDeleteFileUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fileService.deleteFileUpload(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: fileKeys.upload(deletedId) });
      queryClient.invalidateQueries({ queryKey: fileKeys.uploads() });
    },
  });
}
