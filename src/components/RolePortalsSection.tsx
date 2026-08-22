/**
 * @file RolePortalsSection.tsx
 * Section 7: Role-Based Portals for Project Developers, Buyers, and Verifiers.
 * Provides interactive tabs, active role switching, and action tools including
 * real-time telemetry and MRV updates submission.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ProjectCategory, UpdateType } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  ShoppingCart, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Layers,
  ArrowRight,
  UploadCloud,
  Radio,
  Send,
  Satellite
} from 'lucide-react';

export const RolePortalsSection: React.FC = () => {
  const { 
    account, 
    switchAccount, 
    projects, 
    registerProject, 
    verifyProject, 
    rejectProject, 
    issueCredits,
    postProjectUpdate
  } = useWeb3();

  const [activePortal, setActivePortal] = useState<'DEVELOPER' | 'BUYER' | 'VERIFIER'>('DEVELOPER');
  const [devActionTab, setDevActionTab] = useState<'REGISTER' | 'TELEMETRY'>('REGISTER');
  
  // Developer Form State (Register)
  const [projName, setProjName] = useState('');
  const [projCountry, setProjCountry] = useState('Brazil');
  const [projCategory, setProjCategory] = useState<ProjectCategory>('Forestry');
  const [projExpected, setProjExpected] = useState<number>(45000);
  const [projPrice, setProjPrice] = useState<number>(18.5);
  const [devSubmitMsg, setDevSubmitMsg] = useState<string | null>(null);

  // Developer Form State (Telemetry Update)
  const [selectedProjIdForUpdate, setSelectedProjIdForUpdate] = useState<number>(projects[0]?.id || 1);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateSummary, setUpdateSummary] = useState('');
  const [updateType, setUpdateType] = useState<UpdateType>('MRV_SATELLITE');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('');
  const [telemetryMsg, setTelemetryMsg] = useState<string | null>(null);
  const [isSubmittingTelemetry, setIsSubmittingTelemetry] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName) return;

    const res = await registerProject({
      name: projName,
      country: projCountry,
      category: projCategory,
      expectedCO2eTons: projExpected,
      pricePerTonUSD: projPrice,
      methodology: "VM0007 / VCS Verified"
    });

    if (res.success) {
      setDevSubmitMsg(`Project #${res.projectId} submitted successfully to the on-chain verification queue!`);
      setProjName('');
      setTimeout(() => setDevSubmitMsg(null), 5000);
    }
  };

  const handleTelemetrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle || !updateSummary) return;

    setIsSubmittingTelemetry(true);
    try {
      const metrics = [];
      if (metricLabel && metricValue) {
        metrics.push({
          label: metricLabel,
          value: metricValue,
          unit: metricUnit || undefined,
          verified: true,
          trend: 'up' as const
        });
      } else {
        metrics.push({
          label: "NDVI Sequestration Index",
          value: "0.86",
          verified: true,
          trend: 'up' as const
        });
      }

      await postProjectUpdate({
        projectId: selectedProjIdForUpdate,
        updateType,
        title: updateTitle,
        summary: updateSummary,
        metrics,
        satelliteProvider: "ESA Sentinel-2 & Project IoT Transducer Hub",
        ipfsEvidenceHash: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      });

      setTelemetryMsg("Live telemetry and MRV attestation successfully published to on-chain stream!");
      setUpdateTitle('');
      setUpdateSummary('');
      setMetricLabel('');
      setMetricValue('');
      setMetricUnit('');
      setTimeout(() => setTelemetryMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTelemetry(false);
    }
  };

  return (
    <section id="portals" className="py-24 bg-[#0d0d0d] relative border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
            06 / Role-Based Portals
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-4">
            Tailored Experiences For <span className="text-[#7ED321]">Every Stakeholder</span>
          </h2>
          <div className="w-24 h-0.5 bg-[#7ED321] mx-auto mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">
            Select your persona below to experience specialized toolsets for project developers, accredited verifiers, and institutional buyers.
          </p>
        </div>

        {/* 3 Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Developer Card */}
          <div
            onClick={() => {
              setActivePortal('DEVELOPER');
              switchAccount(0); // Apex Green Infrastructure
            }}
            className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              activePortal === 'DEVELOPER'
                ? 'bg-zinc-900 border-[#7ED321] shadow-[0_0_25px_rgba(126,211,33,0.2)]'
                : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase text-white mb-2">
              I'm a Project Developer
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Onboard projects, submit verifiable real-time sensor/satellite telemetry, mint ERC-1155 credit batches, and monetize impact directly.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7ED321]">
              <span>{activePortal === 'DEVELOPER' ? '● Active Portal' : 'Select Developer Portal →'}</span>
            </div>
          </div>

          {/* Buyer Card */}
          <div
            onClick={() => {
              setActivePortal('BUYER');
              switchAccount(2); // Novartis Corporate Buyer
            }}
            className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              activePortal === 'BUYER'
                ? 'bg-zinc-900 border-[#7ED321] shadow-[0_0_25px_rgba(126,211,33,0.2)]'
                : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-lime-500/40 flex items-center justify-center text-[#7ED321] mb-4">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase text-white mb-2">
              I'm a Corporate Buyer
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Procure institutional-grade carbon credits, neutralize Scope 1/2/3 footprints, and generate cryptographic Keccak256 proof certificates.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7ED321]">
              <span>{activePortal === 'BUYER' ? '● Active Portal' : 'Select Buyer Portal →'}</span>
            </div>
          </div>

          {/* Verifier Card */}
          <div
            onClick={() => {
              setActivePortal('VERIFIER');
              switchAccount(1); // TÜV SÜD Verifier
            }}
            className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
              activePortal === 'VERIFIER'
                ? 'bg-zinc-900 border-[#7ED321] shadow-[0_0_25px_rgba(126,211,33,0.2)]'
                : 'bg-[#121212] border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl uppercase text-white mb-2">
              I'm a Verifier & Auditor
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Audit submitted methodologies and satellite MRV evidence on-chain, issue validation attestations, and govern credit issuance limits.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7ED321]">
              <span>{activePortal === 'VERIFIER' ? '● Active Portal' : 'Select Verifier Portal →'}</span>
            </div>
          </div>

        </div>

        {/* Dynamic Portal Interactive Workspace */}
        <div className="p-8 rounded-2xl bg-[#111111] border border-zinc-800">
          
          {/* DEVELOPER PORTAL VIEW */}
          {activePortal === 'DEVELOPER' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                <div>
                  <h4 className="font-heading font-black text-lg uppercase text-white">
                    Project Developer Workstation
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Logged in as: <span className="text-[#7ED321] font-mono">{account.name}</span> ({account.address.slice(0, 8)}...{account.address.slice(-6)})
                  </p>
                </div>

                {/* Developer sub-tabs */}
                <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setDevActionTab('REGISTER')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      devActionTab === 'REGISTER'
                        ? 'bg-[#7ED321] text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    1. Onboard Project
                  </button>
                  <button
                    onClick={() => setDevActionTab('TELEMETRY')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                      devActionTab === 'TELEMETRY'
                        ? 'bg-[#7ED321] text-black font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Radio className="w-3 h-3 text-current" />
                    2. Submit Real-Time MRV
                  </button>
                </div>
              </div>

              {devSubmitMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-xs text-emerald-300 font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{devSubmitMsg}</span>
                </div>
              )}

              {telemetryMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-xs text-emerald-300 font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{telemetryMsg}</span>
                </div>
              )}

              {devActionTab === 'REGISTER' ? (
                <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                      Project Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Borneo Peat Swamp Forest Regeneration"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                      Host Country / Region
                    </label>
                    <input
                      type="text"
                      value={projCountry}
                      onChange={(e) => setProjCountry(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                      Project Category
                    </label>
                    <select
                      value={projCategory}
                      onChange={(e: any) => setProjCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                    >
                      <option value="Forestry">Forestry & Reforestation</option>
                      <option value="Blue Carbon">Blue Carbon (Mangroves/Kelp)</option>
                      <option value="Direct Air Capture">Direct Air Capture (DAC)</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Methane Capture">Methane Capture</option>
                      <option value="Soil Carbon">Soil Carbon</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                      Expected Total CO2e Capacity (Tonnes)
                    </label>
                    <input
                      type="number"
                      min="100"
                      value={projExpected}
                      onChange={(e) => setProjExpected(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                      MRV Audit & PDD Documents (IPFS Hashed)
                    </label>
                    <div className="p-4 rounded-xl border border-dashed border-zinc-700 bg-black text-center text-xs text-zinc-400 font-mono flex flex-col items-center justify-center gap-2">
                      <UploadCloud className="w-6 h-6 text-[#7ED321]" />
                      <span>ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx</span>
                      <span className="text-[10px] text-zinc-500">Auto-pinned to decentralized Filecoin / IPFS nodes</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(126,211,33,0.25)]"
                    >
                      <PlusCircle className="w-4 h-4 stroke-[3]" />
                      Submit Project for Smart Contract Audit
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleTelemetrySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                        Select Active Project
                      </label>
                      <select
                        value={selectedProjIdForUpdate}
                        onChange={(e) => setSelectedProjIdForUpdate(parseInt(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>
                            #{p.id} - {p.name} ({p.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                        Telemetry / Sensor Type
                      </label>
                      <select
                        value={updateType}
                        onChange={(e: any) => setUpdateType(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                      >
                        <option value="MRV_SATELLITE">Satellite Optical Pass (Sentinel / PlanetScope)</option>
                        <option value="SENSOR_TELEMETRY">IoT Ground Transducer / SCADA Inverter</option>
                        <option value="BIOMASS_AUDIT">Soil Organic Core Sample Audit</option>
                        <option value="SEQUESTRATION_MILESTONE">Cumulative Milestone Log</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                        Update Title / Headline
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Q1 Biomass Density Growth & Hydration Index"
                        value={updateTitle}
                        onChange={(e) => setUpdateTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-mono font-bold uppercase text-zinc-300 block mb-1.5">
                        Empirical Field Observations & Telemetry Summary
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detail the verified measurements, satellite reflectance bands, downhole sensors, or core audits..."
                        value={updateSummary}
                        onChange={(e) => setUpdateSummary(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-[#7ED321]"
                      />
                    </div>

                    {/* Metric Data Points */}
                    <div className="md:col-span-2 p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                      <div className="text-xs font-mono uppercase text-[#7ED321] font-bold">
                        Verifiable Metric Data Point
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Label (e.g. Sequestration Rate)"
                          value={metricLabel}
                          onChange={(e) => setMetricLabel(e.target.value)}
                          className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 1,420)"
                          value={metricValue}
                          onChange={(e) => setMetricValue(e.target.value)}
                          className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Unit (e.g. tCO2e / NDVI)"
                          value={metricUnit}
                          onChange={(e) => setMetricUnit(e.target.value)}
                          className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingTelemetry}
                    className="w-full py-3.5 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(126,211,33,0.25)] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmittingTelemetry ? "Attesting Telemetry..." : "Publish Real-Time Project Update"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* BUYER PORTAL VIEW */}
          {activePortal === 'BUYER' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                <div>
                  <h4 className="font-heading font-black text-lg uppercase text-white">
                    Corporate ESG Offset Console
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Active Portfolio: <span className="text-[#7ED321] font-mono">{account.name}</span> • Balance: {account.balanceETH} ETH
                  </p>
                </div>
                <a
                  href="#marketplace"
                  className="px-3 py-1.5 rounded bg-[#7ED321] text-black font-heading font-bold text-xs uppercase tracking-wide inline-flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Browse Live Market
                </a>
              </div>

              {/* Portfolio Holding summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500">Owned Active Credits</div>
                  <div className="font-heading font-black text-2xl text-white mt-1">
                    {(Object.values(account.ownedCredits) as number[]).reduce((a: number, b: number) => a + b, 0).toLocaleString()} tCO2e
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500">Offset Certificates Held</div>
                  <div className="font-heading font-black text-2xl text-emerald-400 mt-1">
                    2 Certificates
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500">Compliance Status</div>
                  <div className="font-heading font-black text-2xl text-[#7ED321] mt-1">
                    100% Audited
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VERIFIER PORTAL VIEW */}
          {activePortal === 'VERIFIER' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                <div>
                  <h4 className="font-heading font-black text-lg uppercase text-white">
                    Accredited Auditor MRV Review Queue
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Verifier ID: <span className="text-cyan-400 font-mono">{account.name}</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono">
                  Role: VERIFIER_ROLE
                </span>
              </div>

              {/* Pending projects review table */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-sm uppercase">
                          {proj.name}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          proj.status === 'PendingVerification' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          proj.status === 'Verified' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        {proj.country} • {proj.expectedCO2eTons.toLocaleString()} tCO2e • {proj.methodology}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {proj.status === 'PendingVerification' ? (
                        <>
                          <button
                            onClick={() => verifyProject(proj.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-heading font-black text-xs uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectProject(proj.id, "Methodology baseline mismatch")}
                            className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-heading font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      ) : proj.status === 'Verified' && proj.issuedCredits === 0 ? (
                        <button
                          onClick={() => issueCredits(proj.id, Math.floor(proj.expectedCO2eTons * 0.75), 2026)}
                          className="px-3 py-1.5 rounded-lg bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Mint ERC-1155 Batch
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-zinc-500">Audit Complete</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
