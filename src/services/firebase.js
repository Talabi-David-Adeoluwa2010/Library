import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

// Replace these values with your Firebase Console Project Settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 1. Register New User & Create Cloud Profile
export const registerUser = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userProfile = {
    uid: user.uid,
    username: username || `@${email.split('@')[0]}`,
    email: email,
    xp: 100,
    streak: 1,
    rank: 'Novice Scholar',
    tier: 'Free',
    avatar: 'https://picsum.photos/seed/user_sam/200/200',
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, "users", user.uid), userProfile);
  return userProfile;
};

// 2. User Sign In
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  return userDoc.data();
};

// 3. Sync User XP & Streaks to Cloud Database
export const syncUserXP = async (uid, newXp) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { xp: newXp });
};

// 4. Sign Out
export const logoutUser = () => signOut(auth);
