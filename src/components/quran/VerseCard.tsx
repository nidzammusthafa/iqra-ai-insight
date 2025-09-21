import { useState } from "react";
import { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lightbulb, Share, Volume2, Bookmark, BookmarkCheck } from "lucide-react";
import { AIInsightPanel } from "./AIInsightPanel";
import { BookmarkDialog } from "../dialogs/BookmarkDialog";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import { useToast } from "@/hooks/use-toast";

interface VerseCardProps {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  className?: string;
}

export const VerseCard = ({ verse, surahNumber, surahName, className }: VerseCardProps) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  
  const { preferences, updatePreferences } = useReadingPreferences();
  const { 
    isBookmarked, 
    getBookmark, 
    addBookmark, 
    removeBookmark, 
    updateBookmark 
  } = useBookmarks();
  const { toast } = useToast();
  
  const isCurrentlyBookmarked = isBookmarked(surahNumber, verse.number);
  const existingBookmark = getBookmark(surahNumber, verse.number);

  const handleShare = () => {
    const text = `${verse.text}\n\n${verse.translation_id}\n\nQS. ${surahName} (${surahNumber}):${verse.number}`;
    
    if (navigator.share) {
      navigator.share({
        title: `QS. ${surahName} ${surahNumber}:${verse.number}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Ayat disalin",
        description: "Ayat telah disalin ke clipboard"
      });
    }
  };

  const handleAudio = () => {
    // Placeholder for audio functionality
    console.log(`Play audio for verse ${surahNumber}:${verse.number}`);
    toast({
      title: "Audio belum tersedia",
      description: "Fitur audio sedang dalam pengembangan"
    });
  };

  const handleBookmarkToggle = () => {
    if (isCurrentlyBookmarked) {
      if (existingBookmark) {
        removeBookmark(existingBookmark.id);
        toast({
          title: "Bookmark dihapus",
          description: `QS. ${surahName} ${surahNumber}:${verse.number}`
        });
      }
    } else {
      setShowBookmarkDialog(true);
    }
  };

  const handleBookmarkSave = (bookmarkData: any) => {
    if (existingBookmark) {
      updateBookmark(existingBookmark.id, bookmarkData);
      toast({
        title: "Bookmark diperbarui",
        description: `QS. ${surahName} ${surahNumber}:${verse.number}`
      });
    } else {
      addBookmark(bookmarkData);
      toast({
        title: "Bookmark ditambahkan",
        description: `QS. ${surahName} ${surahNumber}:${verse.number}`
      });
    }
  };

  const getArabicFontClass = () => {
    switch (preferences.arabicFontSize) {
      case 'small': return 'arabic-small';
      case 'large': return 'arabic-large';
      case 'xl': return 'text-3xl leading-relaxed';
      default: return '';
    }
  };

  const getTranslationFontClass = () => {
    switch (preferences.translationFontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getLineSpacingClass = () => {
    switch (preferences.lineSpacing) {
      case 'compact': return 'leading-tight';
      case 'relaxed': return 'leading-loose';
      default: return 'leading-normal';
    }
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
            onClick={() => updatePreferences({ showTranslation: !preferences.showTranslation })}
            className="text-muted-foreground hover:text-primary"
          >
            {preferences.showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            onClick={handleBookmarkToggle}
            className={cn(
              "text-muted-foreground hover:text-primary",
              isCurrentlyBookmarked && "text-secondary"
            )}
          >
            {isCurrentlyBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
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
      <div className={cn(
        "arabic-text text-foreground",
        getArabicFontClass(),
        getLineSpacingClass()
      )}>
        {verse.text}
      </div>

      {/* Translation */}
      {preferences.showTranslation && verse.translation_id && (
        <div className={cn(
          "text-muted-foreground border-l-2 border-primary-light pl-4",
          getTranslationFontClass(),
          getLineSpacingClass()
        )}>
          {verse.translation_id}
        </div>
      )}

      {/* AI Insights Panel */}
      {showAIInsights && (
        <AIInsightPanel 
          surahNumber={surahNumber} 
          verseNumber={verse.number}
          verseText={verse.text}
          verseTranslation={verse.translation_id || ""}
          onClose={() => setShowAIInsights(false)}
        />
      )}

      {/* Bookmark Dialog */}
      <BookmarkDialog
        open={showBookmarkDialog}
        onOpenChange={setShowBookmarkDialog}
        surahNumber={surahNumber}
        verseNumber={verse.number}
        surahName={surahName}
        verseText={verse.text}
        verseTranslation={verse.translation_id || ""}
        existingBookmark={existingBookmark}
        onSave={handleBookmarkSave}
      />
    </div>
  );
};