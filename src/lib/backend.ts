/**
 * @deprecated This file is deprecated. Use @/services/api instead.
 * This file is kept for backward compatibility only.
 *
 * Migration guide:
 * - Use labService.saveDemoResult() instead of saveDemoResult()
 * - Use labService.generateAIResponse() instead of generateWithOpenAI()
 * - Use fileService.uploadFile() instead of uploadFile()
 * - Use specific service methods from @/services/api for other operations
 *
 * New hooks available in @/hooks/queries:
 * - useSaveDemoResult, useGenerateAI, useFileUpload, etc.
 */

import {
  labService,
  fileService,
  corpusService,
  mapService,
  podcastService,
  socraticService,
} from "@/services/api";

// Re-export types for backward compatibility
export type { AIResponse, FileUploadResult } from "@/types/api";

export type DemoSaveResult = {
  id?: string | number;
  error?: string;
};

/**
 * @deprecated Use labService.saveDemoResult() or useSaveDemoResult() hook instead
 */
export async function saveDemoResult(payload: {
  prompt: string;
  summary: string;
  axes: string[];
  matchedNodes: string[];
  questions: any[];
  aiResponse?: string;
}): Promise<DemoSaveResult> {
  const response = await labService.saveDemoResult(payload);
  if (response.error) {
    return { error: response.error };
  }
  return { id: response.data?.id };
}

/**
 * @deprecated Use labService.generateAIResponse() or useGenerateAI() hook instead
 */
export async function generateWithOpenAI(
  prompt: string,
  context?: string,
  systemPrompt?: string
) {
  const response = await labService.generateAIResponse({
    prompt,
    context,
    systemPrompt,
  });
  if (response.error) {
    console.error("OpenAI function error:", response.error);
  }
  return response.data || { error: response.error };
}

/**
 * @deprecated Use fileService.uploadFile() or useFileUpload() hook instead
 */
export async function uploadFile(file: File) {
  const response = await fileService.uploadFile(file);
  return response.data || { error: response.error };
}

/**
 * @deprecated Use labService.fetchDemos() or useLabDemos() hook instead
 */
export async function fetchLabDemos(limit = 10) {
  const response = await labService.fetchDemos({ limit });
  return { data: response.data, error: response.error };
}

/**
 * @deprecated Use corpusService.fetchEntries() or useCorpusEntries() hook instead
 */
export async function fetchCorpusEntries() {
  const response = await corpusService.fetchEntries();
  return { data: response.data, error: response.error };
}

/**
 * @deprecated Use mapService.fetchNodes() or useMapNodes() hook instead
 */
export async function fetchMapNodes() {
  const response = await mapService.fetchNodes();
  return { data: response.data, error: response.error };
}

/**
 * @deprecated Use socraticService.fetchQuestions() or useSocraticQuestions() hook instead
 */
export async function fetchSocraticQuestions() {
  const response = await socraticService.fetchQuestions();
  return { data: response.data, error: response.error };
}

/**
 * @deprecated Use podcastService.fetchEpisodes() or usePodcastEpisodes() hook instead
 */
export async function fetchPodcastEpisodes() {
  const response = await podcastService.fetchEpisodes();
  return { data: response.data, error: response.error };
}

/**
 * @deprecated Default export. Use individual services from @/services/api instead
 */
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
