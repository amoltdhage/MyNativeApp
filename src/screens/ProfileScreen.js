// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const [showDobPicker, setShowDobPicker] = useState(false);

  const userId = auth().currentUser.uid;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const doc = await firestore().collection('users').doc(userId).get();
        if (doc.exists) {
          setUserData(doc.data());
        }
        setLoading(false);
      } catch (err) {
        console.log('Fetch User Error:', err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const isNumeric = (val) => /^[0-9]*$/.test(val);

  const handleUpdate = async () => {
    try {
      await firestore().collection('users').doc(userId).update(userData);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.log('Update Error:', err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Account Info */}
      <Text style={styles.sectionTitle}>Account Info</Text>
      <TextInput
        placeholder="First Name"
        value={userData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={userData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={userData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      {/* Personal Info */}
      <Text style={styles.sectionTitle}>Personal Info</Text>
      <TextInput
        placeholder="Mobile Number"
        value={userData.mobile}
        onChangeText={(text) => isNumeric(text) && text.length <= 10 && handleChange('mobile', text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.input}>
        <Text>{userData.dob ? new Date(userData.dob.seconds * 1000).toDateString() : 'Select DOB'}</Text>
      </TouchableOpacity>
      {showDobPicker && (
        <DateTimePicker
          value={userData.dob ? new Date(userData.dob.seconds * 1000) : new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowDobPicker(false);
            if (date) handleChange('dob', { seconds: Math.floor(date.getTime() / 1000) });
          }}
        />
      )}

      <TextInput
        placeholder="Age"
        value={userData.age ? String(userData.age) : ''}
        onChangeText={(text) => isNumeric(text) && handleChange('age', Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Height (cm)"
        value={userData.height ? String(userData.height) : ''}
        onChangeText={(text) => isNumeric(text) && handleChange('height', Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Weight (kg)"
        value={userData.weight ? String(userData.weight) : ''}
        onChangeText={(text) => isNumeric(text) && handleChange('weight', Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FF4081',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF4081',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  updateButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
