import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { StickerMap } from '@/components/sticker-map';
import { stickers } from '@/lib/mock-data';

export default function MapScreen() {
  const [data, setData] = useState(stickers);

  useFocusEffect(
    useCallback(() => {
      setData([...stickers]);
    }, [])
  );

  return <StickerMap stickers={data} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
