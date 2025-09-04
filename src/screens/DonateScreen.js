// src/screens/DonateScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function DonateScreen() {
  const handleDonatePress = () => {
    // Open donation link
    Linking.openURL('https://www.example.com/donate');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support AP Zumba App</Text>
      <Text style={styles.text}>
        If you like the app and want to support us, you can make a donation. 
        Your contribution helps us maintain and improve the app for everyone!
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleDonatePress}>
        <Text style={styles.buttonText}>Donate Now 💖</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#FF4081', textAlign: 'center' },
  text: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
