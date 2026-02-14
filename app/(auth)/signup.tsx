import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth-context';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const textColor = useThemeColor({}, 'text');

  const valid = username && email && password;

  async function handleSignup() {
    if (!valid) return;
    setLoading(true);
    setError('');
    try {
      await signup(username, email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
      <ThemedText type="title" style={styles.heading}>
        Create Account
      </ThemedText>

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
        placeholder="Email"
        placeholderTextColor={textColor + '66'}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
        style={[styles.button, (!valid || loading) && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={!valid || loading}>
        <ThemedText style={styles.buttonText}>
          {loading ? 'Creating...' : 'Sign Up'}
        </ThemedText>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.switchLink}>
          <ThemedText type="link">Already have an account? Log in</ThemedText>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32 },
  heading: { textAlign: 'center', marginBottom: 32 },
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
