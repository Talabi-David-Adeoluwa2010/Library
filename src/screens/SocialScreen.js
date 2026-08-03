import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { BASE_COLORS } from '../constants/colors';

const SAMPLE_MESSAGES = [
  { id: '1', sender: '@Alex_Reader', text: 'Hey Sam! Have you checked out Chapter 4 yet?', time: '14:15' },
  { id: '2', sender: '@BookWorm_Sam', text: 'Just finished it! Gatsby’s party description is wild.', time: '14:18' },
];

export default function SocialScreen({ user, setActiveCall }) {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: user.username,
      text: inputText,
      time: 'Just now',
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      {/* Social Header & Call Actions */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>💬 Social Lounge</Text>
        <View style={styles.callGroup}>
          <TouchableOpacity 
            style={styles.callBtn} 
            onPress={() => setActiveCall({ type: 'VOICE', targetUser: '@Alex_Reader' })}
          >
            <Text style={styles.callBtnText}>📞 Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.callBtn} 
            onPress={() => setActiveCall({ type: 'VIDEO', targetUser: '@Alex_Reader' })}
          >
            <Text style={styles.callBtnText}>📹 Video</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        renderItem={({ item }) => (
          <View style={styles.chatBubble}>
            <View style={styles.bubbleHeader}>
              <Text style={styles.senderText}>{item.sender}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Message or mention @book..."
          placeholderTextColor={BASE_COLORS.textMuted}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { color: BASE_COLORS.parchment, fontSize: 18, fontWeight: 'bold' },
  callGroup: { flexDirection: 'row', gap: 8 },
  callBtn: { backgroundColor: BASE_COLORS.obsidianLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  callBtnText: { color: BASE_COLORS.parchment, fontSize: 11, fontWeight: 'bold' },
  messageList: { flex: 1, marginBottom: 12 },
  chatBubble: { backgroundColor: BASE_COLORS.obsidianLight, padding: 12, borderRadius: 10, marginBottom: 8 },
  bubbleHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  senderText: { color: BASE_COLORS.gold, fontSize: 12, fontWeight: 'bold' },
  timeText: { color: BASE_COLORS.textMuted, fontSize: 10 },
  messageText: { color: BASE_COLORS.parchment, fontSize: 13 },
  inputContainer: { flexDirection: 'row', gap: 8 },
  textInput: { flex: 1, backgroundColor: BASE_COLORS.obsidianLight, color: BASE_COLORS.parchment, padding: 10, borderRadius: 8 },
  sendBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  sendBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
});
