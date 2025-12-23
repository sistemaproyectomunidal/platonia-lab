/**
 * Podcast Service
 * Handles podcast episodes operations
 */

import { BaseApiClient, ApiResponse } from './base';
import type { Episode } from '@/types';

export class PodcastService extends BaseApiClient {
  /**
   * Fetch all published episodes
   */
  async fetchEpisodes(options?: {
    includeUnpublished?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Episode[]>> {
    const supabase = this.getSupabaseClient();
    const { includeUnpublished = false, limit, offset = 0 } = options || {};

    let query = supabase
      .from('podcast_episodes')
      .select('*')
      .order('episode_number', { ascending: true });

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    return this.handleResponse(query);
  }

  /**
   * Get a single episode by ID
   */
  async getEpisodeById(id: string): Promise<ApiResponse<Episode>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  /**
   * Get an episode by episode number
   */
  async getEpisodeByNumber(episodeNumber: number): Promise<ApiResponse<Episode>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .select('*')
        .eq('episode_number', episodeNumber)
        .single()
    );
  }

  /**
   * Create a new episode
   */
  async createEpisode(episode: {
    title: string;
    description?: string;
    episode_number: number;
    audio_url?: string;
    duration?: number;
    transcript_key?: string;
    is_published?: boolean;
  }): Promise<ApiResponse<Episode>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .insert([episode])
        .select()
        .single()
    );
  }

  /**
   * Update an episode
   */
  async updateEpisode(id: string, updates: Partial<Episode>): Promise<ApiResponse<Episode>> {
    const supabase = this.getSupabaseClient();
    
    // Convert duration to number if it's a string
    const cleanUpdates = {
      ...updates,
      duration: typeof updates.duration === 'string' ? parseInt(updates.duration) : updates.duration
    };
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .update(cleanUpdates as any)
        .eq('id', id)
        .select()
        .single()
    );
  }

  /**
   * Delete an episode
   */
  async deleteEpisode(id: string): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .delete()
        .eq('id', id)
    );
  }

  /**
   * Publish/unpublish an episode
   */
  async togglePublish(id: string, isPublished: boolean): Promise<ApiResponse<Episode>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .update({ 
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single()
    );
  }

  /**
   * Search episodes
   */
  async searchEpisodes(query: string): Promise<ApiResponse<Episode[]>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('podcast_episodes')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_published', true)
        .order('episode_number', { ascending: true })
    );
  }
}

// Export singleton instance
export const podcastService = new PodcastService();
