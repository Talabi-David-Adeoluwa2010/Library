import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function ProfileScreen({ user, openQr }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏅 Scholar Profile</Text>

      {/* User Info Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.usernameText}>{user.username}</Text>
        <Text style={styles.rankText}>{user.rank} • {user.tier} Member</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>🔥 {user.streak}</Text>
            <Text style={styles.statLbl}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>✨ {user.xp}</Text>
            <Text style={styles.statLbl}>Total XP</Text>
          </View>
        </View>
      </View>

      {/* Passport Modal Trigger */}
      <TouchableOpacity style={styles.passportBtn} onPress={openQr}>
        <Text style={styles.passportBtnText}>📷 Open Digital Library Passport (QR)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { color: BASE_COLORS.parchment, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  profileCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  usernameText: { color: BASE_COLORS.parchment, fontSize: 18, fontWeight: 'bold' },
  rankText: { color: BASE_COLORS.gold, fontSize: 12, marginTop: 2, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 16, width: '100%' },
  statBox: { flex: 1, backgroundColor: BASE_COLORS.obsidian, padding: 12, borderRadius: 10, alignItems: 'center' },
  statVal: { color: BASE_COLORS.parchment, fontSize: 16, fontWeight: 'bold' },
  statLbl: { color: BASE_COLORS.textMuted, fontSize: 10, marginTop: 2 },
  passportBtn: { backgroundColor: BASE_COLORS.terracotta, padding: 14, borderRadius: 10, alignItems: 'center' },
  passportBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 13 },
});
