/**
 * @file AuthContext.tsx
 * Authentication context managing Firebase Google Auth, Email Auth, Guest Demo Mode,
 * profile synchronization, and integration with Web3 wallet personas.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  auth, 
  db, 
  signInWithGoogle as firebaseGoogleSignIn, 
  signInWithEmail as firebaseEmailSignIn,
  signUpWithEmail as firebaseEmailSignUp,
  signOutUser 
} from '../firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN';
  walletAddress?: string;
  isDemo?: boolean;
  createdAt?: number;
  lastLoginAt?: number;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  authError: string | null;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, name?: string, role?: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN') => Promise<User | null>;
  signInAsDemoUser: (personaRole?: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN') => void;
  signOut: () => Promise<void>;
  updateUserRole: (role: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN') => Promise<void>;
  linkWallet: (walletAddress: string) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'carbonx_demo_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync profile from Firestore
  const fetchUserProfile = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Carbon Trader',
          photoURL: user.photoURL,
          role: 'BUYER',
          createdAt: Date.now(),
          lastLoginAt: Date.now()
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not fetch/create Firestore user profile:', err);
      // Fallback local state if Firestore rules/network are restricted
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Carbon Trader',
        photoURL: user.photoURL,
        role: 'BUYER'
      });
    }
  };

  useEffect(() => {
    // Check if there is an existing demo session in sessionStorage
    const savedDemo = sessionStorage.getItem(DEMO_STORAGE_KEY);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        sessionStorage.removeItem(DEMO_STORAGE_KEY);
        setCurrentUser(user);
        await fetchUserProfile(user);
      } else if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo) as UserProfile;
          setUserProfile(parsed);
        } catch {
          sessionStorage.removeItem(DEMO_STORAGE_KEY);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const user = await firebaseGoogleSignIn();
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      setCurrentUser(user);
      await fetchUserProfile(user);
      return user;
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      let errorMsg = 'Failed to sign in with Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in cancelled: The Google sign-in popup was closed.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Only one popup request allowed at a time.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = 'Domain not authorized in Firebase Console yet. Please use Fast Demo or Email/Password login to explore instantly!';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const user = await firebaseEmailSignIn(email, pass);
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      setCurrentUser(user);
      await fetchUserProfile(user);
      return user;
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      let errorMsg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name?: string, 
    role: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN' = 'BUYER'
  ): Promise<User | null> => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const user = await firebaseEmailSignUp(email, pass, name);
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      setCurrentUser(user);
      
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: name || email.split('@')[0] || 'Carbon Trader',
        photoURL: null,
        role: role,
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      };
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, newProfile);
      } catch (e) {
        console.warn('Firestore profile write note:', e);
      }

      setUserProfile(newProfile);
      return user;
    } catch (err: any) {
      console.error('Email Sign Up Error:', err);
      let errorMsg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      return null;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signInAsDemoUser = (personaRole: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN' = 'BUYER') => {
    const demoProfile: UserProfile = {
      uid: `demo_${Date.now()}`,
      email: `${personaRole.toLowerCase()}.demo@carbonx.protocol`,
      displayName: `Demo ${personaRole.charAt(0) + personaRole.slice(1).toLowerCase()} Persona`,
      photoURL: null,
      role: personaRole,
      isDemo: true,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoProfile));
    setUserProfile(demoProfile);
    setAuthError(null);
  };

  const signOut = async (): Promise<void> => {
    setIsAuthLoading(true);
    try {
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.warn('Sign out note:', err);
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const updateUserRole = async (role: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN'): Promise<void> => {
    if (userProfile?.isDemo) {
      const updated = { ...userProfile, role };
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
      setUserProfile(updated);
      return;
    }
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { role }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, role } : null);
    } catch (err) {
      console.warn('Failed to update role in Firestore:', err);
      setUserProfile(prev => prev ? { ...prev, role } : null);
    }
  };

  const linkWallet = async (walletAddress: string): Promise<void> => {
    if (userProfile?.isDemo) {
      const updated = { ...userProfile, walletAddress };
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
      setUserProfile(updated);
      return;
    }
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { walletAddress }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, walletAddress } : null);
    } catch (err) {
      console.warn('Failed to link wallet in Firestore:', err);
      setUserProfile(prev => prev ? { ...prev, walletAddress } : null);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const isAuthenticated = Boolean(currentUser || userProfile);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAuthLoading,
        authError,
        isAuthenticated,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemoUser,
        signOut,
        updateUserRole,
        linkWallet,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

