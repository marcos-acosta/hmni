import MapboxGL from '@rnmapbox/maps';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Sticker } from '@/lib/types';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '');

interface StickerMapProps {
  stickers: Sticker[];
  style?: object;
  interactive?: boolean;
  centerCoordinate?: [number, number]; // [lng, lat]
  zoomLevel?: number;
}

function toGeoJSON(stickers: Sticker[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: stickers.map((s) => ({
      type: 'Feature' as const,
      id: s.id,
      properties: { id: s.id },
      geometry: { type: 'Point' as const, coordinates: [s.longitude, s.latitude] },
    })),
  };
}

export function StickerMap({
  stickers,
  style,
  interactive = true,
  centerCoordinate,
  zoomLevel = 11,
}: StickerMapProps) {
  const center =
    centerCoordinate ??
    (stickers.length > 0
      ? [stickers[0].longitude, stickers[0].latitude]
      : [-73.97, 40.71]);

  return (
    <View style={[styles.container, style]}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={(feature) => {
          if (!interactive) return;
          const props = feature.features?.[0]?.properties;
          if (props?.id) {
            router.push(`/sticker/${props.id}`);
          }
        }}>
        <MapboxGL.Camera centerCoordinate={center} zoomLevel={zoomLevel} />
        <MapboxGL.ShapeSource
          id="stickers"
          shape={toGeoJSON(stickers)}
          onPress={(e) => {
            if (!interactive) return;
            const id = e.features?.[0]?.properties?.id;
            if (id) router.push(`/sticker/${id}`);
          }}>
          <MapboxGL.CircleLayer
            id="sticker-circles"
            style={{
              circleRadius: 8,
              circleColor: '#0a7ea4',
              circleStrokeWidth: 2,
              circleStrokeColor: '#fff',
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
