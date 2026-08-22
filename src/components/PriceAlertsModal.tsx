import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Sliders, 
  Volume2, 
  VolumeX, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Clock,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { Project, ProjectCategory } from '../types';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: number | null;
  onBuyListing?: (listingId: number) => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  initialProjectId,
  onBuyListing
}) => {
  const {
    projects,
    listings,
    alerts,
    alertNotifications,
    unreadAlertCount,
    browserNotificationPermission,
    requestBrowserNotificationPermission,
    createPriceAlert,
    togglePriceAlert,
    deletePriceAlert,
    markAlertNotificationAsRead,
    clearAllAlertNotifications,
    simulateMatchingListing
  } = useWeb3();

  const [activeTab, setActiveTab] = useState<'alerts' | 'history' | 'create'>('alerts');
  const [isSimulating, setIsSimulating] = useState<string | null>(null);
  const [simulationSuccessMessage, setSimulationSuccessMessage] = useState<string | null>(null);

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId ? String(initialProjectId) : '1'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [condition, setCondition] = useState<'LESS_THAN_OR_EQUAL' | 'GREATER_THAN_OR_EQUAL'>('LESS_THAN_OR_EQUAL');
  const [targetPriceUSD, setTargetPriceUSD] = useState<string>('17.50');
  const [targetAmountTons, setTargetAmountTons] = useState<string>('500');
  const [notifyBrowser, setNotifyBrowser] = useState<boolean>(true);
  const [notifyInApp, setNotifyInApp] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Update selected project if initialProjectId is passed
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(String(initialProjectId));
      const proj = projects.find(p => p.id === initialProjectId);
      if (proj) {
        // Set default target to 95% of current price
        setTargetPriceUSD((proj.pricePerTonUSD * 0.95).toFixed(2));
      }
      setActiveTab('create');
    }
  }, [initialProjectId, projects]);

  if (!isOpen) return null;

  const currentSelectedProject = selectedProjectId !== 'ALL' 
    ? projects.find(p => p.id === Number(selectedProjectId))
    : null;

  const handleProjectChange = (val: string) => {
    setSelectedProjectId(val);
    if (val !== 'ALL') {
      const proj = projects.find(p => p.id === Number(val));
      if (proj) {
        setTargetPriceUSD((proj.pricePerTonUSD * 0.95).toFixed(2));
      }
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const priceNum = parseFloat(targetPriceUSD);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid target price greater than $0.00');
      return;
    }

    const tonsNum = parseInt(targetAmountTons, 10);

    // If browser notification is enabled but permission isn't granted yet, request it
    if (notifyBrowser && browserNotificationPermission !== 'granted') {
      await requestBrowserNotificationPermission();
    }

    let projectName = 'All Projects';
    let category: ProjectCategory | 'ALL' = 'ALL';
    let projId: number | 'ALL' = 'ALL';

    if (selectedProjectId === 'ALL') {
      if (selectedCategory !== 'ALL') {
        projectName = `Any ${selectedCategory} Project`;
        category = selectedCategory as ProjectCategory;
      } else {
        projectName = 'All Marketplace Projects';
      }
    } else {
      projId = Number(selectedProjectId);
      const proj = projects.find(p => p.id === projId);
      if (proj) {
        projectName = proj.name;
        category = proj.category;
      }
    }

    createPriceAlert({
      projectId: projId,
      projectName,
      projectCategory: category,
      condition,
      targetPriceUSD: priceNum,
      targetPriceETH: Number((priceNum / 3000).toFixed(4)),
      targetAmountTons: !isNaN(tonsNum) && tonsNum > 0 ? tonsNum : undefined,
      active: true,
      notifyBrowser,
      notifyInApp
    });

    setActiveTab('alerts');
  };

  const handleSimulateAlert = async (alertId: string) => {
    try {
      setIsSimulating(alertId);
      setSimulationSuccessMessage(null);
      const result = await simulateMatchingListing(alertId);
      setSimulationSuccessMessage(`Success! New matching listing created at $${result.listing.pricePerCreditUSD.toFixed(2)}/tCO2e. Check your notifications.`);
      setTimeout(() => setSimulationSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSimulating(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-3xl bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-xl text-white tracking-tight uppercase">
                  Carbon Price <span className="text-[#7ED321]">Alerts</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Real-time Matching Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Set custom target buy prices and receive instant browser push & in-app alerts when listings match.
              </p>
            </div>
          </div>

          <button
            id="close-price-alerts-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        <div className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0">
              {browserNotificationPermission === 'granted' ? (
                <div className="flex items-center gap-1 text-[#7ED321] font-mono font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Browser Notifications: Enabled</span>
                </div>
              ) : browserNotificationPermission === 'denied' ? (
                <div className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Browser Notifications: Blocked in settings</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-zinc-300 font-mono font-semibold">
                  <Bell className="w-4 h-4 text-zinc-400" />
                  <span>Browser Notifications: Not active</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 hidden md:block">
              {browserNotificationPermission === 'granted'
                ? 'You will receive desktop banners even when browsing other tabs.'
                : 'Enable to get instant desktop popups when carbon projects drop to your target.'}
            </p>
          </div>

          {browserNotificationPermission !== 'granted' && (
            <button
              id="enable-browser-notifications-btn"
              onClick={requestBrowserNotificationPermission}
              className="px-3 py-1.5 rounded-lg bg-[#7ED321] text-black font-heading font-bold text-[11px] uppercase tracking-wider hover:bg-[#8ee528] transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              Enable Browser Alerts
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-zinc-800 bg-[#0d0d0d] flex items-center justify-between">
          <div className="flex gap-2">
            <button
              id="tab-alerts-list-btn"
              onClick={() => setActiveTab('alerts')}
              className={`py-3.5 px-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'alerts'
                  ? 'border-[#7ED321] text-[#7ED321]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>My Active Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-300 font-mono">
                {alerts.length}
              </span>
            </button>

            <button
              id="tab-alerts-history-btn"
              onClick={() => setActiveTab('history')}
              className={`py-3.5 px-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-[#7ED321] text-[#7ED321]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Trigger Logs</span>
              {unreadAlertCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#7ED321] text-black font-mono font-bold animate-pulse">
                  {unreadAlertCount} NEW
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                  {alertNotifications.length}
                </span>
              )}
            </button>

            <button
              id="tab-alerts-create-btn"
              onClick={() => setActiveTab('create')}
              className={`py-3.5 px-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'border-[#7ED321] text-[#7ED321]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Target Alert</span>
            </button>
          </div>

          {activeTab === 'alerts' && (
            <button
              id="quick-add-alert-btn"
              onClick={() => setActiveTab('create')}
              className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#7ED321] hover:underline"
            >
              <Plus className="w-3 h-3" />
              <span>New Target Rule</span>
            </button>
          )}
        </div>

        {/* Global Simulation Success Banner */}
        {simulationSuccessMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/40 text-[#7ED321] text-xs font-mono flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{simulationSuccessMessage}</span>
            </div>
            <button onClick={() => setSimulationSuccessMessage(null)} className="text-zinc-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: ACTIVE ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-3">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-base uppercase">No Price Alerts Configured</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    Set a target threshold for your preferred carbon projects and get notified the moment a supplier lists at your desired price.
                  </p>
                  <button
                    id="empty-create-alert-btn"
                    onClick={() => setActiveTab('create')}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#7ED321] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#8ee528] transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Alert
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                    <span>Configured Criteria ({alerts.length})</span>
                    <span className="text-[11px] text-zinc-500">Autonomous evaluation active on all block events</span>
                  </div>

                  {alerts.map((alert) => {
                    const matchedProj = alert.projectId !== 'ALL' 
                      ? projects.find(p => p.id === alert.projectId) 
                      : null;
                    const currentFloorUSD = matchedProj ? matchedProj.pricePerTonUSD : 18.50;
                    const diffPct = ((alert.targetPriceUSD - currentFloorUSD) / currentFloorUSD) * 100;

                    return (
                      <div
                        key={alert.id}
                        id={`alert-card-${alert.id}`}
                        className={`p-4 rounded-xl border transition-all ${
                          alert.active 
                            ? 'bg-[#18181b]/90 border-zinc-700/80 hover:border-zinc-500' 
                            : 'bg-zinc-900/40 border-zinc-800/60 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-heading font-bold text-sm text-white">
                                {alert.projectName}
                              </h4>
                              {alert.projectCategory && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  {alert.projectCategory}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                                alert.active 
                                  ? 'bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30' 
                                  : 'bg-zinc-800 text-zinc-500'
                              }`}>
                                {alert.active ? 'ACTIVE' : 'PAUSED'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300">
                              <div className="flex items-center gap-1.5 text-white font-bold">
                                <span className="text-[#7ED321]">Target:</span>
                                <span>{alert.condition === 'LESS_THAN_OR_EQUAL' ? '≤' : '≥'} ${alert.targetPriceUSD.toFixed(2)}/tCO2e</span>
                                <span className="text-zinc-500 text-[11px]">({alert.targetPriceETH} ETH)</span>
                              </div>

                              {matchedProj && (
                                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                                  <span>Current Floor:</span>
                                  <span className="text-zinc-200">${currentFloorUSD.toFixed(2)}</span>
                                  <span className={diffPct <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                                    ({diffPct > 0 ? '+' : ''}{diffPct.toFixed(1)}%)
                                  </span>
                                </div>
                              )}

                              {alert.targetAmountTons && (
                                <span className="text-[11px] text-zinc-400">
                                  Min Volume: {alert.targetAmountTons.toLocaleString()} tonnes
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono pt-1">
                              <span>Created {new Date(alert.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Triggered {alert.triggerCount} time{alert.triggerCount !== 1 ? 's' : ''}</span>
                              {alert.lastTriggeredAt && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#7ED321]">Last matched {new Date(alert.lastTriggeredAt).toLocaleTimeString()}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Test Simulation Button */}
                            <button
                              id={`simulate-alert-${alert.id}`}
                              onClick={() => handleSimulateAlert(alert.id)}
                              disabled={isSimulating === alert.id || !alert.active}
                              title="Simulate a supplier listing credits at or below this target price to test notifications"
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 border border-zinc-700 disabled:opacity-40"
                            >
                              <Sparkles className={`w-3.5 h-3.5 text-[#7ED321] ${isSimulating === alert.id ? 'animate-spin' : ''}`} />
                              <span>{isSimulating === alert.id ? 'Testing...' : 'Test Trigger'}</span>
                            </button>

                            {/* Active Toggle Switch */}
                            <button
                              id={`toggle-alert-${alert.id}`}
                              onClick={() => togglePriceAlert(alert.id)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                alert.active 
                                  ? 'bg-[#7ED321]/15 border-[#7ED321]/40 text-[#7ED321]' 
                                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                              }`}
                              title={alert.active ? 'Pause Alert' : 'Resume Alert'}
                            >
                              {alert.active ? <Bell className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>

                            {/* Delete Alert Button */}
                            <button
                              id={`delete-alert-${alert.id}`}
                              onClick={() => deletePriceAlert(alert.id)}
                              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 transition-all"
                              title="Delete Alert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRIGGER HISTORY & LOGS */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Trigger Event Log ({alertNotifications.length})</span>
                {alertNotifications.length > 0 && (
                  <button
                    id="clear-all-alerts-history-btn"
                    onClick={clearAllAlertNotifications}
                    className="text-zinc-500 hover:text-zinc-300 underline text-[11px]"
                  >
                    Clear Log History
                  </button>
                )}
              </div>

              {alertNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-base uppercase">No Trigger History Yet</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    When listings match your target price criteria, instant trigger logs will be recorded here with direct buy actions.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {alertNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      id={`alert-notif-${notif.id}`}
                      className={`p-4 rounded-xl border transition-all ${
                        !notif.read
                          ? 'bg-[#18181b] border-[#7ED321]/40 shadow-[0_0_15px_rgba(126,211,33,0.05)]'
                          : 'bg-zinc-900/50 border-zinc-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse" />
                            )}
                            <span className="font-heading font-bold text-sm text-white">
                              {notif.projectName}
                            </span>
                            <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#7ED321]/15 text-[#7ED321] font-semibold">
                              Target Met
                            </span>
                          </div>

                          <p className="text-xs font-mono text-zinc-300">
                            Matched at <strong className="text-[#7ED321]">${notif.matchedPriceUSD.toFixed(2)}/tCO2e</strong> ({notif.matchedPriceETH} ETH) 
                            <span className="text-zinc-500"> • Target was ≤ ${notif.targetPriceUSD.toFixed(2)}</span>
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                            <span>Seller: {notif.sellerName}</span>
                            <span>•</span>
                            <span>{notif.availableCredits.toLocaleString()} tCO2e Available</span>
                            <span>•</span>
                            <span className="text-zinc-500">{new Date(notif.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {onBuyListing && (
                            <button
                              id={`buy-matched-listing-${notif.listingId}`}
                              onClick={() => {
                                markAlertNotificationAsRead(notif.id);
                                onBuyListing(notif.listingId);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#7ED321] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#8ee528] transition-all flex items-center gap-1 shadow-sm"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Buy at ${notif.matchedPriceUSD.toFixed(2)}</span>
                            </button>
                          )}

                          {!notif.read && (
                            <button
                              onClick={() => markAlertNotificationAsRead(notif.id)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs"
                              title="Mark as Read"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATE NEW ALERT */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateSubmit} className="space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Project Selection */}
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  1. Target Carbon Project or Category
                </label>
                <select
                  id="alert-project-select"
                  value={selectedProjectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#7ED321] font-mono"
                >
                  <optgroup label="Specific Projects">
                    {projects.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        #{p.id} - {p.name} (${p.pricePerTonUSD.toFixed(2)}/tCO2e)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Broad Categories">
                    <option value="ALL">All Projects / Any Category</option>
                  </optgroup>
                </select>
              </div>

              {/* Category Filter if ALL is selected */}
              {selectedProjectId === 'ALL' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Filter by Specific Category (Optional)
                  </label>
                  <select
                    id="alert-category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#7ED321] font-mono"
                  >
                    <option value="ALL">All Project Categories</option>
                    <option value="Forestry">Forestry & Reforestation</option>
                    <option value="Blue Carbon">Blue Carbon & Mangroves</option>
                    <option value="Direct Air Capture">Direct Air Capture (DAC)</option>
                    <option value="Renewable Energy">Renewable Energy Methane Avoidance</option>
                    <option value="Soil Carbon">Soil Carbon & Biochar</option>
                  </select>
                </div>
              )}

              {/* Condition & Target Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    2. Trigger Condition
                  </label>
                  <select
                    id="alert-condition-select"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#7ED321] font-mono"
                  >
                    <option value="LESS_THAN_OR_EQUAL">Price Drops To or Below (≤)</option>
                    <option value="GREATER_THAN_OR_EQUAL">Price Rises To or Above (≥)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    3. Target Price (USD / tonne)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">$</span>
                    <input
                      id="alert-target-price-input"
                      type="number"
                      step="0.10"
                      min="0.10"
                      value={targetPriceUSD}
                      onChange={(e) => setTargetPriceUSD(e.target.value)}
                      placeholder="18.00"
                      className="w-full pl-8 pr-20 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#7ED321] font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                      ≈ {(parseFloat(targetPriceUSD || '0') / 3000).toFixed(4)} ETH
                    </span>
                  </div>
                  {currentSelectedProject && (
                    <div className="mt-1 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
                      <span>Current Floor: ${currentSelectedProject.pricePerTonUSD.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => setTargetPriceUSD((currentSelectedProject.pricePerTonUSD * 0.90).toFixed(2))}
                        className="text-[#7ED321] hover:underline"
                      >
                        Set 10% Below Market ($
                        {(currentSelectedProject.pricePerTonUSD * 0.90).toFixed(2)})
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Volume Filter */}
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  4. Minimum Volume Requirement (Optional)
                </label>
                <div className="relative">
                  <input
                    id="alert-target-amount-input"
                    type="number"
                    step="100"
                    min="1"
                    value={targetAmountTons}
                    onChange={(e) => setTargetAmountTons(e.target.value)}
                    placeholder="500"
                    className="w-full px-4 pr-16 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#7ED321] font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                    tCO2e
                  </span>
                </div>
              </div>

              {/* Notification Channel Toggles */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <span className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
                  5. Delivery Channels
                </span>

                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      id="alert-notify-browser-checkbox"
                      type="checkbox"
                      checked={notifyBrowser}
                      onChange={(e) => setNotifyBrowser(e.target.checked)}
                      className="rounded border-zinc-700 text-[#7ED321] focus:ring-[#7ED321] accent-[#7ED321]"
                    />
                    <span>Browser Desktop Notifications (Push)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      id="alert-notify-inapp-checkbox"
                      type="checkbox"
                      checked={notifyInApp}
                      onChange={(e) => setNotifyInApp(e.target.checked)}
                      className="rounded border-zinc-700 text-[#7ED321] focus:ring-[#7ED321] accent-[#7ED321]"
                    />
                    <span>In-App Alert Banners & Logs</span>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('alerts')}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-all"
                >
                  Cancel
                </button>
                <button
                  id="submit-create-alert-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7ED321] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#8ee528] transition-all flex items-center gap-2 shadow-lg shadow-[rgba(126,211,33,0.2)]"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Activate Price Alert</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7ED321]" />
            <span>Autonomous Evaluation Engine Ready</span>
          </div>
          <span>CarbonX Alerting Protocol v1.4</span>
        </div>
      </motion.div>
    </div>
  );
};
