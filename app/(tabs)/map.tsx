import { StyleSheet } from 'react-native';

import { StickerMap } from '@/components/sticker-map';
import { stickers } from '@/lib/mock-data';

export default function MapScreen() {
  return <StickerMap stickers={stickers} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
