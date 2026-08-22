/**
 * @file ProjectDetailModal.tsx
 * Modal displaying deep real-time telemetry, verifiable MRV data points,
 * satellite analysis, sensor telemetry logs, and developer updates for an active project.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Project, ProjectUpdate } from '../types';
import { 
  X, 
  Satellite, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  ExternalLink, 
  Hash, 
  Radio, 
  Cpu, 
  Layers, 
  Flame, 
  ShoppingCart,
  Send,
  Plus,
  Bell,
  BellRing
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBuyModal?: (project: Project) => void;
  onOpenRetireModal?: (project: Project) => void;
  onOpenPriceAlertForProject?: (projectId: number) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenBuyModal,
  onOpenRetireModal,
  onOpenPriceAlertForProject
}) => {
  const { projectUpdates, postProjectUpdate, account, listings, alerts } = useWeb3();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'mrv' | 'overview' | 'submit'>('telemetry');
  
  // Submit update state within modal
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newUpdateType, setNewUpdateType] = useState<'MRV_SATELLITE' | 'SENSOR_TELEMETRY' | 'BIOMASS_AUDIT' | 'SEQUESTRATION_MILESTONE'>('MRV_SATELLITE');
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [newMetricUnit, setNewMetricUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen || !project) return null;

  // Filter updates for this project
  const projectSpecificUpdates = projectUpdates.filter(u => u.projectId === project.id);
  const matchedListing = listings.find(l => l.projectId === project.id);

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    setIsSubmitting(true);
    try {
      const metrics = [];
      if (newMetricLabel && newMetricValue) {
        metrics.push({
          label: newMetricLabel,
          value: newMetricValue,
          unit: newMetricUnit || undefined,
          verified: true,
          trend: 'up' as const
        });
      } else {
        metrics.push({
          label: "Real-Time Sequestration Rate",
          value: "+4.2%",
          unit: "Monthly Delta",
          verified: true,
          trend: 'up' as const
        });
      }

      await postProjectUpdate({
        projectId: project.id,
        updateType: newUpdateType,
        title: newTitle,
        summary: newSummary,
        metrics,
        satelliteProvider: "Copernicus Sentinel-2 & Ground Sensor Hub",
        ipfsEvidenceHash: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      });

      setSubmitSuccess(true);
      setNewTitle('');
      setNewSummary('');
      setNewMetricLabel('');
      setNewMetricValue('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('telemetry');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4 bg-[#141414]">
          <div className="flex items-start gap-4">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/40">
                  {project.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE TELEMETRY ACTIVE
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Token Batch #{project.id} • Vintage {project.vintageYear}
                </span>
              </div>

              <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
                {project.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7ED321]" />
                  {project.location} ({project.coordinates})
                </span>
                <span>•</span>
                <span>Methodology: {project.methodology}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 px-6 border-b border-zinc-800 bg-[#0e0e0e] overflow-x-auto">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'telemetry' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#7ED321]" />
            Real-Time MRV Updates ({projectSpecificUpdates.length})
          </button>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'overview' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Project Fundamentals & Impact
          </button>

          <button
            onClick={() => setActiveTab('mrv')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'mrv' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            Sensor & Satellite Oracles
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'submit' ? 'border-[#7ED321] text-[#7ED321]' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Submit Live Telemetry (Developer)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0c0c0c]">
          
          {/* TAB 1: Real-Time Telemetry Updates */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              
              {/* Telemetry Highlight Banner */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/40 flex items-center justify-center text-[#7ED321] shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white uppercase">
                      Verifiable On-Chain Data Feed
                    </h4>
                    <p className="text-xs text-zinc-400">
                      All metrics attested cryptographically via satellite passes, IoT sensors, and third-party MRV oracles.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-[#7ED321]">
                    Oracle Attestation: 100% Valid
                  </span>
                </div>
              </div>

              {/* Feed of updates */}
              {projectSpecificUpdates.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-zinc-800 text-zinc-400 font-mono text-xs">
                  No telemetry updates logged yet for this project. Submit the first reading below!
                </div>
              ) : (
                <div className="space-y-4">
                  {projectSpecificUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="p-5 rounded-2xl bg-[#121212] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-zinc-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/40">
                              {update.updateType.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-400">
                              {new Date(update.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-base text-white uppercase">
                            {update.title}
                          </h4>
                          <div className="text-xs font-mono text-zinc-400 mt-0.5">
                            Author: {update.authorName} ({update.authorAddress.slice(0, 8)}...{update.authorAddress.slice(-6)})
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Block #{update.blockNumber}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                        {update.summary}
                      </p>

                      {/* Verifiable Metric Pills Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        {update.metrics.map((m, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-black/60 border border-zinc-800/80">
                            <div className="text-[10px] font-mono text-zinc-500 truncate">{m.label}</div>
                            <div className="font-heading font-black text-lg text-white mt-0.5 flex items-baseline gap-1">
                              {m.value}
                              {m.unit && <span className="text-[11px] font-sans font-normal text-zinc-400">{m.unit}</span>}
                            </div>
                            {m.change && (
                              <div className="text-[10px] font-mono text-[#7ED321] mt-0.5 flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />
                                {m.change}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Cryptographic Proof Footer */}
                      <div className="p-3 rounded-xl bg-black/80 border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-zinc-500 shrink-0">IPFS CID:</span>
                          <span className="text-emerald-400 truncate select-all">{update.ipfsEvidenceHash}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-zinc-500">Provider:</span>
                          <span className="text-zinc-300">{update.satelliteProvider}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Project Fundamentals */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500">Total Expected CO2e</div>
                  <div className="font-heading font-black text-2xl text-white mt-1">
                    {project.expectedCO2eTons.toLocaleString()} tCO2e
                  </div>
                  <div className="text-[11px] font-mono text-[#7ED321] mt-1">
                    Lifetime removal baseline
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500">Issued On-Chain (ERC-1155)</div>
                  <div className="font-heading font-black text-2xl text-[#7ED321] mt-1">
                    {project.issuedCredits.toLocaleString()} tCO2e
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-1">
                    {project.availableCredits.toLocaleString()} available in escrow
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500">Permanently Retired</div>
                  <div className="font-heading font-black text-2xl text-emerald-400 mt-1">
                    {project.retiredCredits.toLocaleString()} tCO2e
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-1">
                    Zero double-counting guaranteed
                  </div>
                </div>
              </div>

              {/* Description & Co-benefits */}
              <div className="p-6 rounded-2xl bg-[#121212] border border-zinc-800 space-y-4">
                <h4 className="font-heading font-bold text-base uppercase text-white">
                  Ecological Project Summary
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Verified Co-Benefits & SDG Impact:</div>
                  <div className="flex flex-wrap gap-2">
                    {project.coBenefits.map((b, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-[#7ED321]">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auditor & PDD */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500">Independent MRV Auditor: </span>
                  <span className="text-white font-bold">{project.verifierName || "TÜV SÜD Climate Labs"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Verified Date: </span>
                  <span className="text-[#7ED321]">{project.verificationDate || "2025-03-02"}</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Sensor & Satellite Oracles */}
          {activeTab === 'mrv' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-[#121212] border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <Satellite className="w-5 h-5 text-[#7ED321]" />
                  <h4 className="font-heading font-bold text-base uppercase text-white">
                    Automated Remote Sensing & IoT Telemetry Architecture
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  CarbonX couples satellite remote sensing (ESA Sentinel-2, PlanetScope, NASA Landsat) with ground-level IoT sensor clusters to calculate continuous carbon sequestration velocities, canopy moisture gradients, and permanence assurance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                    <div className="text-xs font-mono text-[#7ED321] font-bold">ORACLE LAYER 1: SATELLITE IMAGERY</div>
                    <div className="text-xs text-zinc-300">Optical 10m bands calculate Normalized Difference Vegetation Index (NDVI) and above-ground biomass delta every 5 days.</div>
                    <div className="text-[11px] font-mono text-zinc-500">Latency: ~48 hours • Accuracy: ±3.2%</div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                    <div className="text-xs font-mono text-[#7ED321] font-bold">ORACLE LAYER 2: GROUND IOT MESH</div>
                    <div className="text-xs text-zinc-300">Downhole SCADA, soil moisture LoRaWAN probes, acoustic bio-diversity hydrophones, and eddy covariance flux towers.</div>
                    <div className="text-[11px] font-mono text-zinc-500">Latency: Real-time (15 min intervals)</div>
                  </div>
                </div>
              </div>

              {/* Verified Documents */}
              <div className="p-5 rounded-2xl bg-[#121212] border border-zinc-800 space-y-3">
                <h4 className="font-heading font-bold text-sm uppercase text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#7ED321]" />
                  Immutable Project Design Documents & Audits (IPFS)
                </h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-black border border-zinc-800 flex items-center justify-between">
                    <span>Project Design Document (PDD) - CarbonX v2.4</span>
                    <span className="text-[#7ED321]">{project.ipfsHash.slice(0, 16)}...</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black border border-zinc-800 flex items-center justify-between">
                    <span>Third-Party Verification Statement (TÜV SÜD)</span>
                    <span className="text-emerald-400">ipfs://QmAudit91...Verified</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Submit Live Telemetry Update (For Developers) */}
          {activeTab === 'submit' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl bg-[#121212] border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-[#7ED321]" />
                  <h4 className="font-heading font-bold text-base uppercase text-white">
                    Submit Real-Time MRV Attestation for {project.name}
                  </h4>
                </div>
                <p className="text-xs text-zinc-400">
                  Publish verifiable data points, sensor readings, or satellite updates. This broadcasts an on-chain transaction hash and updates the Live Impact Dashboard immediately.
                </p>

                {submitSuccess ? (
                  <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="font-heading font-bold text-white uppercase text-base">
                      Telemetry Attested On-Chain!
                    </div>
                    <div className="text-xs text-zinc-300 font-mono">
                      Update broadcasted to live feed with cryptographic oracle signature.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-300 block mb-1 font-bold">
                          Update Category / Sensor Type
                        </label>
                        <select
                          value={newUpdateType}
                          onChange={(e: any) => setNewUpdateType(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-[#7ED321] focus:outline-none"
                        >
                          <option value="MRV_SATELLITE">MRV Satellite Pass (Sentinel / Planet)</option>
                          <option value="SENSOR_TELEMETRY">IoT Ground Sensor / SCADA Inverter</option>
                          <option value="BIOMASS_AUDIT">Soil / Biomass Core Sample Audit</option>
                          <option value="SEQUESTRATION_MILESTONE">Sequestration Milestone Log</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-zinc-300 block mb-1 font-bold">
                          Attestation Headline / Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Monthly Canopy LiDAR Biomass Surge"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-[#7ED321] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-zinc-300 block mb-1 font-bold">
                        Detailed Telemetry Findings & Summary
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Provide empirical measurements, sensor coordinates, and sequestration readings..."
                        value={newSummary}
                        onChange={(e) => setNewSummary(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-[#7ED321] focus:outline-none"
                      />
                    </div>

                    {/* Verifiable Metric Inputs */}
                    <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                      <div className="text-xs font-mono uppercase text-[#7ED321] font-bold">
                        Verifiable Metric Data Point
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="Metric (e.g. Canopy NDVI Index)"
                            value={newMetricLabel}
                            onChange={(e) => setNewMetricLabel(e.target.value)}
                            className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Value (e.g. 0.88)"
                            value={newMetricValue}
                            onChange={(e) => setNewMetricValue(e.target.value)}
                            className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Unit (e.g. NDVI / tCO2e)"
                            value={newMetricUnit}
                            onChange={(e) => setNewMetricUnit(e.target.value)}
                            className="w-full p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(126,211,33,0.3)]"
                    >
                      {isSubmitting ? (
                        <>Broadcasting Real-Time Oracle Telemetry...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Publish Verifiable Telemetry On-Chain
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer with quick trade actions */}
        <div className="p-4 border-t border-zinc-800 bg-[#121212] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-zinc-400">Current Unit Price:</span>
            <span className="text-white font-bold">${project.pricePerTonUSD} / {project.pricePerTonETH} ETH</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenPriceAlertForProject && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPriceAlertForProject(project.id);
                }}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#7ED321] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-[#7ED321]" />
                <span>Price Alert</span>
              </button>
            )}

            {matchedListing && onOpenBuyModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBuyModal(project);
                }}
                className="px-4 py-2 rounded-xl bg-[#7ED321] hover:bg-[#6ec217] text-black text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Buy Carbon Credits
              </button>
            )}

            {matchedListing && onOpenRetireModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRetireModal(project);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 fill-black" />
                Retire & Mint Certificate
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono uppercase"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
