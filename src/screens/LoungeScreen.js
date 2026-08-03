import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const ROOM_MEMBERS = [
  { id: '1', name: '@BookWorm_Sam', progress: 85, status: '📖 Reading' },
  { id: '2', name: '@Polymath_Jane', progress: 92, status: '🎧 Listening' },
  { id: '3', name: '@Alex_Reader', progress: 40, status: '📖 Reading' },
  { id: '4', name: '@Grace_Reads', progress: 60, status: '🧠 Flashcards' },
];

export default function LoungeScreen() {
  const [members] = useState(ROOM_MEMBERS);

  const triggerDuel = () => {
    Alert.alert(
      "⚡ Flashcard Duel Challenge Launched!",
      "A 5-question pop quiz on Chapter 3 has been sent to everyone in the room."
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.roomBanner}>
        <Text style={styles.roomTag}>LIVE STUDY LOUNGE #4</Text>
        <Text style={styles.roomTitle}>Rainy Cafe & Lit Study</Text>
        <Text style={styles.ambientText}>🎵 Playing: Ambient Rain + Lo-Fi Beats</Text>
      </View>

      <TouchableOpacity style={styles.duelBtn} onPress={triggerDuel}>
        <Text style={styles.duelBtnText}>⚔️ Challenge Room to AI Duel</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Co-Readers in Room (4/8)</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberStatus}>{item.status}</Text>
            </View>

            {/* Shared Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{item.progress}% of Chapter completed</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: BASE_COLORS.obsidian },
  roomBanner: { backgroundColor: BASE_COLORS.obsidianLight, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: BASE_COLORS.gold },
  roomTag: { color: BASE_COLORS.gold, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  roomTitle: { color: BASE_COLORS.parchment, fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  ambientText: { color: BASE_COLORS.textMuted, fontSize: 11 },
  duelBtn: { backgroundColor: BASE_COLORS.terracotta, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  duelBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { color: BASE_COLORS.parchment, fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  memberCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 12, borderRadius: 10, marginBottom: 8 },
  memberHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  memberName: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  memberStatus: { color: BASE_COLORS.gold, fontSize: 11 },
  progressTrack: { height: 6, backgroundColor: BASE_COLORS.obsidian, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: BASE_COLORS.sageGreen },
  progressLabel: { color: BASE_COLORS.textMuted, fontSize: 9, marginTop: 4, textAlign: 'right' },
});
