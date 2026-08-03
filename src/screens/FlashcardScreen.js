import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const MOCK_DECK = [
  { id: '1', front: 'What is the primary symbol of Gatsby\'s unfulfilled hopes?', back: 'The green light at the end of Daisy\'s dock.' },
  { id: '2', front: 'Define Socratic Irony.', back: 'A pose of ignorance assumed to entice others into making statements that can then be challenged.' },
  { id: '3', front: 'Who wrote "Things Fall Apart"?', back: 'Chinua Achebe (published in 1958).' },
];

export default function FlashcardScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = MOCK_DECK[currentIndex];

  const handleNext = (quality) => {
    // Quality rating: 1 = Hard (Spaced Repetition short delay), 3 = Easy (Long delay)
    setFlipped(false);
    if (currentIndex < MOCK_DECK.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🧠 AI Spaced-Repetition Deck</Text>
      <Text style={styles.cardCounter}>Card {currentIndex + 1} of {MOCK_DECK.length}</Text>

      {/* Interactive Card */}
      <TouchableOpacity style={styles.flashcard} onPress={() => setFlipped(!flipped)}>
        <Text style={styles.cardTag}>{flipped ? 'ANSWER' : 'QUESTION (Tap to flip)'}</Text>
        <Text style={styles.cardText}>{flipped ? card.back : card.front}</Text>
      </TouchableOpacity>

      {/* Spaced-Repetition Difficulty Selectors */}
      {flipped && (
        <View style={styles.ratingRow}>
          <TouchableOpacity style={[styles.rateBtn, { backgroundColor: '#D9534F' }]} onPress={() => handleNext(1)}>
            <Text style={styles.rateText}>Again (1d)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rateBtn, { backgroundColor: '#F0AD4E' }]} onPress={() => handleNext(2)}>
            <Text style={styles.rateText}>Good (3d)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rateBtn, { backgroundColor: BASE_COLORS.sageGreen }]} onPress={() => handleNext(3)}>
            <Text style={styles.rateText}>Easy (7d)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: BASE_COLORS.gold, fontSize: 16, fontWeight: 'bold' },
  cardCounter: { color: BASE_COLORS.textMuted, fontSize: 12, marginBottom: 20 },
  flashcard: { backgroundColor: BASE_COLORS.obsidianLight, width: '100%', height: 240, borderRadius: 16, padding: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BASE_COLORS.terracotta },
  cardTag: { color: BASE_COLORS.gold, fontSize: 10, fontWeight: 'bold', position: 'absolute', top: 16 },
  cardText: { color: BASE_COLORS.parchment, fontSize: 16, textAlign: 'center', fontWeight: '500' },
  ratingRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  rateBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  rateText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
});
