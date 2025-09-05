// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';
import { showMessage } from 'react-native-flash-message';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    if (!email) return showMessage({ message: 'Email is required!', type: 'danger', floating: true });
    if (!password) return showMessage({ message: 'Password is required!', type: 'danger', floating: true });
    if (!isEmailValid(email)) return showMessage({ message: 'Invalid email format!', type: 'danger', floating: true });

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);

      showMessage({
        message: 'Login successful!',
        type: 'success',
        floating: true,
        duration: 2000,
      });

      // setTimeout(() => navigation.replace('Home'), 2000);
    } catch (error) {
      showMessage({ message: error.message, type: 'danger', floating: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appTitle}>AP Zumba App</Text>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        placeholderTextColor="gray"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          placeholderTextColor="gray"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#FF69B4" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#FF4081" style={{ marginVertical: 10 }} />}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FFF0F5' },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF4081', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF69B4', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#FF69B4',
    marginBottom: 15,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    color: "#000"
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF69B4',
    borderRadius: 25,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: "#000"
  },
  loginButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupLink: { marginTop: 15, alignItems: 'center' },
  signupText: { color: '#FF4081', fontWeight: 'bold', fontSize: 16 },
});
