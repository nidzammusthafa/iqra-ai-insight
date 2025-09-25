import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import { PageResponse, PageVerse, SurahInPage, SingleSurahResponse } from "@/types/quran";
import { VerseActionSheet } from "@/components/quran/VerseActionSheet";
import { useAudioStore } from "@/store/audioSlice";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { JumpToPageDialog } from "@/components/dialogs/JumpToPageDialog";

const toArabicNumerals = (num: number) => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit)])
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
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const { stop, isPlaying, currentVerse } = useAudioStore();
  const { surahList, fetchSurahList } = useAppStore();

  useEffect(() => {
    fetchSurahList();
  }, [fetchSurahList]);

  const { data: pageData, isLoading, error } = useQuery<PageResponse>({
    queryKey: ["page", pageNum],
    queryFn: () => quranApi.getPage(pageNum),
    enabled: !!pageNum && pageNum >= 1 && pageNum <= 604,
  });

  const headerInfo = useMemo(() => {
    if (!pageData || pageData.length === 0 || surahList.length === 0) {
      return { surahName: "", surahNumber: "" };
    }
    const targetSurahOnPage = pageData.length > 1 ? pageData[1] : pageData[0];
    const surahDetails = surahList.find(s => s.number_of_surah === targetSurahOnPage.number);

    return {
      surahName: surahDetails?.name_translations.ar || targetSurahOnPage.name,
      surahNumber: toArabicNumerals(targetSurahOnPage.number),
    };
  }, [pageData, surahList]);

  const allVersesOnPage = useMemo(() => {
    if (!pageData) return [];
    return pageData.flatMap(surah => 
      surah.ayahs.map(verse => ({ verse, surah }))
    );
  }, [pageData]);

  const handleNextVerse = () => {
    if (!selectedVerse) return;
    const currentIndex = allVersesOnPage.findIndex(item => item.verse.number.inQuran === selectedVerse.verse.number.inQuran);
    if (currentIndex < allVersesOnPage.length - 1) {
      const nextItem = allVersesOnPage[currentIndex + 1];
      setSelectedVerse(nextItem);
    }
  };

  const handlePreviousVerse = () => {
    if (!selectedVerse) return;
    const currentIndex = allVersesOnPage.findIndex(item => item.verse.number.inQuran === selectedVerse.verse.number.inQuran);
    if (currentIndex > 0) {
      const prevItem = allVersesOnPage[currentIndex - 1];
      setSelectedVerse(prevItem);
    }
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
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 py-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center font-arabic text-lg">
          <span>{headerInfo.surahName} {headerInfo.surahNumber}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsJumpDialogOpen(true)}>
          <BookOpen className="w-5 h-5" />
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
      <div className="flex items-center justify-between">
         <Button variant="ghost" size="icon" onClick={() => goToPage(pageNum - 1)} disabled={pageNum <= 1}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <p className="font-arabic font-bold text-lg">{toArabicNumerals(pageNum)}</p>
        <Button variant="ghost" size="icon" onClick={() => goToPage(pageNum + 1)} disabled={pageNum >= 604}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <VerseActionSheet
        open={isVerseSheetOpen}
        onOpenChange={setIsVerseSheetOpen}
        verse={selectedVerse?.verse || null}
        surah={selectedVerse?.surah || null}
        onNext={handleNextVerse}
        onPrevious={handlePreviousVerse}
      />
      <JumpToPageDialog
        open={isJumpDialogOpen}
        onOpenChange={setIsJumpDialogOpen}
        onJump={goToPage}
      />
    </div>
  );
};
