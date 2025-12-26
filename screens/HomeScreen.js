import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Round logo avatar */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icon.png")} // app icon
          style={styles.logoImage}
        />
      </View>

      {/* Title + subtitle */}
      <Text style={styles.title}>Welcome to SafeGlow</Text>
      <Text style={styles.subtitle}>
        Personalized skincare recommendations
      </Text>

      {/* Start Quiz */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={styles.primaryButtonText}>Start Skin Quiz</Text>
      </TouchableOpacity>

      {/* Open Camera */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.secondaryButtonText}>Open Camera</Text>
      </TouchableOpacity>

      {/* View Products */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Products")}
      >
        <Text style={styles.secondaryButtonText}>
          View Product Suggestions
        </Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: "center",
  },

  // -------- avatar (round logo) ----------
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f7e9c9", // halka golden sa bg
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    overflow: "hidden", // image circle ke bahar na nikle
  },
  logoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // -------- text ----------
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#6b21a8", // purple
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 40,
  },

  // -------- buttons ----------
  primaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: "#7c3aed",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});