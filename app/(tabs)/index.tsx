import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DesignCard } from '@/components/design-card';
import { ThemedText } from '@/components/themed-text';
import { designs } from '@/lib/mock-data';

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(designs);

  useFocusEffect(
    useCallback(() => {
      setData([...designs]);
    }, [])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.heading}>
        Browse
      </ThemedText>
      <FlatList
        data={data}
        keyExtractor={(d) => d.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <DesignCard design={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  grid: { padding: 8 },
});
