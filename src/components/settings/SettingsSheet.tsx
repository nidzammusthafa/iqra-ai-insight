/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  Palette,
  BookOpen,
  Bookmark,
  Clock,
  Trash2,
  Moon,
  Sun,
  Monitor,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Qari, QARIS } from "@/types/quran";

import { useAudioStore } from "@/store/audioSlice";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsSheet = ({ open, onOpenChange }: SettingsSheetProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    bookmarks,
    folders,
  } = useAppStore();

  const { 
    isContinuousPlayEnabled, 
    toggleContinuousPlay, 
    isShuffleEnabled, 
    toggleShuffle 
  } = useAudioStore();

  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [lastReadVerse, setLastReadVerse] = useState<{
    surah: number;
    verse: number;
  } | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "auto";
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedLastRead = localStorage.getItem("last_read_verse");
    if (savedLastRead) {
      try {
        setLastReadVerse(JSON.parse(savedLastRead));
      } catch (error) {
        console.error("Failed to parse last read verse:", error);
      }
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (newTheme === "auto") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    toast({
      title: "Tema diperbarui",
      description: `Tema berhasil diubah ke ${newTheme}`,
    });
  };

  const clearLastReadVerse = () => {
    setLastReadVerse(null);
    localStorage.removeItem("last_read_verse");
    toast({ title: "Riwayat dibersihkan" });
  };

  const goToLastRead = () => {
    if (lastReadVerse) {
      onOpenChange(false);
      navigate(`/surah/${lastReadVerse.surah}#verse-${lastReadVerse.verse}`);
    }
  };

  const goToBookmark = (bookmark: any) => {
    onOpenChange(false);
    navigate(`/surah/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-primary" />
            <span className="text-2xl">Pengaturan</span>
          </SheetTitle>
          <SheetDescription>
            Atur preferensi dan kelola data aplikasi Anda.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Tema Tampilan</span>
                </CardTitle>
                <CardDescription>
                  Pilih tema yang sesuai dengan preferensi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => handleThemeChange("light")}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Sun className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => handleThemeChange("dark")}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Moon className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={theme === "auto" ? "default" : "outline"}
                    onClick={() => handleThemeChange("auto")}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Monitor className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reading Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Preferensi Membaca</span>
                </CardTitle>
                <CardDescription>
                  Atur tampilan teks saat membaca Al-Qur'an
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tampilkan Tombol Aksi Ayat</p>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan tombol putar, bookmark, dll. di setiap ayat.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.showVerseActionButtons}
                    onCheckedChange={(checked) =>
                      updatePreferences({ showVerseActionButtons: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tampilkan Terjemahan</p>
                    <p className="text-sm text-muted-foreground">
                      Tunjukkan terjemahan ayat secara default
                    </p>
                  </div>
                  <Switch
                    checked={preferences.showTranslation}
                    onCheckedChange={(checked) =>
                      updatePreferences({ showTranslation: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="font-medium">Ukuran Font Arab</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <Button
                        key={size}
                        variant={
                          preferences.arabicFontSize === size
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updatePreferences({ arabicFontSize: size as any })
                        }
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium">Ukuran Font Terjemahan</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <Button
                        key={size}
                        variant={
                          preferences.translationFontSize === size
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updatePreferences({
                            translationFontSize: size as any,
                          })
                        }
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-medium">Pilihan Qori (Pembaca)</p>
                  <Select
                    value={preferences.selectedQari}
                    onValueChange={(value) =>
                      updatePreferences({ selectedQari: value as Qari })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Qori" />
                    </SelectTrigger>
                    <SelectContent>
                      {QARIS.map((qari) => (
                        <SelectItem key={qari} value={qari}>
                          {qari.charAt(0).toUpperCase() + qari.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={resetPreferences}
                  className="w-full"
                >
                  Reset ke Default
                </Button>
              </CardContent>
            </Card>

            {/* Audio Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5" />
                  <span>Preferensi Audio Lanjutan</span>
                </CardTitle>
                <CardDescription>
                  Atur perilaku pemutar audio global.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pemutaran Berkelanjutan</p>
                    <p className="text-sm text-muted-foreground">
                      Lanjut otomatis ke surah berikutnya.
                    </p>
                  </div>
                  <Switch
                    checked={isContinuousPlayEnabled}
                    onCheckedChange={toggleContinuousPlay}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode Acak (Shuffle)</p>
                    <p className="text-sm text-muted-foreground">
                      Pilih surah berikutnya secara acak.
                    </p>
                  </div>
                  <Switch
                    checked={isShuffleEnabled}
                    onCheckedChange={toggleShuffle}
                    disabled={!isContinuousPlayEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prayer Time Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlayCircle className="w-5 h-5" />
                  <span>Notifikasi Waktu Sholat</span>
                </CardTitle>
                <CardDescription>
                  Atur notifikasi adzan untuk pengingat waktu sholat.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Aktifkan Notifikasi Adzan</p>
                    <p className="text-sm text-muted-foreground">
                      Nyalakan untuk menerima notifikasi adzan.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.prayerNotifications.isEnabled}
                    onCheckedChange={(checked) =>
                      updatePreferences({
                        prayerNotifications: {
                          ...preferences.prayerNotifications,
                          isEnabled: checked,
                        },
                      })
                    }
                  />
                </div>
                {preferences.prayerNotifications.isEnabled && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <p className="font-medium">Waktu Sholat</p>
                      {["fajr", "dhuhr", "asr", "maghrib", "isha"].map(
                        (prayer) => (
                          <div
                            key={prayer}
                            className="flex items-center justify-between"
                          >
                            <p className="capitalize">{prayer}</p>
                            <Switch
                              checked={
                                !!preferences.prayerNotifications[
                                  prayer as keyof typeof preferences.prayerNotifications
                                ]
                              }
                              onCheckedChange={(checked) =>
                                updatePreferences({
                                  prayerNotifications: {
                                    ...preferences.prayerNotifications,
                                    [prayer]: checked,
                                  },
                                })
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        Nonaktifkan Adzan Dzuhur di Hari Jumat
                      </p>
                      <Switch
                        checked={
                          preferences.prayerNotifications.disableDhuhrOnFridays
                        }
                        onCheckedChange={(checked) =>
                          updatePreferences({
                            prayerNotifications: {
                              ...preferences.prayerNotifications,
                              disableDhuhrOnFridays: checked,
                            },
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <p className="font-medium">Pilihan Adzan Subuh</p>
                      <Select
                        value={preferences.prayerNotifications.fajrAdhan}
                        onValueChange={(value) =>
                          updatePreferences({
                            prayerNotifications: {
                              ...preferences.prayerNotifications,
                              fajrAdhan: value as "madinah" | "merdu",
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Adzan Subuh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="madinah">Madinah</SelectItem>
                          <SelectItem value="merdu">Merdu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Last Read Verse */}
            {lastReadVerse && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Ayat Terakhir Dibaca</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className="p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    onClick={goToLastRead}
                  >
                    <p className="font-medium">
                      QS. Al-Qur'an {lastReadVerse.surah}:{lastReadVerse.verse}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ketuk untuk lanjut membaca
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearLastReadVerse}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Riwayat
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Bookmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bookmark className="w-5 h-5" />
                    <span>Ayat Tersimpan</span>
                  </div>
                  <Badge variant="secondary">{bookmarks.length}</Badge>
                </CardTitle>
                <CardDescription>Ayat yang telah Anda simpan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookmarks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Belum ada ayat tersimpan
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bookmarks.slice(0, 5).map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => goToBookmark(bookmark)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className="text-xs">
                            QS. {bookmark.surahName} : {bookmark.verseNumber}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {bookmark.verseTranslation}
                        </p>
                      </div>
                    ))}
                    {bookmarks.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground">
                        Dan {bookmarks.length - 5} ayat lainnya
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Folders */}
            {folders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Folder Bookmark</span>
                    <Badge variant="secondary">{folders.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: folder.color }}
                        />
                        <span className="font-medium">{folder.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {folder.bookmarkIds.length} ayat
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};