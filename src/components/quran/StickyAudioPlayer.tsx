import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store";

interface StickyAudioPlayerProps {
  surahName: string;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const floored = Math.floor(seconds);
  const min = Math.floor(floored / 60);
  const sec = floored % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export const StickyAudioPlayer = ({ surahName }: StickyAudioPlayerProps) => {
  const {
    isPlaying,
    currentVerseNumber,
    duration,
    currentTime,
    preferences,
    togglePlayPause,
    nextVerse,
    prevVerse,
    stop,
    seek,
    updatePreferences,
  } = useAppStore();

  const handleSpeedChange = (speed: number) => {
    updatePreferences({ playbackSpeed: speed });
  };

  return (
    <div
      className={cn(
        "fixed bottom-16 left-0 right-0 z-50",
        "bg-background/80 backdrop-blur-md border-t",
        "transition-transform duration-300 ease-in-out",
        "transform translate-y-0"
      )}
    >
      <div className="container mx-auto px-4 pt-2 pb-1 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="text-sm">
              <p className="font-bold truncate text-primary">{surahName}</p>
              <p className="text-muted-foreground">Ayat {currentVerseNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-16">
                  {preferences.playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={String(preferences.playbackSpeed)}
                  onValueChange={(val) => handleSpeedChange(Number(val))}
                >
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <DropdownMenuRadioItem key={speed} value={String(speed)}>
                      {speed}x
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={prevVerse}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlayPause}>
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextVerse}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={stop}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-muted-foreground w-10 text-center">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => seek(value[0])}
          />
          <span className="text-xs text-muted-foreground w-10 text-center">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};