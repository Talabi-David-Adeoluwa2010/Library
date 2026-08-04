import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Note: firebase/analytics relies on window/web tracking and often fails in React Native/Expo native builds. 
// It is recommended to use getReactNativePersistence or handle analytics conditionally if needed.

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAL3o-7LXffBESIYHMio6RGPkEy1k7DUK8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "parchmentobsidian-b27c8.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "parchmentobsidian-b27c8",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "parchmentobsidian-b27c8.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "936507159882",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:936507159882:web:a537faf9e532ff28c33db3",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-69HV8SS2F0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
