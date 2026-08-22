/**
 * @file RetireModal.tsx
 * Modal for permanently burning carbon credits on-chain and generating
 * an immutable Certificate of Retirement.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { MarketplaceListing, Project, RetirementCertificate, GasEstimationData } from '../types';
import { GasFeeEstimator } from './GasFeeEstimator';
import { X, Flame, ShieldCheck, CheckCircle2, Award, Sparkles, Loader2, ArrowRight, Fuel } from 'lucide-react';

interface RetireModalProps {
  listing?: MarketplaceListing | null;
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onCertificateGenerated?: (cert: RetirementCertificate) => void;
}

export const RetireModal: React.FC<RetireModalProps> = ({
  listing,
  project: propProject,
  isOpen,
  onClose,
  onCertificateGenerated
}) => {
  const { account, retireCredits, projects } = useWeb3();

  const targetProject = listing?.project || propProject || projects[0];
  const tokenId = targetProject.id;

  const [amount, setAmount] = useState<number>(50);
  const [retireeName, setRetireeName] = useState<string>(account.name || "Global Eco Enterprise");
  const [beneficiary, setBeneficiary] = useState<string>("Corporate ESG Scope 1 & 2 Emissions 2026");
  const [reason, setReason] = useState<string>("Annual Corporate Sustainability Neutralization");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdCert, setCreatedCert] = useState<RetirementCertificate | null>(null);
  const [gasData, setGasData] = useState<GasEstimationData | null>(null);

  if (!isOpen || !targetProject) return null;

  const gasFeeETH = gasData ? gasData.gasCostETH : 0.00196;
  const gasFeeUSD = gasData ? gasData.gasCostUSD : gasFeeETH * 3450;
  const hasEnoughGasBalance = account.balanceETH >= gasFeeETH;

  const handleRetire = async () => {
    setIsProcessing(true);
    try {
      const res = await retireCredits(tokenId, amount, retireeName, beneficiary, reason);
      if (res.success) {
        setCreatedCert(res.certificate);
        if (onCertificateGenerated) {
          onCertificateGenerated(res.certificate);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDone = () => {
    setCreatedCert(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#111111] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white">
                Retire Carbon Credits
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Irrevocable On-Chain Burn & Certificate Mint
              </p>
            </div>
          </div>
          <button
            onClick={handleDone}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {createdCert ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#7ED321]/20 border border-[#7ED321] text-[#7ED321] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(126,211,33,0.4)]">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-black text-xl uppercase text-white tracking-wide">
              Certificate Minted Successfully!
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Certificate <span className="text-[#7ED321] font-mono font-bold">#{createdCert.certificateId}</span> for {createdCert.amountTonsCO2e} tCO2e has been permanently logged on Ethereum.
            </p>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left font-mono text-xs space-y-1">
              <div className="text-zinc-500">Certificate Hash:</div>
              <div className="text-emerald-400 break-all select-all">{createdCert.certificateHash}</div>
            </div>
            <button
              onClick={() => {
                handleDone();
                const certEl = document.getElementById('certificate');
                if (certEl) certEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              View & Download Certificate →
            </button>
          </div>
        ) : (
          <div className="py-5 space-y-4">
            
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="text-xs font-mono text-[#7ED321] font-semibold uppercase">Offset Project</div>
              <div className="font-heading font-bold text-white text-sm">{targetProject.name}</div>
              <div className="text-xs text-zinc-400 font-mono">{targetProject.country} • {targetProject.methodology}</div>
            </div>

            {/* Retiree Name */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                Retiree Organization / Individual Name
              </label>
              <input
                type="text"
                value={retireeName}
                onChange={(e) => setRetireeName(e.target.value)}
                placeholder="e.g. Acme Corp ESG"
                className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                Tonnes of CO2e to Retire
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
              />
            </div>

            {/* Beneficiary */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                Beneficiary / Claim Target
              </label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="e.g. Corporate Scope 1 Emissions"
                className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
              />
            </div>

            {/* Automatic Gas Fee Estimator Component */}
            <GasFeeEstimator
              actionType="RETIRE_CREDITS"
              assetCostETH={0}
              userBalanceETH={account.balanceETH}
              onGasCalculated={(data) => setGasData(data)}
            />

            {/* Transaction Gas Cost Summary */}
            <div className="p-3 rounded-xl bg-[#151515] border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Fuel className="w-3.5 h-3.5 text-[#7ED321]" />
                <span>Estimated Network Gas to Sign & Burn:</span>
              </span>
              <span className="font-bold text-[#7ED321]">
                {gasFeeETH.toFixed(5)} ETH (~${gasFeeUSD.toFixed(2)})
              </span>
            </div>

            {/* Warning Banner */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-[11px] text-amber-300 font-mono flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Zero Double-Counting Guarantee:</strong> Retiring credits permanently burns ERC-1155 tokens. They can never be re-listed, transferred, or claimed again.
              </span>
            </div>

            {/* Submit button */}
            <button
              id="confirm-retire-btn"
              onClick={handleRetire}
              disabled={isProcessing || !hasEnoughGasBalance}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Executing Permanent Burn on Chain...
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 fill-black" />
                  Burn & Mint Certificate ({amount} tCO2e • Gas: {gasFeeETH.toFixed(5)} ETH)
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
