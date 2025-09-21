import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { VerseCard } from "@/components/quran/VerseCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book } from "lucide-react";
import { cn } from "@/lib/utils";

export const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  
  const surahNum = parseInt(surahNumber || "1");

  const { data: surah, isLoading, error } = useQuery({
    queryKey: ["surah", surahNum],
    queryFn: () => quranApi.getSuratDetail(surahNum),
    enabled: !!surahNum && surahNum >= 1 && surahNum <= 114,
  });

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {surah ? (
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-semibold text-foreground text-lg">
                    {surah.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {surah.name_translations.id} • {surah.number_of_ayah} ayat
                  </p>
                </div>
                <span className="arabic-small text-primary font-bold">
                  {surah.name_translations.ar}
                </span>
              </div>
            </div>
          ) : (
            <LoadingSpinner size="sm" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-muted-foreground">Memuat surah...</span>
          </div>
        ) : surah ? (
          <div className="space-y-6">
            {/* Surah Info Card */}
            <div className="verse-card bg-gradient-primary text-primary-foreground">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Book className="w-5 h-5" />
                  <span className="font-semibold">Surah {surah.name}</span>
                </div>
                
                <h2 className="arabic-large font-bold">
                  {surah.name_translations.ar}
                </h2>
                
                <div className="text-primary-foreground/80 text-sm space-y-1">
                  <p>{surah.name_translations.id}</p>
                  <p>{surah.number_of_ayah} ayat • {surah.type}</p>
                  {surah.place && <p>Diturunkan di {surah.place}</p>}
                </div>
              </div>
            </div>

            {/* Bismillah for non-Fatiha and non-Tawbah */}
            {surahNum !== 1 && surahNum !== 9 && (
              <div className="verse-card text-center">
                <div className="arabic-large text-primary font-bold">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang
                </p>
              </div>
            )}

            {/* Verses */}
            <div className="space-y-4">
              {surah.verses.map((verse) => (
                <VerseCard
                  key={verse.number}
                  verse={verse}
                  surahNumber={surah.number_of_surah}
                />
              ))}
            </div>

            {/* End spacing */}
            <div className="h-8" />
          </div>
        ) : null}
      </div>
    </div>
  );
};