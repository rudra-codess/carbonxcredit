/**
 * @file App.tsx
 * Main application component orchestrating the complete CarbonX Credits
 * blockchain carbon marketplace platform.
 */

import React, { useState } from 'react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthPortal } from './components/AuthPortal';
import { HeroSection } from './components/HeroSection';
import { OurIdeaSection } from './components/OurIdeaSection';
import { ImpactDashboardSection } from './components/ImpactDashboardSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { CoreFeaturesSection } from './components/CoreFeaturesSection';
import { RolePortalsSection } from './components/RolePortalsSection';
import { EmissionsCalculatorSection } from './components/EmissionsCalculatorSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { CertificateSection } from './components/CertificateSection';
import { DeveloperResourcesSection } from './components/DeveloperResourcesSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

// Modals
import { WalletModal } from './components/WalletModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { FullDashboardModal } from './components/FullDashboardModal';
import { BuyModal } from './components/BuyModal';
import { RetireModal } from './components/RetireModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { RecentActivityDrawer } from './components/RecentActivityDrawer';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { MarketplaceListing, Project } from './types';
import { Radio, Activity, Sparkles, ChevronUp, BellRing, Loader2, Leaf } from 'lucide-react';

const MainContent: React.FC = () => {
  const { listings, selectedProjectForDetail, setSelectedProjectForDetail, logs, isPollingEvents, unreadAlertCount } = useWeb3();
  const { isAuthenticated, isAuthLoading } = useAuth();

  // Modal states
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [googleAuthOpen, setGoogleAuthOpen] = useState(false);
  const [fullDashboardOpen, setFullDashboardOpen] = useState(false);
  const [recentActivityOpen, setRecentActivityOpen] = useState(false);
  const [priceAlertsOpen, setPriceAlertsOpen] = useState(false);
  const [priceAlertTargetProjectId, setPriceAlertTargetProjectId] = useState<number | null>(null);
  const [selectedBuyListing, setSelectedBuyListing] = useState<MarketplaceListing | null>(null);
  const [selectedRetireListing, setSelectedRetireListing] = useState<MarketplaceListing | null>(null);
  const [retireModalOpen, setRetireModalOpen] = useState(false);

  // If Firebase / Session auth is resolving on initial cold start
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#070707] text-zinc-100 flex flex-col items-center justify-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-[#7ED321]/40 flex items-center justify-center shadow-[0_0_25px_rgba(126,211,33,0.3)] mb-4 animate-pulse">
          <Leaf className="w-7 h-7 text-[#7ED321]" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Loader2 className="w-4 h-4 text-[#7ED321] animate-spin" />
          <span>Synchronizing CarbonX Protocol & Firebase Session...</span>
        </div>
      </div>
    );
  }

  // 1. If user is NOT authenticated, display the Login / Sign Up dashboard first
  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  // 2. Once user is signed in, render the complete dashboard and marketplace ecosystem
  const handleOpenPriceAlerts = (projectId?: number | null) => {
    setPriceAlertTargetProjectId(projectId || null);
    setPriceAlertsOpen(true);
  };


  const handleBuyFromAlertNotification = (listingId: number) => {
    const matched = listings.find(l => l.id === listingId);
    if (matched) {
      setSelectedBuyListing(matched);
    } else {
      scrollToMarketplace();
    }
  };

  const handleOpenBuyModal = (listing: MarketplaceListing) => {
    setSelectedBuyListing(listing);
  };

  const handleOpenRetireModal = (listing: MarketplaceListing) => {
    setSelectedRetireListing(listing);
    setRetireModalOpen(true);
  };

  const handleOpenBuyFromProject = (project: Project) => {
    const matched = listings.find(l => l.projectId === project.id);
    if (matched) setSelectedBuyListing(matched);
  };

  const handleOpenRetireFromProject = (project: Project) => {
    const matched = listings.find(l => l.projectId === project.id);
    if (matched) {
      setSelectedRetireListing(matched);
      setRetireModalOpen(true);
    }
  };

  const handleOffsetFromCalculator = (tonnes: number) => {
    setRetireModalOpen(true);
  };

  const handleOpenRetireFromHolding = (holding: any) => {
    const matched = listings.find(l => l.projectId === holding.projectId) || {
      id: holding.tokenId,
      projectId: holding.projectId,
      project: holding.project,
      tokenId: holding.tokenId,
      sellerAddress: holding.project.developerAddress,
      sellerName: holding.project.developerName,
      availableCredits: holding.balanceTons,
      pricePerCreditETH: holding.project.pricePerTonETH || 0.0062,
      pricePerCreditUSD: holding.project.pricePerTonUSD || 18.5,
      vintageYear: holding.vintageYear || 2025,
      isVerified: true
    };
    setSelectedRetireListing(matched);
    setRetireModalOpen(true);
  };

  const scrollToMarketplace = () => {
    const el = document.getElementById('marketplace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-[#7ED321] selection:text-black flex flex-col font-sans">
      
      {/* 1. Sticky Transparent Navigation Bar */}
      <Navbar 
        onOpenWalletModal={() => setWalletModalOpen(true)} 
        onOpenRecentActivity={() => setRecentActivityOpen(true)}
        onOpenPriceAlerts={() => handleOpenPriceAlerts(null)}
        onOpenGoogleAuth={() => setGoogleAuthOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection 
          onExploreClick={scrollToMarketplace}
          onOpenCalculator={scrollToCalculator}
        />

        {/* 3. Our Idea Section */}
        <OurIdeaSection />

        {/* 4. Live Impact Dashboard Section with My Portfolio */}
        <ImpactDashboardSection 
          onOpenFullDashboard={() => setFullDashboardOpen(true)}
          onOpenRecentActivity={() => setRecentActivityOpen(true)}
          onOpenPriceAlerts={() => handleOpenPriceAlerts(null)}
          onSelectProjectForDetail={(project) => setSelectedProjectForDetail(project)}
          onOpenRetireModal={handleOpenRetireFromHolding}
          onOpenBuyModal={scrollToMarketplace}
        />

        {/* 5. How It Works (8-Step Flow) */}
        <HowItWorksSection />

        {/* 6. Carbon Credit Marketplace */}
        <MarketplaceSection 
          onOpenBuyModal={handleOpenBuyModal}
          onOpenRetireModal={handleOpenRetireModal}
          onSelectProjectForDetail={(project) => setSelectedProjectForDetail(project)}
          onOpenPriceAlertForProject={(projectId) => handleOpenPriceAlerts(projectId)}
          onOpenPriceAlerts={() => handleOpenPriceAlerts(null)}
        />

        {/* 7. Core Protocol Capabilities Grid */}
        <CoreFeaturesSection />

        {/* 8. Role Portals (Developer, Buyer, Verifier) */}
        <RolePortalsSection />

        {/* 9. Emissions Calculator */}
        <EmissionsCalculatorSection 
          onOffsetNow={handleOffsetFromCalculator}
        />

        {/* 10. Blockchain Architecture (6 Layers) */}
        <ArchitectureSection />

        {/* 11. Proof of Retirement Certificate Explorer */}
        <CertificateSection />

        {/* 12. Developer Resources & Smart Contracts */}
        <DeveloperResourcesSection />

        {/* 13. FAQ Section */}
        <FAQSection />
      </main>

      {/* 14. Footer */}
      <Footer />

      {/* Floating Quick Action Dock */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Quick Price Alerts Button */}
        <button
          id="floating-price-alerts-btn"
          onClick={() => handleOpenPriceAlerts(null)}
          className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-[#121212]/95 hover:bg-[#181818] border border-zinc-800 hover:border-[#7ED321] text-xs font-mono text-zinc-200 shadow-2xl backdrop-blur-md transition-all group hover:scale-105 cursor-pointer"
          title="Open Carbon Price Alerts"
        >
          <div className="relative flex items-center justify-center">
            <BellRing className={`w-4 h-4 text-[#7ED321] ${unreadAlertCount > 0 ? 'animate-bounce' : ''}`} />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7ED321] animate-ping" />
            )}
          </div>
          <span className="hidden sm:inline font-heading font-black text-white uppercase text-[11px] tracking-wider">
            Price Alerts
          </span>
          {unreadAlertCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#7ED321] text-black font-bold font-mono">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Floating Sticky Activity Quick-Trigger Dock */}
        <button
          id="floating-recent-activity-btn"
          onClick={() => setRecentActivityOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#121212]/95 hover:bg-[#181818] border border-zinc-800 hover:border-[#7ED321] text-xs font-mono text-zinc-200 shadow-2xl backdrop-blur-md transition-all group hover:scale-105 cursor-pointer"
          title="Open Live Blockchain Event Stream (Last 10 Events)"
        >
          <div className="relative flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#7ED321] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7ED321] animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 font-heading font-black text-white uppercase text-[11px] tracking-wider">
              <span>Live On-Chain Feed</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30">
                10 Events
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px] sm:max-w-[200px]">
              {logs[0]?.title || "Listening to contracts..."}
            </div>
          </div>
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#7ED321] ml-1 transition-colors" />
        </button>
      </div>

      {/* Recent Activity Sidebar / Bottom-Drawer */}
      <RecentActivityDrawer
        isOpen={recentActivityOpen}
        onClose={() => setRecentActivityOpen(false)}
        onSelectProjectForDetail={(project) => setSelectedProjectForDetail(project)}
      />

      {/* Price Alerts Engine Modal */}
      <PriceAlertsModal
        isOpen={priceAlertsOpen}
        onClose={() => setPriceAlertsOpen(false)}
        initialProjectId={priceAlertTargetProjectId}
        onBuyListing={handleBuyFromAlertNotification}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={googleAuthOpen}
        onClose={() => setGoogleAuthOpen(false)}
      />

      {/* Interactive Modals */}
      <WalletModal 
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onOpenGoogleAuth={() => setGoogleAuthOpen(true)}
      />

      <FullDashboardModal 
        isOpen={fullDashboardOpen}
        onClose={() => setFullDashboardOpen(false)}
        onOpenRetireModal={handleOpenRetireFromHolding}
        onOpenBuyModal={scrollToMarketplace}
      />

      <BuyModal 
        listing={selectedBuyListing}
        isOpen={!!selectedBuyListing}
        onClose={() => setSelectedBuyListing(null)}
      />

      <RetireModal 
        listing={selectedRetireListing}
        isOpen={retireModalOpen}
        onClose={() => {
          setRetireModalOpen(false);
          setSelectedRetireListing(null);
        }}
      />

      <ProjectDetailModal
        project={selectedProjectForDetail}
        isOpen={!!selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
        onOpenBuyModal={handleOpenBuyFromProject}
        onOpenRetireModal={handleOpenRetireFromProject}
        onOpenPriceAlertForProject={(projectId) => handleOpenPriceAlerts(projectId)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <MainContent />
      </Web3Provider>
    </AuthProvider>
  );
}

