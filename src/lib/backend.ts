import { supabase } from '@/integrations/supabase/client';

export type DemoSaveResult = {
  id?: string | number;
  error?: string;
};

export type AIResponse = {
  ok?: boolean;
  text?: string;
  error?: string;
};

export type FileUploadResult = {
  ok?: boolean;
  upload?: {
    id: string;
    filename: string;
    publicUrl: string;
    storagePath: string;
    provider: 'gcs' | 'local';
  };
  error?: string;
};

/**
 * Save a demo result to the lab_demos table
 */
export async function saveDemoResult(payload: { 
  prompt: string; 
  summary: string; 
  axes: string[]; 
  matchedNodes: string[]; 
  questions: any[];
  aiResponse?: string;
}): Promise<DemoSaveResult> {
  try {
    const { data, error } = await supabase
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
      .limit(1)
      .single();

    if (error) return { error: error.message };
    return { id: data?.id };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

/**
 * Call the OpenAI chat edge function
 */
export async function generateWithOpenAI(prompt: string, context?: string): Promise<AIResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: { prompt, context },
    });

    if (error) {
      console.error('OpenAI function error:', error);
      return { error: error.message };
    }

    return data as AIResponse;
  } catch (e: any) {
    console.error('OpenAI call failed:', e);
    return { error: e?.message || String(e) };
  }
}

/**
 * Upload a file via the file-upload edge function
 */
export async function uploadFile(file: File): Promise<FileUploadResult> {
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

    return data as FileUploadResult;
  } catch (e: any) {
    console.error('File upload failed:', e);
    return { error: e?.message || String(e) };
  }
}

/**
 * Fetch lab demos from database
 */
export async function fetchLabDemos(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('lab_demos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { error: error.message };
    return { data };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

/**
 * Fetch corpus entries
 */
export async function fetchCorpusEntries() {
  try {
    const { data, error } = await supabase
      .from('corpus_entries')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

/**
 * Fetch map nodes from database
 */
export async function fetchMapNodes() {
  try {
    const { data, error } = await supabase
      .from('map_nodes')
      .select('*');

    if (error) return { error: error.message };
    return { data };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

/**
 * Fetch socratic questions
 */
export async function fetchSocraticQuestions() {
  try {
    const { data, error } = await supabase
      .from('socratic_questions')
      .select('*');

    if (error) return { error: error.message };
    return { data };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

/**
 * Fetch podcast episodes
 */
export async function fetchPodcastEpisodes() {
  try {
    const { data, error } = await supabase
      .from('podcast_episodes')
      .select('*')
      .eq('is_published', true)
      .order('episode_number', { ascending: true });

    if (error) return { error: error.message };
    return { data };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

export default { 
  saveDemoResult, 
  generateWithOpenAI, 
  uploadFile,
  fetchLabDemos,
  fetchCorpusEntries,
  fetchMapNodes,
  fetchSocraticQuestions,
  fetchPodcastEpisodes,
};
