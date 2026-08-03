import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { BASE_COLORS } from '../constants/colors';

export default function ScannerScreen({ onClose, onAddFriend }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);
    // Parse user handle from URL scheme (e.g. https://parchment.app/u/@BookWorm_Sam)
    const handle = data.includes('/u/') ? data.split('/u/')[1] : data;
    
    Alert.alert(
      "Passport Scanned! 📷",
      `Would you like to add ${handle} to your Scholar network?`,
      [
        { text: "Cancel", onPress: () => setScanned(false), style: "cancel" },
        { 
          text: "Add Friend", 
          onPress: () => {
            onAddFriend(handle);
            onClose();
          } 
        }
      ]
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text style={styles.text}>No access to camera.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Align Library Passport in Frame</Text>
          <View style={styles.scanTarget} />
          
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel Scan</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 60 },
  title: { color: BASE_COLORS.parchment, fontSize: 14, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 8 },
  scanTarget: { width: 220, height: 220, borderWidth: 2, borderColor: BASE_COLORS.gold, borderRadius: 16, backgroundColor: 'transparent' },
  closeBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  closeBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold' },
  text: { color: BASE_COLORS.parchment }
});
