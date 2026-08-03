import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function AnalyticsScreen({ user }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📊 AI Reading Coach & Analytics</Text>
      <Text style={styles.subtitle}>Personalized insights powered by your study habits</Text>

      {/* Weekly AI Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>🧠 AI Coach Weekly Summary</Text>
        <Text style={styles.coachText}>
          "Great focus this week, {user.username}! Your reading speed averaged 240 WPM with an 88% comprehension rate in AI quizzes. We recommend a 5-minute break every 25 minutes to maintain optimal memory retention."
        </Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricVal}>4.8 hrs</Text>
          <Text style={styles.metricLabel}>Total Reading</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricVal}>88%</Text>
          <Text style={styles.metricLabel}>Quiz Score</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricVal}>12</Text>
          <Text style={styles.metricLabel}>Cards Mastered</Text>
        </View>
      </View>

      {/* Pacing Prediction */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>⏱️ Smart Pacing Predictions</Text>
        <View style={styles.predictionRow}>
          <Text style={styles.bookName}>The Great Gatsby</Text>
          <Text style={styles.timeEst}>~35 mins left</Text>
        </View>
        <View style={styles.predictionRow}>
          <Text style={styles.bookName}>Things Fall Apart</Text>
          <Text style={styles.timeEst}>~1 hr 10 mins left</Text>
        </View>
      </View>

      {/* Reading Activity Heatmap */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>🔥 Reading Activity Heatmap</Text>
        <View style={styles.heatmapRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <View key={day} style={styles.dayCol}>
              <View style={[styles.heatSquare, { opacity: i > 1 ? 0.9 : 0.3 }]} />
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: BASE_COLORS.obsidian },
  headerTitle: { color: BASE_COLORS.parchment, fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: BASE_COLORS.textMuted, fontSize: 11, marginBottom: 16 },
  card: { backgroundColor: BASE_COLORS.obsidianLight, padding: 14, borderRadius: 12, marginBottom: 14 },
  cardHeader: { color: BASE_COLORS.gold, fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  coachText: { color: BASE_COLORS.parchment, fontSize: 12, lineHeight: 18 },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metricBox: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, padding: 12, borderRadius: 10, alignItems: 'center' },
  metricVal: { color: BASE_COLORS.gold, fontSize: 16, fontWeight: 'bold' },
  metricLabel: { color: BASE_COLORS.textMuted, fontSize: 10, marginTop: 2 },
  predictionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: BASE_COLORS.obsidian },
  bookName: { color: BASE_COLORS.parchment, fontSize: 12 },
  timeEst: { color: BASE_COLORS.sageGreen, fontSize: 12, fontWeight: 'bold' },
  heatmapRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  dayCol: { alignItems: 'center' },
  heatSquare: { width: 28, height: 28, backgroundColor: BASE_COLORS.terracotta, borderRadius: 6, marginBottom: 4 },
  dayText: { color: BASE_COLORS.textMuted, fontSize: 10 },
});
