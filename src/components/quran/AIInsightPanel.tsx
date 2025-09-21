import { useState, useEffect } from "react";
import { VerseInsight } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, Book, Calendar, Link, Sparkles } from "lucide-react";

interface AIInsightPanelProps {
  surahNumber: number;
  verseNumber: number;
  onClose: () => void;
  className?: string;
}

export const AIInsightPanel = ({ 
  surahNumber, 
  verseNumber, 
  onClose, 
  className 
}: AIInsightPanelProps) => {
  const [insights, setInsights] = useState<VerseInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, [surahNumber, verseNumber]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, mock AI response since we don't have the backend yet
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Mock insights data
      const mockInsights: VerseInsight = {
        asbabun_nuzul: "Ayat ini diturunkan ketika Nabi Muhammad SAW sedang mengajarkan umat Islam tentang pentingnya kesabaran dalam menghadapi cobaan.",
        tafsir_summary: "Ayat ini menjelaskan tentang pentingnya berserah diri kepada Allah dan menjaga keimanan dalam segala kondisi.",
        historical_context: "Ayat ini diturunkan pada periode Makkiyah/Madaniyah dengan konteks sejarah yang spesifik.",
        related_hadits: [
          {
            hadits_number: "HR. Bukhari 123",
            text: "Dari Abu Hurairah ra, Nabi SAW bersabda: 'Sesungguhnya Allah bersama orang-orang yang sabar.'",
            source: "Bukhari"
          }
        ],
        related_verses: [
          {
            surah_number: 2,
            ayah_number: 155,
            text: "Dan sungguh akan Kami berikan cobaan kepadamu...",
            connection: "Ayat ini juga membahas tema kesabaran dalam menghadapi ujian"
          }
        ]
      };
      
      setInsights(mockInsights);
    } catch (err) {
      setError("Gagal memuat wawasan ayat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("ai-panel space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Wawasan Ayat AI</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-primary"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <span className="ml-2 text-muted-foreground">Memuat wawasan...</span>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-destructive mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchInsights}>
            Coba Lagi
          </Button>
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
                <h4 className="font-medium text-foreground">Tafsir Ringkas</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {insights.tafsir_summary}
              </p>
            </div>
          )}

          {/* Related Hadits */}
          {insights.related_hadits && insights.related_hadits.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Hadits Terkait</h4>
              {insights.related_hadits.map((hadits, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground leading-relaxed mb-1">
                    {hadits.text}
                  </p>
                  <p className="text-primary font-medium">
                    {hadits.hadits_number}
                  </p>
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
                <div key={index} className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground leading-relaxed mb-1">
                    {relatedVerse.text}
                  </p>
                  <p className="text-primary font-medium text-xs">
                    QS. {relatedVerse.surah_number}:{relatedVerse.ayah_number} - {relatedVerse.connection}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};