// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import { showMessage } from 'react-native-flash-message';
const TOTAL_DAYS = 21;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user info from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .get();
          if (userDoc.exists) {
            setUserName(userDoc.data()?.firstName || 'User');
          }
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Generate 21 days
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
    dayNumber: i + 1,
    isActive: i === 0, // Only Day 1 active for now
  }));

  const handleDayPress = (day) => {
    showMessage({
    message: 'Coming Soon 🚀',
    description: 'This feature is under development. Stay tuned for updates!',
    type: 'info',       // blue color toast
    floating: true,
    duration: 3000,
  });
    if (!day.isActive) {
      Alert.alert('Locked', `Day ${day.dayNumber} will unlock later!`);
      return;
    }
    navigation.navigate('ActivityUpload', { day: day.dayNumber });
  };

  const handleViewPdf = () => {
    showMessage({
    message: 'Coming Soon 🚀',
    description: 'This feature is under development. Stay tuned for updates!',
    type: 'info',       // blue color toast
    floating: true,
    duration: 3000,
  });
    navigation.navigate('PdfViewer', { pdfUrl: 'https://example.com/plan.pdf' });
  };

  const handleMenuPress = () => {
    Alert.alert('Menu clicked'); // You can replace with drawer or side menu
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hey {userName} 👋</Text>
          <View style={styles.dot} />
        </View>
      </View>

      <Text style={styles.title}>21 Days Zumba Challenge</Text>

      {/* View Plan PDF Button */}
      <TouchableOpacity style={styles.pdfButton} onPress={handleViewPdf}>
        <Text style={styles.pdfButtonText}>📄 View Plan PDF</Text>
      </TouchableOpacity>

      {/* Days Grid */}
      <FlatList
        data={days}
        keyExtractor={(item) => item.dayNumber.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dayButton,
              { backgroundColor: item.isActive ? '#FF4081' : '#B0BEC5' },
            ]}
            onPress={() => handleDayPress(item)}
            disabled={!item.isActive}
          >
            <Text style={styles.dayText}>Day {item.dayNumber}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF0F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF4081', // Header color
    borderRadius: 12,
    marginBottom: 15,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginRight: 8 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF00', // Green indicator dot
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF4081',
    textAlign: 'center',
  },
  grid: { paddingBottom: 30 },
  dayButton: {
    flex: 1,
    margin: 5,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  pdfButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
