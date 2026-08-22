/**
 * @file MyPortfolioSection.tsx
 * "My Portfolio" section for the CarbonX Dashboard that queries the
 * CarbonCreditToken (ERC-1155) smart contract for the connected wallet's balance
 * of tokenized carbon credits and displays individual holdings with real-time valuation,
 * batch metadata, serial ranges, and direct offset/retirement actions.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../data/contracts';
import { WalletCreditHolding, Project } from '../types';
import { 
  Wallet, 
  Coins, 
  Leaf, 
  ArrowUpRight, 
  ShieldCheck, 
  Flame, 
  Trees, 
  Zap, 
  Droplets, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Lock, 
  Activity, 
  ChevronRight,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';

interface MyPortfolioSectionProps {
  onOpenRetireModal?: (holding: WalletCreditHolding) => void;
  onOpenBuyModal?: () => void;
  onSelectProjectForDetail?: (project: Project) => void;
}

export const MyPortfolioSection: React.FC<MyPortfolioSectionProps> = ({
  onOpenRetireModal,
  onOpenBuyModal,
  onSelectProjectForDetail
}) => {
  const { 
    account, 
    accountList, 
    currentAccountIndex, 
    switchAccount, 
    holdings, 
    isQueryingHoldings, 
    lastHoldingsQueryTimestamp, 
    queryHoldingsFromContract,
    lastPolledBlock,
    projects,
    setSelectedProjectForDetail
  } = useWeb3();

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [queryFeedbackToast, setQueryFeedbackToast] = useState<string | null>(null);

  // Aggregate stats from individual holdings
  const totalTonsHeld = holdings.reduce((sum, h) => sum + h.balanceTons, 0);
  const totalValueUSD = holdings.reduce((sum, h) => sum + h.valueUSD, 0);
  const totalValueETH = holdings.reduce((sum, h) => sum + h.valueETH, 0);
  const totalBatchesCount = holdings.length;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleRefreshContractQuery = async () => {
    const freshHoldings = await queryHoldingsFromContract();
    setQueryFeedbackToast(
      `Queried CarbonCreditToken.balanceOfBatch() at Block #${lastPolledBlock}: ${freshHoldings.length} active holding batch(es) confirmed on-chain.`
    );
    setTimeout(() => setQueryFeedbackToast(null), 5000);
  };

  const handleInspectProject = (project: Project) => {
    if (onSelectProjectForDetail) {
      onSelectProjectForDetail(project);
    } else if (setSelectedProjectForDetail) {
      setSelectedProjectForDetail(project);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Forestry': return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'Direct Air Capture': return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'Blue Carbon': return <Droplets className="w-4 h-4 text-sky-400" />;
      case 'Renewable Energy': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Methane Capture': return <Flame className="w-4 h-4 text-orange-400" />;
      default: return <Leaf className="w-4 h-4 text-[#7ED321]" />;
    }
  };

  return (
    <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800 space-y-6" id="my-portfolio">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-1 font-bold">
            <Wallet className="w-3.5 h-3.5 text-[#7ED321]" />
            On-Chain Asset Management • ERC-1155
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-white flex items-center gap-3">
            My Carbon Portfolio
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/40 normal-case font-semibold">
              {totalBatchesCount} Batch{totalBatchesCount === 1 ? '' : 'es'} Held
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Real-time multi-token balances queried from contract <span className="text-zinc-200 font-semibold">{CONTRACT_ADDRESSES.carbonCreditToken.slice(0, 10)}...{CONTRACT_ADDRESSES.carbonCreditToken.slice(-6)}</span>
          </p>
        </div>

        {/* Action Controls & Query Contract Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Query Smart Contract Button */}
          <button
            id="query-carbon-token-contract-btn"
            onClick={handleRefreshContractQuery}
            disabled={isQueryingHoldings}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#7ED321]/50 hover:border-[#7ED321] text-xs font-mono font-bold text-white transition-all flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(126,211,33,0.2)] cursor-pointer disabled:opacity-50"
            title="Calls balanceOf() / balanceOfBatch() on CarbonCreditToken.sol"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#7ED321] ${isQueryingHoldings ? 'animate-spin' : ''}`} />
            <span>{isQueryingHoldings ? 'Querying Contract...' : 'Query Token Contract'}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-[#7ED321] text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#7ED321] text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              Ledger Table
            </button>
          </div>
        </div>
      </div>

      {/* Contract Query Feedback Toast */}
      {queryFeedbackToast && (
        <div className="p-3.5 rounded-xl bg-[#7ED321]/10 border border-[#7ED321]/40 flex items-center justify-between gap-3 text-xs text-zinc-200 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#7ED321] shrink-0" />
            <span className="font-mono text-zinc-300">
              <strong className="text-white font-bold">Smart Contract Query Result:</strong> {queryFeedbackToast}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#7ED321] bg-black/50 px-2 py-0.5 rounded border border-[#7ED321]/30 shrink-0">
            Synced
          </span>
        </div>
      )}

      {/* Connected Wallet Bar & Quick Persona Switcher */}
      <div className="p-4 rounded-xl bg-[#151515] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Active Account Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xl shrink-0">
            {account.avatar || '💼'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-white text-sm">
                {account.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                {account.roleLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
              <span>{account.address.slice(0, 10)}...{account.address.slice(-6)}</span>
              <button
                onClick={handleCopyAddress}
                className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                title="Copy Address"
              >
                {copiedAddress ? <Check className="w-3 h-3 text-[#7ED321]" /> : <Copy className="w-3 h-3" />}
              </button>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">Balance: <strong>{account.balanceETH.toFixed(2)} ETH</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Test Persona Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto max-w-full pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-zinc-500 shrink-0">Switch Persona:</span>
          {accountList.map((acc, idx) => (
            <button
              key={acc.address}
              onClick={() => switchAccount(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 transition-all border ${
                currentAccountIndex === idx
                  ? 'bg-zinc-800 text-[#7ED321] border-[#7ED321]/50 font-bold'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {acc.avatar} {acc.role.slice(0, 3)}
            </button>
          ))}
        </div>

      </div>

      {/* Portfolio Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Carbon Credits Held */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 relative overflow-hidden">
          <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-1 flex items-center justify-between">
            <span>Carbon Credits Held</span>
            <Leaf className="w-4 h-4 text-[#7ED321]" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            {totalTonsHeld.toLocaleString()} <span className="text-sm font-sans font-normal text-zinc-400">tCO2e</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-1">
            Available for trading or permanent retirement
          </div>
        </div>

        {/* Metric 2: Estimated USD Valuation */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 relative overflow-hidden">
          <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-1 flex items-center justify-between">
            <span>Portfolio Value (USD)</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-400 tracking-tight">
            ${totalValueUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-1">
            ~{totalValueETH.toFixed(3)} ETH floor liquidity
          </div>
        </div>

        {/* Metric 3: Unique Batches */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 relative overflow-hidden">
          <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-1 flex items-center justify-between">
            <span>Active Token Batches</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            {totalBatchesCount} <span className="text-sm font-sans font-normal text-zinc-400">batches</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-1">
            ERC-1155 Token IDs on Hardhat Localhost
          </div>
        </div>

        {/* Metric 4: Offset Potential */}
        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 relative overflow-hidden">
          <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-1 flex items-center justify-between">
            <span>Equivalent Neutrality</span>
            <Sparkles className="w-4 h-4 text-[#7ED321]" />
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#7ED321] tracking-tight">
            {Math.round(totalTonsHeld * 2.2).toLocaleString()} <span className="text-sm font-sans font-normal text-zinc-400">flts</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono mt-1">
            ~{Math.round(totalTonsHeld * 0.22).toLocaleString()} gasoline cars removed for 1 yr
          </div>
        </div>

      </div>

      {/* HOLDINGS LIST / CARDS */}
      {holdings.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-xl bg-[#141414] border border-zinc-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 mx-auto">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg text-white uppercase tracking-wide">
              No Carbon Credits in Connected Wallet
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mt-1 font-mono">
              The connected address <code className="text-zinc-300 font-mono">{account.address.slice(0, 10)}...{account.address.slice(-6)}</code> currently holds 0 ERC-1155 tokens on the <code className="text-zinc-300">CarbonCreditToken</code> contract.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                // Switch to Corporate Buyer who has holdings
                switchAccount(2);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#7ED321] hover:bg-[#6cb81c] text-black font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Switch to Corporate Buyer (Novartis)
            </button>
            <button
              onClick={() => {
                // Switch to Project Developer who has holdings
                switchAccount(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-semibold transition-all cursor-pointer"
            >
              Switch to Developer (Apex)
            </button>
            {onOpenBuyModal && (
              <button
                onClick={onOpenBuyModal}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#7ED321]/40 text-[#7ED321] font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                Browse Marketplace
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {holdings.map((holding) => {
            const proj = holding.project;
            return (
              <div
                key={holding.tokenId}
                className="rounded-xl bg-[#141414] border border-zinc-800 hover:border-[#7ED321]/50 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header & Thumbnail Banner */}
                  <div className="relative h-28 overflow-hidden bg-zinc-900">
                    <img 
                      src={proj.imageUrl} 
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
                    
                    {/* Badges on Banner */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-[#7ED321] border border-[#7ED321]/40 flex items-center gap-1.5">
                        <Layers className="w-3 h-3" />
                        ERC-1155 Token #{holding.tokenId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700 flex items-center gap-1">
                        {getCategoryIcon(proj.category)}
                        {proj.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-mono text-zinc-300">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        📍 {proj.location}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-bold">
                        Vintage {holding.vintageYear}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-heading font-bold text-base text-white uppercase tracking-wide line-clamp-1">
                        {proj.name}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        Methodology: <span className="text-zinc-300">{proj.methodology}</span>
                      </p>
                    </div>

                    {/* Balance & Valuation Highlight Box */}
                    <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Wallet Balance</div>
                        <div className="font-heading font-black text-2xl text-white tracking-tight mt-0.5">
                          {holding.balanceTons.toLocaleString()} <span className="text-xs font-sans font-normal text-[#7ED321]">tCO2e</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono uppercase text-zinc-400">Floor Valuation</div>
                        <div className="font-heading font-bold text-lg text-emerald-400 tracking-tight mt-0.5">
                          ${holding.valueUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {holding.valueETH.toFixed(4)} ETH
                        </div>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="space-y-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900/60 p-3 rounded-lg border border-zinc-850">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Serial Range:</span>
                        <span className="text-zinc-300 select-all">{holding.serialNumberRange}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Contract:</span>
                        <span className="text-[#7ED321] truncate max-w-[200px]">{CONTRACT_ADDRESSES.carbonCreditToken}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Attestation:</span>
                        <span className="text-cyan-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#7ED321]" /> Verified on Block #{holding.lastQueriedBlock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleInspectProject(proj)}
                    className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  >
                    MRV Dossier
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    {onOpenRetireModal && (
                      <button
                        onClick={() => onOpenRetireModal(holding)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                      >
                        <Lock className="w-3 h-3" />
                        Retire / Offset
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Ledger Table View */
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#141414]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Token ID</th>
                <th className="py-3.5 px-4">Project & Category</th>
                <th className="py-3.5 px-4">Vintage</th>
                <th className="py-3.5 px-4 text-right">Balance (tCO2e)</th>
                <th className="py-3.5 px-4 text-right">Value (USD / ETH)</th>
                <th className="py-3.5 px-4">Serial Range</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {holdings.map((holding) => {
                const proj = holding.project;
                return (
                  <tr key={holding.tokenId} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-[#7ED321] border border-[#7ED321]/30 font-bold">
                        #{holding.tokenId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-white text-xs">{proj.name}</div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        {getCategoryIcon(proj.category)}
                        {proj.category} • {proj.country}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {holding.vintageYear}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white text-sm">
                      {holding.balanceTons.toLocaleString()} t
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-emerald-400">
                        ${holding.valueUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {holding.valueETH.toFixed(4)} ETH
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[10px] text-zinc-400 truncate max-w-[150px]">
                      {holding.serialNumberRange}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onOpenRetireModal && (
                          <button
                            onClick={() => onOpenRetireModal(holding)}
                            className="px-2.5 py-1 rounded bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Retire
                          </button>
                        )}
                        <button
                          onClick={() => handleInspectProject(proj)}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-all cursor-pointer"
                          title="View Details"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Contract Verification Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7ED321]" />
          <span>ERC-1155 multi-token balances attested against Hardhat Localhost node</span>
        </div>
        <div className="text-zinc-400">
          Last queried: {new Date(lastHoldingsQueryTimestamp).toLocaleTimeString()} (Block #{lastPolledBlock.toLocaleString()})
        </div>
      </div>

    </div>
  );
};
