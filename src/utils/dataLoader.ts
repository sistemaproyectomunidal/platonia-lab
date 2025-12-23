/**
 * Data Loader Utilities - Sistema Lagrange
 * Functions for loading data from static JSON files and Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  Node,
  Edge,
  Episode,
  SocraticQuestion,
  CorpusEntry,
  NodesResponse,
  EdgesResponse,
  EpisodesResponse,
  QuestionsResponse,
} from '@/types';

// Import local JSON data as fallback
import nodesData from '@/data/nodes.json';
import episodesData from '@/data/episodes.json';
import questionsData from '@/data/socraticQuestions.json';

const BASE_PATH = import.meta.env.BASE_URL || '/';

// ============================================
// NODE FUNCTIONS
// ============================================

/**
 * Fetch all nodes from static JSON or Supabase
 */
export async function fetchNodes(): Promise<Node[]> {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('map_nodes')
      .select('*');

    if (!error && data && data.length > 0) {
      return data.map((node) => ({
        id: node.id,
        label: node.label,
        axis: node.axis,
        description: node.description || '',
        x: node.position_x || 0,
        y: node.position_y || 0,
        coordinates: {
          x: node.position_x || 0,
          y: node.position_y || 0,
        },
      }));
    }
  } catch (e) {
    console.warn('Supabase nodes fetch failed, using local data:', e);
  }

  // Fallback to local JSON
  return (nodesData as NodesResponse).nodes || [];
}

/**
 * Fetch all edges from static JSON
 */
export async function fetchEdges(): Promise<Edge[]> {
  // Edges are stored locally in nodes.json
  const data = nodesData as { nodes: Node[]; edges: Edge[] };
  return data.edges || [];
}

/**
 * Fetch a single node by ID
 */
export async function fetchNodeById(nodeId: string): Promise<Node | null> {
  const nodes = await fetchNodes();
  return nodes.find((n) => n.id === nodeId) || null;
}

// ============================================
// EPISODE FUNCTIONS
// ============================================

/**
 * Fetch all episodes
 */
export async function fetchEpisodes(): Promise<Episode[]> {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('podcast_episodes')
      .select('*')
      .eq('is_published', true)
      .order('episode_number', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((ep) => ({
        id: ep.id,
        title: ep.title,
        description: ep.description || '',
        audio_url: ep.audio_url || '',
        duration: ep.duration || 0,
        transcript_key: ep.transcript_key,
        episode_number: ep.episode_number,
        is_published: ep.is_published,
        published_date: ep.published_at,
      }));
    }
  } catch (e) {
    console.warn('Supabase episodes fetch failed, using local data:', e);
  }

  // Fallback to local JSON
  const data = episodesData as EpisodesResponse;
  return data.episodes.map((ep) => ({
    id: ep.id,
    title: ep.title,
    description: ep.description,
    audio_url: ep.audioUrl,
    audioUrl: ep.audioUrl,
    duration: ep.duration,
    nodes: ep.nodes,
    related_nodes: ep.nodes,
    date: ep.date,
    state: ep.state as 'draft' | 'published',
    questions: ep.questions,
  }));
}

/**
 * Fetch a single episode by ID
 */
export async function fetchEpisodeById(episodeId: string): Promise<Episode | null> {
  const episodes = await fetchEpisodes();
  return episodes.find((e) => e.id === episodeId) || null;
}

// ============================================
// SOCRATIC QUESTIONS FUNCTIONS
// ============================================

/**
 * Fetch all socratic questions
 */
export async function fetchSocraticQuestions(): Promise<SocraticQuestion[]> {
  try {
    // Try Supabase first
    const { data, error } = await supabase
      .from('socratic_questions')
      .select('*');

    if (!error && data && data.length > 0) {
      return data.map((q) => ({
        id: q.id,
        text: q.text,
        axis: q.axis,
        related_nodes: q.related_nodes || [],
      }));
    }
  } catch (e) {
    console.warn('Supabase questions fetch failed, using local data:', e);
  }

  // Fallback to local JSON
  const data = questionsData as QuestionsResponse;
  return data.questions.map((q) => ({
    id: q.id,
    text: q.text,
    question: q.text,
    axis: q.axis,
    level: q.level,
    tension: q.tension,
    state: q.state as 'active' | 'latent' | 'saturated',
    relatedNodes: q.relatedNodes,
    related_nodes: q.relatedNodes,
  }));
}

/**
 * Fetch questions by related node ID
 */
export async function fetchQuestionsByNode(nodeId: string): Promise<SocraticQuestion[]> {
  const questions = await fetchSocraticQuestions();
  return questions.filter(
    (q) => q.relatedNodes?.includes(nodeId) || q.related_nodes?.includes(nodeId)
  );
}

// ============================================
// CORPUS FUNCTIONS
// ============================================

/**
 * Fetch all corpus entries
 */
export async function fetchCorpusEntries(): Promise<CorpusEntry[]> {
  try {
    const { data, error } = await supabase
      .from('corpus_entries')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as CorpusEntry[];
    }
  } catch (e) {
    console.warn('Corpus fetch failed:', e);
  }

  return [];
}

/**
 * Fetch a specific corpus file by filename
 */
export async function fetchCorpusFile(filename: string): Promise<string> {
  try {
    const response = await fetch(`${BASE_PATH}data/corpus/${filename}`);
    if (response.ok) {
      return await response.text();
    }
  } catch (e) {
    console.warn('Corpus file fetch failed:', e);
  }

  return '';
}

/**
 * Fetch corpus entry by slug
 */
export async function fetchCorpusEntryBySlug(slug: string): Promise<CorpusEntry | null> {
  try {
    const { data, error } = await supabase
      .from('corpus_entries')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      return data as CorpusEntry;
    }
  } catch (e) {
    console.warn('Corpus entry fetch failed:', e);
  }

  return null;
}

// ============================================
// LAB DEMOS FUNCTIONS
// ============================================

/**
 * Fetch lab demo history
 */
export async function fetchLabDemos(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('lab_demos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('Lab demos fetch failed:', e);
  }

  return [];
}

// ============================================
// STATIC JSON ENDPOINTS (for external consumption)
// ============================================

/**
 * Get the URL for a static data endpoint
 */
export function getDataEndpoint(type: 'nodes' | 'edges' | 'episodes' | 'questions'): string {
  const endpoints: Record<string, string> = {
    nodes: `${BASE_PATH}data/nodes.json`,
    edges: `${BASE_PATH}data/edges.json`,
    episodes: `${BASE_PATH}data/episodes.json`,
    questions: `${BASE_PATH}data/socratic_questions.json`,
  };
  return endpoints[type] || '';
}

export default {
  fetchNodes,
  fetchEdges,
  fetchNodeById,
  fetchEpisodes,
  fetchEpisodeById,
  fetchSocraticQuestions,
  fetchQuestionsByNode,
  fetchCorpusEntries,
  fetchCorpusFile,
  fetchCorpusEntryBySlug,
  fetchLabDemos,
  getDataEndpoint,
};
