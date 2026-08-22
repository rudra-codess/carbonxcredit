/**
 * @file HeroSection.tsx
 * Hero section with massive typography, trust badges, live metrics pulse,
 * and high-contrast dark industrial aesthetics.
 */

import React from 'react';
import { Leaf, ShieldCheck, Eye, Globe2, ArrowRight, Sparkles, Database, Layers } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onOpenCalculator }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 border-b border-zinc-900 bg-[#0a0a0a]">
      {/* Dark Industrial Grid Background with Neon Gradient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#7ED321]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Protocol Status Pill */}
        {/* <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-[#7ED321]/30 text-xs font-mono text-zinc-300 shadow-[0_0_15px_rgba(126,211,33,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-ping" />
            <span className="text-[#7ED321] font-bold">ERC-1155 CARBON PROTOCOL</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400">Zero Double-Counting Guarantee</span>
          </div>
        </div> */}

        {/* Massive Headline */}
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 text-sm font-heading font-bold uppercase tracking-widest text-[#7ED321] mb-2">
            <Leaf className="w-4 h-4 text-[#7ED321]" />
            CarbonX Credits Blockchain
          </div>

          <h1 className="font-heading font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter uppercase text-white leading-none mb-6">
            CARBON<span className="text-[#7ED321] drop-shadow-[0_0_35px_rgba(126,211,33,0.4)]">X</span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-300 tracking-tight max-w-3xl mx-auto mb-10">
            Transparent Carbon Credits. <span className="text-white font-medium">Greener Tomorrow.</span>
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Eliminating opacity and double-counting in global voluntary carbon markets through immutable smart contracts, satellite MRV verification, and cryptographic retirement certificates.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-explore-cta"
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(126,211,33,0.35)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105"
            >
              Explore the Platform
              <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
            </button>

            <button
              id="hero-calc-cta"
              onClick={onOpenCalculator}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#7ED321]/50 text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#7ED321]" />
              Calculate & Offset Footprint
            </button>
          </div>
        </div>

        {/* 3 Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6 border-t border-zinc-800/80">
          
          {/* Badge 1 */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-[#7ED321]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center text-[#7ED321] shrink-0 shadow-[0_0_15px_rgba(126,211,33,0.15)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                Trusted
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Verified Impact (VCS & Gold Standard)
              </div>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-[#7ED321]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center text-[#7ED321] shrink-0 shadow-[0_0_15px_rgba(126,211,33,0.15)]">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                Transparent
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                On-Chain Traceability & Serial IDs
              </div>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-[#7ED321]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center text-[#7ED321] shrink-0 shadow-[0_0_15px_rgba(126,211,33,0.15)]">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-white uppercase text-sm tracking-wide">
                Sustainable
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                A Greener Planet & High-Integrity CDR
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
