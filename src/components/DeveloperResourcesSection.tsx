/**
 * @file DeveloperResourcesSection.tsx
 * Section 11: Developer resources with live Hardhat smart contract code viewer,
 * ABI endpoints, testnet faucet guidance, and Web3 integration snippets.
 */

import React, { useState } from 'react';
import { CONTRACT_ADDRESSES, CONTRACT_SOURCE_CODE } from '../data/contracts';
import { 
  Code, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode, 
  Cpu, 
  Zap, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';

export const DeveloperResourcesSection: React.FC = () => {
  const [activeContract, setActiveContract] = useState<'projectRegistry' | 'carbonCreditToken' | 'marketplace' | 'retirementRegistry'>('carbonCreditToken');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<'solidity' | 'javascript' | 'python'>('solidity');

  const handleCopy = (text: string, type: 'address' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const jsSnippet = `import { ethers } from "ethers";
import CarbonCreditTokenABI from "./abis/CarbonCreditToken.json";

// Initialize provider and contract instance
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const carbonToken = new ethers.Contract(
  "${CONTRACT_ADDRESSES.carbonCreditToken}",
  CarbonCreditTokenABI,
  signer
);

// Query balance of Token ID #1 (Amazonian Reforestation)
const balance = await carbonToken.balanceOf(await signer.getAddress(), 1);
console.log("Owned Carbon Credits (tCO2e):", balance.toString());`;

  const pythonSnippet = `from web3 import Web3

# Connect to local Hardhat node or EVM RPC
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

contract_address = "${CONTRACT_ADDRESSES.carbonCreditToken}"
# Load ABI and interact
carbon_token = w3.eth.contract(address=contract_address, abi=CONTRACT_ABI)

# Check total retired tonnage for batch
retired_amount = carbon_token.functions.batches(1).call()
print(f"Batch #1 Retired Supply: {retired_amount[3]} tCO2e")`;

  return (
    <section id="developers" className="py-24 bg-[#0d0d0d] relative border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            10 / Smart Contract Architecture & SDKs
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Developer & <span className="text-[#7ED321]">Smart Contracts</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Build on top of open, composable climate infrastructure. Verified on Hardhat EVM with OpenZeppelin security primitives.
          </p>
        </div>

        {/* Contract Address Bar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">01 / ProjectRegistry</div>
            <div className="font-mono text-xs font-bold text-white mt-1 truncate">
              {CONTRACT_ADDRESSES.projectRegistry}
            </div>
            <button
              onClick={() => handleCopy(CONTRACT_ADDRESSES.projectRegistry, 'address')}
              className="mt-2 text-[11px] font-mono text-[#7ED321] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedAddress === CONTRACT_ADDRESSES.projectRegistry ? "Copied!" : "Copy Address →"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">02 / CarbonCreditToken (ERC-1155)</div>
            <div className="font-mono text-xs font-bold text-white mt-1 truncate">
              {CONTRACT_ADDRESSES.carbonCreditToken}
            </div>
            <button
              onClick={() => handleCopy(CONTRACT_ADDRESSES.carbonCreditToken, 'address')}
              className="mt-2 text-[11px] font-mono text-[#7ED321] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedAddress === CONTRACT_ADDRESSES.carbonCreditToken ? "Copied!" : "Copy Address →"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">03 / Marketplace Escrow</div>
            <div className="font-mono text-xs font-bold text-white mt-1 truncate">
              {CONTRACT_ADDRESSES.marketplace}
            </div>
            <button
              onClick={() => handleCopy(CONTRACT_ADDRESSES.marketplace, 'address')}
              className="mt-2 text-[11px] font-mono text-[#7ED321] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedAddress === CONTRACT_ADDRESSES.marketplace ? "Copied!" : "Copy Address →"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">04 / RetirementRegistry</div>
            <div className="font-mono text-xs font-bold text-white mt-1 truncate">
              {CONTRACT_ADDRESSES.retirementRegistry}
            </div>
            <button
              onClick={() => handleCopy(CONTRACT_ADDRESSES.retirementRegistry, 'address')}
              className="mt-2 text-[11px] font-mono text-[#7ED321] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedAddress === CONTRACT_ADDRESSES.retirementRegistry ? "Copied!" : "Copy Address →"}
            </button>
          </div>

        </div>

        {/* Code Explorer Sandbox */}
        <div className="rounded-2xl bg-[#111111] border border-zinc-800 overflow-hidden shadow-2xl">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-zinc-800 bg-[#141414] flex flex-wrap items-center justify-between gap-4">
            
            {/* Contract Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setActiveContract('carbonCreditToken'); setCodeLanguage('solidity'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeContract === 'carbonCreditToken' && codeLanguage === 'solidity'
                    ? 'bg-[#7ED321] text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                CarbonCreditToken.sol
              </button>

              <button
                onClick={() => { setActiveContract('projectRegistry'); setCodeLanguage('solidity'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeContract === 'projectRegistry' && codeLanguage === 'solidity'
                    ? 'bg-[#7ED321] text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                ProjectRegistry.sol
              </button>

              <button
                onClick={() => { setActiveContract('marketplace'); setCodeLanguage('solidity'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeContract === 'marketplace' && codeLanguage === 'solidity'
                    ? 'bg-[#7ED321] text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                Marketplace.sol
              </button>

              <button
                onClick={() => { setActiveContract('retirementRegistry'); setCodeLanguage('solidity'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeContract === 'retirementRegistry' && codeLanguage === 'solidity'
                    ? 'bg-[#7ED321] text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                RetirementRegistry.sol
              </button>
            </div>

            {/* SDK Languages */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCodeLanguage('javascript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  codeLanguage === 'javascript' ? 'bg-[#7ED321] text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                JS / Ethers.js
              </button>
              <button
                onClick={() => setCodeLanguage('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  codeLanguage === 'python' ? 'bg-[#7ED321] text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                Python Web3.py
              </button>
            </div>

          </div>

          {/* Code Viewer */}
          <div className="p-6 bg-[#0c0c0c] relative">
            <button
              onClick={() => handleCopy(
                codeLanguage === 'solidity' ? CONTRACT_SOURCE_CODE[activeContract] :
                codeLanguage === 'javascript' ? jsSnippet : pythonSnippet,
                'code'
              )}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer z-10 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#7ED321]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? "Copied!" : "Copy Code"}
            </button>

            <pre className="text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-[420px] selection:bg-[#7ED321] selection:text-black">
              <code>
                {codeLanguage === 'solidity' && CONTRACT_SOURCE_CODE[activeContract]}
                {codeLanguage === 'javascript' && jsSnippet}
                {codeLanguage === 'python' && pythonSnippet}
              </code>
            </pre>
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-zinc-800 bg-[#121212] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7ED321]" />
              <span>Smart Contracts compiler: Solidity 0.8.20 • OpenZeppelin v5.0</span>
            </div>
            <div className="text-zinc-500">
              Zero Double-Counting Assertion Checked
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
