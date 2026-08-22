/**
 * @file GoogleAuthModal.tsx
 * Modal for Firebase Google Authentication, profile inspection, role assignment,
 * and linking Google credentials with Web3 carbon account holdings.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { 
  X, 
  ShieldCheck, 
  LogOut, 
  User, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Link2,
  ExternalLink,
  Shield
} from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    userProfile, 
    isAuthLoading, 
    authError, 
    signInWithGoogle, 
    signOut, 
    updateUserRole, 
    linkWallet,
    clearAuthError 
  } = useAuth();
  
  const { account } = useWeb3();
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN'>(
    userProfile?.role || 'BUYER'
  );
  const [roleUpdatedSuccess, setRoleUpdatedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    clearAuthError();
    const user = await signInWithGoogle();
    if (user && account.address) {
      await linkWallet(account.address);
    }
  };

  const handleRoleChange = async (role: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN') => {
    setSelectedRole(role);
    await updateUserRole(role);
    setRoleUpdatedSuccess(true);
    setTimeout(() => setRoleUpdatedSuccess(false), 2500);
  };

  const handleLinkCurrentWallet = async () => {
    if (account.address) {
      await linkWallet(account.address);
      setRoleUpdatedSuccess(true);
      setTimeout(() => setRoleUpdatedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white">
                Google Authentication
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Firebase Identity & Access Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
            <button
              onClick={clearAuthError}
              className="text-zinc-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Authenticated State */}
        {(currentUser || userProfile) ? (
          <div className="py-5 space-y-4">
            
            {/* User Profile Card */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3.5">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-12 h-12 rounded-full border-2 border-[#7ED321] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl text-white">
                  <User className="w-6 h-6 text-[#7ED321]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-white text-sm truncate">
                    {currentUser?.displayName || userProfile?.displayName || 'Carbon Trader'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                    {userProfile?.isDemo ? 'Sandbox Demo' : 'Verified'}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-mono truncate flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-zinc-500" />
                  <span className="truncate">{currentUser?.email || userProfile?.email || 'authenticated'}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">
                  UID: {(currentUser?.uid || userProfile?.uid || 'user').slice(0, 16)}...
                </div>
              </div>
            </div>

            {/* Linked Web3 Wallet Status */}
            <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/90 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#7ED321]" />
                <span className="text-zinc-400">Linked Web3 Wallet:</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-200 font-bold">
                  {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </span>
                <span className="ml-1.5 text-[#7ED321] text-[10px]">({account.role})</span>
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="text-xs font-mono uppercase text-zinc-400 block mb-2 font-bold">
                Platform Identity & Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['BUYER', 'DEVELOPER', 'VERIFIER', 'ADMIN'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`p-2.5 rounded-lg border text-left font-mono text-xs transition-all cursor-pointer flex items-center justify-between ${
                      (userProfile?.role || selectedRole) === role
                        ? 'bg-[#7ED321]/15 border-[#7ED321] text-white shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="font-bold">{role}</span>
                    {(userProfile?.role || selectedRole) === role && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7ED321]" />
                    )}
                  </button>
                ))}
              </div>
              {roleUpdatedSuccess && (
                <p className="text-[11px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Profile updated in Firestore database
                </p>
              )}
            </div>

            {/* Sign Out Button */}
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              disabled={isAuthLoading}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-800 text-zinc-300 hover:text-red-300 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isAuthLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Log Out of CarbonX Account
                </>
              )}
            </button>

          </div>
        ) : (

          /* Unauthenticated State */
          <div className="py-6 space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div>
              <h4 className="font-heading font-black text-xl text-white uppercase tracking-wide">
                Sign in with Google
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                Authenticate with Firebase Auth to manage carbon credits, save custom price alerts, and link your enterprise profile.
              </p>
            </div>

            {/* One-click Google Sign-In Button */}
            <button
              id="google-signin-action-btn"
              onClick={handleGoogleLogin}
              disabled={isAuthLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-heading font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Feature points */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-left text-[11px] font-mono text-zinc-400">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7ED321]" />
                <span>Secure OAuth 2.0</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#7ED321]" />
                <span>Sync with Firestore</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
