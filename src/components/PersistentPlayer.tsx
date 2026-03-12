import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { stationsAPI } from "@/lib/api";

const PersistentPlayer = () => {
  const {
    currentStation,
    isPlaying,
    volume,
    isMuted,
    togglePlay,
    toggleMute,
    setVolume,
    audioRef,
  } = useAudio();

  const [stationCount, setStationCount] = useState(0);

  useEffect(() => {
    const loadStationCount = async () => {
      try {
        const stations = await stationsAPI.getAll();
        setStationCount(stations.length);
      } catch (error) {
        console.error('Failed to load station count:', error);
      }
    };
    loadStationCount();
  }, []);

  useEffect(() => {
    if (audioRef.current && currentStation && isPlaying) {
      audioRef.current.src = currentStation.streamUrl;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);

      // Set Media Session metadata for iOS lock screen and background controls
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentStation.name,
          artist: currentStation.tagline,
          album: 'The Radio Network',
          artwork: currentStation.logoUrl ? [
            { src: currentStation.logoUrl, sizes: '96x96', type: 'image/png' },
            { src: currentStation.logoUrl, sizes: '128x128', type: 'image/png' },
            { src: currentStation.logoUrl, sizes: '192x192', type: 'image/png' },
            { src: currentStation.logoUrl, sizes: '256x256', type: 'image/png' },
            { src: currentStation.logoUrl, sizes: '384x384', type: 'image/png' },
            { src: currentStation.logoUrl, sizes: '512x512', type: 'image/png' },
          ] : [
            { src: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
          ]
        });

        // Set up media session action handlers
        navigator.mediaSession.setActionHandler('play', () => {
          if (audioRef.current) {
            audioRef.current.play();
          }
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
        });
      }
    }
  }, [currentStation, audioRef, isPlaying, volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioRef]);

  // Empty state when no station is selected
  if (!currentStation) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-20 md:h-24 gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-secondary flex items-center justify-center">
                  <Radio className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display font-medium text-foreground">
                    Select a station to start listening
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stationCount} station{stationCount !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-0.5 w-full bg-border" />
        </div>
        <div className="h-20 md:h-24" />
      </>
    );
  }

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 md:h-24 gap-4">
            {/* Station Info */}
            <Link
              to={`/station/${currentStation.id}`}
              className="flex items-center gap-3 min-w-0 flex-shrink group"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, hsl(${currentStation.color} / 0.8) 0%, hsl(${currentStation.color} / 0.4) 100%)`,
                }}
              >
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-5">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-foreground rounded-full animate-equalizer"
                        style={{
                          height: "100%",
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Radio className="w-5 h-5 text-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {currentStation.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentStation.tagline}
                </p>
              </div>
            </Link>

            {/* Center Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                style={{
                  background: `hsl(${currentStation.color})`,
                  boxShadow: isPlaying ? `0 0 30px hsl(${currentStation.color} / 0.5)` : 'none',
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-background fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-background fill-current ml-0.5" />
                )}
              </button>
            </div>

            {/* Volume Controls */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 md:w-28 h-2 bg-secondary rounded-full appearance-none cursor-pointer"
                style={{
                  accentColor: `hsl(${currentStation.color})`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Progress bar accent */}
        <div
          className="h-0.5 w-full transition-all duration-300"
          style={{
            background: isPlaying
              ? `linear-gradient(90deg, hsl(${currentStation.color}) 0%, hsl(${currentStation.color} / 0.3) 100%)`
              : 'transparent',
          }}
        />
      </div>

      {/* Spacer to prevent content from being hidden behind the player */}
      <div className="h-20 md:h-24" />
    </>
  );
};

export default PersistentPlayer;
