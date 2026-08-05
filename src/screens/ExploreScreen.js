import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

export default function ExploreScreen({ onSelectBook }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState([
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { title: 'Pride and Prejudice', author: 'Jane Austen' },
    { title: '1984', author: 'George Orwell' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { title: 'The Art of War', author: 'Sun Tzu' },
  ]);

  const searchBooks = async (searchQuery) => {
    const term = searchQuery || query;
    if (!term.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(term)}`);
      const data = await response.json();
      setBooks(data.docs.slice(0, 20));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.headerTitle}>THE GRAND ARCHIVE</Text>
        <Text style={styles.subText}>Discover millions of books, manuscripts, and global knowledge.</Text>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Search any title, author, or subject..."
            placeholderTextColor={BASE_COLORS.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => searchBooks()}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => searchBooks()}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={BASE_COLORS.gold} style={{ marginTop: 30 }} />
      ) : books.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          {books.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bookCard}
              onPress={() => onSelectBook({ title: item.title, author: item.author_name?.[0] || 'Unknown Author' })}
            >
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>Author: {item.author_name?.[0] || 'Unknown'}</Text>
              <Text style={styles.readPrompt}>Tap to open in Reader ➔</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Trending & Recommended Classics</Text>
          <Text style={styles.sectionSub}>Tap any book to instantly open it up in your reader workspace.</Text>
          
          {trending.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trendingCard}
              onPress={() => onSelectBook(item)}
            >
              <View>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>
              </View>
              <Text style={styles.openBadge}>Open ➔</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian, padding: 16 },
  heroSection: { marginBottom: 20 },
  headerTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 18, letterSpacing: 1.2 },
  subText: { color: BASE_COLORS.textMuted, fontSize: 12, marginTop: 4, marginBottom: 16 },
  searchBar: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, color: BASE_COLORS.parchment, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#3b3746' },
  searchBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  searchBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  section: { marginTop: 10, paddingBottom: 40 },
  sectionTitle: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  sectionSub: { color: BASE_COLORS.textMuted, fontSize: 11, marginBottom: 12 },
  bookCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#2c2935' },
  trendingCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2c2935' },
  bookTitle: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 14 },
  bookAuthor: { color: BASE_COLORS.textMuted, fontSize: 12, marginTop: 4 },
  readPrompt: { color: BASE_COLORS.gold, fontSize: 11, fontWeight: 'bold', marginTop: 8 },
  openBadge: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 12 },
});
