import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAL3o-7LXffBESIYHMio6RGPkEy1k7DUK8",
  authDomain: "parchmentobsidian-b27c8.firebaseapp.com",
  projectId: "parchmentobsidian-b27c8",
  storageBucket: "parchmentobsidian-b27c8.firebasestorage.app",
  messagingSenderId: "936507159882",
  appId: "1:936507159882:web:a537faf9e532ff28c33db3",
  measurementId: "G-69HV8SS2F0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
