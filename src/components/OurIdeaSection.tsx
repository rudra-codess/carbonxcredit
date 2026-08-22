/**
 * @file OurIdeaSection.tsx
 * Section 2: Our Vision, Our Idea, What We Do, and central manifesto quote.
 */

import React from 'react';
import { Target, Lightbulb, Zap, Quote } from 'lucide-react';

export const OurIdeaSection: React.FC = () => {
  return (
    <section id="idea" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            01 / Strategic Foundation
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Our <span className="text-[#7ED321]">Idea</span> & Purpose
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Modernizing the voluntary carbon market by replacing opaque paper brokerages with programmatic smart contracts and real-time verifiable data.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Column 1: Our Vision */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800 hover:border-[#7ED321]/50 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center text-[#7ED321] mb-6 group-hover:shadow-[0_0_20px_rgba(126,211,33,0.2)] transition-shadow">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase tracking-wide text-white mb-3 flex items-center justify-between">
              Our Vision
              <span className="text-xs font-mono text-zinc-600">01</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A frictionless global economy where every gram of greenhouse gas reduction is cryptographically verified, freely traded with near-zero slippage, and universally trustworthy.
            </p>
          </div>

          {/* Column 2: Our Idea */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800 hover:border-[#7ED321]/50 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center text-[#7ED321] mb-6 group-hover:shadow-[0_0_20px_rgba(126,211,33,0.2)] transition-shadow">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase tracking-wide text-white mb-3 flex items-center justify-between">
              Our Idea
              <span className="text-xs font-mono text-zinc-600">02</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tokenizing verified tonnes of CO2e into standardized ERC-1155 assets. Every credit batch ties directly to immutable IPFS MRV audit records and satellite sensor telemetry.
            </p>
          </div>

          {/* Column 3: What We Do */}
          <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800 hover:border-[#7ED321]/50 transition-all duration-300 relative group">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321]/30 flex items-center justify-center text-[#7ED321] mb-6 group-hover:shadow-[0_0_20px_rgba(126,211,33,0.2)] transition-shadow">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase tracking-wide text-white mb-3 flex items-center justify-between">
              What We Do
              <span className="text-xs font-mono text-zinc-600">03</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We connect project originators directly with corporate ESG buyers through a non-custodial decentralized marketplace, automating verification and irreversible retirement proof.
            </p>
          </div>

        </div>

        {/* Highlighted Quote Box */}
        <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#131d10] to-[#0d120a] border border-[#7ED321]/40 shadow-[0_0_30px_rgba(126,211,33,0.1)] relative text-center">
          <Quote className="w-10 h-10 text-[#7ED321]/30 mx-auto mb-4" />
          <blockquote className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-snug">
            “We turn climate impact into trust by combining blockchain technology with real-world sustainability.”
          </blockquote>
          <div className="mt-4 text-xs uppercase tracking-widest text-[#7ED321] font-mono font-semibold">
            — CarbonX Protocol Manifesto
          </div>
        </div>

      </div>
    </section>
  );
};
