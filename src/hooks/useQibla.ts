
import { useState, useEffect } from 'react';
import { calculateQiblaBearing } from '@/lib/qibla';

export function useQibla() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    let heading = null;
    // For iOS
    if ((event as any).webkitCompassHeading) {
      heading = (event as any).webkitCompassHeading;
    } 
    // For Android
    else if (event.alpha !== null) {
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
        setCompassHeading(heading);
    }
  };

  const requestPermissions = async () => {
    // For iOS 13+ devices
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        } else {
          setPermissionGranted(false);
          setError('Permission to access device orientation was denied.');
        }
      } catch (err) {
        setError('Error requesting device orientation permission.');
        console.error(err);
      }
    } else {
      // For non-iOS 13+ devices
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const bearing = calculateQiblaBearing(latitude, longitude);
        setQiblaDirection(bearing);
      },
      (err) => {
        setError('Could not get location. Please enable location services.');
        console.error(err);
      }
    );

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return { qiblaDirection, compassHeading, error, requestPermissions, permissionGranted };
}
