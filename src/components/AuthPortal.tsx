/**
 * @file AuthPortal.tsx
 * High-performance Login & Sign Up Authentication Dashboard.
 * Serves as the primary gateway into CarbonX Protocol with Firebase Google Auth,
 * Email/Password registration, and Sandbox Persona access.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { 
  Leaf, 
  Shield, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  TreePine, 
  Cpu, 
  Globe2, 
  TrendingUp,
  KeyRound,
  Zap
} from 'lucide-react';

export const AuthPortal: React.FC = () => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signInAsDemoUser,
    isAuthLoading, 
    authError, 
    clearAuthError 
  } = useAuth();
  
  const { switchAccount } = useWeb3();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP' | 'DEMO'>('LOGIN');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN'>('BUYER');
  const [showPassword, setShowPassword] = useState(false);
  const [localValidationMsg, setLocalValidationMsg] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    clearAuthError();
    setLocalValidationMsg(null);
    await signInWithGoogle();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalValidationMsg(null);

    if (!email.trim() || !password.trim()) {
      setLocalValidationMsg('Please enter both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setLocalValidationMsg('Password must be at least 6 characters.');
      return;
    }

    if (activeTab === 'SIGNUP') {
      await signUpWithEmail(email, password, name, role);
    } else {
      await signInWithEmail(email, password);
    }
  };

  const handleQuickDemoAccess = (demoRole: 'BUYER' | 'VERIFIER' | 'DEVELOPER' | 'ADMIN', accountIdx: number) => {
    switchAccount(accountIdx);
    signInAsDemoUser(demoRole);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 flex flex-col justify-between selection:bg-[#7ED321] selection:text-black">
      
      {/* Top Banner / Navigation Bar */}
      <header className="w-full border-b border-zinc-900 bg-[#0a0a0a]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-20 flex items-center transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#7ED321]/40 flex items-center justify-center shadow-[0_0_15px_rgba(126,211,33,0.15)] shrink-0">
              <Leaf className="w-5 h-5 text-[#7ED321]" />
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
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse shrink-0" />
            <span className="text-zinc-400 hidden sm:inline leading-none">Mainnet Synced:</span>
            <span className="text-zinc-200 font-bold leading-none">Verra & Gold Standard</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* Left Column: Platform Overview & Protocol Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7ED321]/10 border border-[#7ED321]/30 text-[#7ED321] text-xs font-mono font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Grade Carbon Infrastructure</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
                Next-Gen Carbon <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ED321] via-emerald-400 to-teal-300">
                  Trading & Verification
                </span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Trade fractionalized, satellite-verified carbon offsets (ERC-1155). Connect with Firebase Authentication to manage your holdings, set custom price alerts, and execute on-chain retirements.
              </p>
            </div>

            {/* Core Capabilities Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#7ED321]/10 text-[#7ED321]">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Universal Standards</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Verra, Gold Standard & dMRV</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#7ED321]/10 text-[#7ED321]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">AI Satellite Audits</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Automated Biomass Verification</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#7ED321]/10 text-[#7ED321]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Deep Liquidity</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">AMM Pools & Instant Settlement</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#7ED321]/10 text-[#7ED321]">
                  <TreePine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Proof of Retirement</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Auditable Immutable Certificates</p>
                </div>
              </div>
            </div>

            {/* Real-time Ticker Preview */}
            <div className="p-4 rounded-xl bg-black/80 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-zinc-400">Benchmark CXC/USD Index:</span>
                <span className="text-white font-bold">$18.42</span>
              </div>
              <span className="text-emerald-400 font-bold">+4.12% 24h</span>
            </div>

          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative backdrop-blur-xl">
              
              {/* Tabs Switcher */}
              <div className="flex items-center rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 mb-6">
                <button
                  id="tab-login-btn"
                  type="button"
                  onClick={() => {
                    setActiveTab('LOGIN');
                    clearAuthError();
                    setLocalValidationMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'LOGIN'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-signup-btn"
                  type="button"
                  onClick={() => {
                    setActiveTab('SIGNUP');
                    clearAuthError();
                    setLocalValidationMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'SIGNUP'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  id="tab-demo-btn"
                  type="button"
                  onClick={() => {
                    setActiveTab('DEMO');
                    clearAuthError();
                    setLocalValidationMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'DEMO'
                      ? 'bg-[#7ED321]/20 text-[#7ED321] border border-[#7ED321]/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  Fast Demo
                </button>
              </div>

              {/* Title & Description */}
              <div className="mb-5">
                <h3 className="font-heading font-black text-xl text-white tracking-wide">
                  {activeTab === 'LOGIN' && 'Welcome Back'}
                  {activeTab === 'SIGNUP' && 'Create CarbonX Account'}
                  {activeTab === 'DEMO' && 'Sandbox Role Access'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {activeTab === 'LOGIN' && 'Sign in to access your portfolios, orders, and certificates.'}
                  {activeTab === 'SIGNUP' && 'Register your identity on the verified carbon registry.'}
                  {activeTab === 'DEMO' && 'Select an instant pre-funded testnet persona to explore the app immediately.'}
                </p>
              </div>

              {/* Error Alerts */}
              {(authError || localValidationMsg) && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-300 flex items-start justify-between gap-2 font-mono">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                    <span>{authError || localValidationMsg}</span>
                  </div>
                  <button
                    onClick={() => {
                      clearAuthError();
                      setLocalValidationMsg(null);
                    }}
                    className="text-zinc-400 hover:text-white text-xs cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 1. GOOGLE ONE-CLICK SIGN IN BUTTON (Available on Login & Signup) */}
              {activeTab !== 'DEMO' && (
                <div className="space-y-4">
                  <button
                    id="portal-google-login-btn"
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isAuthLoading}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                        Connecting to Google Auth...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      or with email
                    </span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>
                </div>
              )}

              {/* 2. EMAIL FORM (SIGN IN & SIGN UP) */}
              {activeTab !== 'DEMO' && (
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  
                  {activeTab === 'SIGNUP' && (
                    <>
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                          Full Name or Corporation
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="signup-name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. EcoImpact Global"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-[#7ED321] text-xs font-mono text-white outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                          Primary Protocol Role
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['BUYER', 'DEVELOPER', 'VERIFIER', 'ADMIN'] as const).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRole(r)}
                              className={`p-2 rounded-lg border text-left font-mono text-[11px] transition-all cursor-pointer flex items-center justify-between ${
                                role === r
                                  ? 'bg-[#7ED321]/15 border-[#7ED321] text-white font-bold'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              <span>{r}</span>
                              {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#7ED321]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="portal-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-[#7ED321] text-xs font-mono text-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono text-zinc-400">
                        Password
                      </label>
                      {activeTab === 'LOGIN' && (
                        <span className="text-[11px] font-mono text-zinc-500 hover:text-[#7ED321] cursor-pointer">
                          Forgot?
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="portal-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-[#7ED321] text-xs font-mono text-white outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="portal-submit-btn"
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-[#7ED321] hover:bg-[#6ec21a] text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(126,211,33,0.3)] cursor-pointer disabled:opacity-50"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {activeTab === 'LOGIN' ? 'Sign In to CarbonX' : 'Create Verified Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* 3. DEMO / SANDBOX PERSONAS */}
              {activeTab === 'DEMO' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-zinc-400 font-mono mb-3">
                    Click any role persona below to immediately enter the application dashboard with pre-loaded balances, mock certificates, and specialized smart contract controls:
                  </p>

                  <button
                    id="demo-persona-buyer"
                    type="button"
                    onClick={() => handleQuickDemoAccess('BUYER', 0)}
                    className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#7ED321] text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[#7ED321] flex items-center justify-center font-bold text-xs font-mono">
                        BY
                      </div>
                      <div>
                        <div className="font-heading font-bold text-white text-xs flex items-center gap-2">
                          Enterprise Buyer Persona
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                            50.0 ETH
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Marketplace buyer & offset retirement workflow
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#7ED321] group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    id="demo-persona-developer"
                    type="button"
                    onClick={() => handleQuickDemoAccess('DEVELOPER', 1)}
                    className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#7ED321] text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                        DV
                      </div>
                      <div>
                        <div className="font-heading font-bold text-white text-xs flex items-center gap-2">
                          Project Developer
                          <span className="text-[10px] bg-blue-950 text-blue-400 px-1.5 py-0.2 rounded font-mono">
                            2,500 CXC
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Tokenize new green projects & list credits
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#7ED321] group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    id="demo-persona-verifier"
                    type="button"
                    onClick={() => handleQuickDemoAccess('VERIFIER', 2)}
                    className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#7ED321] text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                        VF
                      </div>
                      <div>
                        <div className="font-heading font-bold text-white text-xs flex items-center gap-2">
                          Certified Auditor / Verifier
                          <span className="text-[10px] bg-purple-950 text-purple-400 px-1.5 py-0.2 rounded font-mono">
                            Auditor
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Review dMRV telemetry & approve token minting
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#7ED321] group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    id="demo-persona-admin"
                    type="button"
                    onClick={() => handleQuickDemoAccess('ADMIN', 3)}
                    className="w-full p-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 hover:border-[#7ED321] text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                        AD
                      </div>
                      <div>
                        <div className="font-heading font-bold text-white text-xs flex items-center gap-2">
                          Protocol Governance Admin
                          <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded font-mono">
                            Admin
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Full administrative override & registry control
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#7ED321] group-hover:translate-x-1 transition-all" />
                  </button>

                </div>
              )}

              {/* Bottom Security Note */}
              <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7ED321]" />
                  Firebase + ERC-1155 EIP-712
                </span>
                <span>Protected by Cloud Armor</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 py-4 px-6 bg-[#0a0a0a] text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CarbonX Decentralized Environmental Assets Protocol © {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Security Audit</span>
            <span className="hover:text-zinc-300 cursor-pointer">dMRV Specs</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms & Registry</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
