/**
 * @file HowItWorksSection.tsx
 * Section 4: 8-step process flow with connecting lines, icons, and descriptions.
 */

import React from 'react';
import { 
  FileSpreadsheet, 
  ShieldCheck, 
  Coins, 
  Store, 
  ShoppingCart, 
  ArrowRightLeft, 
  Flame, 
  LineChart,
  ArrowRight
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Project Registration",
      icon: <FileSpreadsheet className="w-5 h-5 text-[#7ED321]" />,
      desc: "Developers submit project design, coordinates, and MRV documentation hashed directly to IPFS."
    },
    {
      num: "02",
      title: "Verification & Validation",
      icon: <ShieldCheck className="w-5 h-5 text-[#7ED321]" />,
      desc: "Accredited verifiers (VCS, Gold Standard) perform on-chain audit and grant approval."
    },
    {
      num: "03",
      title: "Credit Issuance",
      icon: <Coins className="w-5 h-5 text-[#7ED321]" />,
      desc: "Smart contracts mint ERC-1155 tokens (1 token = 1 tCO2e) with unique serial ranges."
    },
    {
      num: "04",
      title: "Marketplace Listing",
      icon: <Store className="w-5 h-5 text-[#7ED321]" />,
      desc: "Originators list verified credit batches in decentralized escrow with custom pricing."
    },
    {
      num: "05",
      title: "Purchase by Buyer",
      icon: <ShoppingCart className="w-5 h-5 text-[#7ED321]" />,
      desc: "Corporates and individuals acquire credits using ETH/stablecoins with instant settlement."
    },
    {
      num: "06",
      title: "Transfer & Ownership",
      icon: <ArrowRightLeft className="w-5 h-5 text-[#7ED321]" />,
      desc: "Instant ERC-1155 token transfer to the buyer's non-custodial Web3 wallet."
    },
    {
      num: "07",
      title: "Retirement & Burning",
      icon: <Flame className="w-5 h-5 text-emerald-400" />,
      desc: "Credits are permanently burned on-chain to offset emissions and prevent double-spending."
    },
    {
      num: "08",
      title: "Impact Tracking",
      icon: <LineChart className="w-5 h-5 text-[#7ED321]" />,
      desc: "Generates an immutable Certificate of Retirement with Keccak256 hash for ESG compliance."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            03 / Protocol Execution Pipeline
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            How <span className="text-[#7ED321]">CarbonX</span> Works
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            An 8-step end-to-end decentralized lifecycle turning ecological project origin into audited, irreversible climate impact.
          </p>
        </div>

        {/* 8-Step Grid with Flow Connections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-[#111111] border border-zinc-800 hover:border-[#7ED321]/50 transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Step indicator */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(126,211,33,0.2)] transition-shadow">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-600 group-hover:text-[#7ED321] transition-colors">
                    STEP {step.num}
                  </span>
                </div>

                <h3 className="font-heading font-black text-lg uppercase tracking-wide text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Connecting indicator */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Phase {idx < 3 ? '1: Issuance' : idx < 6 ? '2: Market' : '3: Impact'}</span>
                {idx < 7 && <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#7ED321] transition-colors" />}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
