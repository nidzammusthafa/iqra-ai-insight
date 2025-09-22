export interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
  Sunset: string;
}

export interface PrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: {
        en: string;
        ar: string;
      };
      year: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface PrayerResponse {
  code: number;
  status: string;
  data: PrayerData;
}

export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  isPast: boolean;
  isNext: boolean;
  isCurrent: boolean;
}
