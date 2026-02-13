import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useLogSticker } from '@/lib/log-sticker-context';

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationGranted, setLocationGranted] = useState(false);
  const [permissionsReady, setPermissionsReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const { setPhoto } = useLogSticker();

  useEffect(() => {
    async function requestAll() {
      const [, locResult] = await Promise.all([
        requestCameraPermission(),
        Location.requestForegroundPermissionsAsync(),
      ]);
      setLocationGranted(locResult.status === 'granted');
      setPermissionsReady(true);
    }
    requestAll();
  }, []);

  if (!permissionsReady || !cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.message}>
          Camera access is needed to photograph stickers.
        </ThemedText>
        <Pressable style={styles.button} onPress={requestCameraPermission}>
          <ThemedText style={styles.buttonText}>Grant Camera Access</ThemedText>
        </Pressable>
      </View>
    );
  }

  async function capture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);

    try {
      let lat = 40.7128;
      let lng = -74.006;

      const [photo, location] = await Promise.all([
        cameraRef.current.takePictureAsync({ quality: 0.7 }),
        locationGranted
          ? Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
          : null,
      ]);

      if (location) {
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      }

      if (photo) {
        setPhoto(photo.uri, lat, lng);
        router.push('/log/match-design');
      }
    } finally {
      setCapturing(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.controls}>
        <Pressable style={styles.captureButton} onPress={capture} disabled={capturing}>
          <View style={[styles.captureInner, capturing && styles.capturing]} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  message: { textAlign: 'center', marginBottom: 16 },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  capturing: {
    backgroundColor: '#ccc',
  },
});
