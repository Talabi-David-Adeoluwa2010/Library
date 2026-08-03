import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';
import { registerUser, loginUser } from '../services/firebase';

export default function AuthScreen({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      let profile;
      if (isRegistering) {
        profile = await registerUser(email, password, username);
      } else {
        profile = await loginUser(email, password);
      }
      onLoginSuccess(profile);
    } catch (error) {
      Alert.alert("Authentication Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 PARCHMENT & OBSIDIAN</Text>
      <Text style={styles.subTitle}>{isRegistering ? 'Create Scholar Account' : 'Welcome Back'}</Text>

      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Username (e.g. @BookWorm)"
          placeholderTextColor={BASE_COLORS.textMuted}
          value={username}
          onChangeText={setUsername}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={BASE_COLORS.textMuted}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={BASE_COLORS.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>{isRegistering ? 'Sign Up' : 'Log In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchText}>
          {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian, padding: 24, justifyContent: 'center' },
  title: { color: BASE_COLORS.gold, fontSize: 18, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1 },
  subTitle: { color: BASE_COLORS.parchment, fontSize: 14, textAlign: 'center', marginBottom: 24, marginTop: 4 },
  input: { backgroundColor: BASE_COLORS.obsidianLight, color: BASE_COLORS.parchment, padding: 12, borderRadius: 8, marginBottom: 12 },
  submitBtn: { backgroundColor: BASE_COLORS.terracotta, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 13 },
  switchText: { color: BASE_COLORS.textMuted, fontSize: 11, textAlign: 'center', marginTop: 16 },
});
