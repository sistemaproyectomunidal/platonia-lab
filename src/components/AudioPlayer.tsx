import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  title: string;
  episodeNumber: string;
  duration: string;
  onTimeUpdate?: (currentTime: number) => void;
}

const AudioPlayer = ({ title, episodeNumber, duration, onTimeUpdate }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const progressRef = useRef<HTMLDivElement>(null);

  // Parse duration string to seconds
  useEffect(() => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      setTotalDuration(minutes * 60 + seconds);
    }
  }, [duration]);

  // Simulate playback for demo (no actual audio file)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < totalDuration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, onTimeUpdate, currentTime]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * totalDuration;
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const skipBack = () => {
    const newTime = Math.max(0, currentTime - 15);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const skipForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 15);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Episode info */}
      <div className="mb-4">
        <span className="font-system text-xs text-primary uppercase tracking-wider">
          Episodio {episodeNumber}
        </span>
        <h3 className="font-philosophy text-lg text-foreground mt-1">{title}</h3>
      </div>

      {/* Progress bar */}
      <div 
        ref={progressRef}
        onClick={handleProgressClick}
        className="relative h-2 bg-secondary rounded-full cursor-pointer group mb-4"
      >
        <div 
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-xs font-system text-muted-foreground mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={skipBack}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Retroceder 15s"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={skipForward}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Avanzar 15s"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      {/* Demo notice */}
      <p className="mt-4 text-xs text-muted-foreground text-center italic">
        Demo: reproducción simulada sin archivo de audio
      </p>
    </div>
  );
};

export default AudioPlayer;
