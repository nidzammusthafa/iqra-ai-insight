import { useState, forwardRef } from "react";
import { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  EyeOff,
  Lightbulb,
  Share,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Copy,
  BookOpenCheck,
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
  isPlaying: boolean;
  onPlay: () => void;
}

export const VerseCard = forwardRef<HTMLDivElement, VerseCardProps>((
  { verse, surahNumber, surahName, className, isPlaying, onPlay },
  ref
) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);

  const { preferences, updatePreferences } = useReadingPreferences();
  const { isBookmarked, getBookmark, addBookmark, removeBookmark, updateBookmark } = useBookmarks();
  const { toast } = useToast();

  const verseNumber = verse.number.inSurah;
  const verseText = verse.arab || verse.text;
  const verseTranslation = verse.translation || verse.translation_id || "";

  const isCurrentlyBookmarked = isBookmarked(surahNumber, verseNumber);
  const existingBookmark = getBookmark(surahNumber, verseNumber);

  const fullVerseText = `${verseText}\n\n${verseTranslation}\n\nQS. ${surahName} (${surahNumber}):${verseNumber}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
        text: fullVerseText,
      });
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullVerseText);
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

  const getArabicFontClass = () => {
    switch (preferences.arabicFontSize) {
      case "small": return "arabic-small";
      case "large": return "arabic-large";
      case "xl": return "text-3xl leading-relaxed";
      default: return "";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          ref={ref}
          id={`verse-${verseNumber}`}
          className={cn(
            "verse-card space-y-4 p-4 rounded-lg transition-colors duration-300 relative",
            isPlaying && "bg-primary-light/50",
            className
          )}
        >
          {/* Verse number badge */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{verseNumber}</span>
            </div>
          </div>

          {/* Arabic text */}
          <div
            className={cn(
              "arabic-text text-right text-foreground",
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
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuItem onClick={onPlay}>
          {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          <span>{isPlaying ? "Jeda" : "Putar Audio"}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleBookmarkToggle}>
          {isCurrentlyBookmarked ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
          <span>{isCurrentlyBookmarked ? "Hapus Bookmark" : "Bookmark Ayat"}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setShowAIInsights(true)}>
          <Lightbulb className="mr-2 h-4 w-4" />
          <span>AI Insight</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" />
          <span>Bagikan</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Salin Teks</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => updatePreferences({ showTranslation: !preferences.showTranslation })}>
          {preferences.showTranslation ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          <span>{preferences.showTranslation ? "Sembunyikan Terjemahan" : "Tampilkan Terjemahan"}</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
            <BookOpenCheck className="mr-2 h-4 w-4" />
            <span>Lihat Tafsir</span>
        </DropdownMenuItem>

      </DropdownMenuContent>

      {/* AI Insights Panel & Bookmark Dialog are kept outside the trigger to avoid layout shifts */}
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
    </DropdownMenu>
  );
});

