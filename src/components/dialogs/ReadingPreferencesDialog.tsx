import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReadingPreferences, TranslationId } from "@/types/quran";
import { Settings, Type, Languages, Palette, RotateCcw } from "lucide-react";

interface ReadingPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: ReadingPreferences;
  onPreferencesChange: (preferences: Partial<ReadingPreferences>) => void;
  onReset: () => void;
}

export const ReadingPreferencesDialog = ({
  open,
  onOpenChange,
  preferences,
  onPreferencesChange,
  onReset,
}: ReadingPreferencesDialogProps) => {
  const [tempPreferences, setTempPreferences] = useState(preferences);

  const handleSave = () => {
    onPreferencesChange(tempPreferences);
    onOpenChange(false);
  };

  const handleReset = () => {
    onReset();
    onOpenChange(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTemp = (key: keyof ReadingPreferences, value: any) => {
    setTempPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const fontSizeLabels = {
    small: "Kecil",
    medium: "Sedang",
    large: "Besar",
    xl: "Sangat Besar",
  };

  const lineSpacingLabels = {
    compact: "Padat",
    normal: "Normal",
    relaxed: "Longgar",
  };

  const translationLabels = {
    [TranslationId.ID]: "Indonesia",
    [TranslationId.EN]: "English",
    [TranslationId.AR]: "العربية",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Pengaturan Baca</span>
          </DialogTitle>
          <DialogDescription>
            Sesuaikan tampilan untuk kenyamanan membaca Anda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Arabic Font Size */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-primary" />
              <Label>Ukuran Font Arab</Label>
            </div>
            <Select
              value={tempPreferences.arabicFontSize}
              onValueChange={(value) => updateTemp("arabicFontSize", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{fontSizeLabels.small}</SelectItem>
                <SelectItem value="medium">{fontSizeLabels.medium}</SelectItem>
                <SelectItem value="large">{fontSizeLabels.large}</SelectItem>
                <SelectItem value="xl">{fontSizeLabels.xl}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Translation Font Size */}
          <div className="space-y-2">
            <Label>Ukuran Font Terjemahan</Label>
            <Select
              value={tempPreferences.translationFontSize}
              onValueChange={(value) =>
                updateTemp("translationFontSize", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{fontSizeLabels.small}</SelectItem>
                <SelectItem value="medium">{fontSizeLabels.medium}</SelectItem>
                <SelectItem value="large">{fontSizeLabels.large}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Line Spacing */}
          <div className="space-y-2">
            <Label>Spasi Baris</Label>
            <Select
              value={tempPreferences.lineSpacing}
              onValueChange={(value) => updateTemp("lineSpacing", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">
                  {lineSpacingLabels.compact}
                </SelectItem>
                <SelectItem value="normal">
                  {lineSpacingLabels.normal}
                </SelectItem>
                <SelectItem value="relaxed">
                  {lineSpacingLabels.relaxed}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default Translation */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-primary" />
              <Label>Bahasa Terjemahan Default</Label>
            </div>
            <Select
              value={tempPreferences.defaultTranslation}
              onValueChange={(value) =>
                updateTemp("defaultTranslation", value as TranslationId)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TranslationId.ID}>
                  {translationLabels[TranslationId.ID]}
                </SelectItem>
                <SelectItem value={TranslationId.EN}>
                  {translationLabels[TranslationId.EN]}
                </SelectItem>
                <SelectItem value={TranslationId.AR}>
                  {translationLabels[TranslationId.AR]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Translation Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tampilkan Terjemahan</Label>
              <p className="text-sm text-muted-foreground">
                Otomatis menampilkan terjemahan saat membuka ayat
              </p>
            </div>
            <Switch
              checked={tempPreferences.showTranslation}
              onCheckedChange={(checked) =>
                updateTemp("showTranslation", checked)
              }
            />
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 space-y-3">
            <Label className="text-sm font-medium">Preview:</Label>
            <div
              className={`arabic-text ${
                tempPreferences.arabicFontSize === "small"
                  ? "arabic-small"
                  : tempPreferences.arabicFontSize === "large"
                  ? "arabic-large"
                  : tempPreferences.arabicFontSize === "xl"
                  ? "text-3xl"
                  : ""
              } ${
                tempPreferences.lineSpacing === "compact"
                  ? "leading-tight"
                  : tempPreferences.lineSpacing === "relaxed"
                  ? "leading-loose"
                  : "leading-normal"
              }`}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
            {tempPreferences.showTranslation && (
              <div
                className={`text-muted-foreground ${
                  tempPreferences.translationFontSize === "small"
                    ? "text-sm"
                    : tempPreferences.translationFontSize === "large"
                    ? "text-lg"
                    : "text-base"
                } ${
                  tempPreferences.lineSpacing === "compact"
                    ? "leading-tight"
                    : tempPreferences.lineSpacing === "relaxed"
                    ? "leading-loose"
                    : "leading-normal"
                }`}
              >
                Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-destructive hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleSave}>Simpan</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
