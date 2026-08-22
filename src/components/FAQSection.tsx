/**
 * @file FAQSection.tsx
 * Section 12: Frequently Asked Questions with smooth accordion toggles.
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes CarbonX Credits different from traditional carbon registries?",
      a: "Traditional carbon markets rely on opaque paper records and intermediary brokers where credits can take months to clear and are vulnerable to double-counting. CarbonX digitizes verified tonnes of CO2e into ERC-1155 tokens on the Ethereum blockchain, providing instantaneous settlement, immutable serial IDs, IPFS-backed MRV audit documentation, and cryptographic retirement certificates."
    },
    {
      q: "How does the protocol guarantee zero double-counting?",
      a: "When a credit is retired on CarbonX, the underlying ERC-1155 token is irrevocably burned on-chain via the RetirementRegistry smart contract. Once burned, the token ceases to exist in the circulating supply and cannot be transferred, re-listed, or retired again. A unique Keccak-256 certificate hash is permanently logged to the ledger."
    },
    {
      q: "What standards and methodologies are supported?",
      a: "CarbonX integrates with premier global standards including Verra VCS (Verified Carbon Standard), Gold Standard, Puro.earth (technical carbon removal), and the American Carbon Registry (ACR). All projects must undergo verification by accredited third-party auditing entities (such as TÜV SÜD or DNV) before tokens can be minted."
    },
    {
      q: "Can individuals and SMEs buy carbon credits or is this only for large corporations?",
      a: "CarbonX democratizes climate action for everyone. Institutional buyers can procure gigawatt-scale corporate offsets, while individuals and small businesses can offset flight journeys, web server hosting, or household footprints with as little as 1 credit (1 tonne CO2e) with zero minimum order friction."
    },
    {
      q: "What is the role of ERC-1155 in carbon credit tokenization?",
      a: "ERC-1155 is Ethereum's multi-token standard. It allows each project vintage to exist as a semi-fungible batch (Token ID #1, Token ID #2, etc.) while sharing the same underlying smart contract. This drastically reduces gas costs by up to 85% compared to deploying separate ERC-20 or ERC-721 contracts for every vintage."
    },
    {
      q: "How are project documents stored securely?",
      a: "All Project Design Documents (PDDs), baseline satellite measurements, and verification audit sign-offs are cryptographically pinned to the InterPlanetary File System (IPFS) and Filecoin. The IPFS Content Identifier (CID) is stored directly in the smart contract, preventing retroactive alteration or deletion."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            11 / Knowledge Base
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Frequently Asked <span className="text-[#7ED321]">Questions</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Everything you need to know about the CarbonX protocol, on-chain token mechanics, and MRV verification.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/90 border-[#7ED321]/60 shadow-[0_0_20px_rgba(126,211,33,0.1)]'
                    : 'bg-[#121212] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-white uppercase tracking-tight">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-zinc-800 text-zinc-400 shrink-0 transition-transform ${isOpen ? 'text-[#7ED321] rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed border-t border-zinc-800/60">
                    {faq.a}
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
