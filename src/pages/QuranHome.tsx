import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { SuratResponse } from "@/types/quran";
import { SurahCard } from "@/components/quran/SurahCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const QuranHome = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: surahs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["surahs"],
    queryFn: () => quranApi.getSuratList(),
  });

  const filteredSurahs =
    surahs?.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.translation.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleSurahClick = (surahNumber: number) => {
    navigate(`/surah/${surahNumber}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat daftar surah</p>
          <p className="text-muted-foreground text-sm">
            Silakan periksa koneksi internet Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Al-Qur'an</h1>
        </div>
        <p className="text-muted-foreground">
          Bacalah kitab suci dengan hati yang khusyuk
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari surah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">
            Memuat daftar surah...
          </span>
        </div>
      )}

      {/* Surah List */}
      {!isLoading && (
        <div className="space-y-3">
          {filteredSurahs.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredSurahs.length} surah ditemukan
                </p>
              </div>

              {filteredSurahs.map((surah) => (
                <SurahCard
                  key={surah.number}
                  surah={surah}
                  onClick={() => handleSurahClick(surah.number)}
                />
              ))}
            </>
          ) : searchTerm ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Tidak ditemukan surah dengan kata kunci "{searchTerm}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
