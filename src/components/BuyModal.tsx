/**
 * @file BuyModal.tsx
 * Transaction modal for buying ERC-1155 Carbon Credits from marketplace escrow.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { MarketplaceListing, GasEstimationData } from '../types';
import { GasFeeEstimator } from './GasFeeEstimator';
import { X, ShoppingCart, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Loader2, Fuel } from 'lucide-react';

interface BuyModalProps {
  listing: MarketplaceListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ listing, isOpen, onClose }) => {
  const { account, buyCredits } = useWeb3();
  const [amount, setAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gasData, setGasData] = useState<GasEstimationData | null>(null);

  if (!isOpen || !listing) return null;

  const assetCostETH = listing.pricePerCreditETH * amount;
  const assetCostUSD = listing.pricePerCreditUSD * amount;
  const protocolFeeETH = assetCostETH * 0.01;
  const gasFeeETH = gasData ? gasData.gasCostETH : 0.0028;
  const gasFeeUSD = gasData ? gasData.gasCostUSD : gasFeeETH * 3450;
  const grandTotalETH = assetCostETH + protocolFeeETH + gasFeeETH;
  const grandTotalUSD = assetCostUSD + (protocolFeeETH * 3450) + gasFeeUSD;
  const hasEnoughBalance = account.balanceETH >= grandTotalETH;

  const handleBuy = async () => {
    if (amount <= 0 || amount > listing.remainingAmount) {
      setError("Please select a valid credit quantity within available inventory.");
      return;
    }
    if (!hasEnoughBalance) {
      setError(`Insufficient ETH balance. You need ${grandTotalETH.toFixed(5)} ETH (including ~${gasFeeETH.toFixed(5)} ETH estimated gas), but have ${account.balanceETH.toFixed(4)} ETH.`);
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const res = await buyCredits(listing.id, amount);
      if (res.success) {
        setTxHash(res.txHash);
      }
    } catch (err: any) {
      setError(err?.message || "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setTxHash(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#7ED321]/10 border border-[#7ED321]/30 text-[#7ED321]">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white">
                Acquire Carbon Credits
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                ERC-1155 Token Batch #{listing.tokenId}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {txHash ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-black text-xl uppercase text-white tracking-wide">
              Purchase Confirmed On-Chain!
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              You have acquired <span className="text-[#7ED321] font-bold font-mono">{amount.toLocaleString()} tCO2e</span> credits from {listing.project.name}.
            </p>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left font-mono text-xs space-y-1">
              <div className="text-zinc-500">Transaction Hash:</div>
              <div className="text-zinc-300 break-all select-all">{txHash}</div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Done & Return to Market
            </button>
          </div>
        ) : (
          <div className="py-5 space-y-4">
            
            {/* Project Details */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="font-heading font-bold text-sm text-white uppercase">
                {listing.project.name}
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between font-mono">
                <span>Methodology: {listing.project.methodology}</span>
                <span className="text-[#7ED321]">{listing.project.category}</span>
              </div>
              <div className="text-xs text-zinc-400 flex items-center justify-between font-mono">
                <span>Seller: {listing.sellerName}</span>
                <span>Avail: {listing.remainingAmount.toLocaleString()} tCO2e</span>
              </div>
            </div>

            {/* Input Amount */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <label className="font-bold text-zinc-300 uppercase">Quantity (tCO2e / Credits)</label>
                <button
                  type="button"
                  onClick={() => setAmount(listing.remainingAmount)}
                  className="text-[#7ED321] hover:underline cursor-pointer"
                >
                  Max ({listing.remainingAmount.toLocaleString()})
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={listing.remainingAmount}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full p-3 rounded-xl bg-black border border-zinc-700 text-white font-mono text-base focus:outline-none focus:border-[#7ED321]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                  Tonnes
                </span>
              </div>

              {/* Quick selectors */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[50, 100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(Math.min(val, listing.remainingAmount))}
                    className="py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-[#7ED321] transition-colors cursor-pointer"
                  >
                    +{val} t
                  </button>
                ))}
              </div>
            </div>

            {/* Automatic Gas Fee Estimator Component */}
            <GasFeeEstimator
              actionType="BUY_CREDITS"
              assetCostETH={assetCostETH}
              userBalanceETH={account.balanceETH}
              onGasCalculated={(data) => setGasData(data)}
            />

            {/* Total Cost Summary Breakdown */}
            <div className="p-4 rounded-xl bg-[#151515] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Carbon Credits ({amount.toLocaleString()} tCO2e):</span>
                <span className="text-zinc-200">{assetCostETH.toFixed(4)} ETH (${assetCostUSD.toLocaleString()})</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Protocol Settlement Fee (1%):</span>
                <span>{protocolFeeETH.toFixed(5)} ETH</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-[#7ED321]" />
                  <span>Est. Network Gas Fee:</span>
                </span>
                <span className="text-[#7ED321]">{gasFeeETH.toFixed(5)} ETH (~${gasFeeUSD.toFixed(2)})</span>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-sm font-mono">
                <span className="font-bold text-white">Grand Total Required:</span>
                <div className="text-right">
                  <div className="font-black text-[#7ED321] text-base">
                    {grandTotalETH.toFixed(4)} ETH
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    (${grandTotalUSD.toFixed(2)} USD)
                  </div>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Action button */}
            <button
              id="confirm-buy-btn"
              onClick={handleBuy}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(126,211,33,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Broadcasting on Ethereum...
                </>
              ) : (
                <>
                  Confirm Purchase & Sign ({grandTotalETH.toFixed(4)} ETH)
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

