import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/store/audioSlice";

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const floored = Math.floor(seconds);
  const min = Math.floor(floored / 60);
  const sec = floored % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

export const StickyAudioPlayer = () => {
  const {
    isPlaying,
    currentSurah,
    currentVerse,
    audioRef,
    play,
    pause,
    stop,
    playNext,
    playPrevious,
    seek,
  } = useAudioStore();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const prevSurahRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentSurah && prevSurahRef.current !== currentSurah.number) {
      if (pathname.startsWith('/surah/')) {
        navigate(`/surah/${currentSurah.number}`);
      }
    }
    prevSurahRef.current = currentSurah ? currentSurah.number : null;
  }, [currentSurah, navigate, pathname]);

  // Effect to update time progress
  useEffect(() => {
    const audio = audioRef;
    if (!audio) return;

    const updateProgress = () => {
      setProgress({
        currentTime: audio.currentTime,
        duration: audio.duration,
      });
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [audioRef]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  if (!currentSurah || !currentVerse) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t animate-slide-in-up">
      <div className="container mx-auto px-4 pt-2 pb-1 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-bold truncate text-primary">{currentSurah.name}</p>
            <p className="text-muted-foreground">Ayat {currentVerse.number.inSurah}</p>
          </div>

          <div className="flex items-center space-x-0">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={stop}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-muted-foreground w-10 text-center">
            {formatTime(progress.currentTime)}
          </span>
          <Slider
            value={[progress.currentTime]}
            max={progress.duration || 1}
            step={1}
            onValueChange={(value) => seek(value[0])}
          />
          <span className="text-xs text-muted-foreground w-10 text-center">
            {formatTime(progress.duration)}
          </span>
        </div>
      </div>
    </div>
  );
};