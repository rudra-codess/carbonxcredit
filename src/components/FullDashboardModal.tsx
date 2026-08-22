/**
 * @file FullDashboardModal.tsx
 * Modal displaying the full on-chain ledger, smart contract addresses,
 * recent block activities, and carbon accounting proofs.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESSES } from '../data/contracts';
import { MyPortfolioSection } from './MyPortfolioSection';
import { X, Activity, ShieldCheck, FileText, CheckCircle2, ArrowUpRight, Hash, Database, Clock, Wallet } from 'lucide-react';

interface FullDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRetireModal?: (holding: any) => void;
  onOpenBuyModal?: () => void;
}

export const FullDashboardModal: React.FC<FullDashboardModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenRetireModal,
  onOpenBuyModal
}) => {
  const { stats, projects, certificates, logs, holdings } = useWeb3();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'txs' | 'contracts' | 'projects'>('portfolio');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#7ED321]/40 flex items-center justify-center text-[#7ED321]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl uppercase tracking-wide text-white">
                CarbonX On-Chain Protocol Explorer
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Network: Hardhat Localhost (Chain ID: 31337) • CarbonCreditToken (ERC-1155)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 px-6 border-b border-zinc-800 bg-[#0e0e0e] overflow-x-auto">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'portfolio' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            My Portfolio ({holdings.length})
          </button>
          <button
            onClick={() => setActiveTab('txs')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'txs' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Live Transaction Stream ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'contracts' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Deployed Smart Contracts (4)
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'projects' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Registered Projects ({projects.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 0: My Portfolio */}
          {activeTab === 'portfolio' && (
            <MyPortfolioSection 
              onOpenRetireModal={(h) => {
                onClose();
                if (onOpenRetireModal) onOpenRetireModal(h);
              }}
              onOpenBuyModal={() => {
                onClose();
                if (onOpenBuyModal) onOpenBuyModal();
              }}
            />
          )}
          
          {/* TAB 1: Transactions Stream */}
          {activeTab === 'txs' && (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2 rounded-lg text-xs font-mono font-bold mt-0.5 ${
                      log.type === 'RETIRE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      log.type === 'BUY' ? 'bg-lime-950 text-[#7ED321] border border-lime-800' :
                      log.type === 'ISSUE' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                      'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {log.type}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-sm">
                        {log.title}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {log.description}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 mt-1 flex items-center gap-3">
                        <span>Block #{log.blockNumber}</span>
                        <span>Tx: {log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono shrink-0">
                    {log.amountTons && (
                      <div className="text-xs font-bold text-[#7ED321]">
                        +{log.amountTons.toLocaleString()} tCO2e
                      </div>
                    )}
                    {log.ethValue && (
                      <div className="text-xs text-zinc-400">
                        {log.ethValue.toFixed(4)} ETH
                      </div>
                    )}
                    <div className="text-[10px] text-zinc-600">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Contracts */}
          {activeTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-mono text-[#7ED321] mb-1 font-semibold">01 / Registry</div>
                <h4 className="font-heading font-bold text-white text-base mb-1">ProjectRegistry.sol</h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Handles MRV IPFS uploads, developer verification, and auditor accreditation.
                </p>
                <div className="p-2.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300 break-all select-all">
                  {CONTRACT_ADDRESSES.projectRegistry}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-mono text-[#7ED321] mb-1 font-semibold">02 / Token Multi-Standard</div>
                <h4 className="font-heading font-bold text-white text-base mb-1">CarbonCreditToken.sol (ERC-1155)</h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Issues tokenized batches with immutable serial numbers and burn capabilities.
                </p>
                <div className="p-2.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300 break-all select-all">
                  {CONTRACT_ADDRESSES.carbonCreditToken}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-mono text-[#7ED321] mb-1 font-semibold">03 / Decentralized Escrow</div>
                <h4 className="font-heading font-bold text-white text-base mb-1">Marketplace.sol</h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Fixed-price trading escrow with ReentrancyGuard and pull-payment settlement.
                </p>
                <div className="p-2.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300 break-all select-all">
                  {CONTRACT_ADDRESSES.marketplace}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-mono text-[#7ED321] mb-1 font-semibold">04 / Anti-Double-Counting Registry</div>
                <h4 className="font-heading font-bold text-white text-base mb-1">RetirementRegistry.sol</h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Permanently locks & burns tokens, issuing Keccak256 retirement certificates.
                </p>
                <div className="p-2.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300 break-all select-all">
                  {CONTRACT_ADDRESSES.retirementRegistry}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Projects Table */}
          {activeTab === 'projects' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Methodology</th>
                    <th className="pb-3">Expected CO2e</th>
                    <th className="pb-3">Issued</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-900/50">
                      <td className="py-3 font-sans font-bold text-white pr-4">
                        {p.name}
                        <div className="text-[10px] font-mono text-zinc-500">{p.location}</div>
                      </td>
                      <td className="py-3 text-zinc-300 pr-4">{p.category}</td>
                      <td className="py-3 text-zinc-400 pr-4">{p.methodology}</td>
                      <td className="py-3 text-white pr-4">{p.expectedCO2eTons.toLocaleString()} t</td>
                      <td className="py-3 text-[#7ED321] pr-4">{p.issuedCredits.toLocaleString()} t</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#0e0e0e] flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Zero Knowledge & Keccak256 Verification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-heading font-bold uppercase tracking-wider"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
};
