/**
 * File Upload Service
 * Handles file uploads and storage operations
 */

import { BaseApiClient, ApiResponse } from './base';
import type { FileUpload } from '@/types/api';

export class FileService extends BaseApiClient {
  /**
   * Upload a file
   */
  async uploadFile(file: File): Promise<ApiResponse<FileUpload>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/file-upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return data;
    } catch (e: any) {
      console.error('File upload failed:', e);
      return { error: e?.message || String(e) };
    }
  }

  /**
   * Get file upload by ID
   */
  async getFileUploadById(id: string): Promise<ApiResponse<FileUpload>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('file_uploads')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  /**
   * List all file uploads
   */
  async listFileUploads(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<FileUpload[]>> {
    const supabase = this.getSupabaseClient();
    const { limit = 50, offset = 0 } = options || {};

    return this.handleResponse(
      supabase
        .from('file_uploads')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    );
  }

  /**
   * Delete a file upload record
   */
  async deleteFileUpload(id: string): Promise<ApiResponse<void>> {
    const supabase = this.getSupabaseClient();
    
    return this.handleResponse(
      supabase
        .from('file_uploads')
        .delete()
        .eq('id', id)
    );
  }
}

// Export singleton instance
export const fileService = new FileService();
