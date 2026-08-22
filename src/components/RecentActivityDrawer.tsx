/**
 * @file RecentActivityDrawer.tsx
 * "Recent Activity" sidebar and bottom-drawer component that live-tracks the
 * last 10 blockchain events (Purchases, Retirements, Issuances, and MRV Attestations)
 * fetched via real-time smart contract event listeners and block polling.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../data/contracts';
import { TransactionLog, Project } from '../types';
import { 
  Activity, 
  Radio, 
  ShieldCheck, 
  Flame, 
  ShoppingCart, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Hash, 
  Play, 
  Pause, 
  SlidersHorizontal,
  Sidebar,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Zap,
  Tag
} from 'lucide-react';

interface RecentActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProjectForDetail?: (project: Project) => void;
}

export const RecentActivityDrawer: React.FC<RecentActivityDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProjectForDetail
}) => {
  const { 
    logs, 
    lastPolledBlock, 
    lastPolledTime, 
    isPollingEvents, 
    pollSmartContractEvents,
    projects,
    setSelectedProjectForDetail
  } = useWeb3();

  const [drawerMode, setDrawerMode] = useState<'sidebar' | 'bottom'>('sidebar');
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'RETIRE' | 'ISSUE' | 'VERIFY'>('ALL');
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [autoPollActive, setAutoPollActive] = useState<boolean>(true);
  const [newestTxId, setNewestTxId] = useState<string | null>(null);
  const [pollStatusMessage, setPollStatusMessage] = useState<string | null>(null);

  // Take the most recent 10 events
  const recentLogs = logs.slice(0, 10);

  // Filtered list based on user category selection
  const filteredLogs = filterType === 'ALL'
    ? recentLogs
    : recentLogs.filter(log => log.type === filterType);

  // Highlight newest incoming transaction
  useEffect(() => {
    if (logs.length > 0) {
      setNewestTxId(logs[0].id);
      const timer = setTimeout(() => setNewestTxId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [logs]);

  // Auto-polling cycle
  const pollRef = useRef(pollSmartContractEvents);
  useEffect(() => {
    pollRef.current = pollSmartContractEvents;
  }, [pollSmartContractEvents]);

  useEffect(() => {
    if (!isOpen || !autoPollActive) return;
    const interval = setInterval(() => {
      pollRef.current().catch(() => {});
    }, 18000); // Polling every 18 seconds

    return () => clearInterval(interval);
  }, [isOpen, autoPollActive]);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(hash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleManualPoll = async () => {
    const result = await pollSmartContractEvents(true);
    setPollStatusMessage(result.eventSummary || `Polled Block #${result.blockNumber}`);
    setTimeout(() => setPollStatusMessage(null), 4000);
  };

  const handleInspectProject = (projectId?: number) => {
    if (!projectId) return;
    const found = projects.find(p => p.id === projectId);
    if (found) {
      if (onSelectProjectForDetail) {
        onSelectProjectForDetail(found);
      } else if (setSelectedProjectForDetail) {
        setSelectedProjectForDetail(found);
      }
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 15) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getEventBadge = (type: TransactionLog['type']) => {
    switch (type) {
      case 'BUY':
        return {
          icon: <ShoppingCart className="w-3.5 h-3.5" />,
          label: 'Marketplace Buy',
          contract: 'CarbonCreditMarketplace.sol',
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
        };
      case 'RETIRE':
        return {
          icon: <Flame className="w-3.5 h-3.5" />,
          label: 'Offset Burned',
          contract: 'RetirementRegistry.sol',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        };
      case 'ISSUE':
        return {
          icon: <Layers className="w-3.5 h-3.5" />,
          label: 'Credits Issued',
          contract: 'CarbonCreditToken.sol',
          bg: 'bg-[#7ED321]/15 text-[#7ED321] border-[#7ED321]/40'
        };
      case 'VERIFY':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          label: 'MRV Telemetry',
          contract: 'CarbonCreditRegistry.sol',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      case 'REGISTER':
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          label: 'Project Registry',
          contract: 'CarbonCreditRegistry.sol',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
        };
      default:
        return {
          icon: <Activity className="w-3.5 h-3.5" />,
          label: 'Contract Log',
          contract: 'CarbonX Protocol',
          bg: 'bg-zinc-800 text-zinc-300 border-zinc-700'
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex" id="recent-activity-container">
      
      {/* Backdrop overlay for focus */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
      />

      {/* DRAWER / SIDEBAR CONTAINER */}
      <div
        className={`pointer-events-auto bg-[#0d0d0d] border-zinc-800 shadow-2xl flex flex-col transition-all duration-300 z-10 ${
          drawerMode === 'sidebar'
            ? 'ml-auto h-full w-full max-w-lg sm:max-w-xl border-l'
            : 'mt-auto w-full max-h-[80vh] h-[580px] border-t rounded-t-3xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#121212] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/40 flex items-center justify-center text-[#7ED321] relative">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#7ED321] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg uppercase tracking-tight text-white flex items-center gap-2">
                  Recent Activity
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30">
                  Last 10 Events
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Event Listener
                </span>
                <span>•</span>
                <span className="text-zinc-300 font-semibold">Block #{lastPolledBlock}</span>
              </div>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            
            {/* Mode Switch (Sidebar vs Bottom Drawer) */}
            <button
              onClick={() => setDrawerMode(drawerMode === 'sidebar' ? 'bottom' : 'sidebar')}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title={drawerMode === 'sidebar' ? 'Switch to Bottom Drawer' : 'Switch to Right Sidebar'}
            >
              {drawerMode === 'sidebar' ? <Maximize2 className="w-4 h-4" /> : <Sidebar className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close activity feed"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Network & Control Strip */}
        <div className="px-6 py-3 bg-[#151515] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          <div className="flex items-center gap-2 text-zinc-400">
            <Hash className="w-3.5 h-3.5 text-[#7ED321]" />
            <span>Node: <strong className="text-zinc-200">Hardhat Localhost (31337)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Poll Toggle */}
            <button
              onClick={() => setAutoPollActive(!autoPollActive)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                autoPollActive 
                  ? 'bg-zinc-900 text-[#7ED321] border-[#7ED321]/40' 
                  : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
              }`}
              title={autoPollActive ? 'Pause auto-event stream' : 'Resume auto-event stream'}
            >
              {autoPollActive ? <Pause className="w-3 h-3 text-[#7ED321]" /> : <Play className="w-3 h-3" />}
              <span>{autoPollActive ? 'Streaming' : 'Paused'}</span>
            </button>

            {/* Trigger On-Chain Event Button */}
            <button
              onClick={handleManualPoll}
              disabled={isPollingEvents}
              className="px-3 py-1 rounded-md bg-[#7ED321] hover:bg-[#6cb81c] text-black font-heading font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              title="Trigger on-chain event poll & listener check"
            >
              <RefreshCw className={`w-3 h-3 ${isPollingEvents ? 'animate-spin' : ''}`} />
              <span>Poll Block</span>
            </button>
          </div>

        </div>

        {/* Status Toast Banner */}
        {pollStatusMessage && (
          <div className="mx-6 mt-3 p-2.5 rounded-lg bg-[#7ED321]/15 border border-[#7ED321]/40 flex items-center justify-between text-xs text-zinc-200 animate-fadeIn">
            <span className="font-mono text-[11px] truncate flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7ED321] shrink-0" />
              {pollStatusMessage}
            </span>
            <span className="text-[10px] font-mono text-[#7ED321] font-bold">LIVE</span>
          </div>
        )}

        {/* Filter Tabs Strip */}
        <div className="px-6 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto text-xs font-mono border-b border-zinc-850">
          <span className="text-zinc-500 text-[11px] mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Filter:
          </span>
          {[
            { id: 'ALL', label: `All (${recentLogs.length})` },
            { id: 'BUY', label: `Purchases (${recentLogs.filter(l => l.type === 'BUY').length})` },
            { id: 'RETIRE', label: `Retirements (${recentLogs.filter(l => l.type === 'RETIRE').length})` },
            { id: 'ISSUE', label: `Issuances (${recentLogs.filter(l => l.type === 'ISSUE').length})` },
            { id: 'VERIFY', label: `MRV (${recentLogs.filter(l => l.type === 'VERIFY').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-zinc-800 text-[#7ED321] font-bold border border-[#7ED321]/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event Stream List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 divide-y divide-transparent">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                <Activity className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                No blockchain events found matching filter <strong className="text-white">"{filterType}"</strong> in the last 10 transactions.
              </p>
              <button
                onClick={() => setFilterType('ALL')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const badge = getEventBadge(log.type);
              const isNewest = log.id === newestTxId;

              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isNewest
                      ? 'bg-[#7ED321]/10 border-[#7ED321] shadow-[0_0_20px_rgba(126,211,33,0.25)]'
                      : 'bg-[#141414] border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Event Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold flex items-center gap-1.5 border ${badge.bg}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {formatRelativeTime(log.timestamp)}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-300 font-semibold">Blk #{log.blockNumber}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wide">
                      {log.title}
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {log.description}
                    </p>
                  </div>

                  {/* Highlight Metric Pills (Tons, ETH, etc.) */}
                  {(log.amountTons || log.ethValue) && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-zinc-850">
                      {log.amountTons && (
                        <div className="px-2 py-1 rounded bg-black/60 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                          <span className="text-zinc-500">Volume:</span>
                          <strong className="text-white">{log.amountTons.toLocaleString()} tCO2e</strong>
                        </div>
                      )}
                      {log.ethValue && (
                        <div className="px-2 py-1 rounded bg-black/60 border border-zinc-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                          <span className="text-zinc-500">Value:</span>
                          <strong>{log.ethValue.toFixed(2)} ETH</strong>
                        </div>
                      )}
                      <div className="ml-auto text-[10px] font-mono text-zinc-500">
                        {badge.contract}
                      </div>
                    </div>
                  )}

                  {/* Addresses & Transaction Hash Footer */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                      <span>From:</span>
                      <span className="text-zinc-400 truncate">{log.from.slice(0, 8)}...{log.from.slice(-6)}</span>
                      {log.to && (
                        <>
                          <span className="text-zinc-600">→</span>
                          <span className="text-zinc-400 truncate">{log.to.slice(0, 8)}...{log.to.slice(-6)}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyHash(log.txHash)}
                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                        title="Copy Tx Hash"
                      >
                        {copiedTx === log.txHash ? (
                          <Check className="w-3 h-3 text-[#7ED321]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span className="text-[10px]">{log.txHash.slice(0, 8)}...</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer info & Smart Contract Attestation */}
        <div className="px-6 py-3.5 bg-[#101010] border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7ED321]" />
            <span>Listening to 3 Core Solidity Contracts</span>
          </div>
          <div className="text-zinc-400">
            Auto-Sync: <span className="text-[#7ED321] font-bold">{autoPollActive ? 'Active (18s)' : 'Paused'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
