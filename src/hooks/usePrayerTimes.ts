
import { useState, useEffect } from "react";
import { getPrayerTimes } from "@/services/prayerTimesApi";
import type { PrayerTimesResponse } from "@/types/prayerTimes";

export function usePrayerTimes(city: string, country: string) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const data = await getPrayerTimes(city, country);
        setPrayerTimes(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrayerTimes();
  }, [city, country]);

  return { prayerTimes, isLoading, error };
}
