import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const ContactUsScreen = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:support@zumbaapp.com');
  };

  const handleCall = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <TouchableOpacity style={styles.button} onPress={handleEmail}>
        <Text style={styles.buttonText}>📧 Email Us</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.buttonText}>📞 Call Us</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  button: { backgroundColor: '#FF4081', padding: 15, borderRadius: 10, marginVertical: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
