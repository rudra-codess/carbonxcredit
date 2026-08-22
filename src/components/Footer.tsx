/**
 * @file Footer.tsx
 * Professional dark-themed footer with leaf brand icon, network status,
 * contract ledger links, disclaimer, and copyright.
 */

import React from 'react';
import { Leaf, Github, Twitter, Disc as Discord, Shield, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070707] border-t border-zinc-900 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-[#7ED321]/40 flex items-center justify-center text-[#7ED321] shadow-[0_0_15px_rgba(126,211,33,0.15)] shrink-0">
                <Leaf className="w-5 h-5 text-[#7ED321]" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-xl tracking-wider text-white uppercase leading-none">
                    CARBON<span className="text-[#7ED321]">X</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800/90 border border-zinc-700/80 text-[10px] font-mono font-bold text-[#7ED321] uppercase tracking-wider leading-none">
                    CREDITS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase mt-1 leading-none">
                  PROTOCOL v2.4
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Transparent, immutable blockchain infrastructure for tokenizing, trading, and permanently retiring high-integrity carbon credits worldwide.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse" />
              <span>Ethereum EVM • Smart Contracts Active</span>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li><a href="#marketplace" className="hover:text-[#7ED321] transition-colors">All Carbon Listings</a></li>
              <li><a href="#marketplace" className="hover:text-[#7ED321] transition-colors">Forestry & Biomes</a></li>
              <li><a href="#marketplace" className="hover:text-[#7ED321] transition-colors">Direct Air Capture</a></li>
              <li><a href="#marketplace" className="hover:text-[#7ED321] transition-colors">Blue Carbon Sanctuary</a></li>
              <li><a href="#calculator" className="hover:text-[#7ED321] transition-colors">Emissions Calculator</a></li>
            </ul>
          </div>

          {/* Col 3: Protocol */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-4">
              Protocol & Tech
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li><a href="#how-it-works" className="hover:text-[#7ED321] transition-colors">8-Step Lifecycle</a></li>
              <li><a href="#architecture" className="hover:text-[#7ED321] transition-colors">6-Tier Architecture</a></li>
              <li><a href="#certificate" className="hover:text-[#7ED321] transition-colors">Certificate Explorer</a></li>
              <li><a href="#developers" className="hover:text-[#7ED321] transition-colors">Smart Contract ABIs</a></li>
              <li><a href="#portals" className="hover:text-[#7ED321] transition-colors">Auditor Workstation</a></li>
            </ul>
          </div>

          {/* Col 4: Community & Docs */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white mb-4">
              Governance
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li><a href="#idea" className="hover:text-[#7ED321] transition-colors">Our Manifesto</a></li>
              <li><a href="#faq" className="hover:text-[#7ED321] transition-colors">FAQ & Security</a></li>
              <li><a href="#impact" className="hover:text-[#7ED321] transition-colors">Live ESG Telemetry</a></li>
              <li><a href="#" className="hover:text-[#7ED321] transition-colors">OpenZeppelin Audits</a></li>
              <li><a href="#" className="hover:text-[#7ED321] transition-colors">IPFS CID Directory</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} CarbonX Credits Protocol. Distributed under MIT & OpenZeppelin Open Source Licenses.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy & Data</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="text-[#7ED321]">Zero Double-Counting Verified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
