/**
 * @file ImpactDashboardSection.tsx
 * Section 3: Live Impact Dashboard with count-up statistics,
 * interactive trend chart, link to full on-chain explorer, and
 * real-time verifiable telemetry stream from active carbon credit projects.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { MONTHLY_TREND_DATA } from '../data/initialData';
import { ProjectCategory, ProjectUpdate, Project, WalletCreditHolding } from '../types';
import { MyPortfolioSection } from './MyPortfolioSection';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  Trees, 
  Layers, 
  ExternalLink, 
  Radio, 
  Satellite, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Filter, 
  ChevronRight,
  RefreshCw,
  Zap,
  Cpu,
  Wifi,
  Sparkles,
  Wallet,
  Globe,
  Bell,
  BellRing
} from 'lucide-react';

interface ImpactDashboardSectionProps {
  onOpenFullDashboard: () => void;
  onOpenRecentActivity?: () => void;
  onOpenPriceAlerts?: () => void;
  onSelectProjectForDetail?: (project: Project) => void;
  onOpenRetireModal?: (holding: WalletCreditHolding) => void;
  onOpenBuyModal?: () => void;
}

export const ImpactDashboardSection: React.FC<ImpactDashboardSectionProps> = ({ 
  onOpenFullDashboard,
  onOpenRecentActivity,
  onOpenPriceAlerts,
  onSelectProjectForDetail,
  onOpenRetireModal,
  onOpenBuyModal
}) => {
  const { 
    stats, 
    projects, 
    certificates, 
    logs, 
    projectUpdates, 
    setSelectedProjectForDetail,
    holdings,
    alerts,
    unreadAlertCount,
    isPollingEvents,
    lastPolledBlock,
    lastPolledTime,
    pollSmartContractEvents
  } = useWeb3();

  const [dashboardView, setDashboardView] = useState<'all' | 'portfolio' | 'metrics' | 'telemetry'>('all');
  const [activeTab, setActiveTab] = useState<'both' | 'issued' | 'retired'>('both');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);

  // 30-second polling states
  const [secondsUntilNextPoll, setSecondsUntilNextPoll] = useState<number>(30);
  const [lastSyncBanner, setLastSyncBanner] = useState<string | null>(null);
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  // Animated counter state
  const [displayIssued, setDisplayIssued] = useState(0);
  const [displayRetired, setDisplayRetired] = useState(0);
  const [displayOffset, setDisplayOffset] = useState(0);
  const [displayProjects, setDisplayProjects] = useState(0);

  // Smooth numeric counter animation on load and on any contract event poll update
  useEffect(() => {
    const startIssued = displayIssued;
    const startRetired = displayRetired;
    const startOffset = displayOffset;
    const startProjects = displayProjects;

    const targetIssued = stats.totalCreditsIssued;
    const targetRetired = stats.totalCreditsRetired;
    const targetOffset = stats.totalCO2eOffsetTons;
    const targetProjects = stats.activeProjects;

    const duration = isInitialMount.current ? 1200 : 800;
    isInitialMount.current = false;

    const steps = 25;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
      const factor = easeOut(progress);

      setDisplayIssued(Math.round(startIssued + (targetIssued - startIssued) * factor));
      setDisplayRetired(Math.round(startRetired + (targetRetired - startRetired) * factor));
      setDisplayOffset(Math.round(startOffset + (targetOffset - startOffset) * factor));
      setDisplayProjects(Math.round(startProjects + (targetProjects - startProjects) * factor));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayIssued(targetIssued);
        setDisplayRetired(targetRetired);
        setDisplayOffset(targetOffset);
        setDisplayProjects(targetProjects);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stats.totalCreditsIssued, stats.totalCreditsRetired, stats.totalCO2eOffsetTons, stats.activeProjects]);

  // 30-Second Smart Contract Event Polling Loop
  const pollContractRef = useRef(pollSmartContractEvents);
  useEffect(() => {
    pollContractRef.current = pollSmartContractEvents;
  }, [pollSmartContractEvents]);

  useEffect(() => {
    let countdown = 30;
    const ticker = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        countdown = 30;
        setSecondsUntilNextPoll(30);
        pollContractRef.current(false)
          .then(res => {
            if (res && res.newEventsCount > 0) {
              setLastSyncBanner(res.eventSummary || `Ingested ${res.newEventsCount} new smart contract event(s)`);
              setShowSyncSuccessToast(true);
              setTimeout(() => setShowSyncSuccessToast(false), 6000);
            }
          })
          .catch(err => {
            console.error('Autonomous contract polling error:', err);
          });
      } else {
        setSecondsUntilNextPoll(countdown);
      }
    }, 1000);

    return () => clearInterval(ticker);
  }, []);

  const handleManualSync = async () => {
    setSecondsUntilNextPoll(30);
    const res = await pollSmartContractEvents(true);
    setLastSyncBanner(res.eventSummary || `Polled Block #${res.blockNumber}`);
    setShowSyncSuccessToast(true);
    setTimeout(() => setShowSyncSuccessToast(false), 6000);
  };

  const maxVal = Math.max(...MONTHLY_TREND_DATA.map(d => Math.max(d.issued, d.retired)));

  const filteredUpdates = projectUpdates.filter(u => {
    if (selectedCategory === 'All') return true;
    return u.projectCategory === selectedCategory;
  });

  const handleOpenProjectModal = (projectId: number) => {
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      if (onSelectProjectForDetail) {
        onSelectProjectForDetail(proj);
      } else if (setSelectedProjectForDetail) {
        setSelectedProjectForDetail(proj);
      }
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <section id="impact" className="py-24 bg-[#0d0d0d] relative border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse" />
              02 / Real-Time Telemetry & Impact
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white">
              Live Impact <span className="text-[#7ED321]">Dashboard</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Real-time on-chain issuance, permanent retirements, and continuous sensor & satellite MRV feeds broadcasted directly from project sites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Price Alerts Button */}
            {onOpenPriceAlerts && (
              <button
                id="impact-price-alerts-btn"
                onClick={onOpenPriceAlerts}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#7ED321] text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                title="Manage Target Price Alerts & Notification Rules"
              >
                <BellRing className="w-3.5 h-3.5 text-[#7ED321]" />
                <span>Price Alerts</span>
                {unreadAlertCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#7ED321] text-black font-bold animate-pulse">
                    {unreadAlertCount} NEW
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">
                    {alerts.filter(a => a.active).length}
                  </span>
                )}
              </button>
            )}

            {/* Recent Activity Drawer Button */}
            {onOpenRecentActivity && (
              <button
                id="impact-recent-activity-btn"
                onClick={onOpenRecentActivity}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#7ED321] text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                title="Open Smart Contract Event Activity Feed (Last 10 Events)"
              >
                <div className="relative flex items-center justify-center">
                  <Radio className="w-3.5 h-3.5 text-[#7ED321]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7ED321] animate-ping absolute -top-0.5 -right-0.5" />
                </div>
                <span>Live Event Feed</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#7ED321]/15 text-[#7ED321]">
                  {Math.min(logs.length, 10)}
                </span>
              </button>
            )}

            {/* Manual Sync / Trigger Button */}
            <button
              id="manual-sync-btn"
              onClick={handleManualSync}
              disabled={isPollingEvents}
              title="Force check smart contract events immediately"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#7ED321] text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#7ED321] ${isPollingEvents ? 'animate-spin' : ''}`} />
              <span>{isPollingEvents ? 'Polling Contracts...' : 'Poll Smart Contracts'}</span>
            </button>

            <button
              id="view-full-dashboard-btn"
              onClick={onOpenFullDashboard}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#7ED321]/40 hover:border-[#7ED321] text-xs font-heading font-bold text-white uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(126,211,33,0.2)] cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#7ED321]" />
              View Full On-Chain Ledger
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* 30-Second Polling Status Banner */}
        <div className="mb-10 p-4 rounded-xl bg-[#121212] border border-zinc-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[#7ED321]/20 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <span>Autonomous On-Chain Event Poller</span>
                <span className="px-1.5 py-0.5 rounded bg-[#7ED321]/10 text-[#7ED321] text-[10px] font-semibold border border-[#7ED321]/30 uppercase">
                  30s Polling Cycle Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Continuously listening for ERC-1155 <code className="text-zinc-300 font-mono">CreditsIssued</code> & <code className="text-zinc-300 font-mono">CreditsRetired</code> events without page reload.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 bg-zinc-900/90 px-3.5 py-2 rounded-lg border border-zinc-800 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-[#7ED321]" />
              <span>Block: <strong className="text-white">#{lastPolledBlock.toLocaleString()}</strong></span>
            </div>
            <div className="w-px h-3.5 bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next poll: <strong className="text-[#7ED321] font-bold">{secondsUntilNextPoll}s</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic New Event Ingestion Toast / Notification */}
        {showSyncSuccessToast && lastSyncBanner && (
          <div className="mb-8 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#7ED321] shrink-0" />
              <span>
                <strong className="text-white uppercase tracking-wider font-mono text-[11px]">Live Event Ingested:</strong> {lastSyncBanner}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700 shrink-0">
              Metrics Updated Live
            </span>
          </div>
        )}

        {/* Dashboard Navigation View Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-[#121212] rounded-2xl border border-zinc-800/90 w-fit">
          <button
            id="tab-dashboard-all"
            onClick={() => setDashboardView('all')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'all'
                ? 'bg-[#7ED321] text-black shadow-[0_0_15px_rgba(126,211,33,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Complete Overview
          </button>

          <button
            id="tab-dashboard-portfolio"
            onClick={() => setDashboardView('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'portfolio'
                ? 'bg-[#7ED321] text-black shadow-[0_0_15px_rgba(126,211,33,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            My Portfolio
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              dashboardView === 'portfolio' ? 'bg-black text-[#7ED321]' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {holdings.length}
            </span>
          </button>

          <button
            id="tab-dashboard-metrics"
            onClick={() => setDashboardView('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'metrics'
                ? 'bg-[#7ED321] text-black shadow-[0_0_15px_rgba(126,211,33,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Macro Metrics & Velocity
          </button>

          <button
            id="tab-dashboard-telemetry"
            onClick={() => setDashboardView('telemetry')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              dashboardView === 'telemetry'
                ? 'bg-[#7ED321] text-black shadow-[0_0_15px_rgba(126,211,33,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Telemetry MRV
          </button>
        </div>

        {/* VIEW 1: Global Macro Counter Cards & Chart */}
        {(dashboardView === 'all' || dashboardView === 'metrics') && (
          <div className="space-y-12 mb-12">
            {/* 4 Animated Counter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Total Credits Issued */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-zinc-800/80 relative overflow-hidden group hover:border-[#7ED321]/50 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#7ED321]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Credits Issued</span>
                  <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#7ED321]">
                    <Layers className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mb-1">
                  {displayIssued.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  1 credit = 1 metric tCO2e
                </div>
              </div>

              {/* Card 2: Total Credits Retired */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-zinc-800/80 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Credits Retired</span>
                  <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-heading font-black text-3xl sm:text-4xl text-emerald-400 tracking-tight mb-1">
                  {displayRetired.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Permanently locked & burned
                </div>
              </div>

              {/* Card 3: Total CO2e Offset */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-zinc-800/80 relative overflow-hidden group hover:border-[#7ED321]/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Total Offset</span>
                  <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[#7ED321]">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mb-1">
                  {displayOffset.toLocaleString()} <span className="text-sm font-sans font-normal text-zinc-400">t</span>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Metric Tonnes CO2 Equivalent
                </div>
              </div>

              {/* Card 4: Active Projects */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-zinc-800/80 relative overflow-hidden group hover:border-[#7ED321]/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Active Projects</span>
                  <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                    <Trees className="w-4 h-4" />
                  </span>
                </div>
                <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mb-1">
                  {displayProjects} <span className="text-sm font-sans font-normal text-zinc-400">verified</span>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Across 6 global biomes
                </div>
              </div>

            </div>

            {/* Issuance & Retirement Trend Chart Widget */}
            <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="font-heading font-black text-lg uppercase tracking-wide text-white">
                    Issuance vs. Retirement Velocity
                  </h3>
                  <p className="text-xs text-zinc-400">Monthly tokenized volume (tonnes CO2e)</p>
                </div>
                
                {/* Filter Toggle */}
                <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start">
                  <button
                    onClick={() => setActiveTab('both')}
                    className={`px-3 py-1 text-xs font-mono rounded ${activeTab === 'both' ? 'bg-[#7ED321] text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('issued')}
                    className={`px-3 py-1 text-xs font-mono rounded ${activeTab === 'issued' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Issued
                  </button>
                  <button
                    onClick={() => setActiveTab('retired')}
                    className={`px-3 py-1 text-xs font-mono rounded ${activeTab === 'retired' ? 'bg-emerald-900/60 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Retired
                  </button>
                </div>
              </div>

              {/* SVG / Bar Chart Representation */}
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-56 pt-6 pb-2 border-b border-zinc-800">
                  {MONTHLY_TREND_DATA.map((item) => {
                    const issuedHeight = (item.issued / maxVal) * 100;
                    const retiredHeight = (item.retired / maxVal) * 100;

                    return (
                      <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="w-full flex items-end justify-center gap-1.5 h-44">
                          
                          {/* Issued Bar */}
                          {(activeTab === 'both' || activeTab === 'issued') && (
                            <div
                              style={{ height: `${issuedHeight}%` }}
                              className="w-full max-w-[22px] bg-zinc-600 group-hover:bg-[#7ED321] rounded-t transition-all duration-300 relative group/bar"
                            >
                              <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-zinc-700 text-[10px] font-mono px-1.5 py-0.5 rounded text-white whitespace-nowrap z-20 pointer-events-none">
                                {item.issued.toLocaleString()} t
                              </div>
                            </div>
                          )}

                          {/* Retired Bar */}
                          {(activeTab === 'both' || activeTab === 'retired') && (
                            <div
                              style={{ height: `${retiredHeight}%` }}
                              className="w-full max-w-[22px] bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition-all duration-300 relative group/bar"
                            >
                              <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-700 text-[10px] font-mono px-1.5 py-0.5 rounded text-emerald-300 whitespace-nowrap z-20 pointer-events-none">
                                {item.retired.toLocaleString()} t
                              </div>
                            </div>
                          )}

                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">{item.month}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 font-mono">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-zinc-600" />
                      <span>Credits Issued (tCO2e)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                      <span>Credits Retired (Locked & Burned)</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-zinc-400">
                    Data synced with Ethereum Hardhat Testnet
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: MY PORTFOLIO SECTION */}
        {(dashboardView === 'all' || dashboardView === 'portfolio') && (
          <div className="mb-12">
            <MyPortfolioSection 
              onOpenRetireModal={onOpenRetireModal}
              onOpenBuyModal={onOpenBuyModal}
              onSelectProjectForDetail={onSelectProjectForDetail}
            />
          </div>
        )}

        {/* VIEW 3: Real-Time Projects MRV & Verifiable Telemetry Feed */}
        {(dashboardView === 'all' || dashboardView === 'telemetry') && (
          <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800 space-y-6">
            {/* Section Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/40 flex items-center justify-center text-[#7ED321]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl uppercase tracking-wide text-white flex items-center gap-2">
                  Real-Time Project MRV & Telemetry Stream
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                    LIVE
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Continuous verified data points: Satellite LiDAR passes, LoRaWAN soil moisture, & SCADA downhole transducers
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {['All', 'Forestry', 'Direct Air Capture', 'Blue Carbon', 'Renewable Energy', 'Soil Carbon'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#7ED321] text-black font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of Real-Time Updates */}
          <div className="space-y-4">
            {filteredUpdates.map((update) => {
              const isExpanded = expandedUpdateId === update.id;
              return (
                <div
                  key={update.id}
                  className="p-5 rounded-xl bg-[#141414] border border-zinc-800/90 hover:border-zinc-700 transition-all space-y-4"
                >
                  {/* Top Bar of update card */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/40">
                          {update.projectCategory}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {update.updateType.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#7ED321]" />
                          {getRelativeTime(update.timestamp)}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-base text-white uppercase tracking-wide">
                        {update.title}
                      </h4>

                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        Project: <span className="text-zinc-200 font-semibold">{update.projectName}</span> • Author: {update.authorName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenProjectModal(update.projectId)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-[#7ED321]/40 hover:border-[#7ED321] text-xs font-mono text-[#7ED321] hover:text-white flex items-center gap-1 cursor-pointer transition-all"
                      >
                        Inspect Dossier
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {update.summary}
                  </p>

                  {/* Verifiable Metric Pills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {update.metrics.map((metric, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-black/60 border border-zinc-850">
                        <div className="text-[10px] font-mono text-zinc-500 truncate">{metric.label}</div>
                        <div className="font-heading font-black text-sm text-white mt-0.5 flex items-baseline gap-1">
                          {metric.value}
                          {metric.unit && <span className="text-[10px] font-sans font-normal text-zinc-400">{metric.unit}</span>}
                        </div>
                        {metric.change && (
                          <div className="text-[10px] font-mono text-[#7ED321] mt-0.5 flex items-center gap-0.5">
                            <TrendingUp className="w-2.5 h-2.5" />
                            {metric.change}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cryptographic verification proof strip */}
                  <div className="p-2.5 rounded-lg bg-black/80 border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-2 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#7ED321] shrink-0" />
                      <span className="text-zinc-500 shrink-0">IPFS CID:</span>
                      <span className="text-emerald-400 select-all truncate">{update.ipfsEvidenceHash}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-500">Oracle Sensor:</span>
                      <span className="text-zinc-300">{update.satelliteProvider}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[#7ED321]">Block #{update.blockNumber}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
        )}

      </div>
    </section>
  );
};
