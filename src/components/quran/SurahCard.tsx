import { SuratResponse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SurahCardProps {
  surah: SuratResponse;
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
            {surah.number_of_surah}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground">
                {surah.name}
              </h3>
              <span className="arabic-small text-primary font-bold">
                {surah.name_translations.ar}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{surah.name_translations.id}</span>
              <span>•</span>
              <span>{surah.number_of_ayah} ayat</span>
              {surah.place && (
                <>
                  <span>•</span>
                  <span>{surah.place}</span>
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