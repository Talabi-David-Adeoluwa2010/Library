import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import { BASE_COLORS } from '../constants/colors';
import { checkProAccess } from '../services/proGateService';

export default function ReaderScreen({ user, nightMode, setNightMode, selectedBook, openCharacterChat }) {
  const [activeTheme, setActiveTheme] = useState('parchment');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Pull dynamic title and author from selection, or fallback to a default
  const bookTitle = selectedBook?.title || 'The Great Gatsby';
  const bookAuthor = selectedBook?.author || 'F. Scott Fitzgerald';

  const samplePassage = `Opening records and archival chapters for "${bookTitle}" by ${bookAuthor}.\n\nIn my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven’t had the advantages that you’ve had.'`;

  // Text-To-Speech Controls
  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(samplePassage, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  // Offline Download Check (Library Pro Feature)
  const handleOfflineDownload = () => {
    checkProAccess(user, 'Offline Sync & Book Downloading', () => {
      setIsDownloaded(!isDownloaded);
      Alert.alert(
        isDownloaded ? 'Removed Offline' : 'Saved Offline! 📴',
        isDownloaded
          ? 'Book removed from offline storage.'
          : 'This title and its audio narration are saved to your device.'
      );
    });
  };

  // Theme Picker Gate (Library Pro Feature for Emerald & Velvet)
  const handleSelectTheme = (themeKey) => {
    if (themeKey === 'emerald' || themeKey === 'velvet') {
      checkProAccess(user, 'Custom Warmth & Velvet Themes', () => setActiveTheme(themeKey));
    } else {
      setActiveTheme(themeKey);
    }
  };

  // Voice Margin Note Recorder
  const toggleRecording = () => {
    if (isRecording) {
      if (noteText.trim() === '') {
        Alert.alert('Empty Note', 'Please enter text or audio transcript first.');
        setIsRecording(false);
        return;
      }
      setVoiceNotes([
        ...voiceNotes,
        { id: Date.now().toString(), text: noteText, timestamp: 'Just now' },
      ]);
      setNoteText('');
      setIsRecording(false);
      Alert.alert('Margin Note Saved! 🎙️', 'Transcribed and linked to this page.');
    } else {
      setIsRecording(true);
    }
  };

  // Background Theme Resolver
  const getBackgroundColor = () => {
    if (nightMode) return '#121115';
    switch (activeTheme) {
      case 'emerald':
        return '#0F201B';
      case 'velvet':
        return '#1A0F1F';
      default:
        return BASE_COLORS.parchment;
    }
  };

  const getTextColor = () => {
    if (nightMode || activeTheme === 'emerald' || activeTheme === 'velvet') {
      return BASE_COLORS.parchment;
    }
    return BASE_COLORS.obsidian;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Top Reading Toolbar */}
      <View style={styles.topToolbar}>
        <TouchableOpacity style={styles.toolBtn} onPress={toggleSpeech}>
          <Text style={styles.toolBtnText}>{isSpeaking ? '⏹️ Stop Narration' : '🔊 Listen (TTS)'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn} onPress={handleOfflineDownload}>
          <Text style={styles.toolBtnText}>{isDownloaded ? '✅ Saved Offline' : '📴 Sync Offline'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn} onPress={openCharacterChat}>
          <Text style={styles.toolBtnText}>🎭 Chat Gatsby</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn} onPress={() => setNightMode(!nightMode)}>
          <Text style={styles.toolBtnText}>{nightMode ? '☀️ Day' : '🌙 Night'}</Text>
        </TouchableOpacity>
      </View>

      {/* Book Reader Canvas */}
      <ScrollView style={styles.readerContent}>
        <Text style={styles.bookMainTitle}>{bookTitle}</Text>
        <Text style={styles.bookSubAuthor}>By {bookAuthor}</Text>
        <Text style={styles.chapterTitle}>CHAPTER I</Text>
        <Text style={[styles.bookText, { color: getTextColor() }]}>{samplePassage}</Text>

        {/* Display Margin Notes */}
        {voiceNotes.length > 0 && (
          <View style={styles.notesSection}>
            <Text style={styles.notesSectionTitle}>📌 Margin Voice Notes & Transcripts</Text>
            {voiceNotes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteTimestamp}>🎙️ {note.timestamp}</Text>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Voice Note Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder={isRecording ? 'Listening... Speak now' : 'Type or record margin note...'}
          placeholderTextColor={BASE_COLORS.textMuted}
          value={noteText}
          onChangeText={setNoteText}
        />
        <TouchableOpacity
          style={[styles.micBtn, isRecording && { backgroundColor: BASE_COLORS.terracotta }]}
          onPress={toggleRecording}
        >
          <Text style={styles.micBtnText}>{isRecording ? '⏹️ Save' : '🎙️ Record'}</Text>
        </TouchableOpacity>
      </View>

      {/* Pro Theme Selector */}
      <View style={styles.themeSelector}>
        <TouchableOpacity style={styles.themeDot} onPress={() => handleSelectTheme('parchment')}>
          <Text style={styles.themeDotText}>📜 Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeDot} onPress={() => handleSelectTheme('emerald')}>
          <Text style={[styles.themeDotText, { color: BASE_COLORS.gold }]}>👑 Emerald</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeDot} onPress={() => handleSelectTheme('velvet')}>
          <Text style={[styles.themeDotText, { color: BASE_COLORS.gold }]}>👑 Velvet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  topToolbar: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  toolBtn: { backgroundColor: BASE_COLORS.obsidianLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toolBtnText: { color: BASE_COLORS.parchment, fontSize: 11, fontWeight: 'bold' },
  readerContent: { flex: 1, paddingHorizontal: 6 },
  bookMainTitle: { color: BASE_COLORS.gold, fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  bookSubAuthor: { color: BASE_COLORS.textMuted, fontSize: 12, textAlign: 'center', marginBottom: 14 },
  chapterTitle: { color: BASE_COLORS.gold, fontSize: 13, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 12, textAlign: 'center' },
  bookText: { fontSize: 15, lineHeight: 26, fontFamily: 'serif' },
  notesSection: { marginTop: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: BASE_COLORS.obsidianLight },
  notesSectionTitle: { color: BASE_COLORS.gold, fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  noteCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 10, borderRadius: 8, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: BASE_COLORS.terracotta },
  noteTimestamp: { color: BASE_COLORS.gold, fontSize: 10, fontWeight: 'bold' },
  noteText: { color: BASE_COLORS.parchment, fontSize: 12, marginTop: 2 },
  inputBar: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  textInput: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, color: BASE_COLORS.parchment, padding: 10, borderRadius: 8, fontSize: 12 },
  micBtn: { backgroundColor: BASE_COLORS.gold, paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  micBtnText: { color: BASE_COLORS.obsidian, fontWeight: 'bold', fontSize: 11 },
  themeSelector: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: BASE_COLORS.obsidianLight, paddingVertical: 8, borderRadius: 10 },
  themeDot: { paddingHorizontal: 8, paddingVertical: 4 },
  themeDotText: { color: BASE_COLORS.parchment, fontSize: 10, fontWeight: 'bold' },
});
