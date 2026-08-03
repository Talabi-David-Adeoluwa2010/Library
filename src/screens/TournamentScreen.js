import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const LEADERBOARD_DATA = [
  { rank: '1️⃣', username: '@Polymath_Jane', score: '980 pts', title: '🥇 Gold Medalist' },
  { rank: '2️⃣', username: '@BookWorm_Sam', score: '910 pts', title: '🥈 Silver Medalist' },
  { rank: '3️⃣', username: '@Alex_Reader', score: '880 pts', title: '🥉 Bronze Medalist' },
  { rank: '4th', username: '@Grace_Reads', score: '820 pts', title: 'Arena Challenger' },
  { rank: '5th', username: '@Quantum_Dev', score: '760 pts', title: 'Arena Challenger' },
];

export default function TournamentScreen({ user, onStartMatch }) {
  const [activeTab, setActiveTab] = useState('LIVE'); // LIVE | LEADERBOARD

  return (
    <View style={styles.container}>
      {/* Tournament Banner */}
      <View style={styles.banner}>
        <Text style={styles.eventSubtitle}>⚔️ BI-WEEKLY AI ARENA</Text>
        <Text style={styles.eventTitle}>Wednesday Night Literature Clash</Text>
        <Text style={styles.timerText}>⏱️ Event Ends In: 02h 45m 12s</Text>
        <Text style={styles.multiplierBadge}>🔥 2x XP Multiplier Active</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'LIVE' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('LIVE')}
        >
          <Text style={[styles.tabText, activeTab === 'LIVE' && styles.activeTabText]}>Live Match</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'LEADERBOARD' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('LEADERBOARD')}
        >
          <Text style={[styles.tabText, activeTab === 'LEADERBOARD' && styles.activeTabText]}>Global Standings</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'LIVE' ? (
        <View style={styles.matchCard}>
          <Text style={styles.cardHeader}>Tournament Topic: 19th Century African & World Lit</Text>
          <Text style={styles.cardDesc}>10 Speed Questions • Strict 5-Minute Timer • Unlimited Bragging Rights</Text>
          
          <TouchableOpacity style={styles.enterArenaBtn} onPress={onStartMatch}>
            <Text style={styles.enterArenaText}>ENTER ARENA (2x XP)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={LEADERBOARD_DATA}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <View style={styles.leaderboardRow}>
              <Text style={styles.rankText}>{item.rank}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.userName}>{item.username}</Text>
                <Text style={styles.userTitle}>{item.title}</Text>
              </View>
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  banner: { backgroundColor: BASE_COLORS.obsidianLight, padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: BASE_COLORS.gold },
  eventSubtitle: { color: BASE_COLORS.gold, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  eventTitle: { color: BASE_COLORS.parchment, fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  timerText: { color: BASE_COLORS.textMuted, fontSize: 12 },
  multiplierBadge: { color: BASE_COLORS.terracotta, fontSize: 11, fontWeight: 'bold', marginTop: 8 },
  tabContainer: { flexDirection: 'row', backgroundColor: BASE_COLORS.obsidianLight, borderRadius: 8, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeTabBtn: { backgroundColor: BASE_COLORS.terracotta },
  tabText: { color: BASE_COLORS.textMuted, fontSize: 12, fontWeight: 'bold' },
  activeTabText: { color: BASE_COLORS.parchment },
  matchCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 20, borderRadius: 12, alignItems: 'center' },
  cardHeader: { color: BASE_COLORS.parchment, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  cardDesc: { color: BASE_COLORS.textMuted, fontSize: 12, textAlign: 'center', marginVertical: 12 },
  enterArenaBtn: { backgroundColor: BASE_COLORS.gold, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  enterArenaText: { color: BASE_COLORS.obsidian, fontWeight: 'bold', fontSize: 13 },
  leaderboardRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: BASE_COLORS.obsidianLight, padding: 12, borderRadius: 8, marginBottom: 8 },
  rankText: { fontSize: 16, fontWeight: 'bold' },
  userName: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 13 },
  userTitle: { color: BASE_COLORS.gold, fontSize: 10 },
  scoreText: { color: BASE_COLORS.sageGreen, fontWeight: 'bold', fontSize: 13 }
});
