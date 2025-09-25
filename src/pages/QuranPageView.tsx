import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, BookOpen, BookText } from "lucide-react";
import { PageResponse, PageVerse, SurahInPage } from "@/types/quran";
import { VerseActionSheet } from "@/components/quran/VerseActionSheet";
import { useAudioStore } from "@/store/audioSlice";
import { cn } from "@/lib/utils";
import { JumpToPageDialog } from "@/components/dialogs/JumpToPageDialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const toArabicNumerals = (num: number) => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((digit) => arabicNumericals[parseInt(digit)])
    .join("");
};

export const QuranPageView = () => {
  const { pageNumber } = useParams<{ pageNumber: string }>();
  const navigate = useNavigate();
  const pageNum = parseInt(pageNumber || "1");
  const { toast } = useToast();

  const [selectedVerse, setSelectedVerse] = useState<{verse: PageVerse, surah: SurahInPage} | null>(null);
  const [isVerseSheetOpen, setIsVerseSheetOpen] = useState(false);
  const [isJumpDialogOpen, setIsJumpDialogOpen] = useState(false);
  const [isTranslationSheetOpen, setIsTranslationSheetOpen] = useState(false);
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const { playPage, stop, isPlaying, currentVerse, playbackMode } = useAudioStore();

  const { data: pageData, isLoading, error } = useQuery<PageResponse>({
    queryKey: ["page", pageNum],
    queryFn: () => quranApi.getPage(pageNum),
    enabled: !!pageNum && pageNum >= 1 && pageNum <= 604,
  });

  const isPagePlaying = isPlaying && playbackMode === 'page';

  const goToPage = (page: number) => {
    if (page >= 1 && page <= 604) {
      stop(); // Stop audio when changing pages
      navigate(`/page/${page}`);
    }
  };

  const handleVerseClick = (verse: PageVerse, surah: SurahInPage) => {
    setSelectedVerse({ verse, surah });
    setIsVerseSheetOpen(true);
  };

  const handlePlayPage = () => {
    if (isPagePlaying) {
      stop();
    } else if (pageData) {
      const versesWithSurah = pageData.flatMap(surah => 
        surah.ayahs.map(verse => ({ verse, surahNumber: surah.number }))
      );
      playPage(versesWithSurah);
    }
  };
  
  const headerInfo = useMemo(() => {
    if (!pageData || pageData.length === 0) {
      return { surahName: "" };
    }
    const targetSurah = pageData.length > 1 ? pageData[1] : pageData[0];
    return {
      surahName: targetSurah.name,
    };
  }, [pageData]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStart(e.touches[0].clientX);
    setSwipeDistance(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (swipeStart === null) return;
    const currentTouch = e.touches[0].clientX;
    const distance = currentTouch - swipeStart;
    setSwipeDistance(distance);
  };

  const handleTouchEnd = () => {
    if (swipeStart === null) return;
    const threshold = window.innerWidth / 3;
    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0 && pageNum > 1) {
        goToPage(pageNum - 1);
        toast({ description: `Beralih ke halaman ${pageNum - 1}`, duration: 1500 });
      } else if (swipeDistance < 0 && pageNum < 604) {
        goToPage(pageNum + 1);
        toast({ description: `Beralih ke halaman ${pageNum + 1}`, duration: 1500 });
      }
    }
    setSwipeStart(null);
    setSwipeDistance(0);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat data halaman</p>
          <Button onClick={() => navigate("/")} variant="outline">Kembali</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 space-y-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => goToPage(pageNum - 1)} disabled={pageNum <= 1}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold">{headerInfo.surahName}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => goToPage(pageNum + 1)} disabled={pageNum >= 604}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-center space-x-2 bg-background/95 p-2 rounded-md sticky top-0 z-10 border-b">
          <Button variant="outline" size="sm" onClick={handlePlayPage}>
            {isPagePlaying ? <Pause className="w-4 h-4 mr-2"/> : <Play className="w-4 h-4 mr-2"/>}
            {isPagePlaying ? 'Hentikan' : 'Putar Halaman'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsJumpDialogOpen(true)}>
            <BookOpen className="w-4 h-4 mr-2"/>
            Lompat Halaman
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsTranslationSheetOpen(true)}>
            <BookText className="w-4 h-4 mr-2"/>
            Terjemahan
          </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : pageData ? (
        <div className="border rounded-lg p-4 min-h-[70vh] flex flex-col font-arabic text-2xl leading-loose" dir="rtl">
          <p className="text-justify">
            {pageData.map((surah, surahIndex) => (
              <span key={surah.number}>
                {surahIndex > 0 && (
                  <div className="surah-header text-center my-4 p-2 border-y">
                    <p className="font-bold text-base">{surah.name}</p>
                  </div>
                )}
                {surah.ayahs.map((verse) => (
                  <span
                    key={verse.number.inQuran}
                    className={cn(
                      "cursor-pointer hover:bg-primary/10 transition-colors p-1 rounded",
                      currentVerse?.number.inQuran === verse.number.inQuran && isPlaying && "bg-primary/20"
                    )}
                    onClick={() => handleVerseClick(verse, surah)}
                  >
                    {verse.arab}
                    <span className="text-primary font-bold mx-1 text-xl">
                      ﴿{toArabicNumerals(verse.number.inSurah)}﴾
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      ) : null}
      
      {/* Footer */}
      <div className="flex items-center justify-center">
        <p className="font-arabic font-bold text-lg">{toArabicNumerals(pageNum)}</p>
      </div>

      <VerseActionSheet
        open={isVerseSheetOpen}
        onOpenChange={setIsVerseSheetOpen}
        verse={selectedVerse?.verse || null}
        surah={selectedVerse?.surah || null}
      />
      <JumpToPageDialog
        open={isJumpDialogOpen}
        onOpenChange={setIsJumpDialogOpen}
        onJump={goToPage}
      />
      <Sheet open={isTranslationSheetOpen} onOpenChange={setIsTranslationSheetOpen}>
        <SheetContent side="bottom" className="max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>Terjemahan Halaman {pageNum}</SheetTitle>
            <SheetDescription>Daftar terjemahan untuk semua ayat di halaman ini.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[60vh] mt-4">
            <div className="space-y-4 pr-6">
              {pageData?.flatMap(s => s.ayahs).map(v => (
                <div key={v.number.inQuran} className="border-b pb-2">
                  <p className="font-bold">{pageData.find(s => s.ayahs.includes(v))?.name} : {v.number.inSurah}</p>
                  <p className="text-muted-foreground">{v.translation}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
