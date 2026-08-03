import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import * as Speech from 'expo-speech';
import { BASE_COLORS } from '../constants/colors';

export default function ReaderScreen({ nightMode, setNightMode, openCharacterChat }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const sampleText = "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.";

  const toggleSpeech = async () => {
    if (isPlaying) {
      await Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      Speech.speak(sampleText, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Controls */}
      <View style={styles.readerHeader}>
        <TouchableOpacity onPress={openCharacterChat} style={styles.characterBtn}>
          <Text style={styles.btnText}>🎭 Talk to Gatsby</Text>
        </TouchableOpacity>
        <View style={styles.switchRow}>
          <Text style={{ color: BASE_COLORS.parchment, fontSize: 11 }}>🌙 Warmth</Text>
          <Switch value={nightMode} onValueChange={setNightMode} thumbColor={BASE_COLORS.terracotta} />
        </View>
      </View>

      {/* Reader Text Area */}
      <ScrollView style={[styles.canvas, nightMode && { backgroundColor: BASE_COLORS.parchmentWarm }]}>
        <Text style={styles.title}>The Great Gatsby</Text>
        <Text style={styles.author}>by F. Scott Fitzgerald</Text>
        <View style={styles.divider} />
        <Text style={styles.bodyText}>{sampleText}</Text>
      </ScrollView>

      {/* Floating Audio Playback Bar */}
      <View style={styles.audioBar}>
        <View>
          <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 }}>🎧 Audio Engine</Text>
          <Text style={{ color: BASE_COLORS.textMuted, fontSize: 10 }}>{isPlaying ? 'Speaking...' : 'Ready'}</Text>
        </View>
        <TouchableOpacity style={styles.playBtn} onPress={toggleSpeech}>
          <Text style={styles.btnText}>{isPlaying ? '⏸ PAUSE' : '▶ LISTEN'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  readerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: BASE_COLORS.obsidianLight },
  characterBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  canvas: { flex: 1, backgroundColor: BASE_COLORS.parchment, margin: 12, borderRadius: 8, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: BASE_COLORS.terracotta },
  author: { fontSize: 13, color: BASE_COLORS.textMuted, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: BASE_COLORS.terracotta, marginVertical: 12, opacity: 0.3 },
  bodyText: { fontSize: 16, lineHeight: 26, color: BASE_COLORS.textDark },
  audioBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: BASE_COLORS.obsidianLight, marginHorizontal: 12, marginBottom: 12, padding: 12, borderRadius: 25 },
  playBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 11 },
});
