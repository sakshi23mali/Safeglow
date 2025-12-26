import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ProductLoadingScreen({ route, navigation }) {
  // skin type forwarded from Quiz → Camera → here (never shown to user)
  const skinType = route?.params?.skinType ?? 'normal';

  useEffect(() => {
    const timer = setTimeout(() => {
      // Go to ProductScreen, which will call backend using this skinType
      navigation.replace('Products', { skinType });
    }, 2000); // just for nice loading effect

    return () => clearTimeout(timer);
  }, [navigation, skinType]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.subtitle}>
        Preparing product suggestions based on your skin type...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});