import { Link } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import type { Station } from "@/lib/api";
import { useAudio } from "@/contexts/AudioContext";

interface StationCardProps {
  station: Station;
  index: number;
}

const StationCard = ({ station, index }: StationCardProps) => {
  const { currentStation, isPlaying, playStation, togglePlay } = useAudio();
  const isCurrentStation = currentStation?.id === station.id;
  const isThisPlaying = isCurrentStation && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentStation) {
      togglePlay();
    } else {
      playStation(station);
    }
  };

  return (
    <div
      className="group relative bg-card-gradient rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <Link to={`/${station.slug || `station/${station.id}`}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          {/* Colored gradient background */}
          <div
            className="absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${station.color}99 0%, ${station.color}33 100())`,
            }}
          />

          {/* Station Logo */}
          {station.logoUrl && (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={station.logoUrl}
                alt={`${station.name} logo`}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          )}

          {/* Equalizer visualization when playing */}
          {isThisPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/20 backdrop-blur-sm">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-white rounded-full animate-equalizer"
                  style={{
                    height: "40%",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Genre badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm"
              style={{ color: station.color }}
            >
              {station.genre}
            </span>
          </div>

          {/* Now playing indicator */}
          {isCurrentStation && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                <span className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                Live
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info section with play button */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={handlePlayClick}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
          style={{
            background: station.color,
            boxShadow: isThisPlaying ? `0 0 20px ${station.color}80` : 'none',
          }}
          aria-label={isThisPlaying ? "Pause" : "Play"}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 text-background fill-current" />
          ) : (
            <Play className="w-5 h-5 text-background fill-current ml-0.5" />
          )}
        </button>
        <Link to={`/${station.slug || `station/${station.id}`}`} className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
            {station.name}
          </h3>
          <p className="text-muted-foreground text-sm truncate">{station.tagline}</p>
        </Link>
      </div>
    </div>
  );
};

export default StationCard;
