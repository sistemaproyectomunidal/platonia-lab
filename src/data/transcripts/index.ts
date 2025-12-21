import { transcript as ep001 } from './ep001';
import { transcript as ep002 } from './ep002';
import { transcript as ep003 } from './ep003';

export interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface Transcript {
  episodeId: string;
  title: string;
  duration: string;
  segments: TranscriptSegment[];
  fullText: string;
}

export const transcripts: Record<string, Transcript> = {
  ep001,
  ep002,
  ep003
};

export const getTranscript = (episodeId: string): Transcript | null => {
  return transcripts[episodeId] || null;
};
