import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function useUserLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentRegionCode, setCurrentRegionCode] = useState<null | string>(
    null
  );
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(coords);
      setCurrentRegionCode(place?.isoCountryCode ?? null);
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });
    })();
  }, []);

  return { location, currentRegionCode };
}
