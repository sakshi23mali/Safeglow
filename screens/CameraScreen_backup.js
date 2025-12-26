import { useIsFocused } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen({ navigation }) {
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [cameraKey, setCameraKey] = useState(0); // force remount when switching cameras
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  
useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (e) {
        console.warn("Camera permission error:", e);
        setHasPermission(false);
      }
    })();
  }, []);

  // Remount camera when type changes -> helps avoid black preview on some devices
  useEffect(() => {
    setCameraKey((k) => k + 1);
    setIsCameraReady(false);
  }, [cameraType]);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const toggleCamera = () => {
    // toggle between front/back
    setCameraType((prev) =>
      prev === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !isCameraReady || isTaking) return;

    setIsTaking(true);
    try {
      const options = {
        quality: 0.8,
        skipProcessing: Platform.OS === "android" ? true : false,
      };
      const photo = await cameraRef.current.takePictureAsync(options);

      // Keep URI in memory only (no gallery save, no preview thumbnail).
      // Immediately navigate to ProductLoading (or Products) passing the uri.
      // ProductLoading screen can perform backend upload/analysis or use quiz results.
      navigation.replace?.("ProductLoading", { photoUri: photo.uri }); // replace so back behavior flows as you want
      // If you prefer navigate instead of replace: navigation.navigate("ProductLoading", { photoUri: photo.uri });
    } catch (err) {
      console.warn("takePhoto error:", err);
      Alert.alert("Capture failed", "Could not take photo. Try again.");
    } finally {
      setIsTaking(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Camera permission is required.</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        >
          <Text style={styles.smallBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isFocused ? (
        <Camera
          key={cameraKey}
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          onCameraReady={onCameraReady}
          ratio={"16:9"}
          useCamera2Api={Platform.OS === "android"} // helps on many Android devices
        />
      ) : (
        <View style={[styles.camera, styles.center]}>
          <Text style={styles.infoText}>Camera paused</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            // go back to previous screen
            if (navigation?.goBack) navigation.goBack();
          }}
        >
          <Text style={styles.controlText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallControl, (!isCameraReady || isTaking) && styles.disabled]}
          onPress={toggleCamera}
          disabled={!isCameraReady || isTaking}
        >
          <Text style={styles.controlText}>{cameraType === Camera.Constants.Type.back ? "Rear" : "Front"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureBtn, (isTaking || !isCameraReady) && styles.disabledCapture]}
          onPress={takePhoto}
          disabled={isTaking || !isCameraReady}
        >
          {isTaking ? <ActivityIndicator color="#fff" /> : <Text style={styles.captureText}>TAKE</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1, backgroundColor: "#111" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  infoText: { color: "#fff", fontSize: 16 },

  controls: {
    height: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#0b0b0b",
    paddingHorizontal: 12,
  },

  controlBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  controlText: { color: "#fff", fontSize: 14 },

  smallControl: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#444",
  },

  captureBtn: {
    backgroundColor: "#0a84ff",
    width: 92,
    height: 52,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: { color: "#fff", fontWeight: "700" },

  disabled: { opacity: 0.5 },
  disabledCapture: { opacity: 0.6 },
  smallBtnText: { color: "#fff", fontWeight: "600" },
});