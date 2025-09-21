import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Eye, EyeOff, ExternalLink, Info } from "lucide-react";
import { validateApiKey } from "@/services/geminiApi";

interface GeminiApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySet: (apiKey: string) => void;
}

export const GeminiApiKeyDialog = ({
  open,
  onOpenChange,
  onApiKeySet,
}: GeminiApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!apiKey.trim()) {
      setError("API key tidak boleh kosong");
      return;
    }

          if (!validateApiKey(apiKey.trim())) {      setError(
        "Format API key tidak valid. API key Gemini harus dimulai dengan 'AIza'"
      );
      return;
    }

    setIsValidating(true);

    try {
      // Test the API key with a simple request
      await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Test" }] }],
            generationConfig: { maxOutputTokens: 1 },
          }),
        }
      );

      // If we get here, API key is valid
      localStorage.setItem("gemini_api_key", apiKey.trim());
      onApiKeySet(apiKey.trim());
      onOpenChange(false);
      setApiKey("");
    } catch (error) {
      if (
        error.message?.includes("API_KEY_INVALID") ||
        error.message?.includes("400")
      ) {
        setError("API key tidak valid. Silakan periksa kembali API key Anda.");
      } else {
        setError("Gagal memvalidasi API key. Periksa koneksi internet Anda.");
      }
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-primary" />
            <span>API Key Gemini</span>
          </DialogTitle>
          <DialogDescription>
            Masukkan API key Google Gemini untuk mengakses wawasan ayat berbasis
            AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Alert */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="text-sm">
              API key akan disimpan secara lokal di browser Anda untuk keamanan.
              Tidak ada data yang dikirim ke server kami.
            </AlertDescription>
          </Alert>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Gemini API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* How to get API Key */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Cara mendapatkan API key:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Buka Google AI Studio</li>
              <li>Login dengan akun Google</li>
              <li>Klik "Get API Key"</li>
              <li>Salin API key dan paste di atas</li>
            </ol>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() =>
                window.open(
                  "https://makersuite.google.com/app/apikey",
                  "_blank"
                )
              }
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Buka Google AI Studio
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isValidating}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isValidating || !apiKey.trim()}
            >
              {isValidating ? "Memvalidasi..." : "Simpan API Key"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
