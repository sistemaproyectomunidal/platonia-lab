/**
 * Base API Client
 * Provides common functionality for all API clients
 */

import { supabase } from '@/integrations/supabase/client';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base API client with common methods
 */
export abstract class BaseApiClient {
  protected async handleResponse<T>(
    promise: PromiseLike<{ data: T | null; error: any }>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await promise;
      
      if (error) {
        console.error('API Error:', error);
        return { error: error.message || 'Unknown error occurred' };
      }
      
      return { data: data as T };
    } catch (e: any) {
      console.error('API Exception:', e);
      return { error: e?.message || String(e) };
    }
  }

  protected async invokeFunction<T>(
    functionName: string,
    body?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body,
      });

      if (error) {
        console.error(`Function ${functionName} error:`, error);
        return { error: error.message };
      }

      return { data: data as T };
    } catch (e: any) {
      console.error(`Function ${functionName} exception:`, e);
      return { error: e?.message || String(e) };
    }
  }

  protected getSupabaseClient() {
    return supabase;
  }
}
