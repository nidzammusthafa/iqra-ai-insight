
import { QiblaCompass } from "@/components/qibla/QiblaCompass";

export function QiblaPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Qibla Direction</h1>
        <p className="text-muted-foreground">
          Point your device to find the direction of the Kaaba.
        </p>
      </div>
      <div className="flex justify-center">
        <QiblaCompass />
      </div>
    </div>
  );
}
