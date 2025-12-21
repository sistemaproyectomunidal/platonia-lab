import { supabase } from '@/integrations/supabase/client';

export type DemoSaveResult = {
  id?: string | number;
  error?: string;
};

export async function saveDemoResult(payload: { prompt: string; summary: string; axes: string[]; matchedNodes: string[]; questions: any[] }): Promise<DemoSaveResult> {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    return { error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('lab_demos')
      .insert([{ prompt: payload.prompt, summary: payload.summary, axes: payload.axes, matched_nodes: payload.matchedNodes, questions: JSON.stringify(payload.questions) }])
      .select('id')
      .limit(1)
      .single();

    if (error) return { error: error.message };
    // @ts-ignore
    return { id: data?.id };
  } catch (e: any) {
    return { error: e?.message || String(e) };
  }
}

export default { saveDemoResult };
