import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserProfile } from '@/components/user-profile';
import { useAuth } from '@/lib/auth-context';
import { fetchUserSightings, fetchUserDesigns } from '@/lib/api';
import type { Sighting } from '@/lib/types';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [designCount, setDesignCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let stale = false;
      Promise.all([fetchUserSightings(user.id), fetchUserDesigns(user.id)]).then(([s, d]) => {
        if (!stale) {
          setSightings(s);
          setDesignCount(d.length);
          setLoading(false);
        }
      });
      return () => { stale = true; };
    }, [user?.id])
  );

  if (!user) return null;

  if (loading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator style={styles.loader} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <UserProfile
        user={user}
        sightings={sightings}
        designCount={designCount}
        actions={
          <Pressable style={styles.logoutButton} onPress={logout}>
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </Pressable>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { marginTop: 32 },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cc0000',
    marginBottom: 8,
  },
  logoutText: {
    color: '#cc0000',
    fontWeight: '600',
  },
});
