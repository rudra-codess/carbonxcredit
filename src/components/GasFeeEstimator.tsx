/**
 * @file GasFeeEstimator.tsx
 * Interactive Ethereum EIP-1559 Gas Fee Estimator component powered by ethers.js.
 * Displays live network congestion, configurable speed tiers (Eco/Standard/Fast),
 * gas unit breakdown, and total transaction cost before signing.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GasEstimationData, GasSpeedTier } from '../types';
import { fetchLiveNetworkGas } from '../utils/gasEstimator';
import { 
  Fuel, 
  Zap, 
  Clock, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';

interface GasFeeEstimatorProps {
  actionType: 'BUY_CREDITS' | 'RETIRE_CREDITS' | 'LIST_CREDITS';
  assetCostETH?: number;
  userBalanceETH?: number;
  onGasCalculated?: (gasData: GasEstimationData) => void;
  className?: string;
  compact?: boolean;
}

export const GasFeeEstimator: React.FC<GasFeeEstimatorProps> = ({
  actionType,
  assetCostETH = 0,
  userBalanceETH = 0,
  onGasCalculated,
  className = '',
  compact = false
}) => {
  const [gasData, setGasData] = useState<GasEstimationData | null>(null);
  const [selectedTier, setSelectedTier] = useState<GasSpeedTier>('standard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  const loadGasData = useCallback(async (tier: GasSpeedTier = selectedTier, isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await fetchLiveNetworkGas(actionType, tier);
      setGasData(data);
      setSecondsAgo(0);
      if (onGasCalculated) {
        onGasCalculated(data);
      }
    } catch (err) {
      console.warn('Gas estimation error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [actionType, selectedTier, onGasCalculated]);

  // Initial load
  useEffect(() => {
    loadGasData(selectedTier);
  }, [actionType]);

  // Auto-refresh gas data every 15 seconds (matching block times)
  useEffect(() => {
    const interval = setInterval(() => {
      loadGasData(selectedTier);
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedTier, loadGasData]);

  // Seconds elapsed ticker
  useEffect(() => {
    const ticker = setInterval(() => {
      setSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  const handleTierChange = (tier: GasSpeedTier) => {
    setSelectedTier(tier);
    loadGasData(tier);
  };

  const totalRequiredETH = assetCostETH + (gasData ? gasData.gasCostETH : 0);
  const hasSufficientBalance = userBalanceETH >= totalRequiredETH;

  if (isLoading && !gasData) {
    return (
      <div className={`p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-700 rounded" />
            <div className="h-3 w-32 bg-zinc-700 rounded" />
          </div>
          <div className="h-3 w-20 bg-zinc-700 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-zinc-800 rounded-lg" />
          <div className="h-12 bg-zinc-800 rounded-lg" />
          <div className="h-12 bg-zinc-800 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!gasData) return null;

  const currentTierInfo = gasData.speedTiers[selectedTier];
  const effectiveGwei = (gasData.baseFeeGwei + currentTierInfo.priorityFeeGwei).toFixed(1);

  return (
    <div className={`rounded-xl bg-[#121212] border border-zinc-800/90 overflow-hidden transition-all text-xs font-mono ${className}`}>
      
      {/* Header bar */}
      <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#7ED321]/10 text-[#7ED321] border border-[#7ED321]/20">
            <Fuel className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Network Gas Estimator
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border ${
            gasData.networkCongestion === 'low' 
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' 
              : gasData.networkCongestion === 'high' 
              ? 'bg-amber-950/60 text-amber-400 border-amber-800/50' 
              : 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50'
          }`}>
            {gasData.networkCongestion} traffic
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-[10px]">
          <span className="hidden sm:inline">Block #{gasData.blockNumber.toLocaleString()}</span>
          <button
            type="button"
            onClick={() => loadGasData(selectedTier, true)}
            disabled={isRefreshing}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={`Updated ${secondsAgo}s ago. Click to query ethers.js RPC now`}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#7ED321]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Priority Speed Tier Selector */}
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {(['eco', 'standard', 'fast'] as GasSpeedTier[]).map((tierKey) => {
            const tier = gasData.speedTiers[tierKey];
            const isSelected = selectedTier === tierKey;

            return (
              <button
                key={tierKey}
                type="button"
                onClick={() => handleTierChange(tierKey)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#7ED321]/10 border-[#7ED321] text-white shadow-[0_0_12px_rgba(126,211,33,0.15)]'
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold uppercase text-[10px] ${isSelected ? 'text-[#7ED321]' : 'text-zinc-300'}`}>
                    {tier.label}
                  </span>
                  <div className="flex items-center gap-0.5 text-[9px] text-zinc-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>~{tier.estimatedSeconds < 60 ? `${tier.estimatedSeconds}s` : `${Math.round(tier.estimatedSeconds / 60)}m`}</span>
                  </div>
                </div>

                <div className="font-bold text-xs text-white">
                  ${tier.gasCostUSD.toFixed(2)}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {tier.gasCostETH.toFixed(5)} ETH
                </div>
              </button>
            );
          })}
        </div>

        {/* Summary Row */}
        <div className="flex items-center justify-between pt-1 text-zinc-300">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Gas Price:</span>
            <span className="font-bold text-white">{effectiveGwei} Gwei</span>
            <span className="text-[10px] text-zinc-500">
              (Base: {gasData.baseFeeGwei} + Tip: {currentTierInfo.priorityFeeGwei})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-zinc-400">Est. Gas Units:</span>
            <span className="font-bold text-zinc-200">{gasData.estimatedGasUnits.toLocaleString()}</span>
          </div>
        </div>

        {/* Balance Verification Banner (if balance is provided) */}
        {userBalanceETH > 0 && (
          <div className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
            hasSufficientBalance
              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
              : 'bg-red-950/30 border-red-800/60 text-red-300'
          }`}>
            <div className="flex items-center gap-1.5">
              {hasSufficientBalance ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              )}
              <span>
                {hasSufficientBalance
                  ? 'Wallet has sufficient ETH for Asset + Gas'
                  : `Insufficient ETH: Need ${totalRequiredETH.toFixed(5)} ETH (Have ${userBalanceETH.toFixed(4)} ETH)`}
              </span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400 hidden sm:inline">
              Gas ~{((gasData.gasCostETH / (totalRequiredETH || 1)) * 100).toFixed(1)}% of total
            </span>
          </div>
        )}

        {/* Toggleable Technical Details Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-[#7ED321]" />}
            <span>{showDetails ? 'Hide EIP-1559 Gas Details' : 'Show EIP-1559 Protocol Parameters'}</span>
          </button>

          {showDetails && (
            <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 space-y-1.5 text-[10px] text-zinc-400">
              <div className="flex justify-between">
                <span>EIP-1559 Base Fee:</span>
                <span className="text-zinc-200 font-mono">{gasData.baseFeeGwei.toFixed(2)} Gwei</span>
              </div>
              <div className="flex justify-between">
                <span>Max Priority Fee (Miner Tip):</span>
                <span className="text-zinc-200 font-mono">{gasData.priorityFeeGwei.toFixed(2)} Gwei</span>
              </div>
              <div className="flex justify-between">
                <span>Max Fee Per Gas Cap:</span>
                <span className="text-zinc-200 font-mono">{gasData.maxFeePerGasGwei.toFixed(2)} Gwei</span>
              </div>
              <div className="flex justify-between">
                <span>Contract Gas Limit:</span>
                <span className="text-zinc-200 font-mono">{gasData.estimatedGasUnits.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between">
                <span>Reference ETH Price:</span>
                <span className="text-zinc-200 font-mono">${gasData.ethPriceUSD.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-1 text-[9px] text-zinc-500">
                <span>Network Protocol:</span>
                <span>Ethereum Mainnet / EIP-1559 RPC</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
