
import type { PrayerTimesResponse } from "@/types/prayerTimes";

const PRAYER_TIMES_API_URL = "https://api.aladhan.com/v1/timingsByCity";

export async function getPrayerTimes(city: string, country: string): Promise<PrayerTimesResponse> {
  const response = await fetch(`${PRAYER_TIMES_API_URL}?city=${city}&country=${country}`);
  if (!response.ok) {
    throw new Error("Failed to fetch prayer times");
  }
  return response.json();
}
