// src/screens/SignupScreen.js
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
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { showMessage } from 'react-native-flash-message';

const SignupScreen = ({ navigation }) => {
  // Account info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Personal info
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState(new Date());
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // UI states
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(true);
  const [showPersonalInfo, setShowPersonalInfo] = useState(true);
  const [loading, setLoading] = useState(false);

  // Validation helpers
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = (password) => password.length >= 6;
  const isNumeric = (value) => /^[0-9]*\.?[0-9]*$/.test(value);

const handleSignup = async () => {
  // Required field checks
  if (!firstName)
    return showMessage({ message: 'First Name is required!', type: 'danger', floating: true });
  if (!lastName)
    return showMessage({ message: 'Last Name is required!', type: 'danger', floating: true });
  if (!email)
    return showMessage({ message: 'Email is required!', type: 'danger', floating: true });
  if (!password)
    return showMessage({ message: 'Password is required!', type: 'danger', floating: true });
  if (!confirmPassword)
    return showMessage({ message: 'Confirm Password is required!', type: 'danger', floating: true });
  if (!mobile)
    return showMessage({ message: 'Mobile number is required!', type: 'danger', floating: true });
  if (!dob)
    return showMessage({ message: 'Date of Birth is required!', type: 'danger', floating: true });
  if (!age)
    return showMessage({ message: 'Age is required!', type: 'danger', floating: true });
  if (!height)
    return showMessage({ message: 'Height is required!', type: 'danger', floating: true });
  if (!weight)
    return showMessage({ message: 'Weight is required!', type: 'danger', floating: true });

  // Validations
  if (!isEmailValid(email))
    return showMessage({ message: 'Invalid email format!', type: 'danger', floating: true });
  if (!isPasswordValid(password))
    return showMessage({ message: 'Password must be at least 6 characters!', type: 'danger', floating: true });
  if (password !== confirmPassword)
    return showMessage({ message: 'Passwords do not match!', type: 'danger', floating: true });
  if (!/^\d{10}$/.test(mobile))
    return showMessage({ message: 'Mobile must be exactly 10 digits!', type: 'danger', floating: true });
  if (!isNumeric(age) || parseInt(age) < 1 || parseInt(age) > 120)
    return showMessage({ message: 'Invalid Age!', type: 'danger', floating: true });
  if (!isNumeric(height) || parseFloat(height) < 50 || parseFloat(height) > 250)
    return showMessage({ message: 'Invalid Height (50-250 cm)!', type: 'danger', floating: true });
  if (!isNumeric(weight) || parseFloat(weight) < 20 || parseFloat(weight) > 300)
    return showMessage({ message: 'Invalid Weight (20-300 kg)!', type: 'danger', floating: true });

  try {
    setLoading(true); // show loader

    // Create user in Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    const timestamp = firestore.FieldValue.serverTimestamp();

    // Save user data in Firestore
    await firestore().collection('users').doc(uid).set({
      firstName,
      lastName,
      email,
      mobile,
      dob,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      role: 'user',
      isDelete: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Show success message
    showMessage({
      message: 'Signup successful!',
      type: 'success',
      floating: true,
      duration: 2000,
      icon: 'success',
      onPress: () => navigation.replace('Home'), // navigate once
    });

    // // Optional: auto navigate after 2s if user does not tap flash
    // setTimeout(() => navigation.replace('Home'), 2000);

  } catch (error) {
    showMessage({
      message: error.message,
      type: 'danger',
      floating: true,
      icon: 'auto',
    });
  } finally {
    setLoading(false); // hide loader
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AP Zumba App Signup</Text>
      <Text style={styles.registerNow}>Register Now</Text>

      {/* Account Info Section */}
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowAccountInfo(!showAccountInfo)}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <AntDesign name={showAccountInfo ? 'up' : 'down'} size={18} color="#FF69B4" />
      </TouchableOpacity>
      {showAccountInfo && (
        <View>
          <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
          <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={styles.passwordInput} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#FF69B4" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} style={styles.passwordInput} />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#FF69B4" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Personal Info Section */}
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowPersonalInfo(!showPersonalInfo)}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <AntDesign name={showPersonalInfo ? 'up' : 'down'} size={18} color="#FF69B4" />
      </TouchableOpacity>
      {showPersonalInfo && (
        <View>
          <TextInput placeholder="Mobile Number" value={mobile} onChangeText={text => /^\d*$/.test(text) && text.length <= 10 && setMobile(text)} keyboardType="numeric" style={styles.input} />
          <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.input}><Text>{dob.toDateString()}</Text></TouchableOpacity>
          {showDobPicker && <DateTimePicker value={dob} mode="date" display="default" maximumDate={new Date()} onChange={(e, d) => { setShowDobPicker(false); if(d) setDob(d); }} />}
          <TextInput placeholder="Age" value={age} onChangeText={text => isNumeric(text) && setAge(text)} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Height (cm)" value={height} onChangeText={text => isNumeric(text) && setHeight(text)} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Weight (kg)" value={weight} onChangeText={text => isNumeric(text) && setWeight(text)} keyboardType="numeric" style={styles.input} />
        </View>
      )}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Already have account */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFF0F5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF4081', textAlign: 'center', marginBottom: 20 },
  registerNow: { fontSize: 18, color: '#FF69B4', textAlign: 'center', marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF69B4', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#FF69B4', marginBottom: 15, padding: 12, borderRadius: 25, backgroundColor: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FF69B4', borderRadius: 25, marginBottom: 15, paddingHorizontal: 15, backgroundColor: '#fff', height: 50 },
  passwordInput: { flex: 1, height: '100%', fontSize: 16 },
  eyeIcon: { paddingLeft: 10 },
  signupButton: { backgroundColor: '#FF4081', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginLink: { marginTop: 15, alignItems: 'center' },
  loginText: { color: '#FF4081', fontWeight: 'bold', fontSize: 16 },
});
