import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Design } from '@/lib/types';

export function DesignCard({
  design,
  onPress,
}: {
  design: Design;
  onPress?: () => void;
}) {
  const card = (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={design.imageUrl} style={styles.image} contentFit="cover" />
      <ThemedText style={styles.name} numberOfLines={1}>
        {design.name}
      </ThemedText>
    </Pressable>
  );

  if (onPress) return card;

  return (
    <Link href={`/design/${design.id}`} asChild>
      {card}
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    paddingHorizontal: 2,
  },
});
