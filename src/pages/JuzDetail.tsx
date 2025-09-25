import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { VerseCard } from "@/components/quran/VerseCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book } from "lucide-react";
import { Verse, SingleSurahResponse } from "@/types/quran";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Definisikan tipe data untuk respons API Juz
// Dibuat kompatibel dengan SingleSurahResponse untuk properti yang tumpang tindih
interface SurahInJuz extends Partial<SingleSurahResponse> {
  number: number;
  name: string;
  translation: string;
  revelation: string;
  numberOfAyahs: number;
  ayahs: Verse[];
}

type JuzResponse = SurahInJuz[];

export const JuzDetail = () => {
  const { juzNumber } = useParams<{ juzNumber: string }>();
  const navigate = useNavigate();
  const juzNum = parseInt(juzNumber || "1");
  const { toast } = useToast();

  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const { data: juzData, isLoading, error } = useQuery<JuzResponse>({
    queryKey: ["juz", juzNum],
    queryFn: () => quranApi.getJuz(juzNum),
    enabled: !!juzNum && juzNum >= 1 && juzNum <= 30,
  });

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
      if (swipeDistance > 0 && juzNum > 1) {
        navigate(`/juz/${juzNum - 1}`);
        toast({ title: "Pindah Juz", description: `Beralih ke Juz sebelumnya`, duration: 1000 });
      } else if (swipeDistance < 0 && juzNum < 30) {
        navigate(`/juz/${juzNum + 1}`);
        toast({ title: "Pindah Juz", description: `Beralih ke Juz selanjutnya`, duration: 1000 });
      }
    }
    setSwipeStart(null);
    setSwipeDistance(0);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat data Juz</p>
          <Button onClick={() => navigate("/")} variant="outline">Kembali</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 space-y-6"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md -mx-4 px-4 py-3 border-b">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold">Juz {juzNum}</h1>
          </div>
        </div>
        {Math.abs(swipeDistance) > window.innerWidth / 4 && (
            <div className="absolute top-full left-0 right-0 bg-primary/10 backdrop-blur-sm p-2 text-center animate-slide-in-right border-b border-primary/20">
              <p className="text-sm text-primary font-medium animate-fade-in">
                {swipeDistance > 0 ? `← Juz sebelumnya ${juzNum > 1 ? `(${juzNum - 1})` : ""}` : `Juz selanjutnya → ${juzNum < 30 ? `(${juzNum + 1})` : ""}`}
              </p>
            </div>
          )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Memuat data Juz...</span>
        </div>
      ) : juzData ? (
        <div className="space-y-4">
          {juzData.map((surah) => (
            <div key={surah.number}>
              {/* Surah Header */}
              <div className="verse-card bg-gradient-primary text-primary-foreground p-4 rounded-lg my-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Book className="w-5 h-5" />
                    <span className="font-semibold">Surah {surah.name}</span>
                  </div>
                  <h2 className="arabic-large font-bold">{surah.name}</h2>
                  <p>{surah.translation}</p>
                </div>
              </div>

              {/* Verses */}
              <div className="space-y-1">
                {surah.ayahs.map((verse) => (
                  <VerseCard
                    key={verse.number.inQuran}
                    verse={verse}
                    surah={surah}
                    surahNumber={surah.number}
                    surahName={surah.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
