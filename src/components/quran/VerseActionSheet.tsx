
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  Copy,
  Play,
  Share,
} from "lucide-react";
import { SurahInPage, PageVerse } from "@/types/quran"; // Assuming types are in quran.ts

interface VerseActionSheetProps {
  verse: PageVerse | null;
  surah: SurahInPage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VerseActionSheet = ({
  verse,
  surah,
  open,
  onOpenChange,
}: VerseActionSheetProps) => {
  if (!verse || !surah) return null;

  const verseNumber = verse.number.inSurah;
  const surahName = surah.name;
  const surahNumber = surah.number;

  const handlePlay = () => {
    // TODO: Implement play audio
    console.log("Play audio for", surahNumber, verseNumber);
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark
    console.log("Bookmark", surahNumber, verseNumber);
  };

  const handleCopy = () => {
    // TODO: Implement copy
    console.log("Copy", surahNumber, verseNumber);
  };

  const handleShare = () => {
    // TODO: Implement share
    console.log("Share", surahNumber, verseNumber);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            QS. {surahName} ({surahNumber}):{verseNumber}
          </SheetTitle>
          <SheetDescription>
            Aksi cepat untuk ayat yang dipilih.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="arabic-text text-right text-2xl leading-relaxed">
            {verse.arab}
          </div>
          <div className="text-muted-foreground">
            {verse.translation}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handlePlay}>
            <Play className="w-4 h-4 mr-2" />
            Putar Audio
          </Button>
          <Button variant="outline" onClick={handleBookmark}>
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Salin
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
