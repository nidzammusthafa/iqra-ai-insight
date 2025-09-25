import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { SurahCard } from "@/components/quran/SurahCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, BookMarked, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { SurahListItem } from "@/types/quran";

export const QuranHome = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: surahs,
    isLoading,
    error,
  } = useQuery<SurahListItem[]>({
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

  const handleJuzClick = (juzNumber: number) => {
    navigate(`/juz/${juzNumber}`);
  };

  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat data</p>
          <p className="text-muted-foreground text-sm">
            Silakan periksa koneksi internet Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Al-Qur'an</h1>
        </div>
        <p className="text-muted-foreground">
          Pilih mode baca yang Anda inginkan.
        </p>
      </div>

      <Tabs defaultValue="surah" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="surah">Surah</TabsTrigger>
          <TabsTrigger value="juz">Juz</TabsTrigger>
          <TabsTrigger value="halaman">Halaman</TabsTrigger>
        </TabsList>

        {/* Surah Tab */}
        <TabsContent value="surah" className="space-y-4">
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari surah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-muted-foreground">
                Memuat daftar surah...
              </span>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3">
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah) => (
                  <SurahCard
                    key={surah.number}
                    surah={surah}
                    onClick={() => handleSurahClick(surah.number)}
                  />
                ))
              ) : searchTerm ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Tidak ditemukan surah dengan kata kunci "{searchTerm}"
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </TabsContent>

        {/* Juz Tab */}
        <TabsContent value="juz">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
            {juzList.map((juz) => (
              <Card
                key={juz}
                className="flex items-center justify-center p-4 aspect-square cursor-pointer hover:bg-muted hover:border-primary transition-colors"
                onClick={() => handleJuzClick(juz)}
              >
                <div className="text-center space-y-1">
                  <BookMarked className="w-6 h-6 mx-auto text-muted-foreground" />
                  <p className="font-semibold">Juz {juz}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Halaman Tab */}
        <TabsContent value="halaman">
          <div className="text-center py-12 px-4 space-y-4">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <h3 className="font-semibold text-lg">Mode Halaman Mushaf</h3>
            <p className="text-muted-foreground">
              Masukkan nomor halaman (1-604) untuk memulai membaca dalam mode
              halaman.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const page = (e.target as any).elements.page.value;
                if (page >= 1 && page <= 604) {
                  navigate(`/page/${page}`);
                }
              }}
              className="flex items-center max-w-xs mx-auto space-x-2"
            >
              <Input
                name="page"
                type="number"
                min="1"
                max="604"
                placeholder="Nomor Halaman..."
                required
                className="text-center"
              />
              <Button type="submit">Buka</Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
