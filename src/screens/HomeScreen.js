import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function HomeScreen() {
  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome 🎉</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, marginBottom: 20 },
});
