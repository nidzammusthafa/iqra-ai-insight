
import { useQibla } from "@/hooks/useQibla";
import { Button } from "@/components/ui/button";

export function QiblaCompass() {
  const { qiblaDirection, compassHeading, error, requestPermissions, permissionGranted } = useQibla();

  const handleRequestPermission = () => {
    requestPermissions();
  };

  if (permissionGranted === false) {
    return <p className="text-destructive text-center">Permission denied. Please grant permission to use this feature.</p>;
  }

  if (error) {
    return <p className="text-destructive text-center">{error}</p>;
  }

  if (permissionGranted === null) {
    return (
      <div className="text-center">
        <p className="mb-4">This feature requires permission to access device orientation and location.</p>
        <Button onClick={handleRequestPermission}>Grant Permission</Button>
      </div>
    );
  }

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Compass background */}
      <div className="w-full h-full rounded-full border-4 border-primary flex items-center justify-center text-muted-foreground">
        <span className="absolute top-2 text-lg font-bold">N</span>
        <span className="absolute bottom-2 text-lg font-bold">S</span>
        <span className="absolute left-2 text-lg font-bold">W</span>
        <span className="absolute right-2 text-lg font-bold">E</span>
      </div>

      {/* Compass Needle */}
      {compassHeading !== null && (
        <div
          className="absolute top-1/2 left-1/2 w-2 h-32 bg-destructive origin-bottom transform -translate-x-1/2 -translate-y-full"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${compassHeading}deg)` }}
        ></div>
      )}

      {/* Qibla Direction */}
      {qiblaDirection !== null && (
        <div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `rotate(${qiblaDirection}deg) translate(0, -8rem) rotate(-${qiblaDirection}deg)` }}
        ></div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full" />

      {qiblaDirection !== null && (
        <p className="text-center mt-4 text-lg font-semibold">
          Qibla is at {qiblaDirection.toFixed(2)} degrees
        </p>
      )}
       {compassHeading !== null && (
        <p className="text-center mt-1 text-muted-foreground">
          Your device is pointing at {compassHeading.toFixed(2)} degrees
        </p>
      )}
    </div>
  );
}
