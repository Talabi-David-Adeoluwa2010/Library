import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Import Constants & Services
import { BASE_COLORS } from './src/constants/colors';
import { chatWithCharacter } from './src/services/aiService';

// Import Screens
import ReaderScreen from './src/screens/ReaderScreen';
import StudyScreen from './src/screens/StudyScreen';
import SocialScreen from './src/screens/SocialScreen';
import BazaarScreen from './src/screens/BazaarScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Reader');
  const [nightMode, setNightMode] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  // User Profile State
  const [user, setUser] = useState({
    username: '@BookWorm_Sam',
    tier: 'Free',
    xp: 650,
    streak: 6,
    rank: 'Scholar',
    status: '🟢 Online',
    avatar: 'https://picsum.photos/seed/user_sam/200/200',
  });

  // AI Character Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Jay Gatsby', text: 'Old sport, what brings you to my library today?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Send message to Gemini API for Jay Gatsby
  const handleSendCharacterMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg = chatInput;
    setChatInput('');

    // Append user message locally first
    const updatedHistory = [...chatHistory, { sender: 'You', text: userMsg }];
    setChatHistory(updatedHistory);
    setIsAiLoading(true);

    // Call Gemini AI service
    const aiReply = await chatWithCharacter('Jay Gatsby', userMsg);

    // Update history with AI response
    setChatHistory([...updatedHistory, { sender: 'Jay Gatsby', text: aiReply }]);
    setIsAiLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, nightMode && { backgroundColor: '#121115' }]}>
      <StatusBar barStyle="light-content" backgroundColor={BASE_COLORS.obsidian} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => setShowQrModal(true)}>
          <Text style={styles.logoText}>PARCHMENT & OBSIDIAN</Text>
          <Text style={styles.userTag}>
            {user.username} • <Text style={{ color: BASE_COLORS.gold }}>{user.rank}</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity style={styles.qrBadgeBtn} onPress={() => setShowQrModal(true)}>
            <Text style={{ fontSize: 12, color: BASE_COLORS.parchment }}>📷 Passport</Text>
          </TouchableOpacity>
          <View style={styles.statsBadge}>
            <Text style={styles.statsText}>🔥 {user.streak}d | ✨ {user.xp} XP</Text>
          </View>
        </View>
      </View>

      {/* Active Call Banner */}
      {activeCall && (
        <View style={styles.floatingCallBar}>
          <Text style={{ color: BASE_COLORS.parchment, fontSize: 12, fontWeight: 'bold' }}>
            {activeCall.type === 'VIDEO' ? '📹' : '📞'} Live Call with {activeCall.targetUser}
          </Text>
          <TouchableOpacity style={styles.callEndBtn} onPress={() => setActiveCall(null)}>
            <Text style={{ color: BASE_COLORS.parchment, fontSize: 11, fontWeight: 'bold' }}>End</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Body Content */}
      <View style={styles.body}>
        {activeTab === 'Reader' && (
          <ReaderScreen 
            nightMode={nightMode} 
            setNightMode={setNightMode} 
            openCharacterChat={() => setShowCharacterModal(true)} 
          />
        )}
        {activeTab === 'Study' && <StudyScreen user={user} setUser={setUser} />}
        {activeTab === 'Social' && <SocialScreen user={user} setUser={setUser} setActiveCall={setActiveCall} />}
        {activeTab === 'Bazaar' && <BazaarScreen user={user} setUser={setUser} />}
        {activeTab === 'Profile' && <ProfileScreen user={user} openQr={() => setShowQrModal(true)} />}
      </View>

      {/* Library Passport / QR Modal */}
      <Modal visible={showQrModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalCard}>
            <Text style={styles.qrModalTitle}>LIBRARY PASSPORT</Text>
            <Text style={{ color: BASE_COLORS.textMuted, fontSize: 12, marginBottom: 16 }}>{user.username}</Text>
            
            <View style={styles.qrCanvas}>
              <QRCode
                value={`https://parchment.app/u/${user.username}`}
                size={160}
                color={BASE_COLORS.obsidian}
                backgroundColor={BASE_COLORS.parchment}
              />
            </View>

            <Text style={{ color: BASE_COLORS.parchment, marginTop: 16, fontWeight: 'bold' }}>Rank: {user.rank}</Text>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowQrModal(false)}>
              <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold' }}>Close Passport</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dynamic AI Character Chat Modal */}
      <Modal visible={showCharacterModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.characterModalCard}>
            <Text style={styles.qrModalTitle}>🎭 AI Character Companion</Text>
            <Text style={{ color: BASE_COLORS.textMuted, fontSize: 12, marginBottom: 12 }}>Talking with Jay Gatsby</Text>

            <ScrollView style={styles.characterChatArea}>
              {chatHistory.map((item, index) => (
                <View key={index} style={[styles.chatBubble, item.sender === 'You' && styles.userChatBubble]}>
                  <Text style={styles.chatSender}>{item.sender}</Text>
                  <Text style={styles.chatText}>{item.text}</Text>
                </View>
              ))}
              {isAiLoading && (
                <View style={{ paddingVertical: 8, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={BASE_COLORS.gold} />
                  <Text style={{ color: BASE_COLORS.textMuted, fontSize: 10, marginTop: 4 }}>Jay Gatsby is thinking...</Text>
                </View>
              )}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.chatInput, { flex: 1 }]}
                placeholder="Ask Jay Gatsby a question..."
                placeholderTextColor={BASE_COLORS.textMuted}
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendCharacterMessage}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendCharacterMessage}>
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.closeModalBtn, { marginTop: 10 }]} onPress={() => setShowCharacterModal(false)}>
              <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold' }}>Exit Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        {[
          { key: 'Reader', icon: '📖', label: 'Reader' },
          { key: 'Study', icon: '🧪', label: 'Study' },
          { key: 'Social', icon: '💬', label: 'Social' },
          { key: 'Bazaar', icon: '🛍️', label: 'Bazaar' },
          { key: 'Profile', icon: '🏅', label: 'Profile' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.activeTabItem]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.icon} {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {nightMode && <View style={styles.eyeCareOverlay} pointerEvents="none" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: BASE_COLORS.obsidianLight },
  logoText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 13 },
  userTag: { color: BASE_COLORS.textMuted, fontSize: 11, marginTop: 2 },
  qrBadgeBtn: { backgroundColor: BASE_COLORS.obsidianLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statsBadge: { backgroundColor: BASE_COLORS.obsidianLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statsText: { color: BASE_COLORS.parchment, fontSize: 12, fontWeight: 'bold' },
  body: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: BASE_COLORS.obsidianLight, borderTopWidth: 1, borderTopColor: '#25242A', paddingVertical: 8 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  activeTabItem: { borderBottomWidth: 2, borderBottomColor: BASE_COLORS.terracotta },
  tabText: { color: BASE_COLORS.textMuted, fontSize: 9, fontWeight: '600' },
  activeTabText: { color: BASE_COLORS.terracotta },
  eyeCareOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: BASE_COLORS.tintOverlay },
  floatingCallBar: { backgroundColor: BASE_COLORS.terracotta, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  callEndBtn: { backgroundColor: BASE_COLORS.obsidian, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  qrModalCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 24, borderRadius: 16, alignItems: 'center', width: '80%' },
  qrModalTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  qrCanvas: { backgroundColor: BASE_COLORS.parchment, padding: 16, borderRadius: 12 },
  closeModalBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  characterModalCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 16, borderRadius: 16, width: '85%', height: 420 },
  characterChatArea: { flex: 1, marginVertical: 12 },
  chatBubble: { backgroundColor: BASE_COLORS.obsidian, padding: 12, borderRadius: 10, marginBottom: 8 },
  userChatBubble: { borderRightWidth: 3, borderRightColor: BASE_COLORS.gold },
  chatSender: { color: BASE_COLORS.gold, fontSize: 11, fontWeight: 'bold' },
  chatText: { color: BASE_COLORS.parchment, fontSize: 13, marginTop: 4 },
  chatInput: { backgroundColor: BASE_COLORS.obsidian, color: BASE_COLORS.parchment, padding: 10, borderRadius: 8 },
  sendBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  sendBtnText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
});
