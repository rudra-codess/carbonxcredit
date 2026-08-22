/**
 * @file CertificateSection.tsx
 * Section 10: Interactive Certificate of Retirement explorer, real-time
 * Keccak-256 cryptographic verification, SVG certificate preview with
 * download and print styling.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { RetirementCertificate } from '../types';
import { 
  Award, 
  ShieldCheck, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Sparkles, 
  Flame, 
  Copy, 
  Check 
} from 'lucide-react';

export const CertificateSection: React.FC = () => {
  const { certificates, selectedCertificate, setSelectedCertificate } = useWeb3();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  const activeCert: RetirementCertificate = selectedCertificate || certificates[0];

  const filteredCerts = certificates.filter(c => 
    c.certificateId.toString().includes(searchQuery) ||
    c.certificateHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.retireeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="certificate" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            09 / Immutable Audit Trail
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Proof of <span className="text-[#7ED321]">Retirement</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Every retired carbon credit generates a cryptographically signed Certificate of Retirement anchored directly to the Ethereum Virtual Machine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Certificate Selector & Registry List */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search certificate #, retiree, or hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121212] border border-zinc-800 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#7ED321]"
              />
            </div>

            {/* List of Certificates */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredCerts.map((cert) => {
                const isSelected = activeCert.certificateId === cert.certificateId;
                return (
                  <div
                    key={cert.certificateId}
                    onClick={() => setSelectedCertificate(cert)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-[#7ED321] shadow-[0_0_15px_rgba(126,211,33,0.15)]'
                        : 'bg-[#121212] border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#7ED321]" />
                        <span className="font-mono text-xs font-bold text-white">
                          CERTIFICATE #{cert.certificateId}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        VERIFIED IMMUTABLE
                      </span>
                    </div>

                    <div className="font-heading font-bold text-sm text-zinc-200 truncate">
                      {cert.retireeName}
                    </div>

                    <div className="text-xs text-zinc-400 mt-1 flex items-center justify-between font-mono">
                      <span>{cert.projectName}</span>
                      <span className="text-[#7ED321] font-bold">
                        {cert.amountTonsCO2e.toLocaleString()} tCO2e
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cryptographic Verification Badge */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3 text-xs font-mono text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-[#7ED321] shrink-0" />
              <span>
                All certificates verified with on-chain EVM Keccak-256 state tree algorithms.
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Printable SVG Certificate */}
          <div className="lg:col-span-7">
            {activeCert ? (
              <div className="space-y-4">
                
                {/* Visual Certificate Card */}
                <div 
                  id="printable-certificate"
                  className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#111610] via-[#0d120a] to-[#0a0f08] border-2 border-[#7ED321]/50 shadow-[0_0_40px_rgba(126,211,33,0.15)] relative overflow-hidden text-zinc-100"
                >
                  {/* Subtle Background Watermark / Guilloche Pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#7ED321_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Decorative Border Frame */}
                  <div className="border border-[#7ED321]/30 p-6 sm:p-8 rounded-xl relative">
                    
                    {/* Top Certificate Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#7ED321]/30 pb-6 mb-6 text-center sm:text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#7ED321] flex items-center justify-center text-[#7ED321] shadow-[0_0_15px_rgba(126,211,33,0.3)]">
                          <Award className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="font-heading font-black text-xl tracking-wider uppercase text-white">
                            Carbon<span className="text-[#7ED321]">X</span> Protocol
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                            Official Certificate of Carbon Retirement
                          </div>
                        </div>
                      </div>

                      <div className="text-center sm:text-right font-mono">
                        <div className="text-[10px] text-zinc-400 uppercase">Certificate No.</div>
                        <div className="text-lg font-black text-[#7ED321]">
                          CX-CERT-{activeCert.certificateId}
                        </div>
                      </div>
                    </div>

                    {/* Main Certificate Body */}
                    <div className="text-center space-y-4 my-6">
                      <div className="text-xs uppercase font-mono tracking-widest text-zinc-400">
                        This certifies that
                      </div>
                      
                      <div className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                        {activeCert.retireeName}
                      </div>

                      <div className="text-xs text-zinc-300 font-sans max-w-lg mx-auto leading-relaxed">
                        has permanently retired and neutralized carbon credits on the Ethereum blockchain on behalf of:
                      </div>

                      <div className="font-heading font-bold text-base text-[#7ED321] italic">
                        "{activeCert.beneficiary}"
                      </div>

                      {/* Massive Amount Badge */}
                      <div className="my-6 py-4 px-6 rounded-xl bg-black/60 border border-[#7ED321]/40 inline-block">
                        <div className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight">
                          {activeCert.amountTonsCO2e.toLocaleString()}{' '}
                          <span className="text-xl font-sans font-normal text-[#7ED321]">tCO2e</span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                          Metric Tonnes Carbon Dioxide Equivalent
                        </div>
                      </div>

                      {/* Project Origin Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left font-mono text-xs p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Project Name:</span>
                          <span className="text-white font-bold">{activeCert.projectName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Serial Number Batch:</span>
                          <span className="text-[#7ED321] font-bold">{activeCert.serialNumberRange}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Retirement Purpose:</span>
                          <span className="text-zinc-300">{activeCert.retirementReason}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Timestamp / Block Date:</span>
                          <span className="text-zinc-300">{new Date(activeCert.timestamp).toUTCString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Cryptographic Footer */}
                    <div className="pt-6 border-t border-[#7ED321]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                      <div className="space-y-1 text-left w-full sm:w-auto">
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7ED321]" />
                          Keccak-256 State Tree Hash:
                        </div>
                        <div className="text-[11px] text-emerald-400 break-all select-all font-mono">
                          {activeCert.certificateHash}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="p-2 rounded-lg bg-black border border-zinc-700 text-[#7ED321]">
                          <QrCode className="w-8 h-8" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Certificate Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyHash(activeCert.certificateHash)}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-[#7ED321]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedHash ? "Hash Copied!" : "Copy Verification Hash"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 rounded-lg bg-[#7ED321] hover:bg-[#6ec217] text-black text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print / PDF Certificate
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 font-mono">
                No certificate selected.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
