import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from '../screens/AuthScreen';
import App from '../../App'; // Points to your main App.js
import { BASE_COLORS } from '../constants/colors';

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Reads saved session from phone memory
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Failed to load session token', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BASE_COLORS.gold} />
      </View>
    );
  }

  // Token exists -> Show Main App | No token -> Show Login Screen
  return userToken ? (
    <App onLogout={async () => {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    }} />
  ) : (
    <AuthScreen onLoginSuccess={async (token) => {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    }} />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: BASE_COLORS.obsidian,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
