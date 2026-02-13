import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserProfile } from '@/components/user-profile';
import { fetchUser, fetchUserStickers, fetchUserDesigns } from '@/lib/api';
import type { Sticker, User } from '@/lib/types';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [designCount, setDesignCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUser(id), fetchUserStickers(id), fetchUserDesigns(id)]).then(
      ([u, s, d]) => {
        setUser(u);
        setStickers(s);
        setDesignCount(d.length);
        setLoading(false);
      }
    );
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <ThemedText>User not found.</ThemedText>
      </View>
    );
  }

  return <UserProfile user={user} stickers={stickers} designCount={designCount} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
