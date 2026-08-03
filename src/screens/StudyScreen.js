import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const QUESTION_BANK = {
  UTME: [
    {
      id: 101,
      question: "Select the word nearest in meaning to 'EPHEMERAL':",
      options: ["A) Permanent", "B) Transient", "C) Gigantic", "D) Mysterious"],
      correctIndex: 1,
      explanation: "'Ephemeral' means lasting for a very short time (transient)."
    },
    {
      id: 102,
      question: "In 'The Great Gatsby', where does Jay Gatsby live?",
      options: ["A) East Egg", "B) West Egg", "C) Manhattan", "D) Valley of Ashes"],
      correctIndex: 1,
      explanation: "Gatsby lives in a lavish mansion in West Egg, representing new money."
    }
  ],
  WAEC: [
    {
      id: 201,
      question: "Which literary device is used in 'The wind whispered through the trees'?",
      options: ["A) Metaphor", "B) Simile", "C) Personification", "D) Hyperbole"],
      correctIndex: 2,
      explanation: "Giving human qualities (whispering) to non-human elements (wind) is personification."
    },
    {
      id: 202,
      question: "In Shakespeare's 'Julius Caesar', who delivers the funeral speech starting 'Friends, Romans, countrymen'?",
      options: ["A) Brutus", "B) Mark Antony", "C) Cassius", "D) Octavius"],
      correctIndex: 1,
      explanation: "Mark Antony delivers this famous speech to sway the crowd against the conspirators."
    }
  ]
};

export default function StudyScreen({ user, setUser }) {
  const [examCategory, setExamCategory] = useState('UTME');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestions = QUESTION_BANK[examCategory];
  const currentQ = currentQuestions[currentIndex];

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setShowExplanation(true);
    if (index === currentQ.correctIndex) {
      setScore(score + 1);
    }
  };

  const switchExamMode = (mode) => {
    setExamCategory(mode);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setShowExplanation(false);
    } else {
      const xpEarned = score * 50;
      setUser({ ...user, xp: user.xp + xpEarned });
      Alert.alert(
        "Exam Completed!",
        `Mode: ${examCategory}\nScore: ${score}/${currentQuestions.length}\nXP Earned: +${xpEarned} XP`
      );
      setCurrentIndex(0);
      setSelectedIndex(null);
      setScore(0);
      setShowExplanation(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🧪 AI Practice Exam Prep</Text>

      {/* Mode Switcher */}
      <View style={styles.modeRow}>
        <TouchableOpacity 
          style={[styles.modeTab, examCategory === 'UTME' && styles.activeModeTab]}
          onPress={() => switchExamMode('UTME')}
        >
          <Text style={[styles.modeTabText, examCategory === 'UTME' && styles.activeModeText]}>UTME Prep</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, examCategory === 'WAEC' && styles.activeModeTab]}
          onPress={() => switchExamMode('WAEC')}
        >
          <Text style={[styles.modeTabText, examCategory === 'WAEC' && styles.activeModeText]}>WAEC Prep</Text>
        </TouchableOpacity>
      </View>
      
      {/* Question Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.progressText}>Question {currentIndex + 1} of {currentQuestions.length}</Text>
          <Text style={styles.scoreBadge}>Current Score: {score}</Text>
        </View>

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
            <Text style={styles.explanationTitle}>💡 AI Tutor Analysis:</Text>
            <Text style={styles.explanationBody}>{currentQ.explanation}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>
                {currentIndex + 1 === currentQuestions.length ? 'Finish & Save Score 🏆' : 'Next Question ➡'}
              </Text>
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
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  modeTab: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, padding: 10, borderRadius: 8, alignItems: 'center' },
  activeModeTab: { backgroundColor: BASE_COLORS.terracotta },
  modeTabText: { color: BASE_COLORS.textMuted, fontSize: 12, fontWeight: 'bold' },
  activeModeText: { color: BASE_COLORS.parchment },
  card: { backgroundColor: BASE_COLORS.obsidianLight, padding: 16, borderRadius: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressText: { color: BASE_COLORS.terracotta, fontSize: 12, fontWeight: 'bold' },
  scoreBadge: { color: BASE_COLORS.gold, fontSize: 12, fontWeight: 'bold' },
  questionText: { color: BASE_COLORS.parchment, fontSize: 15, fontWeight: '600', marginBottom: 16 },
  optionBtn: { backgroundColor: BASE_COLORS.obsidian, padding: 12, borderRadius: 8, marginBottom: 8 },
  correctBtn: { backgroundColor: BASE_COLORS.sageGreen },
  wrongBtn: { backgroundColor: BASE_COLORS.terracotta },
  optionText: { color: BASE_COLORS.parchment, fontSize: 13 },
  explanationBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3A3940' },
  explanationTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 12 },
  explanationBody: { color: BASE_COLORS.parchment, fontSize: 12, marginTop: 4 },
  nextBtn: { backgroundColor: BASE_COLORS.terracotta, padding: 10, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  nextBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
});
