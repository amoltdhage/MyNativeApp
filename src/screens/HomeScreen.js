//MAin finel trieal
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from 'react-native-flash-message';

const TOTAL_DAYS = 21;
const CHALLENGE_START_DATE = new Date('2025-09-05'); // Set your challenge start date

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [userActivities, setUserActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        // Fetch user name
        const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          setUserName(userDoc.data()?.firstName || 'User');
        }

        // Fetch user activity
        const activitySnapshot = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('userActivity')
          .get();

        const activities = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserActivities(activities);
      } catch (error) {
        console.log('Error fetching user/activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  // Generate day grid with status
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const dayNumber = i + 1;
    const activity = userActivities.find(d => d.dayNumber === dayNumber);
    const isCompleted = activity?.isCompleted || false;

    const dayDate = new Date(CHALLENGE_START_DATE);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));
    dayDate.setHours(0, 0, 0, 0);

    let status = 'locked';
    if (isCompleted) status = 'completed';
    else if (dayDate.getTime() === today.getTime()) status = 'active';
    else if (dayDate.getTime() < today.getTime()) status = 'missed';
    else status = 'future'; // any day after today

    return { dayNumber, status, dayDate };
  });

  const handleDayPress = async (day) => {
    if (day.status === 'completed') return;

    if (day.status === 'active') {
      navigation.navigate('ActivityUpload', { day: day.dayNumber });

      // Mark completed in Firestore
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('userActivity')
          .doc(`day-${day.dayNumber}`)
          .set({
            dayNumber: day.dayNumber,
            isCompleted: true,
            date: new Date(),
          }, { merge: true });

        setUserActivities(prev => [
          ...prev.filter(d => d.dayNumber !== day.dayNumber),
          { dayNumber: day.dayNumber, isCompleted: true },
        ]);
      } catch (error) {
        console.log('Error marking day as completed:', error);
      }
      return;
    }

    if (day.status === 'future') {
      Alert.alert('Not Active Yet', `Day ${day.dayNumber} will be active on ${day.dayDate.toDateString()}`);
    } else if (day.status === 'missed') {
      Alert.alert('Missed Day', `You missed Day ${day.dayNumber}. It was active on ${day.dayDate.toDateString()}`);
    }
  };

  const handleViewPdf = () => {
    showMessage({
      message: 'Coming Soon 🚀',
      description: 'This feature is under development. Stay tuned!',
      type: 'info',
      floating: true,
      duration: 3000,
    });
    navigation.navigate('PdfViewer', { pdfUrl: 'https://example.com/plan.pdf' });
  };

  const handleMenuPress = () => {
    Alert.alert('Menu clicked'); // Placeholder
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Feather name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hey {userName} 👋</Text>
          <View style={styles.dot} />
        </View>
      </View>

      <Text style={styles.title}>21 Days Zumba Challenge</Text>

      {/* PDF Button */}
      <TouchableOpacity style={styles.pdfButton} onPress={handleViewPdf}>
        <Text style={styles.pdfButtonText}>📄 View Plan PDF</Text>
      </TouchableOpacity>

      {/* Days Grid */}
      <FlatList
        data={days}
        keyExtractor={(item) => item.dayNumber.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          let bgColor = '#B0BEC5';
          let disabled = true;
          let icon = <Feather name="lock" size={20} color="#fff" style={{ marginTop: 5 }} />;

          if (item.status === 'completed') {
            bgColor = '#4CAF50';
            disabled = true;
            icon = <MaterialIcons name="check-circle" size={20} color="#fff" style={{ marginTop: 5 }} />;
          } else if (item.status === 'active') {
            bgColor = '#FF4081';
            disabled = false;
            icon = null;
          } else if (item.status === 'missed') {
            bgColor = '#B0BEC5';
            disabled = true;
            icon = <Feather name="lock" size={20} color="#fff" style={{ marginTop: 5 }} />;
          } else if (item.status === 'future') {
            bgColor = '#B0BEC5';
            disabled = true;
            icon = <Feather name="lock" size={20} color="#fff" style={{ marginTop: 5 }} />;
          }

          return (
            <TouchableOpacity
              style={[styles.dayButton, { backgroundColor: bgColor }]}
              onPress={() => handleDayPress(item)}
              disabled={disabled}
            >
              <Text style={styles.dayText}>Day {item.dayNumber}</Text>
              {icon}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF0F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF4081',
    borderRadius: 12,
    marginBottom: 15,
  },
  greetingContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginRight: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00FF00' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF4081', textAlign: 'center' },
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
  pdfButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});



















//treidl code

// src/screens/HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import Feather from 'react-native-vector-icons/Feather';

// const TOTAL_DAYS = 21;

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [userName, setUserName] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [userActivities, setUserActivities] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const currentUser = auth().currentUser;
//         if (!currentUser) return;

//         // Fetch user name
//         const userDoc = await firestore()
//           .collection('users')
//           .doc(currentUser.uid)
//           .get();
//         if (userDoc.exists) {
//           setUserName(userDoc.data()?.firstName || 'User');
//         }

//         // Fetch user's activity subcollection
//         const activitySnapshot = await firestore()
//           .collection('users')
//           .doc(currentUser.uid)
//           .collection('userActivity')
//           .get();

//         const activities = activitySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUserActivities(activities);
//       } catch (error) {
//         console.log('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getDayStatus = (dayNumber) => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     yesterday.setHours(0, 0, 0, 0);

//     const prevDayActivity = userActivities.find(a => a.dayNumber === dayNumber - 1);
//     const currDayActivity = userActivities.find(a => a.dayNumber === dayNumber);

//     if (currDayActivity?.isCompleted) {
//       return { color: '#4CAF50', icon: 'check', isClickable: false }; // Green + check
//     }

//     if (dayNumber === 1 || (prevDayActivity?.isCompleted && today >= yesterday)) {
//       // Active day today (Day 1 always active)
//       return { color: '#FF4081', icon: 'lock', isClickable: true, unlockMsg: `Day ${dayNumber} will unlock tomorrow at 12:00 AM` };
//     }

//     // Locked day
//     let unlockMsg = dayNumber === 2
//       ? `Day ${dayNumber} will unlock tomorrow at 12:00 AM`
//       : `Day ${dayNumber} will unlock later`;
//     return { color: '#B0BEC5', icon: 'lock', isClickable: false, unlockMsg };
//   };

//   const handleDayPress = (dayNumber) => {
//     const status = getDayStatus(dayNumber);
//     if (!status.isClickable) {
//       Alert.alert('Locked', status.unlockMsg);
//       return;
//     }
//     navigation.navigate('ActivityUpload', { day: dayNumber });
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#FF4081" />
//       </View>
//     );
//   }

//   const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Hey {userName} 👋</Text>
//       </View>

//       <Text style={styles.title}>21 Days Zumba Challenge</Text>

//       {/* Days Grid */}
//       <FlatList
//         data={days}
//         keyExtractor={(item) => item.toString()}
//         numColumns={3}
//         contentContainerStyle={styles.grid}
//         renderItem={({ item }) => {
//           const status = getDayStatus(item);
//           return (
//             <TouchableOpacity
//               style={[styles.dayButton, { backgroundColor: status.color }]}
//               onPress={() => handleDayPress(item)}
//               disabled={!status.isClickable && !status.icon === 'check'}
//             >
//               <Text style={styles.dayText}>Day {item}</Text>
//               <Feather
//                 name={status.icon}
//                 size={20}
//                 color="#fff"
//                 style={{ marginTop: 5 }}
//               />
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#FFF0F5' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: {
//     padding: 15,
//     backgroundColor: '#FF4081',
//     borderRadius: 12,
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   greeting: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF4081', textAlign: 'center' },
//   grid: { paddingBottom: 30 },
//   dayButton: {
//     flex: 1,
//     margin: 5,
//     height: 80,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });








//Inital code impo
// // src/screens/HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import Feather from 'react-native-vector-icons/Feather';
// import { showMessage } from 'react-native-flash-message';
// const TOTAL_DAYS = 21;

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [userName, setUserName] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Fetch user info from Firestore
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const currentUser = auth().currentUser;
//         if (currentUser) {
//           const userDoc = await firestore()
//             .collection('users')
//             .doc(currentUser.uid)
//             .get();
//           if (userDoc.exists) {
//             setUserName(userDoc.data()?.firstName || 'User');
//           }
//         }
//       } catch (error) {
//         console.log('Error fetching user:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Generate 21 days
//   const days = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
//     dayNumber: i + 1,
//     isActive: i === 0, // Only Day 1 active for now
//   }));

//   const handleDayPress = (day) => {
//     showMessage({
//     message: 'Coming Soon 🚀',
//     description: 'This feature is under development. Stay tuned for updates!',
//     type: 'info',       // blue color toast
//     floating: true,
//     duration: 3000,
//   });
//     if (!day.isActive) {
//       Alert.alert('Locked', `Day ${day.dayNumber} will unlock later!`);
//       return;
//     }
//     navigation.navigate('ActivityUpload', { day: day.dayNumber });
//   };

//   const handleViewPdf = () => {
//     showMessage({
//     message: 'Coming Soon 🚀',
//     description: 'This feature is under development. Stay tuned for updates!',
//     type: 'info',       // blue color toast
//     floating: true,
//     duration: 3000,
//   });
//     navigation.navigate('PdfViewer', { pdfUrl: 'https://example.com/plan.pdf' });
//   };

//   const handleMenuPress = () => {
//     Alert.alert('Menu clicked'); // You can replace with drawer or side menu
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#FF4081" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.greetingContainer}>
//           <Text style={styles.greeting}>Hey {userName} 👋</Text>
//           <View style={styles.dot} />
//         </View>
//       </View>

//       <Text style={styles.title}>21 Days Zumba Challenge</Text>

//       {/* View Plan PDF Button */}
//       <TouchableOpacity style={styles.pdfButton} onPress={handleViewPdf}>
//         <Text style={styles.pdfButtonText}>📄 View Plan PDF</Text>
//       </TouchableOpacity>

//       {/* Days Grid */}
//       <FlatList
//         data={days}
//         keyExtractor={(item) => item.dayNumber.toString()}
//         numColumns={3}
//         contentContainerStyle={styles.grid}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[
//               styles.dayButton,
//               { backgroundColor: item.isActive ? '#FF4081' : '#B0BEC5' },
//             ]}
//             onPress={() => handleDayPress(item)}
//             disabled={!item.isActive}
//           >
//             <Text style={styles.dayText}>Day {item.dayNumber}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#FFF0F5' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#FF4081', // Header color
//     borderRadius: 12,
//     marginBottom: 15,
//   },
//   greetingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   greeting: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginRight: 8 },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#00FF00', // Green indicator dot
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#FF4081',
//     textAlign: 'center',
//   },
//   grid: { paddingBottom: 30 },
//   dayButton: {
//     flex: 1,
//     margin: 5,
//     height: 80,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   pdfButton: {
//     backgroundColor: '#FF4081',
//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   pdfButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
