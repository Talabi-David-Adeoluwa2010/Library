import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_COLORS } from '../constants/colors';

const SAMPLE_CHAPTER = {
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  chapterName: 'Chapter I',
  content: [
    "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.",
    "\"Whenever you feel like criticizing any one,\" he told me, \"just remember that all the people in this world haven't had the advantages that you've had.\"",
    "He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.",
    "In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores."
  ],
};

export default function ReaderScreen({ nightMode, setNightMode, openCharacterChat }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [fontSize, setFontSize] = useState(16);
  const [savedBookmark, setSavedBookmark] = useState(null);
  const [selectedParagraph, setSelectedParagraph] = useState(null);

  // Load saved bookmark on launch
  useEffect(() => {
    loadBookmark();
  }, []);

  const saveBookmark = async (index) => {
    try {
      await AsyncStorage.setItem('@saved_bookmark', index.toString());
      setSavedBookmark(index);
      Alert.alert('Bookmark Saved', `Bookmarked paragraph ${index + 1}`);
    } catch (e) {
      console.error(e);
    }
  };

  const loadBookmark = async () => {
    try {
      const val = await AsyncStorage.getItem('@saved_bookmark');
      if (val !== null) setSavedBookmark(parseInt(val, 10));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSpeech = async () => {
    if (isPlaying) {
      await Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const textToRead = SAMPLE_CHAPTER.content.join(' ');
      Speech.speak(textToRead, {
        language: 'en-US',
        pitch: 1.0,
        rate: speechRate,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Reader Controls Toolbar */}
      <View style={styles.readerHeader}>
        <TouchableOpacity onPress={openCharacterChat} style={styles.characterBtn}>
          <Text style={styles.btnText}>🎭 AI Gatsby Chat</Text>
        </TouchableOpacity>

        <View style={styles.toolGroup}>
          {/* Font Size Adjusters */}
          <TouchableOpacity 
            style={styles.fontBtn} 
            onPress={() => setFontSize(Math.max(12, fontSize - 2))}
          >
            <Text style={styles.toolBtnText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.fontBtn} 
            onPress={() => setFontSize(Math.min(26, fontSize + 2))}
          >
            <Text style={styles.toolBtnText}>A+</Text>
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={{ color: BASE_COLORS.parchment, fontSize: 11 }}>🌙 Warmth</Text>
            <Switch value={nightMode} onValueChange={setNightMode} thumbColor={BASE_COLORS.terracotta} />
          </View>
        </View>
      </View>

      {/* Book Parchment Canvas */}
      <ScrollView style={[styles.canvas, nightMode && { backgroundColor: BASE_COLORS.parchmentWarm }]}>
        <Text style={styles.title}>{SAMPLE_CHAPTER.title}</Text>
        <Text style={styles.author}>by {SAMPLE_CHAPTER.author} • {SAMPLE_CHAPTER.chapterName}</Text>
        <View style={styles.divider} />

        {SAMPLE_CHAPTER.content.map((paragraph, index) => {
          const isBookmarked = savedBookmark === index;
          const isSelected = selectedParagraph === index;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setSelectedParagraph(index)}
              style={[
                styles.paragraphBlock,
                isSelected && styles.selectedParagraph,
                isBookmarked && styles.bookmarkedParagraph,
              ]}
            >
              <Text style={[styles.bodyText, { fontSize, lineHeight: fontSize * 1.6 }]}>
                {paragraph}
              </Text>
              
              {isSelected && (
                <View style={styles.paragraphTools}>
                  <TouchableOpacity style={styles.actionBadge} onPress={() => saveBookmark(index)}>
                    <Text style={styles.badgeText}>{isBookmarked ? '🔖 Bookmarked' : '📌 Bookmark'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBadge, { backgroundColor: BASE_COLORS.gold }]}
                    onPress={() => {
                      Speech.speak(paragraph, { rate: speechRate });
                    }}
                  >
                    <Text style={[styles.badgeText, { color: BASE_COLORS.obsidian }]}>🔊 Read Paragraph</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Floating Audio Controller */}
      <View style={styles.audioBar}>
        <View>
          <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 }}>🎧 Narrator Engine</Text>
          <TouchableOpacity onPress={() => setSpeechRate(speechRate === 0.9 ? 1.2 : 0.9)}>
            <Text style={{ color: BASE_COLORS.gold, fontSize: 10 }}>Speed: {speechRate}x (Tap to change)</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.playBtn} onPress={toggleSpeech}>
          <Text style={styles.btnText}>{isPlaying ? '⏸ PAUSE' : '▶ LISTEN ALL'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  readerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: BASE_COLORS.obsidianLight },
  characterBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toolGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fontBtn: { backgroundColor: BASE_COLORS.obsidian, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  toolBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  canvas: { flex: 1, backgroundColor: BASE_COLORS.parchment, margin: 12, borderRadius: 8, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: BASE_COLORS.terracotta },
  author: { fontSize: 13, color: BASE_COLORS.textMuted, fontStyle: 'italic', marginTop: 2 },
  divider: { height: 1, backgroundColor: BASE_COLORS.terracotta, marginVertical: 12, opacity: 0.3 },
  paragraphBlock: { marginBottom: 14, padding: 6, borderRadius: 6 },
  selectedParagraph: { backgroundColor: BASE_COLORS.highlightYellow },
  bookmarkedParagraph: { borderLeftWidth: 3, borderLeftColor: BASE_COLORS.terracotta, paddingLeft: 10 },
  bodyText: { color: BASE_COLORS.textDark },
  paragraphTools: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionBadge: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: BASE_COLORS.parchment, fontSize: 10, fontWeight: 'bold' },
  audioBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: BASE_COLORS.obsidianLight, marginHorizontal: 12, marginBottom: 12, padding: 12, borderRadius: 25 },
  playBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 11 },
});
