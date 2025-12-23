/**
 * Sistema Lagrange - TypeScript Types
 * Comprehensive type definitions for the entire application
 */

// Re-export API types
export * from "./api";

// ============================================
// ENUMS
// ============================================

export enum LagrangeAxis {
  L1_MIEDO = "L1_miedo",
  L2_CONTROL = "L2_control",
  L3_LEGITIMIDAD = "L3_legitimidad",
  L4_SALUD_MENTAL = "L4_salud_mental",
  L5_RESPONSABILIDAD = "L5_responsabilidad",
}

export type NodeState = "active" | "latent" | "saturated";

export type TensionType = "reinforcement" | "opposition" | "dialectic";

export type EpisodeState = "draft" | "published";

// ============================================
// NODE & EDGE INTERFACES
// ============================================

export interface Node {
  id: string;
  label: string;
  axis: string;
  corpus_source?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  x?: number;
  y?: number;
  color?: string;
  tension_level?: number;
  description: string;
  state?: NodeState;
}

export interface Edge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  tension_type?: TensionType;
  weight: number;
}

// ============================================
// EPISODE INTERFACE
// ============================================

export interface Episode {
  id: string;
  title: string;
  description: string;
  audio_url?: string;
  audioUrl?: string;
  duration: number | string;
  transcript?: string;
  transcript_key?: string;
  related_nodes?: string[];
  nodes?: string[];
  published_date?: string;
  date?: string;
  episode_number?: number;
  is_published?: boolean;
  state?: EpisodeState;
  questions?: string[];
}

// ============================================
// SOCRATIC QUESTION INTERFACE
// ============================================

export interface SocraticQuestion {
  id: string;
  text: string;
  question?: string;
  axis: string;
  related_axis?: string;
  tension?: string;
  tension_level?: number;
  level?: number;
  context?: string;
  state?: NodeState;
  relatedNodes?: string[];
  related_nodes?: string[];
}

// ============================================
// CORPUS INTERFACE
// ============================================

export interface CorpusEntry {
  id: string;
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  axes?: string[];
  related_nodes?: string[];
  status?: "draft" | "published";
  created_at?: string;
  updated_at?: string;
}

// ============================================
// LAB / ANALYSIS INTERFACES
// ============================================

export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}

export interface AnalysisRequest {
  userInput: string;
  context?: string;
  targetAxis?: LagrangeAxis | string;
  conversationHistory?: ConversationMessage[];
}

export interface AnalysisResponse {
  analysis: string;
  generatedQuestions: string[];
  relatedNodes: string[];
  tensionLevel: number;
  warnings: string[];
  ok?: boolean;
  error?: string;
}

export interface LabDemo {
  id: string;
  prompt: string;
  summary: string;
  axes?: string[];
  matched_nodes?: string[];
  questions?: any;
  ai_response?: string;
  created_at?: string;
}

// ============================================
// MAP STATE INTERFACE
// ============================================

export interface MapState {
  selectedNode: Node | null;
  hoveredNode: Node | null;
  zoom: number;
  activeEpisode: Episode | null;
  panPosition: { x: number; y: number };
}

// ============================================
// FILE UPLOAD INTERFACE
// ============================================

export interface FileUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  public_url?: string;
  storage_provider?: string;
  created_at?: string;
}

// ============================================
// AUTH INTERFACES
// ============================================

export interface User {
  id: string;
  email: string;
  role?: "admin" | "user";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  ok?: boolean;
}

export interface NodesResponse {
  nodes: Node[];
}

export interface EdgesResponse {
  edges: Edge[];
}

export interface EpisodesResponse {
  episodes: Episode[];
}

export interface QuestionsResponse {
  questions: SocraticQuestion[];
}
