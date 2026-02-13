import MapboxGL from '@rnmapbox/maps';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Sticker } from '@/lib/types';

// Set access token — replace with your real token for native builds
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

interface StickerMapProps {
  stickers: Sticker[];
  style?: object;
  interactive?: boolean;
  centerCoordinate?: [number, number]; // [lng, lat]
  zoomLevel?: number;
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
      : [-73.97, 40.71]); // Default: NYC

  return (
    <View style={[styles.container, style]}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}>
        <MapboxGL.Camera centerCoordinate={center} zoomLevel={zoomLevel} />
        {stickers.map((sticker) => (
          <MapboxGL.PointAnnotation
            key={sticker.id}
            id={sticker.id}
            coordinate={[sticker.longitude, sticker.latitude]}
            onSelected={() => {
              if (interactive) {
                router.push(`/sticker/${sticker.id}`);
              }
            }}>
            <View style={styles.marker}>
              <ThemedText style={styles.markerText}>S</ThemedText>
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
