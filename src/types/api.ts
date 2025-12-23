/**
 * API Types
 * Type definitions for API requests and responses
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface AIRequest {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  conversationHistory?: ChatMessage[];
}

export interface AIResponse {
  ok?: boolean;
  text?: string;
  error?: string;
}

export interface FileUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  public_url: string | null;
  storage_provider: string | null;
  created_at: string;
}

export interface FileUploadResult {
  ok?: boolean;
  upload?: {
    id: string;
    filename: string;
    publicUrl: string;
    storagePath: string;
    provider: "gcs" | "local";
  };
  error?: string;
}

export interface LabDemo {
  id: string;
  prompt: string;
  summary: string;
  axes: string[] | null;
  matched_nodes: string[] | null;
  questions: unknown;
  ai_response: string | null;
  created_at: string;
}

export interface DemoSaveRequest {
  prompt: string;
  summary: string;
  axes: string[];
  matchedNodes: string[];
  questions: unknown[];
  aiResponse?: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface SearchOptions {
  query: string;
  limit?: number;
  filters?: Record<string, unknown>;
}
