import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { TranslationId } from "@/types/quran";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"verses" | "surahs">("verses");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchTerm, searchType],
    queryFn: () => {
      if (searchType === "verses") {
        return quranApi.searchVerses(searchTerm, TranslationId.ID, 1, 20);
      } else {
        return quranApi.searchSurats(searchTerm);
      }
    },
    enabled: hasSearched && searchTerm.length > 2,
  });

  const handleSearch = () => {
    if (searchTerm.length > 2) {
      setHasSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Pencarian</h1>
        </div>
        <p className="text-muted-foreground">
          Cari ayat atau surah dalam Al-Qur'an
        </p>
      </div>

      {/* Search Type Toggle */}
      <div className="flex rounded-lg bg-muted p-1">
        <Button
          variant={searchType === "verses" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSearchType("verses")}
          className={cn(
            "flex-1",
            searchType === "verses" && "bg-primary text-primary-foreground"
          )}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Ayat
        </Button>
        <Button
          variant={searchType === "surahs" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSearchType("surahs")}
          className={cn(
            "flex-1",
            searchType === "surahs" && "bg-primary text-primary-foreground"
          )}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Surah
        </Button>
      </div>

      {/* Search Input */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={
              searchType === "verses" 
                ? "Cari ayat (contoh: Allah, rahmat, sabar...)"
                : "Cari nama surah (contoh: Al-Fatihah, Baqarah...)"
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary"
          />
        </div>
        
        <Button 
          onClick={handleSearch}
          disabled={searchTerm.length < 3}
          className="w-full"
        >
          <Search className="w-4 h-4 mr-2" />
          Cari {searchType === "verses" ? "Ayat" : "Surah"}
        </Button>
      </div>

      {/* Search Info */}
      {searchTerm.length > 0 && searchTerm.length < 3 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            Masukkan minimal 3 karakter untuk mulai pencarian
          </p>
        </div>
      )}

      {/* Results */}
      {hasSearched && searchTerm.length > 2 && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-muted-foreground">Mencari...</span>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Ditemukan {searchResults.length} hasil
              </p>
              
              {searchResults.map((result, index) => (
                <div key={index} className="verse-card">
                  {searchType === "verses" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          QS. {result.surah_name || result.name} : {result.ayah_number || result.number}
                        </span>
                      </div>
                      
                      {result.text && (
                        <div className="arabic-text text-foreground">
                          {result.text}
                        </div>
                      )}
                      
                      {result.translation_id && (
                        <div className="text-muted-foreground leading-relaxed border-l-2 border-primary-light pl-4">
                          {result.translation_id}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {result.number_of_surah}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground">
                              {result.name}
                            </h3>
                            <span className="arabic-small text-primary font-bold">
                              {result.name_translations?.ar}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{result.name_translations?.id}</span>
                            <span>•</span>
                            <span>{result.number_of_ayah} ayat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Tidak ditemukan hasil untuk "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Tips Pencarian:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Gunakan kata kunci dalam bahasa Indonesia atau Arab</li>
            <li>• Coba kata yang lebih spesifik untuk hasil yang lebih relevan</li>
            <li>• Gunakan pencarian surah untuk menemukan surat tertentu</li>
            <li>• Pencarian ayat akan mencari di seluruh Al-Qur'an</li>
          </ul>
        </div>
      )}
    </div>
  );
};