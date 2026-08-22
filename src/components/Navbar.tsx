/**
 * @file Navbar.tsx
 * Sticky transparent navigation with smooth scroll links, mobile menu,
 * and MetaMask / Testnet Web3 wallet connection state.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useAuth } from '../context/AuthContext';
import { Leaf, Wallet, ChevronDown, Menu, X, ShieldCheck, Activity, Radio, Bell, BellRing, User, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenWalletModal: () => void;
  onOpenRecentActivity?: () => void;
  onOpenPriceAlerts?: () => void;
  onOpenGoogleAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenWalletModal, 
  onOpenRecentActivity,
  onOpenPriceAlerts,
  onOpenGoogleAuth
}) => {
  const { account, isConnected, logs, alerts, unreadAlertCount } = useWeb3();
  const { currentUser, userProfile, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    // { label: "Idea", href: "#idea" },
    // { label: "Impact", href: "#impact" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Marketplace", href: "#marketplace" },
    // { label: "Portals", href: "#portals" },
    { label: "Calculator", href: "#calculator" },
    { label: "Architecture", href: "#architecture" },
    { label: "Certificates", href: "#certificate" },
    { label: "Developers", href: "#developers" },
  ];

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const displayName = currentUser?.displayName || userProfile?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Trader');
  const userRole = userProfile?.role || account.role;


  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-900 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#7ED321]/40 flex items-center justify-center group-hover:border-[#7ED321] transition-all duration-300 shadow-[0_0_15px_rgba(126,211,33,0.15)] shrink-0">
            <Leaf className="w-5 h-5 text-[#7ED321] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-wider text-white uppercase leading-none">
                CARBON<span className="text-[#7ED321]">X</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/80 text-[10px] font-mono font-bold text-[#7ED321] uppercase tracking-wider leading-none">
                CREDITS
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase mt-1 leading-none">
              PROTOCOL v2.4
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-wider text-zinc-400 hover:text-[#7ED321] font-semibold transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth & Wallet Connect & Activity & Alerts Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          
          {/* Google / Account Profile Button */}
          {onOpenGoogleAuth && (
            <button
              id="google-auth-nav-btn"
              onClick={onOpenGoogleAuth}
              className={`h-10 flex items-center gap-2 px-3 rounded-xl border text-xs font-mono transition-all shadow-sm cursor-pointer ${
                isAuthenticated
                  ? 'bg-zinc-900/90 border-[#7ED321]/40 hover:border-[#7ED321] text-white'
                  : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
              }`}
              title="Identity & Profile Settings"
            >
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Avatar" 
                  className="w-4 h-4 rounded-full object-cover border border-[#4285F4] shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-[#7ED321]/20 text-[#7ED321] border border-[#7ED321]/50 flex items-center justify-center text-[9px] font-bold shrink-0">
                  {displayName ? displayName[0].toUpperCase() : 'U'}
                </div>
              )}
              <span className="font-semibold max-w-[85px] truncate leading-none">
                {displayName}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[#7ED321] text-[9px] font-mono uppercase font-bold leading-none">
                {userRole}
              </span>
            </button>
          )}

          {/* Dedicated Log Out Button */}
          {/* <button
            id="nav-logout-btn"
            onClick={async () => {
              await signOut();
            }}
            className="h-10 flex items-center gap-1.5 px-3 rounded-xl bg-zinc-900/90 hover:bg-red-950/40 border border-zinc-800 hover:border-red-800 text-zinc-400 hover:text-red-300 text-xs font-mono transition-all shadow-sm cursor-pointer group"
            title="Log Out of CarbonX Platform"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400 transition-colors shrink-0" />
            <span className="font-semibold hidden md:inline leading-none">Log Out</span>
          </button> */}

          {/* Price Alerts Button */}
          {onOpenPriceAlerts && (
            <button
              id="price-alerts-nav-btn"
              onClick={onOpenPriceAlerts}
              className="h-10 relative flex items-center gap-2 px-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#7ED321]/60 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="Open Carbon Price Alerts & Notification Settings"
            >
              <div className="relative flex items-center justify-center shrink-0">
                {unreadAlertCount > 0 ? (
                  <BellRing className="w-3.5 h-3.5 text-[#7ED321] animate-bounce" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#7ED321]" />
                )}
                {unreadAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7ED321] animate-ping" />
                )}
              </div>
              <span className="font-semibold leading-none">Alerts</span>
              {unreadAlertCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#7ED321] text-black font-bold leading-none">
                  {unreadAlertCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700 leading-none">
                  {alerts.filter(a => a.active).length}
                </span>
              )}
            </button>
          )}

          {/* Live Recent Activity Button */}
          {onOpenRecentActivity && (
            <button
              id="recent-activity-nav-btn"
              onClick={onOpenRecentActivity}
              className="h-10 flex items-center gap-2 px-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-[#7ED321]/60 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="Open Recent Blockchain Activity Drawer / Sidebar"
            >
              <div className="relative flex items-center justify-center shrink-0">
                <Radio className="w-3.5 h-3.5 text-[#7ED321] group-hover:animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#7ED321] animate-ping" />
              </div>
              <span className="font-semibold leading-none">Recent Activity</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30 leading-none">
                {Math.min(logs.length, 10)}
              </span>
            </button>
          )}

          {/* Wallet Connect */}
          {/* <button
            id="wallet-connect-btn"
            onClick={onOpenWalletModal}
            className="h-10 flex items-center gap-2.5 px-3.5 rounded-xl bg-zinc-900/90 border border-[#7ED321]/40 hover:border-[#7ED321] text-xs font-mono text-zinc-200 transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(126,211,33,0.2)] cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse shrink-0" />
            <span className="text-base leading-none">{account.avatar}</span>
            <div className="flex flex-col text-left justify-center">
              <span className="font-bold text-white tracking-tight leading-tight">{truncateAddress(account.address)}</span>
              <span className="text-[9px] text-[#7ED321] uppercase tracking-wider leading-tight">{account.role} • {account.balanceETH.toFixed(2)} ETH</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5 shrink-0" />
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#7ED321]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-zinc-800 px-6 py-5 space-y-4">
          <div className="flex flex-col gap-2 pb-3 border-b border-zinc-800">
            {onOpenGoogleAuth && (
              <button
                id="mobile-google-auth-btn"
                onClick={() => {
                  onOpenGoogleAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-[#7ED321]/40 text-xs font-mono text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#7ED321]" />
                  <span className="font-bold">
                    {displayName} ({userRole})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#7ED321]/20 text-[#7ED321] font-bold">
                  PROFILE
                </span>
              </button>
            )}

            {/* Mobile Log Out button */}
            <button
              id="mobile-logout-btn"
              onClick={async () => {
                setMobileMenuOpen(false);
                await signOut();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-red-950/30 border border-red-900/60 text-xs font-mono text-red-300 hover:bg-red-950/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="font-bold">Log Out of CarbonX</span>
              </div>
              <span className="text-[10px] font-mono text-red-400">Exit →</span>
            </button>


            {onOpenPriceAlerts && (
              <button
                id="mobile-price-alerts-btn"
                onClick={() => {
                  onOpenPriceAlerts();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-[#7ED321]" />
                  <span className="font-bold text-white">Price Alerts & Engine</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#7ED321]/15 text-[#7ED321] font-bold">
                  {unreadAlertCount > 0 ? `${unreadAlertCount} NEW` : `${alerts.filter(a => a.active).length} Active`}
                </span>
              </button>
            )}

            {onOpenRecentActivity && (
              <button
                onClick={() => {
                  onOpenRecentActivity();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#7ED321] animate-pulse" />
                  <span className="font-bold text-white">Live Activity Feed</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#7ED321]/15 text-[#7ED321]">
                  Last 10 Events
                </span>
              </button>
            )}
            <button
              onClick={() => {
                onOpenWalletModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-[#7ED321]/40 text-xs font-mono text-zinc-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{account.avatar}</span>
                <div className="text-left">
                  <div className="font-bold text-white">{truncateAddress(account.address)}</div>
                  <div className="text-[10px] text-[#7ED321]">{account.roleLabel} ({account.balanceETH.toFixed(2)} ETH)</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-[#7ED321] hover:bg-zinc-900 rounded"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

