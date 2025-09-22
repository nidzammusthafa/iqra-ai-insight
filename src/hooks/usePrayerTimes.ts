import { useState, useEffect } from 'react';
import { PrayerResponse, PrayerTime } from '@/types/prayer';

const PRAYER_NAMES = {
  Fajr: { name: 'Subuh', arabic: 'الفجر' },
  Dhuhr: { name: 'Dzuhur', arabic: 'الظهر' },
  Asr: { name: 'Ashar', arabic: 'العصر' },
  Maghrib: { name: 'Maghrib', arabic: 'المغرب' },
  Isha: { name: 'Isya', arabic: 'العشاء' },
};

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get city name from coordinates
  const getCityName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
      );
      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Lokasi Tidak Diketahui';
      setCityName(city);
    } catch (error) {
      console.error('Error getting city name:', error);
      setCityName('');
    }
  };

  // Get coordinates from timezone
  const getCoordinatesFromTimezone = (timezone: string) => {
    const timezoneCoords: { [key: string]: { lat: number; lng: number; city: string } } = {
      'Asia/Jakarta': { lat: -6.2088, lng: 106.8456, city: 'Jakarta' },
      'Asia/Makassar': { lat: -5.1477, lng: 119.4327, city: 'Makassar' },
      'Asia/Jayapura': { lat: -2.5489, lng: 140.7162, city: 'Jayapura' },
      'Asia/Pontianak': { lat: -0.0263, lng: 109.3425, city: 'Pontianak' },
      'Asia/Kuala_Lumpur': { lat: 3.1390, lng: 101.6869, city: 'Kuala Lumpur' },
      'Asia/Singapore': { lat: 1.3521, lng: 103.8198, city: 'Singapore' },
      'Asia/Brunei': { lat: 4.5353, lng: 114.7277, city: 'Bandar Seri Begawan' },
    };
    return timezoneCoords[timezone] || timezoneCoords['Asia/Jakarta'];
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(coords);
          getCityName(coords.lat, coords.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Jakarta if location denied
          const defaultCoords = { lat: -6.2088, lng: 106.8456 };
          setLocation(defaultCoords);
          setCityName('Jakarta');
        }
      );
    } else {
      // Default to Jakarta
      const defaultCoords = { lat: -6.2088, lng: 106.8456 };
      setLocation(defaultCoords);
      setCityName('Jakarta');
    }
  }, []);

  // Handle timezone selection
  useEffect(() => {
    if (selectedTimezone) {
      const coords = getCoordinatesFromTimezone(selectedTimezone);
      setLocation({ lat: coords.lat, lng: coords.lng });
      setCityName(coords.city);
    }
  }, [selectedTimezone]);

  // Fetch prayer times when location is available
  useEffect(() => {
    if (!location) return;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
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
          const prayerTime = new Date();
          const [hours, minutes] = timeStr.split(':');
          prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          return {
            name: value.name,
            time: timeStr,
            arabicName: value.arabic,
            isPast: currentTime > prayerTime,
            isNext: false,
            isCurrent: false,
          };
        });

        // Determine next prayer
        const currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        let nextPrayerIndex = -1;
        
        for (let i = 0; i < times.length; i++) {
          const [hours, minutes] = times[i].time.split(':');
          const prayerTimeMinutes = parseInt(hours) * 60 + parseInt(minutes);
          
          if (prayerTimeMinutes > currentTimeMinutes) {
            nextPrayerIndex = i;
            break;
          }
        }

        // If no prayer found for today, next prayer is Fajr tomorrow
        if (nextPrayerIndex === -1) {
          nextPrayerIndex = 0;
        }

        times[nextPrayerIndex].isNext = true;

        setPrayerTimes(times);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [location, currentTime.getDate()]);

  // Update prayer status based on current time
  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const updatedTimes = prayerTimes.map((prayer, index) => {
      const prayerTime = new Date();
      const [hours, minutes] = prayer.time.split(':');
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      const prayerTimeMinutes = parseInt(hours) * 60 + parseInt(minutes);
      
      // Check if this is the current prayer (within 30 minutes window)
      const isInWindow = currentTimeMinutes >= prayerTimeMinutes && 
                        currentTimeMinutes < prayerTimeMinutes + 30;
      
      return {
        ...prayer,
        isPast: currentTimeMinutes > prayerTimeMinutes + 30,
        isCurrent: isInWindow,
      };
    });

    setPrayerTimes(updatedTimes);
  }, [currentTime]);

  const nextPrayer = prayerTimes.find(p => p.isNext);
  const currentPrayer = prayerTimes.find(p => p.isCurrent);

  return {
    prayerTimes,
    nextPrayer,
    currentPrayer,
    currentTime,
    loading,
    error,
    location,
    cityName,
    setSelectedTimezone,
  };
};