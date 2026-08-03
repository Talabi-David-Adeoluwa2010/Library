import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "Select the word nearest in meaning to 'EPHEMERAL':",
    options: ["A) Permanent", "B) Transient", "C) Gigantic", "D) Mysterious"],
    correctIndex: 1,
    explanation: "'Ephemeral' means lasting for a very short time (transient)."
  },
  {
    id: 2,
    question: "In 'The Great Gatsby', where does Jay Gatsby live?",
    options: ["A) East Egg", "B) West Egg", "C) Manhattan", "D) Valley of Ashes"],
    correctIndex: 1,
    explanation: "Gatsby lives in a mansion in West Egg, representing new money."
  }
];

export default function StudyScreen({ user, setUser }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = SAMPLE_QUESTIONS[currentIndex];

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setShowExplanation(true);
    if (index === currentQ.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < SAMPLE_QUESTIONS.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setShowExplanation(false);
    } else {
      const xpEarned = score * 50;
      setUser({ ...user, xp: user.xp + xpEarned });
      Alert.alert("Quiz Completed!", `You scored ${score}/${SAMPLE_QUESTIONS.length} and earned +${xpEarned} XP!`);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setScore(0);
      setShowExplanation(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧪 AI Practice Exam</Text>
      
      <View style={styles.card}>
        <Text style={styles.progressText}>Question {currentIndex + 1} of {SAMPLE_QUESTIONS.length}</Text>
        <Text style={styles.questionText}>{currentQ.question}</Text>

        {currentQ.options.map((opt, i) => {
          let btnStyle = styles.optionBtn;
          if (selectedIndex !== null) {
            if (i === currentQ.correctIndex) btnStyle = [styles.optionBtn, styles.correctBtn];
            else if (i === selectedIndex) btnStyle = [styles.optionBtn, styles.wrongBtn];
          }

          return (
            <TouchableOpacity 
              key={i} 
              style={btnStyle} 
              onPress={() => handleSelect(i)}
              disabled={selectedIndex !== null}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {showExplanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>💡 Explanation:</Text>
            <Text style={styles.explanationBody}>{currentQ.explanation}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next Question ➡</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { color: BASE_COLORS.parchment, fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: BASE_COLORS.obsidianLight, padding: 16, borderRadius: 12 },
  progressText: { color: BASE_COLORS.terracotta, fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  questionText: { color: BASE_COLORS.parchment, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  optionBtn: { backgroundColor: BASE_COLORS.obsidian, padding: 12, borderRadius: 8, marginBottom: 8 },
  correctBtn: { backgroundColor: BASE_COLORS.sageGreen },
  wrongBtn: { backgroundColor: BASE_COLORS.terracotta },
  optionText: { color: BASE_COLORS.parchment, fontSize: 13 },
  explanationBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3A3940' },
  explanationTitle: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  explanationBody: { color: BASE_COLORS.textMuted, fontSize: 12, marginTop: 4 },
  nextBtn: { backgroundColor: BASE_COLORS.terracotta, padding: 10, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  nextBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
});
