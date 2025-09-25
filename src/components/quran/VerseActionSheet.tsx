import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bookmark,
  Copy,
  Play,
  Share,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Pause,
  BookmarkCheck,
} from "lucide-react";
import { SurahInPage, PageVerse, SingleSurahResponse } from "@/types/quran";
import { useAudioStore } from "@/store/audioSlice";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { quranApi } from "@/services/quranApi";
import { AIInsightPanel } from "./AIInsightPanel";
import { BookmarkDialog } from "../dialogs/BookmarkDialog";

interface VerseActionSheetProps {
  verse: PageVerse | null;
  surah: SurahInPage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const VerseActionSheet = ({
  verse,
  surah,
  open,
  onOpenChange,
  onNext,
  onPrevious,
}: VerseActionSheetProps) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);

  const {
    preferences,
    isBookmarked,
    getBookmark,
    addBookmark,
    removeBookmark,
    updateBookmark,
  } = useAppStore();
  const { toast } = useToast();
  const { isPlaying, currentVerse, setVerse, pause } = useAudioStore();

  if (!verse || !surah) return null;

  const verseNumber = verse.number.inSurah;
  const surahName = surah.name;
  const surahNumber = surah.number;

  const isCurrentVersePlaying =
    isPlaying && currentVerse?.number.inQuran === verse.number.inQuran;

  const handlePlay = async () => {
    if (isCurrentVersePlaying) {
      pause();
    } else {
      try {
        const fullSurahData = await quranApi.getSuratDetail(surahNumber);
        const fullVerseData = fullSurahData.ayahs.find(
          (v) => v.number.inQuran === verse.number.inQuran
        );
        if (fullVerseData) {
          setVerse(fullSurahData, fullVerseData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data audio surah.",
        });
      }
    }
  };

  const isCurrentlyBookmarked = isBookmarked(surahNumber, verseNumber);
  const existingBookmark = getBookmark(surahNumber, verseNumber);

  const textToCopy = `${verse.arab}\n\n${verse.translation}\n\nQS. ${surahName} (${surahNumber}):${verseNumber}`;

  const handleShare = () => {
    if (navigator.share) {
      void navigator.share({
        title: `QS. ${surahName} ${surahNumber}:${verseNumber}`,
        text: textToCopy,
      });
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
      if (existingBookmark) removeBookmark(existingBookmark.id);
    } else {
      setShowBookmarkDialog(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBookmarkSave = (bookmarkData: any) => {
    if (existingBookmark) {
      updateBookmark(existingBookmark.id, bookmarkData);
    } else {
      addBookmark(bookmarkData);
    }
    toast({ title: "Bookmark disimpan" });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>
              QS. {surahName} ({surahNumber}):{verseNumber}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-grow">
            <div className="space-y-4">
              <div className="arabic-text text-right text-2xl leading-loose">
                {verse.arab}
              </div>
              <div className="text-muted-foreground">{verse.translation}</div>
              {showAIInsights && (
                <AIInsightPanel
                  surahNumber={surahNumber}
                  verseNumber={verseNumber}
                  verseText={verse.arab}
                  verseTranslation={verse.translation}
                  onClose={() => setShowAIInsights(false)}
                  className="max-w-[238px]"
                />
              )}
            </div>
          </ScrollArea>
          <Separator />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onPrevious} size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePlay}>
              {isCurrentVersePlaying ? <Pause /> : <Play />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmarkToggle}>
              {isCurrentlyBookmarked ? <BookmarkCheck /> : <Bookmark />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAIInsights(!showAIInsights)}
            >
              <Lightbulb />
            </Button>
            <Button variant="ghost" onClick={onNext} size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <BookmarkDialog
        open={showBookmarkDialog}
        onOpenChange={setShowBookmarkDialog}
        surahNumber={surahNumber}
        verseNumber={verseNumber}
        surahName={surahName}
        verseText={verse.arab}
        verseTranslation={verse.translation}
        existingBookmark={existingBookmark}
        onSave={handleBookmarkSave}
      />
    </>
  );
};
