import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function AuthScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>PARCHMENT & OBSIDIAN</Text>
        <Text style={styles.subtitle}>{isSignUp ? 'Create your scholar profile' : 'Enter the grand archive'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Scholar Email"
          placeholderTextColor={BASE_COLORS.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Secret Passcode"
          placeholderTextColor={BASE_COLORS.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.mainBtn} onPress={handleAuth} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={BASE_COLORS.parchment} />
          ) : (
            <Text style={styles.mainBtnText}>{isSignUp ? 'Initialize Scholar Pass' : 'Enter Archives'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 16 }}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have a pass? Log In' : "Don't have a passport? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: BASE_COLORS.obsidianLight, width: '100%', maxWidth: 380, padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2c2935' },
  title: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 18, letterSpacing: 1.5, textAlign: 'center' },
  subtitle: { color: BASE_COLORS.textMuted, fontSize: 12, marginTop: 4, marginBottom: 24 },
  input: { width: '100%', backgroundColor: BASE_COLORS.obsidian, color: BASE_COLORS.parchment, padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#3b3746' },
  mainBtn: { width: '100%', backgroundColor: BASE_COLORS.terracotta, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  mainBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 14 },
  switchText: { color: BASE_COLORS.gold, fontSize: 12, textAlign: 'center' },
});
