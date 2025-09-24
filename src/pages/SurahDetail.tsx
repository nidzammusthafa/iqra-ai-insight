import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, createRef } from "react";
import { quranApi } from "@/services/quranApi";
import { VerseCard } from "@/components/quran/VerseCard";
import { StickyAudioPlayer } from "@/components/quran/StickyAudioPlayer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { JumpToVerseDialog } from "@/components/dialogs/JumpToVerseDialog";
import { ArrowLeft, Book, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFocusMode } from "@/hooks/useFocusModeHook";
import { useAppStore } from "@/store";
import { SingleSurahResponse } from "@/types/quran";

export const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get global audio state to decide when to show the player and scroll
  const { currentSurahNumber, currentVerseNumber, isPlaying } = useAppStore();

  const verseRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const [isJumpDialogOpen, setIsJumpDialogOpen] = useState(false);

  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFocusMode } = useFocusMode();

  const surahNum = parseInt(surahNumber || "1");

  const {
    data: surah,
    isLoading,
    error,
  } = useQuery<SingleSurahResponse>({
    queryKey: ["surah", surahNum],
    queryFn: () => quranApi.getSuratDetail(surahNum),
    enabled: !!surahNum && surahNum >= 1 && surahNum <= 114,
  });

  const verses = surah?.ayahs || surah?.verses || [];
  if (verses.length > 0 && verseRefs.current.length !== verses.length) {
    verseRefs.current = verses.map((_) => createRef<HTMLDivElement>());
  }

  // Effect to scroll the currently playing verse into view
  useEffect(() => {
    if (isPlaying && currentSurahNumber === surahNum && currentVerseNumber) {
      const verseRef = verseRefs.current[currentVerseNumber - 1];
      verseRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isPlaying, currentSurahNumber, currentVerseNumber, surahNum]);

  const handleJumpToVerse = (verseNumber: number) => {
    const element = document.getElementById(`verse-${verseNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight");
      setTimeout(() => element.classList.remove("highlight"), 3000);
    }
  };

  // Scroll to verse if hash is present
  useEffect(() => {
    if (surah && window.location.hash) {
      const verseId = window.location.hash.substring(1);
      const element = document.getElementById(verseId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight");
          setTimeout(() => element.classList.remove("highlight"), 3000);
        }, 500);
      }
    }
  }, [surah]);

  // Save last read verse
  useEffect(() => {
    if (surah) {
      const lastRead = { surah: surahNum, verse: 1 };
      localStorage.setItem("last_read_verse", JSON.stringify(lastRead));
    }
  }, [surah, surahNum]);

  // Sticky header scroll effect
  useEffect(() => {
    const header = containerRef.current?.querySelector(".sticky-header");
    if (!header) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      header.classList.toggle("scrolled", scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Swipe navigation handlers
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
    const threshold = 100;
    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0 && surahNum > 1) {
        navigate(`/surah/${surahNum - 1}`);
        toast({ title: "Pindah Surah", description: `Beralih ke surah sebelumnya` });
      } else if (swipeDistance < 0 && surahNum < 114) {
        navigate(`/surah/${surahNum + 1}`);
        toast({ title: "Pindah Surah", description: `Beralih ke surah selanjutnya` });
      }
    }
    setSwipeStart(null);
    setSwipeDistance(0);
  };

  const goToPreviousSurah = () => {
    if (surahNum > 1) navigate(`/surah/${surahNum - 1}`);
  };

  const goToNextSurah = () => {
    if (surahNum < 114) navigate(`/surah/${surahNum + 1}`);
  };

  if (!surahNumber || surahNum < 1 || surahNum > 114) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Nomor surah tidak valid</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat surah</p>
          <p className="text-muted-foreground text-sm mb-4">
            Silakan periksa koneksi internet Anda
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      {!isFocusMode && (
        <div className="sticky-header animate-fade-in">
          <div className="p-4 flex items-center space-x-3 animate-slide-in-right">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {surah ? (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h1 className="font-semibold text-foreground text-lg">{surah.name}</h1>
                    <p className="text-sm text-muted-foreground">{surah.translation} • {surah.numberOfAyahs} ayat</p>
                  </div>
                </div>
              </div>
            ) : (
              <LoadingSpinner size="sm" />
            )}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => setIsJumpDialogOpen(true)} className="text-muted-foreground hover:text-primary">
                <Hash className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToPreviousSurah} disabled={surahNum <= 1} className="text-muted-foreground hover:text-primary">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToNextSurah} disabled={surahNum >= 114} className="text-muted-foreground hover:text-primary">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {Math.abs(swipeDistance) > 50 && (
            <div className="absolute top-full left-0 right-0 bg-primary/10 backdrop-blur-sm p-2 text-center animate-slide-in-right border-b border-primary/20">
              <p className="text-sm text-primary font-medium animate-fade-in">
                {swipeDistance > 0 ? `← Surah sebelumnya ${surahNum > 1 ? `(${surahNum - 1})` : ""}` : `Surah selanjutnya → ${surahNum < 114 ? `(${surahNum + 1})` : ""}`}
              </p>
            </div>
          )}
        </div>
      )}

      {surah && (
        <JumpToVerseDialog open={isJumpDialogOpen} onOpenChange={setIsJumpDialogOpen} maxVerse={surah.numberOfAyahs} onJump={handleJumpToVerse} />
      )}

      {/* Sticky Audio Player UI now appears based on global state */}
      {currentSurahNumber && surah && (
        <StickyAudioPlayer surahName={surah.name} />
      )}

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-muted-foreground">Memuat surah...</span>
          </div>
        ) : surah ? (
          <div className="space-y-6">
            <Breadcrumb className="-mt-2 mb-2">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{surah.name}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="verse-card bg-gradient-primary text-primary-foreground p-4 rounded-lg">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Book className="w-5 h-5" />
                  <span className="font-semibold">Surah {surah.name}</span>
                </div>
                <h2 className="arabic-large font-bold">{surah.name}</h2>
                <div className="text-primary-foreground/80 text-sm space-y-1">
                  <p>{surah.translation}</p>
                  <p>{surah.numberOfAyahs} ayat • {surah.revelation}</p>
                  {surah.description && <p className="text-xs pt-2">{surah.description}</p>}
                </div>
              </div>
            </div>

            {surah.number !== 1 && surah.number !== 9 && surah.bismillah && (
              <div className="verse-card text-center p-4 rounded-lg">
                <div className="arabic-large text-primary font-bold">{surah.bismillah.arab}</div>
                <p className="text-muted-foreground text-sm mt-2">{surah.bismillah.translation}</p>
              </div>
            )}

            <div className="space-y-1">
              {verses.map((verse, index) => (
                <VerseCard
                  ref={verseRefs.current[index]}
                  key={verse.number.inSurah}
                  verse={verse}
                  surahNumber={surah.number}
                  surahName={surah.name}
                />
              ))}
            </div>

            <div className="h-24" />
          </div>
        ) : null}
      </div>
    </div>
  );
};