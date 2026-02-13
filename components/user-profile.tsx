import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { User, Sticker } from '@/lib/types';

export function UserProfile({
  user,
  stickers,
  designCount,
  actions,
}: {
  user: User;
  stickers: Sticker[];
  designCount: number;
  actions?: React.ReactNode;
}) {
  return (
    <FlatList
      data={stickers}
      keyExtractor={(s) => s.id}
      numColumns={3}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {user.username[0].toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.username}>
            {user.username}
          </ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <ThemedText style={styles.statNum}>{stickers.length}</ThemedText>
              <ThemedText style={styles.statLabel}>Stickers</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statNum}>{designCount}</ThemedText>
              <ThemedText style={styles.statLabel}>Designs</ThemedText>
            </View>
          </View>
          {actions}
          <ThemedText type="subtitle" style={styles.timelineTitle}>
            Timeline
          </ThemedText>
        </View>
      }
      renderItem={({ item }) => <TimelineItem sticker={item} />}
      ListEmptyComponent={
        <ThemedText style={styles.empty}>No stickers logged yet.</ThemedText>
      }
    />
  );
}

function TimelineItem({ sticker }: { sticker: Sticker }) {
  return (
    <Link href={`/sticker/${sticker.id}`} asChild>
      <Pressable style={styles.timelineItem}>
        <Image source={sticker.photoUri} style={styles.timelineImage} contentFit="cover" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 28,
  },
  username: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  timelineTitle: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },
  timelineItem: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
  },
  timelineImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  empty: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 24,
  },
});
