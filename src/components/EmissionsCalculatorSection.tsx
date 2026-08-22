/**
 * @file EmissionsCalculatorSection.tsx
 * Section 8: Interactive Corporate & Individual Carbon Emissions Calculator.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Calculator, Flame, Sparkles, Building, Plane, Zap, Server, ArrowRight } from 'lucide-react';

interface EmissionsCalculatorSectionProps {
  onOffsetNow: (tonnes: number) => void;
}

export const EmissionsCalculatorSection: React.FC<EmissionsCalculatorSectionProps> = ({ onOffsetNow }) => {
  const [calcMode, setCalcMode] = useState<'quick' | 'detailed'>('quick');
  
  // Quick Mode
  const [quickTons, setQuickTons] = useState<number>(250);

  // Detailed Scope Mode
  const [scope1Fuel, setScope1Fuel] = useState<number>(80); // Vehicles / natural gas
  const [scope2Power, setScope2Power] = useState<number>(140); // Electricity MWh
  const [scope3Flights, setScope3Flights] = useState<number>(50); // Air travel & cloud servers

  const detailedTotal = scope1Fuel + scope2Power + scope3Flights;
  const activeTons = calcMode === 'quick' ? quickTons : detailedTotal;

  // Pricing calculations (average $18.50/ton, ETH @ $3,000)
  const avgPriceUSD = 18.5;
  const totalCostUSD = activeTons * avgPriceUSD;
  const totalCostETH = totalCostUSD / 3000;

  return (
    <section id="calculator" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            07 / Carbon Footprint Intelligence
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Emissions <span className="text-[#7ED321]">Calculator</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Quantify your organizational or operational greenhouse gas footprint and determine exact on-chain carbon credits required for net-zero.
          </p>
        </div>

        {/* Calculator Widget Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#111111] border border-zinc-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#7ED321]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Mode Switcher */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-[#7ED321]/30 text-[#7ED321]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg uppercase text-white">
                  GHG Protocol Estimation Engine
                </h3>
                <p className="text-xs text-zinc-400">Compliant with ISO 14064 & SBTi standards</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setCalcMode('quick')}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all ${
                  calcMode === 'quick' ? 'bg-[#7ED321] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Quick Total
              </button>
              <button
                onClick={() => setCalcMode('detailed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase transition-all ${
                  calcMode === 'detailed' ? 'bg-[#7ED321] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Scope 1-2-3 Breakdown
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Column */}
            <div className="lg:col-span-7 space-y-6">
              {calcMode === 'quick' ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <label className="font-bold text-zinc-300 uppercase">
                      Annual Operational Emissions (tCO2e)
                    </label>
                    <span className="text-[#7ED321] font-bold">{quickTons.toLocaleString()} Tonnes</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="5000"
                    step="10"
                    value={quickTons}
                    onChange={(e) => setQuickTons(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#7ED321]"
                  />

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[50, 250, 1000, 2500].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQuickTons(t)}
                        className={`py-2 rounded-xl border text-xs font-mono transition-all ${
                          quickTons === t
                            ? 'bg-[#7ED321]/20 border-[#7ED321] text-[#7ED321]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {t} tCO2e
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Scope 1 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        Scope 1: Direct Combustion & Fleet (tCO2e)
                      </span>
                      <span className="text-white font-bold">{scope1Fuel} t</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={scope1Fuel}
                      onChange={(e) => setScope1Fuel(parseInt(e.target.value) || 0)}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
                    />
                  </div>

                  {/* Scope 2 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Scope 2: Purchased Electricity & Steam (tCO2e)
                      </span>
                      <span className="text-white font-bold">{scope2Power} t</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      value={scope2Power}
                      onChange={(e) => setScope2Power(parseInt(e.target.value) || 0)}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  {/* Scope 3 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <Plane className="w-3.5 h-3.5 text-cyan-400" />
                        Scope 3: Supply Chain, Cloud & Travel (tCO2e)
                      </span>
                      <span className="text-white font-bold">{scope3Flights} t</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2500"
                      value={scope3Flights}
                      onChange={(e) => setScope3Flights(parseInt(e.target.value) || 0)}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400 font-mono">
                💡 <span className="text-zinc-200 font-semibold">Equivalency Impact:</span> Offsetting {activeTons.toLocaleString()} tonnes neutralizes approximately {(activeTons * 2480).toLocaleString()} passenger car miles or the annual carbon absorption of {(activeTons * 45).toLocaleString()} mature trees.
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-[#141d11] border border-[#7ED321]/40 shadow-[0_0_25px_rgba(126,211,33,0.15)] flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-1 font-bold">
                  Offset Requirement
                </div>
                <div className="font-heading font-black text-4xl text-white mb-4">
                  {activeTons.toLocaleString()} <span className="text-lg font-sans font-normal text-zinc-400">CXC Credits</span>
                </div>

                <div className="space-y-2 py-3 border-y border-zinc-800 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Est. Fiat Cost:</span>
                    <span className="text-white font-bold">${totalCostUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Est. Crypto Cost:</span>
                    <span className="text-[#7ED321] font-bold">{totalCostETH.toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Certificate Hash:</span>
                    <span className="text-zinc-500">Auto Keccak256</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  id="calc-offset-now-btn"
                  onClick={() => onOffsetNow(activeTons)}
                  className="w-full py-4 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(126,211,33,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  Offset {activeTons.toLocaleString()} tCO2e Now
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
