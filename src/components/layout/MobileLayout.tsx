import { Book, BookOpen, Search, Clock } from "lucide-react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFocusMode } from "@/hooks/useFocusModeHook";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { useAdhanNotifications } from "@/hooks/useAdhanNotifications";
import { useAppStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { SingleSurahResponse } from "@/types/quran";

interface MobileLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "Qur'an",
    icon: BookOpen,
    path: "/",
    activePattern: /^\/$/,
  },
  {
    label: "Hadits",
    icon: Book,
    path: "/hadits",
    activePattern: /^\/hadits/,
  },
  {
    label: "Cari",
    icon: Search,
    path: "/search",
    activePattern: /^\/search/,
  },
  {
    label: "Sholat",
    icon: Clock,
    path: "/prayer-times",
    activePattern: /^\/prayer-times/,
  },
];

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  const { isFocusMode, setIsFocusMode } = useFocusMode();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useAdhanNotifications();

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    currentSurahNumber,
    currentVerseNumber,
    isPlaying,
    seekTo,
    nextVerse,
    setPlayingStatus,
    stop,
    setAudioProgress,
    onSeekComplete,
  } = useAppStore();

  const preferences = useAppStore((state) => state.preferences);

  const { data: surahData } = useQuery<SingleSurahResponse>({
    queryKey: ["surah", currentSurahNumber],
    queryFn: () => quranApi.getSuratDetail(currentSurahNumber!),
    enabled: !!currentSurahNumber,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (seekTo !== null) {
      audio.currentTime = seekTo;
      onSeekComplete();
    }

    if (isPlaying && currentSurahNumber && currentVerseNumber && surahData) {
      const verse = (surahData.ayahs || surahData.verses || []).find(
        (v) => v.number.inSurah === currentVerseNumber
      );
      const qari = preferences.selectedQari;

      if (verse && verse.audio[qari]) {
        const audioUrl = verse.audio[qari];
        if (audio.src !== audioUrl) {
          audio.src = audioUrl;
        }
        audio.playbackRate = preferences.playbackSpeed;
        audio.play().catch((err) => {
          console.error("Audio playback failed:", err);
          setPlayingStatus(false);
        });
      } else {
        stop();
      }
    } else {
      audio.pause();
    }
  }, [
    isPlaying,
    currentSurahNumber,
    currentVerseNumber,
    surahData,
    preferences,
    seekTo,
    setPlayingStatus,
    stop,
    onSeekComplete,
  ]);

  const handleAudioEnded = () => {
    if (preferences.isAutoplayEnabled) {
      if (surahData && currentVerseNumber && currentVerseNumber < surahData.numberOfAyahs) {
        nextVerse();
      } else {
        stop();
      }
    } else {
      stop();
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setAudioProgress({
        currentTime: audio.currentTime,
        duration: audio.duration,
      });
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setAudioProgress({
        currentTime: audio.currentTime,
        duration: audio.duration,
      });
    }
  };

  return (
    <div className="mobile-container">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <main className={cn("min-h-screen", !isFocusMode && "pb-20")}>
        {children}
      </main>

      <FloatingActionMenu
        isFocusMode={isFocusMode}
        onFocusToggle={() => setIsFocusMode(!isFocusMode)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <BackToTopButton />

      {!isFocusMode && (
        <>
          <SettingsSheet
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
          <nav className="bottom-nav animate-slide-in-right backdrop-blur-md bg-card/95 shadow-lg">
            <div className="flex justify-around items-center py-2 pr-12 animate-fade-in">
              {navItems.map((item) => {
                const isActive = item.activePattern.test(location.pathname);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-300 hover-scale",
                      isActive
                        ? "text-primary bg-primary-light animate-scale-in shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-accent/80 hover:shadow-sm"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 mb-1 transition-transform",
                        isActive && "scale-110"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive && "font-semibold"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
};
