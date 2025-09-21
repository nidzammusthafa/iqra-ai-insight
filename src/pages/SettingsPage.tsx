import { useState, useEffect } from "react";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Palette, 
  BookOpen, 
  Bookmark, 
  Clock,
  Trash2,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { preferences, updatePreferences, resetPreferences } = useReadingPreferences();
  const { bookmarks, folders, searchBookmarks } = useBookmarks();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [lastReadVerse, setLastReadVerse] = useState<{surah: number, verse: number} | null>(null);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto';
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Load last read verse
    const savedLastRead = localStorage.getItem('last_read_verse');
    if (savedLastRead) {
      try {
        setLastReadVerse(JSON.parse(savedLastRead));
      } catch (error) {
        console.error('Failed to parse last read verse:', error);
      }
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    
    toast({
      title: "Tema diperbarui",
      description: `Tema berhasil diubah ke ${newTheme === 'auto' ? 'otomatis' : newTheme === 'dark' ? 'gelap' : 'terang'}`,
    });
  };

  const clearLastReadVerse = () => {
    setLastReadVerse(null);
    localStorage.removeItem('last_read_verse');
    toast({
      title: "Riwayat dibersihkan",
      description: "Ayat terakhir dibaca telah dihapus",
    });
  };

  const goToLastRead = () => {
    if (lastReadVerse) {
      navigate(`/surah/${lastReadVerse.surah}#verse-${lastReadVerse.verse}`);
    }
  };

  const goToBookmark = (bookmark: any) => {
    navigate(`/surah/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
        </div>
        <p className="text-muted-foreground">
          Atur preferensi dan kelola data aplikasi
        </p>
      </div>

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
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('light')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Sun className="w-5 h-5" />
              <span className="text-xs">Terang</span>
            </Button>
            
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('dark')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Moon className="w-5 h-5" />
              <span className="text-xs">Gelap</span>
            </Button>
            
            <Button
              variant={theme === 'auto' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('auto')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Monitor className="w-5 h-5" />
              <span className="text-xs">Otomatis</span>
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
              {['small', 'medium', 'large'].map((size) => (
                <Button
                  key={size}
                  variant={preferences.arabicFontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updatePreferences({ arabicFontSize: size as any })}
                >
                  {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-medium">Ukuran Font Terjemahan</p>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <Button
                  key={size}
                  variant={preferences.translationFontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updatePreferences({ translationFontSize: size as any })}
                >
                  {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
                </Button>
              ))}
            </div>
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
          <CardDescription>
            Ayat yang telah Anda simpan
          </CardDescription>
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
  );
};