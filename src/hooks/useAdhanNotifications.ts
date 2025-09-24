
import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/store';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';

export function useAdhanNotifications() {
  const { preferences } = useAppStore();
  const today = useMemo(() => new Date(), []);
  const { prayerTimes } = usePrayerTimes(today); // Notifications only for today

  useEffect(() => {
    const checkPrayerTimes = () => {
      if (!preferences.prayerNotifications.isEnabled || !prayerTimes) return;

      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const todayStr = now.toISOString().split('T')[0];

      for (const [prayerName, prayerTime] of Object.entries(prayerTimes.data.timings)) {
        if (currentTime === prayerTime) {
          const notificationKey = `notif-${todayStr}-${prayerName}`;
          if (localStorage.getItem(notificationKey)) continue; // Already notified today

          const prayerPrefs = preferences.prayerNotifications;
          const prayerKey = prayerName.toLowerCase() as keyof typeof prayerPrefs;

          if (prayerPrefs[prayerKey]) {
            // Special check for Dhuhr on Friday
            if (prayerKey === 'dhuhr' && now.getDay() === 5 && prayerPrefs.disableDhuhrOnFridays) {
                continue;
            }

            // Determine which adhan to play
            let adhanFile = 'Adzan Mekkah Versi 1 Full.mp3';
            if (prayerKey === 'fajr') {
                adhanFile = prayerPrefs.fajrAdhan === 'madinah' ? 'Adzan Subuh Madinah.mp3' : 'Adzan Subuh Merdu.mp3';
            }

            // Play audio
            const audio = new Audio(`/audio/${adhanFile}`);
            audio.play();

            // Show notification
            new Notification('Waktu Sholat Telah Tiba', {
              body: `Saatnya menunaikan sholat ${prayerName}`,
              icon: '/pwa-192x192.png',
            });

            localStorage.setItem(notificationKey, 'true');
          }
        }
      }
    };

    const interval = setInterval(checkPrayerTimes, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [preferences, prayerTimes]);

  // Request permission on component mount if not already granted
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}
