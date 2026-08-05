import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function ExploreScreen({ onSelectBook }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setBooks(data.docs.slice(0, 20)); // Top 20 results worldwide
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>GLOBAL CATALOG & ARCHIVE</Text>
      <Text style={styles.subText}>Access millions of books and global information instantly.</Text>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search any title, author, or subject..."
          placeholderTextColor={BASE_COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchBooks}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchBooks}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BASE_COLORS.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookCard}
              onPress={() => onSelectBook({ title: item.title, author: item.author_name?.[0] || 'Unknown Author' })}
            >
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>Author: {item.author_name?.[0] || 'Unknown'}</Text>
              <Text style={styles.readPrompt}>Tap to open in Reader ➔</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian, padding: 16 },
  headerTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  subText: { color: BASE_COLORS.textMuted, fontSize: 12, marginBottom: 16 },
  searchBar: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, color: BASE_COLORS.parchment, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#3b3746' },
  searchBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  searchBtnText: { color: BASE_ONS_PARCHMENT = BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  bookCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#2c2935' },
  bookTitle: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 14 },
  bookAuthor: { color: BASE_COLORS.textMuted, fontSize: 12, marginTop: 4 },
  readPrompt: { color: BASE_COLORS.gold, fontSize: 11, fontWeight: 'bold', marginTop: 8 },
});
