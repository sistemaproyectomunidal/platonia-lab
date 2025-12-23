/**
 * Laboratory Service
 * Handles lab demos and analysis operations
 */

import { BaseApiClient, ApiResponse } from './base';
import type { LabDemo, AIRequest, AIResponse } from '@/types/api';

export class LabService extends BaseApiClient {
  /**
   * Save a lab demo result
   */
  async saveDemoResult(payload: {
    prompt: string;
    summary: string;
    axes: string[];
    matchedNodes: string[];
    questions: any[];
    aiResponse?: string;
  }): Promise<ApiResponse<{ id: string }>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('lab_demos')
        .insert([{
          prompt: payload.prompt,
          summary: payload.summary,
          axes: payload.axes,
          matched_nodes: payload.matchedNodes,
          questions: JSON.stringify(payload.questions),
          ai_response: payload.aiResponse || null,
        }])
        .select('id')
        .single()
    );
  }

  /**
   * Fetch lab demos with pagination
   */
  async fetchDemos(options?: {
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at';
    ascending?: boolean;
  }): Promise<ApiResponse<LabDemo[]>> {
    const supabase = this.getSupabaseClient();
    const { limit = 10, offset = 0, orderBy = 'created_at', ascending = false } = options || {};

    return this.handleResponse(
      supabase
        .from('lab_demos')
        .select('*')
        .order(orderBy, { ascending })
        .range(offset, offset + limit - 1)
    );
  }

  /**
   * Get a single lab demo by ID
   */
  async getDemoById(id: string): Promise<ApiResponse<LabDemo>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('lab_demos')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  /**
   * Delete a lab demo
   */
  async deleteDemo(id: string): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('lab_demos')
        .delete()
        .eq('id', id)
    );
  }

  /**
   * Generate AI response using OpenAI
   */
  async generateAIResponse(request: AIRequest): Promise<ApiResponse<AIResponse>> {
    return this.invokeFunction<AIResponse>('openai-chat', {
      prompt: request.prompt,
      context: request.context,
      systemPrompt: request.systemPrompt,
    });
  }
}

// Export singleton instance
export const labService = new LabService();
