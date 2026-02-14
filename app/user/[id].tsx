import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserProfile } from '@/components/user-profile';
import { fetchUser, fetchUserSightings, fetchUserDesigns } from '@/lib/api';
import type { Sighting, User } from '@/lib/types';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [designCount, setDesignCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUser(id), fetchUserSightings(id), fetchUserDesigns(id)]).then(
      ([u, s, d]) => {
        setUser(u);
        setSightings(s);
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

  return <UserProfile user={user} sightings={sightings} designCount={designCount} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
