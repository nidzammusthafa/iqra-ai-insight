import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Definisikan tipe data yang lebih spesifik untuk API Halaman
interface PageVerse {
  number: { inQuran: number; inSurah: number };
  arab: string;
  // ...properti lain jika ada
}

interface SurahInPage {
  number: number;
  name: string;
  ayahs: PageVerse[];
}

type PageResponse = SurahInPage[];

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

  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const { data: pageData, isLoading, error } = useQuery<PageResponse>({
    queryKey: ["page", pageNum],
    queryFn: () => quranApi.getPage(pageNum),
    enabled: !!pageNum && pageNum >= 1 && pageNum <= 604,
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= 604) {
      navigate(`/page/${page}`);
    }
  };

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
    const threshold = window.innerWidth / 2;
    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0 && pageNum > 1) {
        goToPage(pageNum - 1);
        toast({ title: "Pindah Halaman", description: `Beralih ke halaman sebelumnya`, duration: 1000 });
      } else if (swipeDistance < 0 && pageNum < 604) {
        goToPage(pageNum + 1);
        toast({ title: "Pindah Halaman", description: `Beralih ke halaman selanjutnya`, duration: 1000 });
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

  const continuousText = pageData
    ? pageData
        .map((surah) =>
          surah.ayahs
            .map(
              (verse) =>
                `${verse.arab} ﴿${toArabicNumerals(verse.number.inSurah)}﴾`
            )
            .join(" ")
        )
        .join(" ")
    : "";

  return (
    <div 
      className="p-4 space-y-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Halaman {pageNum}</h1>
        <div style={{ width: 40 }} /> {/* Spacer */}
        {Math.abs(swipeDistance) > window.innerWidth / 4 && (
            <div className="absolute top-full left-0 right-0 bg-primary/10 backdrop-blur-sm p-2 text-center animate-slide-in-right border-b border-primary/20">
              <p className="text-sm text-primary font-medium animate-fade-in">
                {swipeDistance > 0 ? `← Halaman ${pageNum > 1 ? `${pageNum - 1}` : ""}` : `Halaman ${pageNum < 604 ? `${pageNum + 1}` : ""} →`}
              </p>
            </div>
          )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : pageData ? (
        <div className="border rounded-lg p-4 min-h-[70vh] flex flex-col">
          {/* Konten Halaman Mushaf */}
          <div className="flex-grow arabic-text leading-loose text-2xl" dir="rtl">
            <p>{continuousText}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
