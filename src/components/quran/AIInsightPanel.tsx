import { useState, useEffect, useCallback } from "react";
import { VerseInsight } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GeminiApiKeyDialog } from "@/components/dialogs/GeminiApiKeyDialog";
import { generateVerseInsight } from "@/services/geminiApi";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Book,
  Calendar,
  Link,
  Sparkles,
  Key,
  Lightbulb,
} from "lucide-react";

interface AIInsightPanelProps {
  surahNumber: number;
  verseNumber: number;
  verseText: string;
  verseTranslation: string;
  onClose: () => void;
  className?: string;
}

export const AIInsightPanel = ({
  surahNumber,
  verseNumber,
  verseText,
  verseTranslation,
  onClose,
  className,
}: AIInsightPanelProps) => {
  const [insights, setInsights] = useState<VerseInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const { toast } = useToast();

  const fetchInsights = useCallback(async () => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedInsights = await generateVerseInsight(
        surahNumber,
        verseNumber,
        verseText,
        verseTranslation,
        { apiKey }
      );

      setInsights(generatedInsights);

      toast({
        title: "Wawasan berhasil dimuat",
        description: "Analisis AI untuk ayat telah tersedia",
      });
    } catch (err) {
      console.error("Failed to fetch insights:", err);

      if (err.message?.includes("API_KEY_INVALID")) {
        setError(
          "API key tidak valid. Silakan periksa dan perbarui API key Anda."
        );
        localStorage.removeItem("gemini_api_key");
        setApiKey(null);
      } else if (err.message?.includes("QUOTA_EXCEEDED")) {
        setError(
          "Kuota API Gemini telah habis. Silakan coba lagi nanti atau periksa billing Anda."
        );
      } else {
        setError("Gagal memuat wawasan ayat. Silakan coba lagi.");
      }

      toast({
        title: "Gagal memuat wawasan",
        description: err.message || "Terjadi kesalahan saat memuat analisis AI",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiKey, surahNumber, verseNumber, verseText, verseTranslation, toast]);

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleFetchInsights = () => {
    setHasSearched(true);
    fetchInsights();
  };

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeyDialog(false);
    toast({
      title: "API key berhasil disimpan",
      description: "Anda sekarang dapat memulai analisis AI.",
    });
  };

  const handleChangeApiKey = () => {
    setShowApiKeyDialog(true);
  };

  const renderInitialState = () => (
    <div className="text-center py-6 space-y-3">
      <div className="w-16 h-16 mx-auto bg-primary-light rounded-full flex items-center justify-center mb-3">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h4 className="font-medium text-foreground">Dapatkan Wawasan Ayat</h4>
      <p className="text-muted-foreground text-sm max-w-xs mx-auto">
        Gunakan kekuatan AI untuk mendapatkan pemahaman mendalam tentang ayat
        ini, termasuk asbabun nuzul, tafsir ringkas, dan hikmah praktis.
      </p>
      <Button onClick={handleFetchInsights} className="mt-3">
        <Sparkles className="w-4 h-4 mr-2" />
        Mulai Analisis AI
      </Button>
    </div>
  );

  return (
    <>
      <div className={cn("ai-panel space-y-4", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Wawasan Ayat AI</h3>
            <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full">
              Gemini 1.5 Flash
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {apiKey && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeApiKey}
                className="text-muted-foreground hover:text-primary"
                title="Ganti API Key"
              >
                <Key className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-primary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!apiKey ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary-light rounded-full flex items-center justify-center mb-3">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-medium text-foreground">API Key Diperlukan</h4>
            <p className="text-muted-foreground text-sm">
              Untuk mengakses wawasan ayat dengan AI, Anda memerlukan API key
              Google Gemini.
            </p>
            <Button onClick={() => setShowApiKeyDialog(true)} className="mt-3">
              <Key className="w-4 h-4 mr-2" />
              Masukkan API Key
            </Button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2 text-muted-foreground">
              Menganalisis ayat...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-destructive text-sm">{error}</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleFetchInsights}>
                Coba Lagi
              </Button>
              <Button variant="outline" size="sm" onClick={handleChangeApiKey}>
                <Key className="w-4 h-4 mr-1" />
                Ganti API Key
              </Button>
            </div>
          </div>
        ) : insights ? (
          <div className="space-y-4">
            {/* Asbabun Nuzul */}
            {insights.asbabun_nuzul && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <h4 className="font-medium text-foreground">Asbabun Nuzul</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insights.asbabun_nuzul}
                </p>
              </div>
            )}

            {/* Tafsir Summary */}
            {insights.tafsir_summary && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-foreground">
                    Tafsir Ringkas
                  </h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insights.tafsir_summary}
                </p>
              </div>
            )}

            {/* Practical Wisdom */}
            {insights.practical_wisdom && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-secondary" />
                  <h4 className="font-medium text-foreground">
                    Hikmah Praktis
                  </h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insights.practical_wisdom}
                </p>
              </div>
            )}

            {/* Key Themes */}
            {insights.key_themes && insights.key_themes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Tema Utama</h4>
                <div className="flex flex-wrap gap-2">
                  {insights.key_themes.map((theme, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Hadits */}
            {insights.related_hadits && insights.related_hadits.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Hadits Terkait</h4>
                {insights.related_hadits.map((hadits, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 rounded-lg p-3 text-sm space-y-2"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {hadits.text}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-primary font-medium">
                        {hadits.hadits_number}
                      </span>
                      {hadits.relevance && (
                        <span className="text-muted-foreground italic">
                          {hadits.relevance}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Related Verses */}
            {insights.related_verses && insights.related_verses.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4 text-secondary" />
                  <h4 className="font-medium text-foreground">Ayat Terkait</h4>
                </div>
                {insights.related_verses.map((relatedVerse, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 rounded-lg p-3 text-sm space-y-1"
                  >
                    {relatedVerse.text && (
                      <p className="text-muted-foreground leading-relaxed">
                        {relatedVerse.text}
                      </p>
                    )}
                    <div className="flex flex-col space-y-1 text-xs">
                      <span className="text-primary font-medium">
                        QS. {relatedVerse.surah_number}:
                        {relatedVerse.ayah_number}
                      </span>
                      <span className="text-muted-foreground italic">
                        {relatedVerse.connection}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Historical Context */}
            {insights.historical_context && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Konteks Sejarah</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {insights.historical_context}
                </p>
              </div>
            )}
          </div>
        ) : hasSearched ? null : (
          renderInitialState()
        )}
      </div>

      {/* API Key Dialog */}
      <GeminiApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySet={handleApiKeySet}
      />
    </>
  );
};
