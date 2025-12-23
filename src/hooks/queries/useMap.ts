/**
 * React Query Hooks for Map Features
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { mapService } from '@/services/api';
import type { Node } from '@/types';
import type { ApiResponse } from '@/services/api/base';

// Query Keys
export const mapKeys = {
  all: ['map'] as const,
  nodes: () => [...mapKeys.all, 'nodes'] as const,
  nodesList: () => [...mapKeys.nodes(), 'list'] as const,
  node: (id: string) => [...mapKeys.nodes(), 'detail', id] as const,
  nodesByAxis: (axis: string) => [...mapKeys.nodes(), 'axis', axis] as const,
};

/**
 * Hook to fetch all map nodes
 */
export function useMapNodes() {
  return useQuery({
    queryKey: mapKeys.nodesList(),
    queryFn: async () => {
      const response = await mapService.fetchNodes();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get a single node
 */
export function useMapNode(id: string) {
  return useQuery({
    queryKey: mapKeys.node(id),
    queryFn: async () => {
      const response = await mapService.getNodeById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to get nodes by axis
 */
export function useMapNodesByAxis(axis: string) {
  return useQuery({
    queryKey: mapKeys.nodesByAxis(axis),
    queryFn: async () => {
      const response = await mapService.getNodesByAxis(axis);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: !!axis,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to create a node
 */
export function useCreateNode(
  options?: UseMutationOptions<
    ApiResponse<Node>,
    Error,
    { id: string; label: string; axis: string; description?: string; position_x?: number; position_y?: number }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (node) => {
      const response = await mapService.createNode(node);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mapKeys.nodes() });
    },
    ...options,
  });
}

/**
 * Hook to update a node
 */
export function useUpdateNode(
  options?: UseMutationOptions<ApiResponse<Node>, Error, { id: string; updates: Partial<Node> }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await mapService.updateNode(id, updates);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: mapKeys.node(id) });
      queryClient.invalidateQueries({ queryKey: mapKeys.nodes() });
    },
    ...options,
  });
}

/**
 * Hook to update node position
 */
export function useUpdateNodePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, x, y }: { id: string; x: number; y: number }) => {
      const response = await mapService.updateNodePosition(id, x, y);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: mapKeys.node(id) });
      queryClient.invalidateQueries({ queryKey: mapKeys.nodes() });
    },
  });
}

/**
 * Hook to batch update node positions
 */
export function useBatchUpdateNodePositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (positions: Array<{ id: string; x: number; y: number }>) => {
      const response = await mapService.batchUpdateNodePositions(positions);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mapKeys.nodes() });
    },
  });
}

/**
 * Hook to delete a node
 */
export function useDeleteNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await mapService.deleteNode(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: mapKeys.node(deletedId) });
      queryClient.invalidateQueries({ queryKey: mapKeys.nodes() });
    },
  });
}
