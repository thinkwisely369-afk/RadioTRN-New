import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { Station } from "@/data/stations";

interface AudioPlayerProps {
  station: Station;
}

const AudioPlayer = ({ station }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <audio ref={audioRef} src={station.streamUrl} />
      
      <div className="flex items-center gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: `hsl(${station.color})`,
            boxShadow: isPlaying ? `0 0 40px hsl(${station.color} / 0.5)` : 'none',
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-background fill-current" />
          ) : (
            <Play className="w-7 h-7 text-background fill-current ml-1" />
          )}
        </button>

        {/* Now Playing Info */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">
            {isPlaying ? "Now Playing" : "Click to Play"}
          </p>
          <h3 className="font-display font-semibold text-xl text-foreground">
            {station.name}
          </h3>

          {/* Animated bars when playing */}
          {isPlaying && (
            <div className="flex items-end gap-1 mt-2 h-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full animate-equalizer"
                  style={{
                    background: `hsl(${station.color})`,
                    height: "100%",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            style={{
              accentColor: `hsl(${station.color})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
