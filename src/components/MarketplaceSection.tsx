/**
 * @file MarketplaceSection.tsx
 * Section 5: Carbon Credit Marketplace preview and trading cards with
 * direct access to project MRV telemetry dossiers.
 */

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { MarketplaceListing, ProjectCategory, Project } from '../types';
import { 
  Trees, 
  Waves, 
  Wind, 
  Zap, 
  Flame, 
  Sprout, 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  ShieldCheck, 
  MapPin, 
  ExternalLink,
  Flame as BurnIcon,
  Radio,
  ArrowUpRight,
  Bell,
  BellRing
} from 'lucide-react';

interface MarketplaceSectionProps {
  onOpenBuyModal: (listing: MarketplaceListing) => void;
  onOpenRetireModal: (listing: MarketplaceListing) => void;
  onSelectProjectForDetail?: (project: Project) => void;
  onOpenPriceAlertForProject?: (projectId: number) => void;
  onOpenPriceAlerts?: () => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ 
  onOpenBuyModal, 
  onOpenRetireModal,
  onSelectProjectForDetail,
  onOpenPriceAlertForProject,
  onOpenPriceAlerts
}) => {
  const { listings, alerts, setSelectedProjectForDetail } = useWeb3();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'availability'>('price-asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Forestry', 'Blue Carbon', 'Direct Air Capture', 'Renewable Energy', 'Soil Carbon'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Forestry': return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'Blue Carbon': return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'Direct Air Capture': return <Wind className="w-4 h-4 text-sky-400" />;
      case 'Renewable Energy': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Methane Capture': return <Flame className="w-4 h-4 text-orange-400" />;
      default: return <Sprout className="w-4 h-4 text-[#7ED321]" />;
    }
  };

  const handleInspectProject = (project: Project) => {
    if (onSelectProjectForDetail) {
      onSelectProjectForDetail(project);
    } else if (setSelectedProjectForDetail) {
      setSelectedProjectForDetail(project);
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.project.category === selectedCategory;
    const matchesSearch = item.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.project.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.project.methodology.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerCreditUSD - b.pricePerCreditUSD;
    if (sortBy === 'price-desc') return b.pricePerCreditUSD - a.pricePerCreditUSD;
    if (sortBy === 'availability') return b.remainingAmount - a.remainingAmount;
    return 0;
  });

  return (
    <section id="marketplace" className="py-24 bg-[#0a0a0a] relative border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#7ED321] mb-2 font-bold">
              04 / Spot Marketplace
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight text-white">
              Verified Carbon <span className="text-[#7ED321]">Credit Listings</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Buy directly from audited project originators. 1 token = 1 metric tonne CO2e reduction backed by live satellite and IoT telemetry proofs.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search biome, country, or standard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#7ED321] font-mono"
            />
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800/80">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#7ED321] text-black shadow-[0_0_15px_rgba(126,211,33,0.25)]'
                    : 'bg-[#121212] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Set Price Alert Button */}
            {onOpenPriceAlerts && (
              <button
                id="marketplace-open-alerts-btn"
                onClick={onOpenPriceAlerts}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#7ED321] text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                title="Create a Target Price Alert for any carbon credit project"
              >
                <BellRing className="w-3.5 h-3.5 text-[#7ED321]" />
                <span>Price Alerts</span>
              </button>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#141414] border border-zinc-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-[#7ED321]"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="availability">Highest Inventory</option>
              </select>
            </div>
          </div>

        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((listing) => {
            const { project } = listing;
            return (
              <div
                key={listing.id}
                className="rounded-2xl bg-[#121212] border border-zinc-800 hover:border-[#7ED321]/60 transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1 shadow-lg hover:shadow-[0_0_25px_rgba(126,211,33,0.15)]"
              >
                {/* Card Image */}
                <div 
                  className="relative h-44 overflow-hidden cursor-pointer"
                  onClick={() => handleInspectProject(project)}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-zinc-700/80 text-[11px] font-mono text-zinc-200">
                    {getCategoryIcon(project.category)}
                    <span>{project.category}</span>
                  </div>

                  {/* Country Flag Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-zinc-700/80 text-xs font-mono text-zinc-300">
                    {project.country}
                  </div>

                  {/* Real-time Telemetry Tag */}
                  <div className="absolute bottom-2 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live MRV Telemetry
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => handleInspectProject(project)}
                      className="font-heading font-black text-base uppercase text-white tracking-tight mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-[#7ED321] transition-colors"
                    >
                      {project.name}
                    </h3>

                    <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#7ED321]" />
                      <span className="truncate">{project.methodology}</span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {project.description}
                    </p>

                    {/* View Telemetry Trigger */}
                    <button
                      type="button"
                      onClick={() => handleInspectProject(project)}
                      className="text-xs font-mono text-[#7ED321] hover:underline flex items-center gap-1 mb-3 cursor-pointer"
                    >
                      <Radio className="w-3 h-3 text-[#7ED321]" />
                      Inspect Real-Time MRV Feed →
                    </button>
                  </div>

                  <div>
                    {/* Price & Available Metrics */}
                    <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 mb-3">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-zinc-500">Available:</span>
                        <span className="text-white font-bold">{listing.remainingAmount.toLocaleString()} tCO2e</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500">Price / Credit:</span>
                        <span className="text-[#7ED321] font-bold">${listing.pricePerCreditUSD.toFixed(2)} / {listing.pricePerCreditETH} ETH</span>
                      </div>
                    </div>

                    {/* Price Alert Shortcut */}
                    {onOpenPriceAlertForProject && (
                      <div className="mb-3 flex items-center justify-between">
                        {alerts.some(a => a.active && (a.projectId === project.id || a.projectId === 'ALL')) ? (
                          <button
                            type="button"
                            onClick={() => onOpenPriceAlertForProject(project.id)}
                            className="w-full py-1 px-2.5 rounded-lg bg-[#7ED321]/10 border border-[#7ED321]/30 hover:border-[#7ED321] text-[11px] font-mono text-[#7ED321] flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-1.5 font-semibold">
                              <BellRing className="w-3 h-3 animate-pulse" />
                              Price Alert Active
                            </span>
                            <span className="text-[10px] text-zinc-400">Edit Alert →</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenPriceAlertForProject(project.id)}
                            className="w-full py-1 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-[11px] font-mono text-zinc-400 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Bell className="w-3 h-3 text-zinc-500" />
                              Set Target Price Alert
                            </span>
                            <span className="text-[10px] text-[#7ED321]">Set Target →</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenBuyModal(listing)}
                        className="w-full py-2.5 rounded-lg bg-[#7ED321] hover:bg-[#6ec217] text-black font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                        Buy
                      </button>

                      <button
                        onClick={() => onOpenRetireModal(listing)}
                        className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500 text-zinc-200 hover:text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BurnIcon className="w-3.5 h-3.5 text-emerald-400" />
                        Offset
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
