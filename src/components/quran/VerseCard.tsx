import { useState, forwardRef } from "react";
import { Verse, SingleSurahResponse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Eye,
  EyeOff,
  Lightbulb,
  Share,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
} from "lucide-react";
import { AIInsightPanel } from "./AIInsightPanel";
import { BookmarkDialog } from "../dialogs/BookmarkDialog";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { useAudioStore } from "@/store/audioSlice";
import { quranApi } from "@/services/quranApi";

interface VerseCardProps {
  verse: Verse;
  surah: Partial<SingleSurahResponse>; // Allow partial surah object
  surahNumber: number;
  surahName: string;
  className?: string;
}

export const VerseCard = forwardRef<HTMLDivElement, VerseCardProps>((
  { verse, surah, surahNumber, surahName, className },
  ref
) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);

  const { preferences, updatePreferences, isBookmarked, getBookmark, addBookmark, removeBookmark, updateBookmark } = useAppStore();
  const { toast } = useToast();

  const {
    isPlaying: isAudioPlaying,
    currentVerse,
    setVerse,
    pause,
  } = useAudioStore();

  const verseNumber = verse.number.inSurah;
  const verseText = verse.arab || verse.text;
  const verseTranslation = verse.translation || verse.translation_id || "";

  const isPlaying = isAudioPlaying && currentVerse?.number.inQuran === verse.number.inQuran;

  const handlePlay = async () => {
    if (isPlaying) {
      pause();
    } else {
      // Check if we have the full surah details (e.g., bismillah property)
      // If not, fetch the full details first.
      if (!surah.bismillah) {
        try {
          const fullSurahData = await quranApi.getSuratDetail(surahNumber);
          setVerse(fullSurahData, verse);
        } catch (error) {
          toast({ title: "Error", description: "Gagal memuat data audio surah." });
        }
      } else {
        // We already have the full data
        setVerse(surah as SingleSurahResponse, verse);
      }
    }
  };

  const isCurrentlyBookmarked = isBookmarked(surahNumber, verseNumber);
  const existingBookmark = getBookmark(surahNumber, verseNumber);

  const textToCopy = `${verseText}\n\n${verseTranslation}\n\nQS. ${surahName} (${surahNumber}):${verseNumber}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
        text: textToCopy,
      });
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Ayat disalin",
      description: "Teks ayat dan terjemahan telah disalin.",
    });
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


  const getTranslationFontClass = () => {
    switch (preferences.translationFontSize) {
      case "small": return "text-sm";
      case "large": return "text-lg";
      default: return "text-base";
    }
  };

  const getLineSpacingClass = () => {
    switch (preferences.lineSpacing) {
      case "compact": return "leading-tight";
      case "relaxed": return "leading-loose";
      default: return "leading-normal";
    }
  };

  return (
    <div 
      ref={ref}
      id={`verse-${verseNumber}`}
      className={cn(
        "verse-card space-y-4 p-4 rounded-lg transition-colors duration-300 border-b",
        isPlaying && "bg-primary-light/50",
        className
      )}
    >
      {preferences.showVerseActionButtons ? (
        // "Classic" Layout with action buttons
        <>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{verseNumber}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updatePreferences({ showTranslation: !preferences.showTranslation })}
                className="text-muted-foreground hover:text-primary"
              >
                {preferences.showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlay}
                className={cn("text-muted-foreground hover:text-primary", isPlaying && "text-primary")}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmarkToggle}
                className={cn("text-muted-foreground hover:text-primary", isCurrentlyBookmarked && "text-primary")}
              >
                {isCurrentlyBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={cn("text-muted-foreground hover:text-primary", showAIInsights && "text-primary bg-primary-light")}
              >
                <Lightbulb className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-primary"
              >
                <Copy className="w-4 h-4" />
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
          <div
            className={cn(
              "arabic-text text-right text-foreground",
              getLineSpacingClass()
            )}
            style={{
              fontFamily: preferences.arabicFontFamily,
              fontSize: `${preferences.arabicFontSize}px`,
            }}
          >
            {verseText}
          </div>
        </>
      ) : (
        // "Clean" Layout without action buttons
        <div className="flex flex-row-reverse items-start gap-x-4">
          <div
            className={cn(
              "arabic-text flex-grow text-right text-foreground",
              getLineSpacingClass()
            )}
            style={{
              fontFamily: preferences.arabicFontFamily,
              fontSize: `${preferences.arabicFontSize}px`,
            }}
          >
            {verseText}
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">{verseNumber}</span>
          </div>
        </div>
      )}

      {/* Translation (common for both layouts) */}
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

      {/* AI Insights Panel & Bookmark Dialog (common for both layouts) */}
      {showAIInsights && (
        <AIInsightPanel
          surahNumber={surahNumber}
          verseNumber={verseNumber}
          verseText={verseText}
          verseTranslation={verseTranslation}
          onClose={() => setShowAIInsights(false)}
        />
      )}

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
});
