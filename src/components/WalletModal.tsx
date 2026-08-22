/**
 * @file WalletModal.tsx
 * Modal for connecting MetaMask or switching Web3 testnet role personas.
 */

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';
import { INITIAL_TEST_ACCOUNTS } from '../data/initialData';
import { X, CheckCircle2, Shield, ExternalLink, Sparkles, LogIn, User, LogOut } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGoogleAuth?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onOpenGoogleAuth }) => {
  const { account, connectMetaMask, switchAccount, isConnecting } = useWeb3();
  const { currentUser, signInWithGoogle, signOut, isAuthLoading } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#7ED321]" />
              Account & Identity Access
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Connect Google Firebase Auth, MetaMask, or switch role personas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Firebase Google Auth Option */}
        <div className="my-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block">
            Google Account (Firebase Auth)
          </label>
          
          {currentUser ? (
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-[#4285F4]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google'}
                    className="w-10 h-10 rounded-full border border-[#4285F4] object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#4285F4] text-white flex items-center justify-center font-bold">
                    {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                  </div>
                )}
                <div>
                  <div className="font-heading font-bold text-white text-xs flex items-center gap-1.5">
                    {currentUser.displayName || 'Google Account'}
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono">
                      Signed In
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5 truncate max-w-[200px]">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenGoogleAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenGoogleAuth();
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              id="google-wallet-signin-btn"
              onClick={async () => {
                await signInWithGoogle();
              }}
              disabled={isAuthLoading}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/70 border border-zinc-800 hover:border-[#4285F4] text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
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
                </div>
                <div>
                  <div className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                    Sign In with Google
                    <span className="text-[10px] bg-[#4285F4]/20 text-[#4285F4] px-1.5 py-0.2 rounded font-mono font-normal">
                      Firebase
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Sync identity & cloud settings
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#4285F4] font-semibold group-hover:translate-x-1 transition-transform">
                {isAuthLoading ? "Signing in..." : "Authenticate →"}
              </span>
            </button>
          )}
        </div>

        {/* 2. Real MetaMask Option */}
        <div className="my-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block">
            Direct Browser Web3 Wallet
          </label>
          <button
            id="metamask-connect-action"
            onClick={async () => {
              await connectMetaMask();
              onClose();
            }}
            disabled={isConnecting}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/60 border border-[#7ED321]/40 hover:border-[#7ED321] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-orange-950/40 border border-orange-500/30 flex items-center justify-center text-xl">
                🦊
              </div>
              <div>
                <div className="font-heading font-bold text-white text-sm flex items-center gap-2">
                  MetaMask / Injected Provider
                  <span className="text-[10px] bg-[#7ED321]/20 text-[#7ED321] px-1.5 py-0.5 rounded font-mono font-normal">
                    Ethers v6
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Connect live extension or hardware wallet
                </div>
              </div>
            </div>
            <span className="text-xs text-[#7ED321] font-semibold group-hover:translate-x-1 transition-transform">
              {isConnecting ? "Connecting..." : "Connect →"}
            </span>
          </button>
        </div>

        {/* 3. Role-Based Testnet Personas */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
            Switch Pre-Funded Protocol Roles (Testnet Sandbox)
          </label>
          <div className="space-y-2">
            {INITIAL_TEST_ACCOUNTS.map((acc, index) => {
              const isSelected = account.address.toLowerCase() === acc.address.toLowerCase();
              return (
                <button
                  key={acc.address}
                  onClick={() => {
                    switchAccount(index);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-[#7ED321] shadow-[0_0_15px_rgba(126,211,33,0.15)]'
                      : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{acc.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-xs uppercase tracking-wide">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                          acc.role === 'DEVELOPER' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          acc.role === 'VERIFIER' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                          acc.role === 'ADMIN' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                          'bg-lime-950 text-[#7ED321] border border-lime-800'
                        }`}>
                          {acc.role}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        {acc.address.slice(0, 8)}...{acc.address.slice(-6)} • {acc.balanceETH} ETH
                      </div>
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-[#7ED321]" />
                  ) : (
                    <span className="text-[11px] text-zinc-500 hover:text-zinc-300">Switch</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Auth: Google Firebase + Ethereum EIP-1193</span>
          <span className="text-[#7ED321] font-mono">1 tCO2e = 1 CXC</span>
        </div>
      </div>
    </div>
  );
};

