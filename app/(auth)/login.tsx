import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const textColor = useThemeColor({}, 'text');

  async function handleLogin() {
    if (!username || !password) return;
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
      <ThemedText type="title" style={styles.heading}>
        HMNI
      </ThemedText>
      <ThemedText style={styles.subtitle}>Hello My Name Is</ThemedText>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="Username"
        placeholderTextColor={textColor + '66'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="Password"
        placeholderTextColor={textColor + '66'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, (!username || !password || loading) && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!username || !password || loading}>
        <ThemedText style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Log In'}
        </ThemedText>
      </Pressable>

      <Link href="/(auth)/signup" asChild>
        <Pressable style={styles.switchLink}>
          <ThemedText type="link">{"Don't have an account? Sign up"}</ThemedText>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32 },
  heading: { textAlign: 'center', marginBottom: 4 },
  subtitle: { textAlign: 'center', opacity: 0.5, marginBottom: 40 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.4 },
  error: { color: '#e53e3e', textAlign: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchLink: { alignItems: 'center', marginTop: 20 },
});
