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
  Alert,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BASE_COLORS } from './src/constants/colors';
import { chatWithCharacter } from './src/services/aiService';

let leaveStudyChannel = async () => {};
if (Platform.OS !== 'web') {
  try {
    const agoraService = require('./src/services/agoraService');
    leaveStudyChannel = agoraService.leaveStudyChannel;
  } catch (e) {}
}

import LoadingScreen from './src/screens/LoadingScreen'; // Added Loading Screen Import
import AuthScreen from './src/screens/AuthScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import StudyScreen from './src/screens/StudyScreen';
import SocialScreen from './src/screens/SocialScreen';
import BazaarScreen from './src/screens/BazaarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import TournamentScreen from './src/screens/TournamentScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import LoungeScreen from './src/screens/LoungeScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Explore');
  const [nightMode, setNightMode] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [user, setUser] = useState({
    username: '@BookWorm_Sam',
    tier: 'Scholar Tier',
    xp: 650,
    streak: 6,
    rank: 'Bibliophile',
    status: '🟢 Online',
    avatar: 'https://picsum.photos/seed/user_sam/200/200',
  });

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Jay Gatsby', text: 'Welcome to the grand archives, old sport. What knowledge do you seek?' },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSendCharacterMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userMsg = chatInput;
    setChatInput('');

    const updatedHistory = [...chatHistory, { sender: 'You', text: userMsg }];
    setChatHistory(updatedHistory);
    setIsAiLoading(true);

    const aiReply = await chatWithCharacter('Jay Gatsby', userMsg);
    setChatHistory([...updatedHistory, { sender: 'Jay Gatsby', text: aiReply }]);
    setIsAiLoading(false);
  };

  const handleAddFriend = (friendHandle) => {
    Alert.alert('Friend Added!', `Successfully added ${friendHandle} to your network.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // 1. Show the Loading Screen first
  if (isLoading) {
    return <LoadingScreen onFinishLoading={() => setIsLoading(false)} />;
  }

  // 2. Show the Auth Screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 3. Show the Main App
  return (
    <SafeAreaView style={[styles.container, nightMode && { backgroundColor: '#121115' }]}>
      <StatusBar barStyle="light-content" backgroundColor={BASE_COLORS.obsidian} />

      {/* Top App Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => setShowQrModal(true)}>
          <Text style={styles.logoText}>PARCHMENT & OBSIDIAN</Text>
          <Text style={styles.userTag}>
            {user.username} • <Text style={{ color: BASE_COLORS.gold }}>{user.tier}</Text>
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowScannerModal(true)}>
            <Text style={{ fontSize: 11, color: BASE_COLORS.parchment }}>📷 Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowQrModal(true)}>
            <Text style={{ fontSize: 11, color: BASE_COLORS.parchment }}>🪪 Passport</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutHeaderBtn} onPress={handleLogout}>
            <Text style={{ fontSize: 11, color: BASE_COLORS.parchment, fontWeight: 'bold' }}>🚪 Exit</Text>
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
          <TouchableOpacity
            style={styles.callEndBtn}
            onPress={async () => {
              await leaveStudyChannel();
              setActiveCall(null);
            }}
          >
            <Text style={{ color: BASE_COLORS.parchment, fontSize: 11, fontWeight: 'bold' }}>End</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content Router */}
      <View style={styles.body}>
        {activeTab === 'Explore' && (
          <ExploreScreen
            onSelectBook={(book) => {
              setSelectedBook(book);
              setActiveTab('Reader');
            }}
          />
        )}
        {activeTab === 'Reader' && (
          <ReaderScreen
            user={user}
            nightMode={nightMode}
            setNightMode={setNightMode}
            selectedBook={selectedBook}
            openCharacterChat={() => setShowCharacterModal(true)}
          />
        )}
        {activeTab === 'Study' && <StudyScreen user={user} setUser={setUser} />}
        {activeTab === 'Analytics' && <AnalyticsScreen user={user} />}
        {activeTab === 'Arena' && <TournamentScreen user={user} onStartMatch={() => setActiveTab('Study')} />}
        {activeTab === 'Deck' && <FlashcardScreen />}
        {activeTab === 'Lounge' && <LoungeScreen />}
        {activeTab === 'Social' && <SocialScreen user={user} setUser={setUser} setActiveCall={setActiveCall} />}
        {activeTab === 'Bazaar' && <BazaarScreen user={user} setUser={setUser} />}
        {activeTab === 'Profile' && (
          <ProfileScreen
            user={user}
            openQr={() => setShowQrModal(true)}
            onLogout={handleLogout}
          />
        )}
      </View>

      {/* Modals (Scanner, Passport, AI Companion) */}
      <Modal visible={showScannerModal} animationType="slide">
        <ScannerScreen onClose={() => setShowScannerModal(false)} onAddFriend={handleAddFriend} />
      </Modal>

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
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowQrModal(false)}>
              <Text style={{ color: BASE_COLORS.parchment, fontWeight: 'bold' }}>Close Passport</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCharacterModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.characterModalCard}>
            <Text style={styles.qrModalTitle}>🎭 AI Character Companion</Text>
            <Text style={{ color: BASE_COLORS.textMuted, fontSize: 12, marginBottom: 10 }}>Talking with Jay Gatsby</Text>
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
          { key: 'Explore', icon: '🔍', label: 'Explore' },
          { key: 'Reader', icon: '📖', label: 'Reader' },
          { key: 'Study', icon: '🧪', label: 'Study' },
          { key: 'Analytics', icon: '📊', label: 'Stats' },
          { key: 'Arena', icon: '⚔️', label: 'Arena' },
          { key: 'Deck', icon: '🧠', label: 'Deck' },
          { key: 'Lounge', icon: '👥', label: 'Lounge' },
          { key: 'Social', icon: '💬', label: 'Social' },
          { key: 'Bazaar', icon: '🛍️', label: 'Bazaar' },
          { key: 'Profile', icon: '🏅', label: 'Profile' },
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BASE_COLORS.obsidian },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: BASE_COLORS.obsidianLight },
  logoText: { color: BASE_COLORS.parchment, fontWeight: 'bold', fontSize: 12 },
  userTag: { color: BASE_COLORS.textMuted, fontSize: 10, marginTop: 2 },
  headerBtn: { backgroundColor: BASE_COLORS.obsidianLight, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  logoutHeaderBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  statsBadge: { backgroundColor: BASE_COLORS.obsidianLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statsText: { color: BASE_COLORS.parchment, fontSize: 11, fontWeight: 'bold' },
  body: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: BASE_COLORS.obsidianLight, borderTopWidth: 1, borderTopColor: '#25242A', paddingVertical: 6 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  activeTabItem: { borderBottomWidth: 2, borderBottomColor: BASE_COLORS.terracotta },
  tabText: { color: BASE_COLORS.textMuted, fontSize: 7, fontWeight: '600' },
  activeTabText: { color: BASE_COLORS.terracotta },
  floatingCallBar: { backgroundColor: BASE_COLORS.terracotta, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  callEndBtn: { backgroundColor: BASE_COLORS.obsidian, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  qrModalCard: { backgroundColor: BASE_COLORS.obsidianLight, padding: 24, borderRadius: 16, alignItems: 'center', width: '80%' },
  qrModalTitle: { color: BASE_COLORS.gold, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  qrCanvas: { backgroundColor: BASE_COLORS.parchment, padding: 16, borderRadius: 12 },
  closeModalBtn: { backgroundColor: BASE_COLORS.terracotta, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 16 },
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
