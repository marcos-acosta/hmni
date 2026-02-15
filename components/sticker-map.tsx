import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

import type { Sticker } from '@/lib/types';

interface StickerMapProps {
  stickers: Sticker[];
  style?: object;
  interactive?: boolean;
  centerCoordinate?: [number, number]; // [lng, lat]
  zoomLevel?: number;
  initialRegion?: Region;
  onRegionChange?: (region: Region) => void;
}

function zoomToDelta(zoom: number) {
  const delta = 360 / Math.pow(2, zoom);
  return { latitudeDelta: delta, longitudeDelta: delta };
}

export function StickerMap({
  stickers,
  style,
  interactive = true,
  centerCoordinate,
  zoomLevel = 11,
  initialRegion: savedRegion,
  onRegionChange,
}: StickerMapProps) {
  const defaultRegion: Region = (() => {
    if (centerCoordinate) {
      return {
        latitude: centerCoordinate[1],
        longitude: centerCoordinate[0],
        ...zoomToDelta(zoomLevel),
      };
    }
    if (stickers.length === 0) {
      return { latitude: 40.71, longitude: -73.97, ...zoomToDelta(zoomLevel) };
    }
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const s of stickers) {
      if (s.latitude < minLat) minLat = s.latitude;
      if (s.latitude > maxLat) maxLat = s.latitude;
      if (s.longitude < minLng) minLng = s.longitude;
      if (s.longitude > maxLng) maxLng = s.longitude;
    }
    const padding = 1.3;
    const latDelta = Math.max((maxLat - minLat) * padding, 0.005);
    const lngDelta = Math.max((maxLng - minLng) * padding, 0.005);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  })();

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={savedRegion ?? defaultRegion}
        onRegionChangeComplete={onRegionChange}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}>
        {stickers.map((sticker) => (
          <Marker
            key={sticker.id}
            coordinate={{
              latitude: sticker.latitude,
              longitude: sticker.longitude,
            }}
            pinColor="#0a7ea4"
            onPress={() => {
              if (interactive) {
                router.push(`/sticker/${sticker.id}`);
              }
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
