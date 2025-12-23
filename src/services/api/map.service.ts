/**
 * Map Service
 * Handles map nodes and edges operations
 */

import { BaseApiClient, ApiResponse } from './base';
import type { Node, Edge } from '@/types';

export class MapService extends BaseApiClient {
  /**
   * Fetch all map nodes
   */
  async fetchNodes(): Promise<ApiResponse<Node[]>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .select('*')
        .order('axis', { ascending: true })
    );
  }

  /**
   * Get a single node by ID
   */
  async getNodeById(id: string): Promise<ApiResponse<Node>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  /**
   * Get nodes by axis
   */
  async getNodesByAxis(axis: string): Promise<ApiResponse<Node[]>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .select('*')
        .eq('axis', axis)
        .order('label', { ascending: true })
    );
  }

  /**
   * Create a new node
   */
  async createNode(node: {
    id: string;
    label: string;
    axis: string;
    description?: string;
    position_x?: number;
    position_y?: number;
  }): Promise<ApiResponse<Node>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .insert([node])
        .select()
        .single()
    );
  }

  /**
   * Update a node
   */
  async updateNode(id: string, updates: Partial<Node>): Promise<ApiResponse<Node>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );
  }

  /**
   * Delete a node
   */
  async deleteNode(id: string): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .delete()
        .eq('id', id)
    );
  }

  /**
   * Update node position
   */
  async updateNodePosition(id: string, x: number, y: number): Promise<ApiResponse<Node>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('map_nodes')
        .update({ position_x: x, position_y: y })
        .eq('id', id)
        .select()
        .single()
    );
  }

  /**
   * Batch update node positions
   */
  async batchUpdateNodePositions(positions: Array<{ id: string; x: number; y: number }>): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    // Execute updates in parallel
    const promises = positions.map(({ id, x, y }) =>
      supabase
        .from('map_nodes')
        .update({ position_x: x, position_y: y })
        .eq('id', id)
    );

    try {
      await Promise.all(promises);
      return { data: undefined };
    } catch (e: any) {
      return { error: e?.message || String(e) };
    }
  }
}

// Export singleton instance
export const mapService = new MapService();
