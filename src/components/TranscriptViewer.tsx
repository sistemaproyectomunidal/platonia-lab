import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { TranscriptSegment } from '@/data/transcripts';

interface TranscriptViewerProps {
  title: string;
  segments: TranscriptSegment[];
  currentTime?: number;
  onSegmentClick?: (timestamp: string) => void;
}

const TranscriptViewer = ({ title, segments, currentTime = 0, onSegmentClick }: TranscriptViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 0;
  };

  const isActiveSegment = (segment: TranscriptSegment, index: number): boolean => {
    const segmentTime = parseTimestamp(segment.timestamp);
    const nextSegment = segments[index + 1];
    const nextTime = nextSegment ? parseTimestamp(nextSegment.timestamp) : Infinity;
    return currentTime >= segmentTime && currentTime < nextTime;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-philosophy text-foreground">Transcripción</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {segments.map((segment, index) => {
            const isActive = isActiveSegment(segment, index);
            return (
              <div
                key={index}
                onClick={() => onSegmentClick?.(segment.timestamp)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-300
                  ${isActive 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'hover:bg-secondary border border-transparent'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    font-system text-xs px-2 py-0.5 rounded flex-shrink-0
                    ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}
                  `}>
                    {segment.timestamp}
                  </span>
                  <p className={`
                    text-sm leading-relaxed
                    ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {segment.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TranscriptViewer;
