import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DesignCard } from '@/components/design-card';
import { ThemedText } from '@/components/themed-text';
import { UserCard } from '@/components/user-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { searchDesignsApi, searchUsersApi } from '@/lib/api';
import type { Design, User } from '@/lib/types';

type Mode = 'designs' | 'users';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('designs');
  const textColor = useThemeColor({}, 'text');

  const [designResults, setDesignResults] = useState<Design[]>([]);
  const [userResults, setUserResults] = useState<(User & { sightingCount?: number })[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query) {
      setDesignResults([]);
      setUserResults([]);
      return;
    }
    let stale = false;
    setSearching(true);
    const search = mode === 'designs'
      ? searchDesignsApi(query).then((r) => { if (!stale) setDesignResults(r); })
      : searchUsersApi(query).then((r) => { if (!stale) setUserResults(r); });
    search.finally(() => { if (!stale) setSearching(false); });
    return () => { stale = true; };
  }, [query, mode]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.heading}>
        Search
      </ThemedText>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder={`Search ${mode}...`}
        placeholderTextColor={textColor + '66'}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.toggleRow}>
        <ToggleButton
          label="Designs"
          active={mode === 'designs'}
          onPress={() => setMode('designs')}
        />
        <ToggleButton
          label="Users"
          active={mode === 'users'}
          onPress={() => setMode('users')}
        />
      </View>

      {searching && <ActivityIndicator style={styles.loader} />}

      {mode === 'designs' ? (
        <FlatList
          key="designs"
          data={designResults}
          keyExtractor={(d) => d.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => <DesignCard design={item} />}
          ListEmptyComponent={
            !searching ? (
              query ? (
                <ThemedText style={styles.empty}>No designs found.</ThemedText>
              ) : (
                <ThemedText style={styles.empty}>Type to search designs.</ThemedText>
              )
            ) : null
          }
        />
      ) : (
        <FlatList
          key="users"
          data={userResults}
          keyExtractor={(u) => u.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => <UserCard user={item} sightingCount={item.sightingCount} />}
          ListEmptyComponent={
            !searching ? (
              query ? (
                <ThemedText style={styles.empty}>No users found.</ThemedText>
              ) : (
                <ThemedText style={styles.empty}>Type to search users.</ThemedText>
              )
            ) : null
          }
        />
      )}
    </View>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
      onPress={onPress}>
      <ThemedText style={[styles.toggleText, active && styles.toggleTextActive]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  input: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  grid: { padding: 8 },
  empty: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 32,
  },
  loader: { marginTop: 16 },
});
