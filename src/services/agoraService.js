import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';

const AGORA_APP_ID = process.env.EXPO_PUBLIC_AGORA_APP_ID;

let agoraEngine = null;

export const initAgora = async () => {
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
  const engine = await initAgora();
  
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
  if (agoraEngine) {
    agoraEngine.leaveChannel();
  }
};
