/**
 * @file firebase.ts
 * Firebase initialization and Google Authentication provider configuration.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google OAuth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

/**
 * Sign in with Google Popup via Firebase Auth
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Persist / update profile in Firestore
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'CarbonX Trader',
      photoURL: user.photoURL || '',
      lastLoginAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore profile sync note:', err);
  }

  return user;
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.email?.split('@')[0] || 'CarbonX Trader',
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore user doc create note:', err);
  }
  return user;
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      lastLoginAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore update last login note:', err);
  }
  return user;
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

