// src/screens/PdfViewer.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const PdfViewer = ({ route }) => {
  const { pdfUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: pdfUrl }} style={{ flex: 1 }} />
    </View>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
