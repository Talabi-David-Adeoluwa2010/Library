import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const BAZAAR_ITEMS = [
  { id: '1', title: '🔥 Streak Freeze Ticket', cost: 200, desc: 'Protects your reading streak for 1 missed day.' },
  { id: '2', title: '📜 Sepia Classic Reader Theme', cost: 350, desc: 'Unlocks rich warm vintage paper background.' },
  { id: '3', title: '👑 Scholar Crown Badge', cost: 800, desc: 'Displays a golden crown beside your avatar.' },
  { id: '4', title: '🧪 Double XP Booster (24h)', cost: 500, desc: 'Earn 2x XP points on all practice quizzes.' },
];

export default function BazaarScreen({ user, setUser }) {
  const buyItem = (item) => {
    if (user.xp < item.cost) {
      Alert.alert("Insufficient XP", `You need ${item.cost - user.xp} more XP to purchase this!`);
      return;
    }
    setUser({ ...user, xp: user.xp - item.cost });
    Alert.alert("Item Unlocked!", `You successfully purchased: ${item.title}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛍️ XP Scholar Bazaar</Text>
      <Text style={styles.subHeader}>Your XP Balance: ✨ {user.xp} XP</Text>

      <FlatList
        data={BAZAAR_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
            <TouchableOpacity style={styles.buyBtn} onPress={() => buyItem(item)}>
              <Text style={styles.buyBtnText}>✨ {item.cost}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { color: BASE_COLORS.parchment, fontSize: 18, fontWeight: 'bold' },
  subHeader: { color: BASE_COLORS.gold, fontSize: 13, marginBottom: 16, fontWeight: 'bold' },
  card: { backgroundColor: BASE_COLORS.obsidianLight, padding: 14, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  itemTitle: { color: BASE_COLORS.parchment, fontSize: 14, fontWeight: 'bold' },
  itemDesc: { color: BASE_COLORS.textMuted, fontSize: 11, marginTop: 2 },
  buyBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  buyBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
});
