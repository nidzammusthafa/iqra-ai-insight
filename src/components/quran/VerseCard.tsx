import { useState } from "react";
import { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lightbulb, Share, Volume2 } from "lucide-react";
import { AIInsightPanel } from "./AIInsightPanel";

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  className?: string;
}

export const VerseCard = ({ verse, surahNumber, className }: VerseCardProps) => {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(false);

  const handleShare = () => {
    const text = `${verse.text}\n\n${verse.translation_id}\n\nQS. ${surahNumber}:${verse.number}`;
    
    if (navigator.share) {
      navigator.share({
        title: `QS. ${surahNumber}:${verse.number}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      // Could add toast notification here
    }
  };

  const handleAudio = () => {
    // Placeholder for audio functionality
    console.log(`Play audio for verse ${surahNumber}:${verse.number}`);
  };

  return (
    <div className={cn("verse-card space-y-4", className)}>
      {/* Verse number badge */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
          <span className="text-primary font-bold text-sm">{verse.number}</span>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-muted-foreground hover:text-primary"
          >
            {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAudio}
            className="text-muted-foreground hover:text-primary"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={cn(
              "text-muted-foreground hover:text-primary",
              showAIInsights && "text-primary bg-primary-light"
            )}
          >
            <Lightbulb className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-muted-foreground hover:text-primary"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="arabic-text text-foreground leading-loose">
        {verse.text}
      </div>

      {/* Translation */}
      {showTranslation && verse.translation_id && (
        <div className="text-muted-foreground leading-relaxed border-l-2 border-primary-light pl-4">
          {verse.translation_id}
        </div>
      )}

      {/* AI Insights Panel */}
      {showAIInsights && (
        <AIInsightPanel 
          surahNumber={surahNumber} 
          verseNumber={verse.number}
          onClose={() => setShowAIInsights(false)}
        />
      )}
    </div>
  );
};