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
}

function zoomToDelta(zoom: number) {
  // Rough conversion from zoom level to lat/lng delta
  const delta = 360 / Math.pow(2, zoom);
  return { latitudeDelta: delta, longitudeDelta: delta };
}

export function StickerMap({
  stickers,
  style,
  interactive = true,
  centerCoordinate,
  zoomLevel = 11,
}: StickerMapProps) {
  const center = centerCoordinate ??
    (stickers.length > 0
      ? [stickers[0].longitude, stickers[0].latitude]
      : [-73.97, 40.71]);

  const region: Region = {
    latitude: center[1],
    longitude: center[0],
    ...zoomToDelta(zoomLevel),
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={region}
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
