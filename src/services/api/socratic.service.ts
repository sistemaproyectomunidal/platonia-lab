/**
 * Socratic Questions Service
 * Handles socratic questions operations
 */

import { BaseApiClient, ApiResponse } from './base';
import type { SocraticQuestion } from '@/types';

export class SocraticService extends BaseApiClient {
  /**
   * Fetch all socratic questions
   */
  async fetchQuestions(options?: {
    axis?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<SocraticQuestion[]>> {
    const supabase = this.getSupabaseClient();
    const { axis, limit, offset = 0 } = options || {};

    let query = supabase
      .from('socratic_questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (axis) {
      query = query.eq('axis', axis);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    return this.handleResponse(query);
  }

  /**
   * Get a single question by ID
   */
  async getQuestionById(id: string): Promise<ApiResponse<SocraticQuestion>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('socratic_questions')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  /**
   * Get questions by axis
   */
  async getQuestionsByAxis(axis: string): Promise<ApiResponse<SocraticQuestion[]>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('socratic_questions')
        .select('*')
        .eq('axis', axis)
        .order('created_at', { ascending: false })
    );
  }

  /**
   * Create a new question
   */
  async createQuestion(question: {
    text: string;
    axis: string;
    tension?: string;
    level?: number;
    context?: string;
  }): Promise<ApiResponse<SocraticQuestion>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('socratic_questions')
        .insert([question as any])
        .select()
        .single()
    );
  }

  /**
   * Update a question
   */
  async updateQuestion(id: string, updates: Partial<SocraticQuestion>): Promise<ApiResponse<SocraticQuestion>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('socratic_questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );
  }

  /**
   * Delete a question
   */
  async deleteQuestion(id: string): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('socratic_questions')
        .delete()
        .eq('id', id)
    );
  }

  /**
   * Get random questions
   */
  async getRandomQuestions(count: number = 3, axis?: string): Promise<ApiResponse<SocraticQuestion[]>> {
    const supabase = this.getSupabaseClient();
    
    let query = supabase
      .from('socratic_questions')
      .select('*');

    if (axis) {
      query = query.eq('axis', axis);
    }

    // Get all matching questions first, then select random ones
    const response = await this.handleResponse(query);
    
    if (response.error || !response.data) {
      return response as ApiResponse<SocraticQuestion[]>;
    }

    const questions = response.data as SocraticQuestion[];
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, questions.length));

    return { data: selected };
  }
}

// Export singleton instance
export const socraticService = new SocraticService();
