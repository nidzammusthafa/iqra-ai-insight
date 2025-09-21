import { SurahListItem } from "@/types/quran";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SurahCardProps {
  surah: SurahListItem;
  onClick: () => void;
  className?: string;
}

export const SurahCard = ({ surah, onClick, className }: SurahCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "verse-card cursor-pointer transition-all duration-200",
        "hover:shadow-medium hover:-translate-y-0.5",
        "active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Surah number in Islamic style */}
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {surah.number}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground">
                {surah.name}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{surah.translation}</span>
              <span>•</span>
              <span>{surah.numberOfAyahs} ayat</span>
              {surah.revelation && (
                <>
                  <span>•</span>
                  <span>{surah.revelation}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
};