import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';

import { StickerMap } from '@/components/sticker-map';
import { ThemedText } from '@/components/themed-text';
import { fetchStickers } from '@/lib/api';
import type { Sticker } from '@/lib/types';

export default function MapScreen() {
  const [data, setData] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapKey, setMapKey] = useState(0);
  const regionRef = useRef<Region | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      let stale = false;
      fetchStickers().then((s) => {
        if (!stale) {
          setData(s);
          setLoading(false);
        }
      });
      return () => { stale = true; };
    }, [])
  );

  function refresh() {
    fetchStickers().then((s) => {
      setData(s);
      setMapKey((k) => k + 1);
    });
  }

  if (loading) {
    return <View style={styles.container}><ActivityIndicator style={styles.loader} /></View>;
  }

  return (
    <View style={styles.container}>
      <StickerMap
        key={mapKey}
        stickers={data}
        style={styles.map}
        initialRegion={regionRef.current}
        onRegionChange={(r) => { regionRef.current = r; }}
      />
      <Pressable style={styles.refreshButton} onPress={refresh}>
        <ThemedText style={styles.refreshText}>Refresh</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { marginTop: 32 },
  refreshButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  refreshText: {
    color: '#0a7ea4',
    fontWeight: '600',
    fontSize: 14,
  },
});
