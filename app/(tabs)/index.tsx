import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DesignCard } from '@/components/design-card';
import { ThemedText } from '@/components/themed-text';
import { fetchDesigns } from '@/lib/api';
import type { Design } from '@/lib/types';

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let stale = false;
      fetchDesigns().then((designs) => {
        if (!stale) {
          setData(designs);
          setLoading(false);
        }
      });
      return () => { stale = true; };
    }, [])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.heading}>
        Browse
      </ThemedText>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(d) => d.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => <DesignCard design={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  grid: { padding: 8 },
  loader: { marginTop: 32 },
});
