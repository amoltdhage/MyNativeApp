import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import FlashMessage, { showMessage } from 'react-native-flash-message'; // 🔹 Added
// @ts-ignore
import AntDesign from 'react-native-vector-icons/AntDesign';
import ActivityUpload from './src/screens/ActivityUpload'; 
enableScreens();

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import DonateScreen from './src/screens/DonateScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Label Component
const DrawerLabel = ({ label, focused }: { label: string; focused: boolean }) => (
  <View style={styles.labelContainer}>
    <Text style={[styles.labelText, focused && styles.labelTextFocused]}>
      {label}
    </Text>
    <AntDesign name="right" size={16} color={focused ? '#FF4081' : '#888'} />
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = (props: any) => {
  const { navigation, state } = props;
  const [userData, setUserData] = useState<any>(null);

useEffect(() => {
  const user = auth().currentUser;

  if (user) {
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(doc => {
        if (doc.exists()) {  // ✅ note the parentheses
          setUserData(doc.data());
        }
      });

    return unsubscribe;
  }
}, []);


  const handleLogout = async () => {
    try {
      await auth().signOut();
      showMessage({
        message: 'Logged out successfully!',
        type: 'success',
        duration: 2000,
      });
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err: unknown) {
      if (err instanceof Error)
        console.log('Logout Error:', err.message);
      else console.log('Logout Error: Unknown');
    }
  };

  const currentRoute = state.routeNames[state.index];

  const drawerItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Profile', icon: 'user' },
    { name: 'Settings', icon: 'setting' },
    { name: 'About', icon: 'infocirlceo' },
    { name: 'Donate', icon: 'hearto' },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {userData?.photoURL ? (
          <Image
            source={{ uri: userData.photoURL }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.iconPlaceholder]}>
            <AntDesign name="user" size={40} color="#FF4081" />
          </View>
        )}
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>
            {userData?.firstName || 'First'} {userData?.lastName || 'Last'}
          </Text>
          <Text style={styles.profileEmail}>
            {auth().currentUser?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separatorLine} />

      {/* Drawer Items */}
      {drawerItems.map(item => (
        <DrawerItem
          key={item.name}
          label={() => (
            <DrawerLabel label={item.name} focused={currentRoute === item.name} />
          )}
          icon={({ size }) => (
            <AntDesign
              name={item.icon}
              size={size}
              color={currentRoute === item.name ? '#FF4081' : '#000'}
            />
          )}
          focused={currentRoute === item.name}
          style={[styles.item, currentRoute === item.name && styles.activeItem]}
          onPress={() => navigation.navigate(item.name)}
        />
      ))}

      {/* Logout */}
      <DrawerItem
        label={() => <DrawerLabel label="Logout" focused={false} />}
        icon={({ size }) => <AntDesign name="logout" size={size} color="#000" />}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="About" component={AboutScreen} />
    <Drawer.Screen name="Donate" component={DonateScreen} />
  </Drawer.Navigator>
);

// Main App Component
const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // 🔹 Ensure user exists in Firestore
        const userRef = firestore().collection('users').doc(user.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
          await userRef.set({
            firstName: '',
            lastName: '',
            email: user.email,
            photoURL: user.photoURL || '',
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        }
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (initializing) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
         {user ? (
    <>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="ActivityUpload" component={ActivityUpload} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </>
  ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="center" floating />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FF4081',
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    backgroundColor: '#FFE4EC',
  },
  profileTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  profileEmail: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#FF4081',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  item: {
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeItem: {
    backgroundColor: '#FFE4EC',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  labelText: {
    fontSize: 16,
    color: '#000',
  },
  labelTextFocused: {
    color: '#FF4081',
    fontWeight: 'bold',
  },
});

export default App;
