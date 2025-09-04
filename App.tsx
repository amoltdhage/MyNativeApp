// // App.tsx
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { enableScreens } from 'react-native-screens';
// import FlashMessage from 'react-native-flash-message';

// // Enable native screens for React Navigation (fix RNSScreen error)
// enableScreens();

// import LoginScreen from './src/screens/LoginScreen';
// import SignupScreen from './src/screens/SignupScreen';
// import HomeScreen from './src/screens/HomeScreen';

// type RootStackParamList = {
//   Login: undefined;
//   Signup: undefined;
//   Home: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const App: React.FC = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

//   // Auth state listener with type
//   const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   };

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   if (initializing) {
//     return <ActivityIndicator size="large" style={{ flex: 1 }} />;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {user ? (
//             <Stack.Screen name="Home" component={HomeScreen} />
//           ) : (
//             <>
//               <Stack.Screen name="Login" component={LoginScreen} />
//               <Stack.Screen name="Signup" component={SignupScreen} />
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>

//       {/* Centered Flash Message */}
//       <FlashMessage
//         position= "center"
//         floating
//         style={{ top: '0%', transform: [{ translateY: -50 }] }}
//       />
//     </GestureHandlerRootView>
//   );
// };

// export default App;

import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';

// Enable native screens
enableScreens();

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import DonateScreen from './src/screens/DonateScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = (props: any) => {
  const { navigation } = props;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.log('Logout Error: ', err.message);
      else console.log('Logout Error: Unknown error');
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Home" onPress={() => navigation.navigate('Home')} />
      <DrawerItem label="Profile" onPress={() => navigation.navigate('Profile')} />
      <DrawerItem label="Settings" onPress={() => navigation.navigate('Settings')} />
      <DrawerItem label="About" onPress={() => navigation.navigate('About')} />
      <DrawerItem label="Donate" onPress={() => navigation.navigate('Donate')} />
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Donate" component={DonateScreen} />
    </Drawer.Navigator>
  );
};

// Main App
const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
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

export default App;
