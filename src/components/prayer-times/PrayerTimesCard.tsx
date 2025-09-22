
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function PrayerTimesCard() {
  // TODO: Replace with user's actual location
  const { prayerTimes, isLoading, error } = usePrayerTimes("Jakarta", "Indonesia");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prayer Times</CardTitle>
        {prayerTimes && (
          <p className="text-sm text-muted-foreground">
            {prayerTimes.data.date.hijri.date}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {prayerTimes && (
          <ul>
            <li>Fajr: {prayerTimes.data.timings.Fajr}</li>
            <li>Dhuhr: {prayerTimes.data.timings.Dhuhr}</li>
            <li>Asr: {prayerTimes.data.timings.Asr}</li>
            <li>Maghrib: {prayerTimes.data.timings.Maghrib}</li>
            <li>Isha: {prayerTimes.data.timings.Isha}</li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
