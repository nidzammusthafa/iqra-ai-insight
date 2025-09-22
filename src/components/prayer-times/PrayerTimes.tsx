import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PrayerCard } from "./PrayerCard";
import { CurrentTimeCard } from "./CurrentTimeCard";
import { CalendarPrayerTimes } from "./CalendarPrayerTimes";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorCard } from "./ErrorCard";
import { MapPin, Compass, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const PrayerTimes = () => {
  const {
    prayerTimes,
    currentTime,
    loading,
    error,
    location,
    cityName,
    setSelectedTimezone,
  } = usePrayerTimes();
  const [showTimezoneSelect, setShowTimezoneSelect] = useState(false);

  const timezones = [
    { value: "Asia/Jakarta", label: "Jakarta (WIB)", offset: "+07:00" },
    { value: "Asia/Makassar", label: "Makassar (WITA)", offset: "+08:00" },
    { value: "Asia/Jayapura", label: "Jayapura (WIT)", offset: "+09:00" },
    { value: "Asia/Pontianak", label: "Pontianak (WIB)", offset: "+07:00" },
    {
      value: "Asia/Kuala_Lumpur",
      label: "Kuala Lumpur (MYT)",
      offset: "+08:00",
    },
    { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "+08:00" },
    { value: "Asia/Brunei", label: "Brunei (BNT)", offset: "+08:00" },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center space-x-2 text-foreground/80">
            <Compass className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Jadwal Sholat</h1>
          </div>
          {location && (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1 text-foreground/80 text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {cityName ||
                    `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setShowTimezoneSelect(!showTimezoneSelect)}
                  className="flex items-center space-x-1 text-xs text-foreground/80 hover:text-muted-foreground transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Pilih Zona Waktu</span>
                </button>
              </div>
              {showTimezoneSelect && (
                <div className="flex justify-center animate-fade-in">
                  <Select
                    onValueChange={(value) => {
                      setSelectedTimezone(value);
                      setShowTimezoneSelect(false);
                    }}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Pilih zona waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Time */}
        <CurrentTimeCard currentTime={currentTime} />

        {/* Error Display */}
        {error && <ErrorCard error={error} />}

        {/* Tabs for Today and Calendar */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-6">
            {/* Prayer Times */}
            {prayerTimes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-center text-foreground mb-4">
                  Waktu Sholat Hari Ini
                </h2>
                {prayerTimes.map((prayer) => (
                  <PrayerCard key={prayer.name} prayer={prayer} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarPrayerTimes location={location} />
          </TabsContent>
        </Tabs>

        {/* Islamic greeting */}
        <div className="text-center pt-6 pb-8">
          <p className="text-sm text-muted-foreground font-arabic">
            السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
        </div>
      </div>
    </div>
  );
};
