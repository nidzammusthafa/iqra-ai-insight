import { useState, useEffect } from 'react';
import { PrayerResponse, PrayerTime } from '@/types/prayer';

const PRAYER_NAMES = {
  Fajr: { name: 'Subuh', arabic: 'الفجر' },
  Dhuhr: { name: 'Dzuhur', arabic: 'الظهر' },
  Asr: { name: 'Ashar', arabic: 'العصر' },
  Maghrib: { name: 'Maghrib', arabic: 'المغرب' },
  Isha: { name: 'Isya', arabic: 'العشاء' },
};

export const usePrayerTimesByDate = (selectedDate: Date, location: { lat: number; lng: number } | null) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location || !selectedDate) return;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dateStr = `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`;
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.lat}&longitude=${location.lng}&method=2`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }

        const data: PrayerResponse = await response.json();
        
        // Process prayer times
        const times: PrayerTime[] = Object.entries(PRAYER_NAMES).map(([key, value]) => {
          const timeStr = data.data.timings[key as keyof typeof PRAYER_NAMES];
          
          return {
            name: value.name,
            time: timeStr,
            arabicName: value.arabic,
            isPast: false,
            isNext: false,
            isCurrent: false,
          };
        });

        setPrayerTimes(times);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [selectedDate, location]);

  return {
    prayerTimes,
    loading,
    error,
  };
};