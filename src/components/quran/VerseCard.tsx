import { useState, useEffect, useRef } from "react";
import { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Lightbulb,
  Share,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
} from "lucide-react";
import { AIInsightPanel } from "./AIInsightPanel";
import { BookmarkDialog } from "../dialogs/BookmarkDialog";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import { useToast } from "@/hooks/use-toast";

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  className?: string;
  playingVerse: number | null;
  setPlayingVerse: (verseNumber: number | null) => void;
}

export const VerseCard = ({
  verse,
  surahNumber,
  surahName,
  className,
  playingVerse,
  setPlayingVerse,
}: VerseCardProps) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { preferences, updatePreferences } = useReadingPreferences();
  const {
    isBookmarked,
    getBookmark,
    addBookmark,
    removeBookmark,
    updateBookmark,
  } = useBookmarks();
  const { toast } = useToast();

  const verseNumber = verse.number.inSurah;
  const verseText = verse.arab || verse.text;
  const verseTranslation = verse.translation || verse.translation_id || "";

  const isCurrentlyBookmarked = isBookmarked(surahNumber, verseNumber);
  const existingBookmark = getBookmark(surahNumber, verseNumber);
  const isPlaying = playingVerse === verseNumber;

  useEffect(() => {
    const qari = preferences.selectedQari;
    if (verse.audio && verse.audio[qari]) {
      audioRef.current = new Audio(verse.audio[qari]);
      audioRef.current.onended = () => setPlayingVerse(null);
    } else {
      audioRef.current = null;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [verse.audio, preferences.selectedQari, setPlayingVerse]);

  useEffect(() => {
    if (playingVerse !== verseNumber && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playingVerse, verseNumber]);

  const handleShare = () => {
    const text = `${verseText}\n\n${verseTranslation}\n\nQS. ${surahName} (${surahNumber}):${verseNumber}`;

    if (navigator.share) {
      navigator.share({
        title: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Ayat disalin",
        description: "Ayat telah disalin ke clipboard",
      });
    }
  };

  const handleAudio = () => {
    if (!audioRef.current) {
      toast({
        title: "Audio tidak tersedia",
        description: "Audio untuk ayat ini tidak ditemukan.",
      });
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setPlayingVerse(null);
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
        toast({
          variant: "destructive",
          title: "Gagal memutar audio",
          description: "Tidak dapat memutar file audio.",
        });
      });
      setPlayingVerse(verseNumber);
    }
  };

  const handleBookmarkToggle = () => {
    if (isCurrentlyBookmarked) {
      if (existingBookmark) {
        removeBookmark(existingBookmark.id);
        toast({
          title: "Bookmark dihapus",
          description: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
        });
      }
    } else {
      setShowBookmarkDialog(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBookmarkSave = (bookmarkData: any) => {
    if (existingBookmark) {
      updateBookmark(existingBookmark.id, bookmarkData);
      toast({
        title: "Bookmark diperbarui",
        description: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
      });
    } else {
      addBookmark(bookmarkData);
      toast({
        title: "Bookmark ditambahkan",
        description: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
      });
    }
  };

  const getArabicFontClass = () => {
    switch (preferences.arabicFontSize) {
      case "small":
        return "arabic-small";
      case "large":
        return "arabic-large";
      case "xl":
        return "text-3xl leading-relaxed";
      default:
        return "";
    }
  };

  const getTranslationFontClass = () => {
    switch (preferences.translationFontSize) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const getLineSpacingClass = () => {
    switch (preferences.lineSpacing) {
      case "compact":
        return "leading-tight";
      case "relaxed":
        return "leading-loose";
      default:
        return "leading-normal";
    }
  };

  return (
    <div className={cn("verse-card space-y-4", className)}>
      {/* Verse number badge */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
          <span className="text-primary font-bold text-sm">{verseNumber}</span>
        </div>

        {/* Control buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              updatePreferences({
                showTranslation: !preferences.showTranslation,
              })
            }
            className="text-muted-foreground hover:text-primary"
          >
            {preferences.showTranslation ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAudio}
            className={cn(
              "text-muted-foreground hover:text-primary",
              isPlaying && "text-secondary"
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkToggle}
            className={cn(
              "text-muted-foreground hover:text-primary",
              isCurrentlyBookmarked && "text-secondary"
            )}
          >
            {isCurrentlyBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={cn(
              "text-muted-foreground hover:text-primary",
              showAIInsights && "text-primary bg-primary-light"
            )}
          >
            <Lightbulb className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-muted-foreground hover:text-primary"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Arabic text */}
      <div
        className={cn(
          "arabic-text text-foreground",
          getArabicFontClass(),
          getLineSpacingClass()
        )}
      >
        {verseText}
      </div>

      {/* Translation */}
      {preferences.showTranslation && verseTranslation && (
        <div
          className={cn(
            "text-muted-foreground border-l-2 border-primary-light pl-4",
            getTranslationFontClass(),
            getLineSpacingClass()
          )}
        >
          {verseTranslation}
        </div>
      )}

      {/* AI Insights Panel */}
      {showAIInsights && (
        <AIInsightPanel
          surahNumber={surahNumber}
          verseNumber={verseNumber}
          verseText={verseText}
          verseTranslation={verseTranslation}
          onClose={() => setShowAIInsights(false)}
        />
      )}

      {/* Bookmark Dialog */}
      <BookmarkDialog
        open={showBookmarkDialog}
        onOpenChange={setShowBookmarkDialog}
        surahNumber={surahNumber}
        verseNumber={verseNumber}
        surahName={surahName}
        verseText={verseText}
        verseTranslation={verseTranslation}
        existingBookmark={existingBookmark}
        onSave={handleBookmarkSave}
      />
    </div>
  );
};
