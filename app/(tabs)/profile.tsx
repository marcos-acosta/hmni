import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserProfile } from '@/components/user-profile';
import { useAuth } from '@/lib/auth-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <UserProfile
        user={user}
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
