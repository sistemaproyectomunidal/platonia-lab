/**
 * Corpus Service
 * Handles corpus entries operations
 */

import { BaseApiClient, ApiResponse } from './base';
import type { CorpusEntry } from '@/types';

export class CorpusService extends BaseApiClient {
  /**
   * Fetch all published corpus entries
   */
  async fetchEntries(options?: {
    status?: 'published' | 'draft';
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<CorpusEntry[]>> {
    const supabase = this.getSupabaseClient();
    const { status = 'published', limit, offset = 0 } = options || {};

    let query = supabase
      .from('corpus_entries')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    return this.handleResponse(query) as Promise<ApiResponse<CorpusEntry[]>>;
  }

  /**
   * Get a corpus entry by slug
   */
  async getEntryBySlug(slug: string): Promise<ApiResponse<CorpusEntry>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('corpus_entries')
        .select('*')
        .eq('slug', slug)
        .single()
    );
  }

  /**
   * Get a corpus entry by ID
   */
  async getEntryById(id: string): Promise<ApiResponse<CorpusEntry>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('corpus_entries')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  /**
   * Create a new corpus entry
   */
  async createEntry(entry: Omit<CorpusEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<CorpusEntry>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('corpus_entries')
        .insert([entry])
        .select()
        .single()
    );
  }

  /**
   * Update a corpus entry
   */
  async updateEntry(id: string, updates: Partial<CorpusEntry>): Promise<ApiResponse<CorpusEntry>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('corpus_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );
  }

  /**
   * Delete a corpus entry
   */
  async deleteEntry(id: string): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('corpus_entries')
        .delete()
        .eq('id', id)
    );
  }

  /**
   * Search corpus entries
   */
  async searchEntries(query: string): Promise<ApiResponse<CorpusEntry[]>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('corpus_entries')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
    ) as Promise<ApiResponse<CorpusEntry[]>>;
  }
}

// Export singleton instance
export const corpusService = new CorpusService();
