import { useState } from 'react';
import { HijriCalendar } from './HijriCalendar';
import { PrayerCard } from './PrayerCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorCard } from './ErrorCard';
import { Card } from '@/components/ui/card';
import { usePrayerTimesByDate } from '@/hooks/usePrayerTimesByDate';
import { Clock } from 'lucide-react';

interface CalendarPrayerTimesProps {
  location: { lat: number; lng: number } | null;
}

export const CalendarPrayerTimes = ({ location }: CalendarPrayerTimesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { prayerTimes, loading, error } = usePrayerTimesByDate(selectedDate, location);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      <HijriCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      <Card className="p-4 bg-card shadow-soft">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Jadwal Sholat {isToday ? 'Hari Ini' : selectedDate.toLocaleDateString('id-ID')}
          </h3>
        </div>
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorCard error={error} />}
        
        {prayerTimes.length > 0 && (
          <div className="space-y-3">
            {prayerTimes.map((prayer) => (
              <PrayerCard 
                key={prayer.name} 
                prayer={{
                  ...prayer,
                  isPast: false,
                  isNext: false,
                  isCurrent: false
                }} 
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};