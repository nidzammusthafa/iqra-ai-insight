import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { quranApi } from "@/services/quranApi";
import { HaditsPerawi } from "@/types/quran";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const HaditsHome = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: perawis, isLoading, error } = useQuery({
    queryKey: ["hadits-perawi"],
    queryFn: () => quranApi.getHaditsPerawiInfo(),
  });

  const filteredPerawis = perawis?.filter(perawi => 
    perawi.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat daftar perawi</p>
          <p className="text-muted-foreground text-sm">Silakan periksa koneksi internet Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <BookOpen className="w-6 h-6 text-secondary" />
          <h1 className="text-2xl font-bold text-foreground">Hadits</h1>
        </div>
        <p className="text-muted-foreground">
          Kumpulan hadits dari berbagai perawi terpercaya
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari perawi hadits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-secondary"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Memuat daftar perawi...</span>
        </div>
      )}

      {/* Perawi List */}
      {!isLoading && (
        <div className="space-y-3">
          {filteredPerawis.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredPerawis.length} perawi ditemukan
                </p>
              </div>
              
              {filteredPerawis.map((perawi) => (
                <div
                  key={perawi.slug}
                  className={cn(
                    "verse-card cursor-pointer transition-all duration-200",
                    "hover:shadow-medium hover:-translate-y-0.5",
                    "active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-secondary-foreground">
                        <Users className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {perawi.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{perawi.total.toLocaleString()} hadits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : searchTerm ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Tidak ditemukan perawi dengan kata kunci "{searchTerm}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};