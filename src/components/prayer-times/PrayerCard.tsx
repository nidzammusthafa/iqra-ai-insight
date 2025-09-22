import { PrayerTime } from '@/types/prayer';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PrayerCardProps {
  prayer: PrayerTime;
}

export const PrayerCard = ({ prayer }: PrayerCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 animate-fade-in",
        prayer.isNext && "bg-gradient-gold shadow-gold animate-pulse-gold ring-2 ring-prayer-next/20",
        prayer.isCurrent && "bg-gradient-islamic shadow-islamic text-primary-foreground",
        prayer.isPast && "opacity-60 bg-muted"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className={cn(
            "font-semibold text-lg",
            prayer.isNext && "text-foreground",
            prayer.isCurrent && "text-primary-foreground"
          )}>
            {prayer.name}
          </h3>
          <p className={cn(
            "text-sm opacity-80",
            prayer.isNext && "text-foreground/80",
            prayer.isCurrent && "text-primary-foreground/80"
          )}>
            {prayer.arabicName}
          </p>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-2xl font-bold tracking-wider",
            prayer.isNext && "text-foreground",
            prayer.isCurrent && "text-primary-foreground"
          )}>
            {prayer.time}
          </p>
          {prayer.isNext && (
            <p className="text-xs text-foreground/70 mt-1 font-medium">
              Waktu Sholat Selanjutnya
            </p>
          )}
          {prayer.isCurrent && (
            <p className="text-xs text-primary-foreground/80 mt-1 font-medium">
              Waktu Sholat Sekarang
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};