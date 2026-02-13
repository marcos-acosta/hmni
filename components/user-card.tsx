import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getStickersForUser } from '@/lib/mock-data';
import type { User } from '@/lib/types';

export function UserCard({ user }: { user: User }) {
  const stickerCount = getStickersForUser(user.id).length;

  return (
    <Link href={`/user/${user.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {user.username[0].toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.info}>
          <ThemedText style={styles.username}>{user.username}</ThemedText>
          <ThemedText style={styles.stats}>
            {stickerCount} sticker{stickerCount !== 1 ? 's' : ''}
          </ThemedText>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
  },
  stats: {
    fontSize: 13,
    opacity: 0.6,
  },
});
