/**
 * @file ArchitectureSection.tsx
 * Section 9: 6-layer stacked architectural diagram of the CarbonX protocol.
 */

import React, { useState } from 'react';
import { Layers, Users, Monitor, Cpu, Network, HardDrive, Server, ChevronRight } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [expandedLayer, setExpandedLayer] = useState<number>(2); // Default open Smart Contract Layer

  const layers = [
    {
      id: 0,
      name: "User Layer",
      icon: <Users className="w-5 h-5 text-[#7ED321]" />,
      summary: "Project Developers, Accredited Verifiers & Auditors, Corporate Buyers, ESG Regulators",
      details: "Provides role-based authenticated gateways for all carbon market participants with cryptographically signed actions."
    },
    {
      id: 1,
      name: "Application Layer",
      icon: <Monitor className="w-5 h-5 text-[#7ED321]" />,
      summary: "React.js Web App, Mobile Console, RESTful & GraphQL APIs, Real-Time ESG Analytics",
      details: "High-performance interface connected to Web3 providers (MetaMask, WalletConnect) and live contract indexers."
    },
    {
      id: 2,
      name: "Smart Contract Layer",
      icon: <Cpu className="w-5 h-5 text-[#7ED321]" />,
      summary: "ProjectRegistry.sol, CarbonCreditToken.sol (ERC-1155), Marketplace.sol, RetirementRegistry.sol",
      details: "Non-custodial smart contracts governing the 8-step lifecycle with OpenZeppelin AccessControl and ReentrancyGuard."
    },
    {
      id: 3,
      name: "Blockchain Layer",
      icon: <Network className="w-5 h-5 text-[#7ED321]" />,
      summary: "Ethereum Virtual Machine (EVM), Layer 2 Arbitrum/Base Rollups, Hardhat Localnode",
      details: "Provides immutable, decentralized transaction consensus and verifiable state execution across distributed nodes."
    },
    {
      id: 4,
      name: "Storage Layer",
      icon: <HardDrive className="w-5 h-5 text-[#7ED321]" />,
      summary: "IPFS / Filecoin (MRV documents, PDDs, satellite baseline data), Decentralized Oracles",
      details: "Content-addressed decentralized storage ensures project audit documents cannot be altered or deleted."
    },
    {
      id: 5,
      name: "Infrastructure Layer",
      icon: <Server className="w-5 h-5 text-[#7ED321]" />,
      summary: "Cloud Container Nodes, RPC Endpoints, Hardware Security Modules (HSM), End-to-End Encryption",
      details: "Enterprise-grade high-availability infrastructure supporting high transaction throughput and sub-second querying."
    }
  ];

  return (
    <section id="architecture" className="py-24 bg-[#0d0d0d] relative border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            08 / System Topology
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Blockchain <span className="text-[#7ED321]">Architecture</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            A modular 6-tier architecture engineered for bank-grade security, extreme auditability, and gas efficiency.
          </p>
        </div>

        {/* Stacked Layer Diagram */}
        <div className="max-w-4xl mx-auto space-y-4">
          {layers.map((layer, index) => {
            const isExpanded = expandedLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setExpandedLayer(isExpanded ? -1 : layer.id)}
                className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isExpanded
                    ? 'bg-zinc-900 border-[#7ED321] shadow-[0_0_20px_rgba(126,211,33,0.15)]'
                    : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center shrink-0">
                      {layer.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#7ED321] font-bold">
                          LAYER 0{index + 1}
                        </span>
                        <span className="text-zinc-600">/</span>
                        <h3 className="font-heading font-black text-base uppercase text-white tracking-wide">
                          {layer.name}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        {layer.summary}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90 text-[#7ED321]' : ''}`} />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-800/80 bg-black/40 text-xs text-zinc-300 font-sans leading-relaxed">
                    {layer.details}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
