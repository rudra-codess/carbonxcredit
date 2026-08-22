/**
 * @file CoreFeaturesSection.tsx
 * Section 6: 8-item icon grid showcasing core protocol capabilities.
 */

import React from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Eye, 
  Store, 
  Lock, 
  Flame, 
  Activity, 
  FileCheck2 
} from 'lucide-react';

export const CoreFeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Verified Projects",
      desc: "Strict MRV accreditation through VCS, Gold Standard, and satellite remote sensing.",
      icon: <ShieldCheck className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Carbon Credit Issuance",
      desc: "Minting ERC-1155 tokens directly pegged 1:1 with metric tonnes of CO2 equivalent.",
      icon: <Coins className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Blockchain Transparency",
      desc: "Zero opaque intermediaries; all transactions and batch serials publicly auditable.",
      icon: <Eye className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Marketplace for All",
      desc: "Democratized access for institutional enterprises, startups, and retail green champions.",
      icon: <Store className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Secure Transactions",
      desc: "Non-custodial smart contracts with ReentrancyGuard and automated atomic settlement.",
      icon: <Lock className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Retirement & Offsetting",
      desc: "Permanent token burns that irrevocably retire credits, eliminating double-counting.",
      icon: <Flame className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Real-Time Tracking",
      desc: "Instant live metrics and event streaming indexing credit velocity and global tonnage.",
      icon: <Activity className="w-6 h-6 text-[#7ED321]" />
    },
    {
      title: "Reports & Compliance",
      desc: "Cryptographic Keccak256 proof certificates ready for GHG Protocol and CSRD audits.",
      icon: <FileCheck2 className="w-6 h-6 text-[#7ED321]" />
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            05 / Core Capabilities
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Next-Gen <span className="text-[#7ED321]">Carbon Infrastructure</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Engineered with bank-grade smart contracts and decentralized storage to restore confidence in voluntary carbon mitigation.
          </p>
        </div>

        {/* 8-Item Icon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-[#111111] border border-zinc-800 hover:border-[#7ED321]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(126,211,33,0.1)] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-[#7ED321]/40 flex items-center justify-center mb-5 transition-colors group-hover:shadow-[0_0_15px_rgba(126,211,33,0.2)]">
                  {item.icon}
                </div>

                <h3 className="font-heading font-black text-lg uppercase tracking-wide text-white mb-2 group-hover:text-[#7ED321] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-600 flex justify-between">
                <span>0{index + 1}</span>
                <span className="text-[#7ED321] opacity-0 group-hover:opacity-100 transition-opacity">Enabled</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
