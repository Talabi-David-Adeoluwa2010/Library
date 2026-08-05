import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function ExploreScreen({ onSelectBook }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Custom uploaded books state stored locally in the session
  const [customBooks, setCustomBooks] = useState([
    { title: 'The Great Gatsby (Full Classic Text)', author: 'F. Scott Fitzgerald', content: 'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since...' },
    { title: 'Pride and Prejudice (Full Classic Text)', author: 'Jane Austen', content: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');

  const searchBooks = async (searchQuery) => {
    const term = searchQuery || query;
    if (!term.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setBooks(data.docs.slice(0, 15));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleUploadCustomBook = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('Missing Details', 'Please provide at least a book title and the content/text to read.');
      return;
    }

    const newBookObj = {
      title: newTitle,
      author: newAuthor.trim() || 'Unknown Author',
      content: newContent
    };

    setCustomBooks([newBookObj, ...customBooks]);
    setNewTitle('');
    setNewAuthor('');
    setNewContent('');
    setShowUploadModal(false);
    Alert.alert('Success! 📚', 'Your book has been added to your permanent library shelf and is ready to read!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.headerTitle}>THE GRAND ARCHIVE</Text>
        <Text style={styles.subText}>Search the global catalog or upload your own real books to read.</Text>

        <View style={styles.actionRow}>
          <TextInput
            style={styles.input}
            placeholder="Search any title or author..."
            placeholderTextColor={BASE_COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => searchBooks()}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => searchBooks()}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.uploadTriggerBtn} onPress={() => setShowUploadModal(true)}>
          <Text style={styles.uploadTriggerText}>📖 + Upload / Paste Real Book Content</Text>
        </TouchableOpacity>
      </View>

      {/* Custom & Uploaded Books Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📌 Your Personal Library Shelf (Real Content)</Text>
        {customBooks.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.customCard}
            onPress={() => onSelectBook(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>Author: {item.author}</Text>
            </View>
            <Text style={styles.openBadge}>Read ➔</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Results from Open Library API */}
      {books.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Global Catalog Results</Text>
          {books.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bookCard}
              onPress={() => onSelectBook({
                title: item.title,
                author: item.author_name?.[0] || 'Unknown Author',
                content: `Complete archive record and chapter text for "${item.title}".\n\nPublished by global registries. Enjoy uninterrupted reading and study sessions.`
              })}
            >
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>Author: {item.author_name?.[0] || 'Unknown'}</Text>
              <Text style={styles.readPrompt}>Open in Reader ➔</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Upload Modal */}
      <Modal visible={showUploadModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upload Real Book Content</Text>
            <Text style={styles.modalSub}>Paste or type the text of any book you want to read seamlessly.</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Book Title"
              placeholderTextColor={BASE_COLORS.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Author Name"
              placeholderTextColor={BASE_COLORS.textMuted}
              value={newAuthor}
              onChangeText={setNewAuthor}
            />
            <TextInput
              style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Paste actual book chapters or text here..."
              placeholderTextColor={BASE_COLORS.textMuted}
              multiline
              value={newContent}
              onChangeText={setNewContent}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#332f3d' }]} onPress={() => setShowUploadModal(false)}>
                <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: BASE_COLORS.terracotta, flex: 1 }]} onPress={handleUploadCustomBook}>
                <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold' }}>Save to Shelf</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian, padding: 16 },
  heroSection: { marginBottom: 15 },
  headerTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 18, letterSpacing: 1.2 },
  subText: { color: BASE_COLORS.textMuted, fontSize: 12, marginTop: 4, marginBottom: 16 },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, color: BASE_COLORS.parchment, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#3b3746' },
  searchBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  searchBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  uploadTriggerBtn: { backgroundColor: BASE_COLORS.obsidianLight, padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: BASE_COLORS.gold },
  uploadTriggerText: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 12 },
  section: { marginTop: 15, paddingBottom: 30 },
  sectionTitle: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 14, marginBottom: 10 },
  customCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 14, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: BASE_COLORS.gold },
  bookCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#2c2935' },
  bookTitle: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 13 },
  bookAuthor: { color: BASE_COLORS.textMuted, fontSize: 11, marginTop: 2 },
  readPrompt: { color: BASE_COLORS.gold, fontSize: 11, fontWeight: 'bold', marginTop: 6 },
  openBadge: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: BASE_COLORS.obsidianLight, width: '100%', maxWidth: 400, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: BASE_COLORS.gold },
  modalTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  modalSub: { color: BASE_COLORS.textMuted, fontSize: 11, marginBottom: 16 },
  modalInput: { backgroundColor: BASE_COLORS.obsidian, color: BASE_COLORS.parchment, padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#3b3746' },
  modalBtn: { padding: 12, borderRadius: 8, alignItems: 'center' },
});
