import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { launchCamera } from "react-native-image-picker";
import ImageViewer from "react-native-image-zoom-viewer";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const { width } = Dimensions.get("window");

const activityImages = [
  require("../assets/day1.png"),
  require("../assets/day1.png"),
  require("../assets/day1.png"),
];

const ActivityUpload = ({ route, navigation }) => {
  const { day } = route.params || { day: 1 };
  const dayIndex = day - 1;

  const [userImage, setUserImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: "photo",
      quality: 0.8,
      cameraType: "back",
    });
    if (result.didCancel) return;
    if (result.errorMessage) {
      console.log(result.errorMessage);
      return;
    }
    const fileUri = result.assets?.[0]?.uri;
    setUserImage(fileUri);
  };

  const handleRemoveImage = () => setUserImage(null);

const handleSubmitActivity = async () => {
  if (!userImage) {
    Alert.alert("No Image", "Please capture an image before submitting.");
    return;
  }

  setLoading(true);

  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const uid = currentUser.uid;
    const timestamp = firestore.Timestamp.now();

    await firestore()
      .collection("users")
      .doc(uid)
      .collection("userActivity")
      .add({
        dayNumber: day,          // number
        images: [userImage],     
        activityPoint: 0,        
        isCompleted: true,       // updated field
        isAdminApproved: false,  // new field
        createdAt: timestamp,
        updatedAt: timestamp,
        date: timestamp,
      });

    setLoading(false);
    setUserImage(null);

    Alert.alert("Success", "Activity submitted successfully!", [
      {
        text: "OK",
        onPress: () => navigation.replace("Home"), // navigate cleanly to Home
      },
    ]);
  } catch (error) {
    console.log("Error submitting activity:", error);
    setLoading(false);
    Alert.alert("Error", "Failed to submit activity. Try again.");
  }
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Day {day} Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.title}>Today's Activity</Text>

      {/* Reference Image */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsImageModalVisible(true)}
      >
        <Image source={activityImages[dayIndex]} style={styles.activityImage} />
      </TouchableOpacity>

      {/* Capture / Preview Section */}
      {userImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: userImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={handleRemoveImage}
          >
            <Text style={styles.retakeText}>Retake Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={openCamera}
        >
          <Text style={styles.captureText}>📸 Capture Your Image</Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitActivity}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitText}>Submit Activity</Text>
        )}
      </TouchableOpacity>

      {/* Loading overlay in middle of screen */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF4081" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      )}

      {/* Full-Screen Image Viewer */}
      <Modal visible={isImageModalVisible} transparent={true}>
        <ImageViewer
          imageUrls={[
            {
              url: Image.resolveAssetSource(activityImages[dayIndex])?.uri || "",
            },
          ]}
          enableSwipeDown
          onSwipeDown={() => setIsImageModalVisible(false)}
          backgroundColor="black"
          saveToLocalByLongPress={false}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsImageModalVisible(false)}
        >
          <Feather name="x" size={28} color="#fff" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ActivityUpload;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5", padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4081",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#FF4081", marginBottom: 15 },
  activityImage: { width: "100%", height: 220, borderRadius: 12, marginBottom: 20 },
  captureButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  captureText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  previewContainer: { alignItems: "center", marginBottom: 20 },
  previewImage: { width: 220, height: 220, borderRadius: 12 },
  retakeButton: {
    marginTop: 10,
    backgroundColor: "#FF4081",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retakeText: { color: "#fff", fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
 loadingOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
},
loadingText: {
  marginTop: 15,
  color: "#FF4081",
  fontSize: 18,
  fontWeight: "bold",
},
});
