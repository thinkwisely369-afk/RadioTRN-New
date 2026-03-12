import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import type { Station } from "@/lib/api";

interface AudioContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playStation: (station: Station) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playStation = useCallback((station: Station) => {
    setCurrentStation(station);
    setIsPlaying(true);
    // Audio will be played by the PersistentPlayer component
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        isMuted,
        playStation,
        togglePlay,
        toggleMute,
        setVolume,
        audioRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
