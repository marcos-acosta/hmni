import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserProfile } from '@/components/user-profile';
import { getUserById } from '@/lib/mock-data';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = getUserById(id);

  if (!user) {
    return (
      <View style={styles.center}>
        <ThemedText>User not found.</ThemedText>
      </View>
    );
  }

  return <UserProfile user={user} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
