import { Platform } from 'react-native';

let createAgoraRtcEngine = null;
let ChannelProfileType = null;
let ClientRoleType = null;

// Only import native Agora bindings when running on iOS or Android
if (Platform.OS !== 'web') {
  try {
    const AgoraModule = require('react-native-agora');
    createAgoraRtcEngine = AgoraModule.createAgoraRtcEngine;
    ChannelProfileType = AgoraModule.ChannelProfileType;
    ClientRoleType = AgoraModule.ClientRoleType;
  } catch (e) {
    console.warn('react-native-agora is not available on this platform.');
  }
}

const AGORA_APP_ID = process.env.EXPO_PUBLIC_AGORA_APP_ID;
let agoraEngine = null;

export const initAgora = async () => {
  if (Platform.OS === 'web' || !createAgoraRtcEngine) return null;
  if (agoraEngine) return agoraEngine;

  try {
    agoraEngine = createAgoraRtcEngine();
    agoraEngine.initialize({ appId: AGORA_APP_ID });
    
    // Set profile for interactive communication
    agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
    return agoraEngine;
  } catch (e) {
    console.error('Failed to initialize Agora RTC engine:', e);
  }
};

export const joinStudyChannel = async (channelName, uid = 0, isVideo = false) => {
  if (Platform.OS === 'web') return;
  const engine = await initAgora();
  if (!engine) return;
  
  if (isVideo) {
    agoraEngine.enableVideo();
    agoraEngine.startPreview();
  } else {
    agoraEngine.enableAudio();
  }

  agoraEngine.joinChannel('', channelName, uid, {
    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
  });
};

export const leaveStudyChannel = async () => {
  if (Platform.OS === 'web') return;
  if (agoraEngine) {
    agoraEngine.leaveChannel();
  }
};
