// src/screens/AboutScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About AP Zumba App</Text>
      <Text style={styles.text}>
        Welcome to the AP Zumba App! This app is designed to help you follow a 21-day Zumba challenge.
        You can track your daily workouts, upload activity photos, and stay motivated throughout the program.
      </Text>
      <Text style={styles.text}>
        This app is specially designed for AP Zumba App <Text style={styles.highlight}>Punam Bhutada Rathi</Text>.{"\n"}
        App developed by <Text style={styles.highlight}>Amol Dhage</Text> and <Text style={styles.highlight}>Nishant J</Text>.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFF0F5' },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#FF4081', 
    textAlign: 'center' 
  },
  text: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 10, 
    lineHeight: 22 
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FF4081',
  },
});
