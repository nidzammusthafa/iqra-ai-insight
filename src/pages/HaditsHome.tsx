import { useQuery, useMutation } from "@tanstack/react-query";
import { getHaditsInfo } from "@/services/haditsApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BookOpen, Users, Search, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Combobox } from "@/components/ui/combobox";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HadithSearchResult } from "@/types/hadits";
import { searchHadithByTopic } from "@/services/geminiApi";

export const HaditsHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aiSearchTerm, setAiSearchTerm] = useState("");

  const {
    data: perawisResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hadits-perawi"],
    queryFn: getHaditsInfo,
  });

  const aiSearchMutation = useMutation<HadithSearchResult[], Error, string>({
    mutationFn: (topic: string) => {
      const apiKey = localStorage.getItem("gemini_api_key");
      if (!apiKey) {
        throw new Error(
          "API Key Gemini tidak ditemukan. Silakan atur di halaman Pengaturan."
        );
      }
      return searchHadithByTopic(topic, { apiKey });
    },
    onSuccess: () => {
      toast({
        title: "Pencarian AI berhasil",
        description: "Menampilkan hadits yang relevan.",
      });
    },
    onError: (error) => {
      toast({
        title: "Pencarian AI Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAiSearch = () => {
    if (aiSearchTerm.trim()) {
      aiSearchMutation.mutate(aiSearchTerm.trim());
    }
  };

  const perawis = perawisResponse?.data || [];

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Gagal memuat daftar perawi.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <BookOpen className="w-8 h-8 text-primary mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Koleksi Hadits</h1>
        <p className="text-muted-foreground">
          Pilih perawi untuk melihat daftar hadits atau cari berdasarkan topik.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Cari hadits tentang niat, puasa..."
            value={aiSearchTerm}
            onChange={(e) => setAiSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
            className="bg-muted/50 border-muted-foreground/20 focus:border-primary"
          />
          <Button
            onClick={handleAiSearch}
            disabled={aiSearchMutation.isPending}
          >
            {aiSearchMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {aiSearchMutation.isPending && (
        <div className="text-center py-8">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-2">
            AI sedang mencari hadits...
          </p>
        </div>
      )}

      {aiSearchMutation.isSuccess && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" /> Hasil Pencarian AI
          </h2>
          {aiSearchMutation.data.length > 0 ? (
            aiSearchMutation.data.map((h, i) => (
              <Link
                to={`/hadits/${h.rawi}/${h.hadits_number}`}
                key={`${h.rawi}-${h.hadits_number}-${i}`}
                className="block verse-card p-4 text-sm no-underline"
              >
                <p className="font-semibold text-primary capitalize">
                  HR. {h.rawi} No. {h.hadits_number}
                </p>
                <p className="text-muted-foreground mt-1 line-clamp-2">
                  {h.text}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Tidak ada hadits yang ditemukan.
            </p>
          )}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau pilih perawi
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {perawis.map((perawi) => (
            <Link
              to={`/hadits/${perawi.slug}`}
              key={perawi.slug}
              className="block verse-card transition-all duration-200 hover:shadow-medium hover:-translate-y-0.5 active:scale-[0.98] no-underline p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-secondary-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {perawi.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {perawi.total.toLocaleString()} hadits
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
