/**
 * @file Web3Context.tsx
 * Web3 state management providing MetaMask and full testnet contract simulation.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, MarketplaceListing, RetirementCertificate, Web3Account, TransactionLog, PlatformStats, ProjectUpdate, TelemetryMetric, UpdateType, WalletCreditHolding, ProjectCategory, PriceAlert, PriceAlertNotification } from '../types';
import { INITIAL_TEST_ACCOUNTS, INITIAL_PROJECTS, INITIAL_LISTINGS, INITIAL_CERTIFICATES, INITIAL_LOGS, INITIAL_PROJECT_UPDATES, INITIAL_ALERTS, INITIAL_ALERT_NOTIFICATIONS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface Web3ContextType {
  account: Web3Account;
  accountList: Web3Account[];
  currentAccountIndex: number;
  isConnected: boolean;
  isConnecting: boolean;
  isMetaMask: boolean;
  projects: Project[];
  listings: MarketplaceListing[];
  certificates: RetirementCertificate[];
  logs: TransactionLog[];
  stats: PlatformStats;
  projectUpdates: ProjectUpdate[];
  selectedProjectForDetail: Project | null;
  setSelectedProjectForDetail: (project: Project | null) => void;
  holdings: WalletCreditHolding[];
  isQueryingHoldings: boolean;
  lastHoldingsQueryTimestamp: number;
  queryHoldingsFromContract: () => Promise<WalletCreditHolding[]>;
  isPollingEvents: boolean;
  lastPolledBlock: number;
  lastPolledTime: number;
  pollSmartContractEvents: (manual?: boolean) => Promise<{ newEventsCount: number; blockNumber: number; eventSummary?: string }>;
  postProjectUpdate: (updateData: {
    projectId: number;
    updateType: UpdateType;
    title: string;
    summary: string;
    metrics: TelemetryMetric[];
    ipfsEvidenceHash?: string;
    satelliteProvider?: string;
  }) => Promise<{ success: boolean; update: ProjectUpdate }>;
  connectMetaMask: () => Promise<void>;
  switchAccount: (accountIndex: number) => void;
  disconnectWallet: () => void;
  registerProject: (projectData: Partial<Project>) => Promise<{ success: boolean; projectId: number }>;
  verifyProject: (projectId: number) => Promise<boolean>;
  rejectProject: (projectId: number, reason: string) => Promise<boolean>;
  issueCredits: (projectId: number, amount: number, vintageYear: number) => Promise<boolean>;
  listCredits: (tokenId: number, amount: number, pricePerCreditETH: number) => Promise<boolean>;
  buyCredits: (listingId: number, amount: number) => Promise<{ success: boolean; txHash: string }>;
  retireCredits: (tokenId: number, amount: number, retireeName: string, beneficiary: string, reason: string) => Promise<{ success: boolean; certificate: RetirementCertificate }>;
  selectedCertificate: RetirementCertificate | null;
  setSelectedCertificate: (cert: RetirementCertificate | null) => void;

  // Alerts System
  alerts: PriceAlert[];
  alertNotifications: PriceAlertNotification[];
  unreadAlertCount: number;
  browserNotificationPermission: NotificationPermission | 'unsupported';
  requestBrowserNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
  createPriceAlert: (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'lastTriggeredAt' | 'triggerCount'>) => PriceAlert;
  updatePriceAlert: (alertId: string, alertData: Partial<PriceAlert>) => void;
  togglePriceAlert: (alertId: string) => void;
  deletePriceAlert: (alertId: string) => void;
  markAlertNotificationAsRead: (notificationId: string) => void;
  clearAllAlertNotifications: () => void;
  simulateMatchingListing: (alertId?: string) => Promise<{ success: boolean; listing: MarketplaceListing; alertName: string }>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

function generateRandomHash(prefix = '0x'): string {
  const chars = '0123456789abcdef';
  let hash = prefix;
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accountList, setAccountList] = useState<Web3Account[]>(INITIAL_TEST_ACCOUNTS);
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(2); // Default to Corporate Buyer for easy testing
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isMetaMask, setIsMetaMask] = useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [listings, setListings] = useState<MarketplaceListing[]>(INITIAL_LISTINGS);
  const [certificates, setCertificates] = useState<RetirementCertificate[]>(INITIAL_CERTIFICATES);
  const [logs, setLogs] = useState<TransactionLog[]>(INITIAL_LOGS);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>(INITIAL_PROJECT_UPDATES);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<RetirementCertificate | null>(INITIAL_CERTIFICATES[0]);

  // Real-time On-Chain Smart Contract Event Polling States
  const [isPollingEvents, setIsPollingEvents] = useState<boolean>(false);
  const [lastPolledBlock, setLastPolledBlock] = useState<number>(19483250);
  const [lastPolledTime, setLastPolledTime] = useState<number>(Date.now());
  const [pollCycleCount, setPollCycleCount] = useState<number>(0);

  // Smart Contract Token Balance Query State
  const [isQueryingHoldings, setIsQueryingHoldings] = useState<boolean>(false);
  const [lastHoldingsQueryTimestamp, setLastHoldingsQueryTimestamp] = useState<number>(Date.now());

  // Alerts System State
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('carbonx_price_alerts');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [alertNotifications, setAlertNotifications] = useState<PriceAlertNotification[]>(() => {
    try {
      const saved = localStorage.getItem('carbonx_alert_notifications');
      return saved ? JSON.parse(saved) : INITIAL_ALERT_NOTIFICATIONS;
    } catch {
      return INITIAL_ALERT_NOTIFICATIONS;
    }
  });

  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  useEffect(() => {
    try {
      localStorage.setItem('carbonx_price_alerts', JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('carbonx_alert_notifications', JSON.stringify(alertNotifications));
    } catch {}
  }, [alertNotifications]);

  const activeAccount = accountList[currentAccountIndex] || accountList[0];

  // Derived on-chain holdings queried from CarbonCreditToken contract for connected account
  const rawOwnedCredits = (activeAccount.ownedCredits || {}) as Record<string, number>;
  const holdings: WalletCreditHolding[] = Object.entries(rawOwnedCredits)
    .filter(([_, balance]) => Number(balance) > 0)
    .map(([tokenIdStr, balanceRaw]) => {
      const tokenId = parseInt(tokenIdStr, 10);
      const balance = Number(balanceRaw);
      const proj = projects.find(p => p.id === tokenId) || {
        id: tokenId,
        name: `Carbon Credit Batch #${tokenId}`,
        country: "Global",
        countryCode: "UN",
        location: "Verified Biome Registry",
        coordinates: "0.0° N, 0.0° E",
        category: "Forestry" as ProjectCategory,
        categoryIcon: "Trees",
        methodology: "VCS / Verra Verified Carbon Standard",
        developerAddress: "0x0000000000000000000000000000000000000000",
        developerName: "Certified Developer",
        expectedCO2eTons: 50000,
        issuedCredits: 50000,
        availableCredits: 25000,
        retiredCredits: 25000,
        pricePerTonUSD: 18.5,
        pricePerTonETH: 0.0062,
        vintageYear: 2025,
        ipfsHash: "ipfs://QmDefaultHash",
        status: "Active" as const,
        submissionDate: "2025-01-01",
        description: "Verified Carbon Credit batch on CarbonX protocol.",
        coBenefits: ["Carbon Sequestration"],
        imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
      };

      return {
        tokenId,
        projectId: proj.id,
        project: proj,
        balanceTons: balance,
        vintageYear: proj.vintageYear || 2025,
        valueUSD: balance * (proj.pricePerTonUSD || 18.5),
        valueETH: balance * (proj.pricePerTonETH || 0.0062),
        serialNumberRange: `CX-${proj.vintageYear || 2025}-${proj.countryCode || 'GL'}-000001-${String(balance).padStart(6, '0')}`,
        contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        tokenStandard: 'ERC-1155' as const,
        lastQueriedBlock: lastPolledBlock,
        tokenMetadataUri: proj.ipfsHash || "ipfs://QmCarbonCreditToken"
      };
    });

  // Explicit function to trigger on-chain contract query for token balances
  const queryHoldingsFromContract = async (): Promise<WalletCreditHolding[]> => {
    setIsQueryingHoldings(true);
    // Simulate smart contract RPC latency (CarbonCreditToken.balanceOf / balanceOfBatch)
    await new Promise(resolve => setTimeout(resolve, 550));
    setLastHoldingsQueryTimestamp(Date.now());
    setIsQueryingHoldings(false);
    return holdings;
  };

  // Recalculate global stats
  const stats: PlatformStats = {
    totalCreditsIssued: projects.reduce((acc, p) => acc + p.issuedCredits, 0),
    totalCreditsRetired: projects.reduce((acc, p) => acc + p.retiredCredits, 0),
    totalCO2eOffsetTons: certificates.reduce((acc, c) => acc + c.amountTonsCO2e, 0) + 75000,
    activeProjects: projects.filter(p => p.status === 'Active').length,
    totalVolumeETH: 84.5,
    totalVolumeUSD: 253500,
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          const metaMaskAccount: Web3Account = {
            address: accounts[0],
            name: `MetaMask (${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)})`,
            role: 'BUYER',
            roleLabel: 'MetaMask Connected Account',
            balanceETH: 12.4,
            isMetaMask: true,
            avatar: '🦊',
            ownedCredits: { 1: 500 }
          };
          setAccountList(prev => [metaMaskAccount, ...prev]);
          setCurrentAccountIndex(0);
          setIsMetaMask(true);
          setIsConnected(true);
        }
      } else {
        // Fallback simulate connection if no extension
        const simMetaMask: Web3Account = {
          address: "0x58A3e4F46eF6D7e1320F71427cCeA0B79f9775d1",
          name: "MetaMask (0x58A3...75d1)",
          role: "BUYER",
          roleLabel: "MetaMask Active Wallet",
          balanceETH: 8.75,
          isMetaMask: true,
          avatar: "🦊",
          ownedCredits: { 1: 1000 }
        };
        setAccountList(prev => [simMetaMask, ...prev]);
        setCurrentAccountIndex(0);
        setIsMetaMask(true);
        setIsConnected(true);
      }
    } catch (err) {
      console.warn("MetaMask connection notice:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchAccount = (idx: number) => {
    if (idx >= 0 && idx < accountList.length) {
      setCurrentAccountIndex(idx);
      setIsConnected(true);
      setIsMetaMask(accountList[idx].isMetaMask);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const addLog = (log: Omit<TransactionLog, 'id' | 'timestamp'>) => {
    const newLog: TransactionLog = {
      ...log,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // 1. Register Project
  const registerProject = async (data: Partial<Project>): Promise<{ success: boolean; projectId: number }> => {
    const newId = projects.length + 1;
    const newProject: Project = {
      id: newId,
      name: data.name || "Untitled Carbon Project",
      country: data.country || "Global",
      countryCode: data.countryCode || "GL",
      location: data.location || "Coordinates Pending",
      coordinates: data.coordinates || "0.0° N, 0.0° E",
      category: data.category || "Forestry",
      categoryIcon: data.category === 'Forestry' ? 'Trees' : data.category === 'Blue Carbon' ? 'Waves' : 'Leaf',
      methodology: data.methodology || "VM0007 / VCS Verified",
      developerAddress: activeAccount.address,
      developerName: activeAccount.name,
      expectedCO2eTons: data.expectedCO2eTons || 25000,
      issuedCredits: 0,
      availableCredits: 0,
      retiredCredits: 0,
      pricePerTonUSD: data.pricePerTonUSD || 20.0,
      pricePerTonETH: (data.pricePerTonUSD || 20.0) / 3000,
      vintageYear: new Date().getFullYear(),
      ipfsHash: data.ipfsHash || `ipfs://Qm${generateRandomHash('').slice(0, 44)}`,
      status: 'PendingVerification',
      submissionDate: new Date().toISOString().split('T')[0],
      description: data.description || "Project registered with MRV documentation on IPFS.",
      coBenefits: data.coBenefits || ["Climate Action", "Biodiversity", "Community Support"],
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    };

    setProjects(prev => [newProject, ...prev]);
    const txHash = generateRandomHash();
    addLog({
      type: 'REGISTER',
      title: 'Project Registered for MRV Audit',
      description: `${newProject.name} (${newProject.expectedCO2eTons.toLocaleString()} tCO2e) submitted to registry`,
      from: activeAccount.address,
      txHash,
      blockNumber: 19482500 + projects.length,
      status: 'confirmed'
    });

    return { success: true, projectId: newId };
  };

  // 2. Verify Project
  const verifyProject = async (projectId: number): Promise<boolean> => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'Verified',
          verifiedBy: activeAccount.address,
          verifierName: activeAccount.name,
          verificationDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    const p = projects.find(item => item.id === projectId);
    const txHash = generateRandomHash();
    addLog({
      type: 'VERIFY',
      title: 'Project Verified by Accredited Auditor',
      description: `${p?.name || `Project #${projectId}`} verified under ${p?.methodology}`,
      from: activeAccount.address,
      txHash,
      blockNumber: 19482600 + projectId,
      status: 'confirmed'
    });

    return true;
  };

  // 2b. Reject Project
  const rejectProject = async (projectId: number, reason: string): Promise<boolean> => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'Rejected',
          verifiedBy: activeAccount.address,
          verifierName: activeAccount.name,
          description: `${p.description} [Audit Rejected: ${reason}]`
        };
      }
      return p;
    }));
    return true;
  };

  // 3. Issue Credits
  const issueCredits = async (projectId: number, amount: number, vintageYear: number): Promise<boolean> => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          issuedCredits: p.issuedCredits + amount,
          availableCredits: p.availableCredits + amount,
          status: 'Active'
        };
      }
      return p;
    }));

    const proj = projects.find(p => p.id === projectId);
    // Update developer owned balance
    setAccountList(prev => prev.map(acc => {
      if (acc.address.toLowerCase() === (proj?.developerAddress || '').toLowerCase() || acc.role === 'DEVELOPER') {
        const prevBal = acc.ownedCredits[projectId] || 0;
        return {
          ...acc,
          ownedCredits: { ...acc.ownedCredits, [projectId]: prevBal + amount }
        };
      }
      return acc;
    }));

    const txHash = generateRandomHash();
    addLog({
      type: 'ISSUE',
      title: 'ERC-1155 Carbon Credits Minted',
      description: `Minted ${amount.toLocaleString()} tCO2e tokens for ${proj?.name || `Project #${projectId}`}`,
      from: activeAccount.address,
      to: proj?.developerAddress,
      amountTons: amount,
      txHash,
      blockNumber: 19482700 + projectId,
      status: 'confirmed'
    });

    return true;
  };

  // 4. List Credits
  const listCredits = async (tokenId: number, amount: number, pricePerCreditETH: number): Promise<boolean> => {
    const proj = projects.find(p => p.id === tokenId) || projects[0];
    const newListing: MarketplaceListing = {
      id: listings.length + 1,
      tokenId,
      projectId: proj.id,
      project: proj,
      sellerAddress: activeAccount.address,
      sellerName: activeAccount.name,
      amount,
      remainingAmount: amount,
      pricePerCreditETH,
      pricePerCreditUSD: pricePerCreditETH * 3000,
      active: true,
      listedTimestamp: Date.now()
    };

    setListings(prev => [newListing, ...prev]);

    // deduct from seller's wallet
    setAccountList(prev => prev.map(acc => {
      if (acc.address === activeAccount.address) {
        const curr = acc.ownedCredits[tokenId] || 0;
        return {
          ...acc,
          ownedCredits: { ...acc.ownedCredits, [tokenId]: Math.max(0, curr - amount) }
        };
      }
      return acc;
    }));

    const txHash = generateRandomHash();
    addLog({
      type: 'LIST',
      title: 'Credits Listed in Marketplace Escrow',
      description: `${amount.toLocaleString()} tCO2e of ${proj.name} listed at ${pricePerCreditETH} ETH/tonne`,
      from: activeAccount.address,
      amountTons: amount,
      txHash,
      blockNumber: 19482800,
      status: 'confirmed'
    });

    // Check against active price alerts
    evaluateAlertsAgainstListings([newListing], alerts);

    return true;
  };

  // 5. Buy Credits
  const buyCredits = async (listingId: number, amount: number): Promise<{ success: boolean; txHash: string }> => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) throw new Error("Listing not found");

    const totalCostETH = listing.pricePerCreditETH * amount;
    const txHash = generateRandomHash();

    // Deduct remaining listing amount
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const remaining = l.remainingAmount - amount;
        return {
          ...l,
          remainingAmount: Math.max(0, remaining),
          active: remaining > 0
        };
      }
      return l;
    }));

    // Update buyer balance & credits
    setAccountList(prev => prev.map(acc => {
      if (acc.address === activeAccount.address) {
        const currentCredits = acc.ownedCredits[listing.tokenId] || 0;
        return {
          ...acc,
          balanceETH: Math.max(0, acc.balanceETH - totalCostETH),
          ownedCredits: { ...acc.ownedCredits, [listing.tokenId]: currentCredits + amount }
        };
      }
      if (acc.address === listing.sellerAddress) {
        return {
          ...acc,
          balanceETH: acc.balanceETH + (totalCostETH * 0.99) // 1% platform fee
        };
      }
      return acc;
    }));

    addLog({
      type: 'BUY',
      title: 'Carbon Credits Purchased on-chain',
      description: `Bought ${amount.toLocaleString()} tCO2e from ${listing.sellerName} for ${totalCostETH.toFixed(4)} ETH`,
      from: activeAccount.address,
      to: listing.sellerAddress,
      amountTons: amount,
      ethValue: totalCostETH,
      txHash,
      blockNumber: 19482900,
      status: 'confirmed'
    });

    return { success: true, txHash };
  };

  // 6. Retire Credits (Permanent lock, burn & Certificate Generation)
  const retireCredits = async (
    tokenId: number,
    amount: number,
    retireeName: string,
    beneficiary: string,
    reason: string
  ): Promise<{ success: boolean; certificate: RetirementCertificate }> => {
    const proj = projects.find(p => p.id === tokenId) || projects[0];
    const certId = 1000 + certificates.length + 1;
    const certHash = generateRandomHash();
    const txHash = generateRandomHash();

    // Burn tokens from active account
    setAccountList(prev => prev.map(acc => {
      if (acc.address === activeAccount.address) {
        const curr = acc.ownedCredits[tokenId] || 0;
        return {
          ...acc,
          ownedCredits: { ...acc.ownedCredits, [tokenId]: Math.max(0, curr - amount) }
        };
      }
      return acc;
    }));

    // Increment retired credits on project
    setProjects(prev => prev.map(p => {
      if (p.id === tokenId) {
        return {
          ...p,
          retiredCredits: p.retiredCredits + amount,
          availableCredits: Math.max(0, p.availableCredits - amount)
        };
      }
      return p;
    }));

    const newCert: RetirementCertificate = {
      certificateId: certId,
      certificateHash: certHash,
      retireeAddress: activeAccount.address,
      retireeName: retireeName || activeAccount.name,
      beneficiary: beneficiary || "Global Climate Protection",
      tokenId,
      projectId: proj.id,
      projectName: proj.name,
      category: proj.category,
      amountTonsCO2e: amount,
      timestamp: Date.now(),
      retirementReason: reason || "Corporate Scope 1 & 2 Carbon Neutrality",
      serialNumberRange: `CX-${proj.vintageYear}-${proj.countryCode}-${String(proj.retiredCredits + 1).padStart(6, '0')}-${String(proj.retiredCredits + amount).padStart(6, '0')}`,
      transactionHash: txHash,
      valid: true
    };

    setCertificates(prev => [newCert, ...prev]);
    setSelectedCertificate(newCert);

    addLog({
      type: 'RETIRE',
      title: 'Permanent Carbon Credit Retirement',
      description: `Irrevocably burned ${amount.toLocaleString()} tCO2e -> Certificate #${certId} minted`,
      from: activeAccount.address,
      amountTons: amount,
      txHash,
      blockNumber: 19483000,
      status: 'confirmed'
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7ED321', '#ffffff', '#22c55e', '#a3e635']
      });
    } catch {
      // safe fallback
    }

    return { success: true, certificate: newCert };
  };

  const postProjectUpdate = async (updateData: {
    projectId: number;
    updateType: UpdateType;
    title: string;
    summary: string;
    metrics: TelemetryMetric[];
    ipfsEvidenceHash?: string;
    satelliteProvider?: string;
  }): Promise<{ success: boolean; update: ProjectUpdate }> => {
    await new Promise(r => setTimeout(r, 700));

    const proj = projects.find(p => p.id === updateData.projectId);
    if (!proj) throw new Error("Project not found");

    const updateId = `upd-${Date.now().toString().slice(-4)}`;
    const oracleSig = generateRandomHash('0x');
    const ipfsHash = updateData.ipfsEvidenceHash || `ipfs://Qm${generateRandomHash('').slice(0, 44)}`;

    const newUpdate: ProjectUpdate = {
      id: updateId,
      projectId: proj.id,
      projectName: proj.name,
      projectCategory: proj.category,
      timestamp: Date.now(),
      authorAddress: activeAccount.address,
      authorName: activeAccount.name,
      updateType: updateData.updateType,
      title: updateData.title,
      summary: updateData.summary,
      metrics: updateData.metrics,
      ipfsEvidenceHash: ipfsHash,
      oracleSignature: oracleSig,
      coordinates: proj.coordinates,
      satelliteProvider: updateData.satelliteProvider || "Copernicus & Sentinel-2 IoT Array",
      verifiedOnChain: true,
      blockNumber: 19483150
    };

    setProjectUpdates(prev => [newUpdate, ...prev]);

    addLog({
      type: 'VERIFY',
      title: `Real-Time MRV Telemetry Attested: ${proj.name}`,
      description: `Developer posted verified telemetry: "${updateData.title}" -> IPFS: ${ipfsHash.slice(0, 18)}...`,
      from: activeAccount.address,
      txHash: oracleSig,
      blockNumber: 19483150,
      status: 'confirmed'
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#7ED321', '#10b981', '#ffffff']
      });
    } catch {
      // safe
    }

    return { success: true, update: newUpdate };
  };

  // 7. Polling mechanism for smart contract events & on-chain metrics sync
  const pollSmartContractEvents = async (manual = false): Promise<{ newEventsCount: number; blockNumber: number; eventSummary?: string }> => {
    setIsPollingEvents(true);
    
    // Simulate brief RPC latency
    await new Promise(r => setTimeout(r, 450));

    const nextBlock = lastPolledBlock + (manual ? 1 : Math.floor(Math.random() * 2) + 1);
    setLastPolledBlock(nextBlock);
    setLastPolledTime(Date.now());
    const nextCycle = pollCycleCount + 1;
    setPollCycleCount(nextCycle);

    let newEventsCount = 0;
    let eventSummary = "Contracts checked. Zero pending log exceptions.";

    // Trigger simulated on-chain contract events periodically or on manual trigger
    if (manual || nextCycle % 2 === 0) {
      newEventsCount = 1;
      const isIssuance = (nextCycle % 4 !== 0);

      if (isIssuance) {
        // Pick an active project to receive verified oracle-attested issuance
        const targetProj = projects.find(p => p.id === 1 || p.status === 'Active') || projects[0];
        const addedCredits = Math.floor(Math.random() * 1800) + 750; // +750 to +2550 tCO2e
        const txHash = generateRandomHash();

        setProjects(prev => prev.map(p => {
          if (p.id === targetProj.id) {
            return {
              ...p,
              issuedCredits: p.issuedCredits + addedCredits,
              availableCredits: p.availableCredits + addedCredits
            };
          }
          return p;
        }));

        setListings(prev => prev.map(l => {
          if (l.projectId === targetProj.id) {
            return {
              ...l,
              remainingAmount: l.remainingAmount + addedCredits
            };
          }
          return l;
        }));

        addLog({
          type: 'ISSUE',
          title: `Smart Contract Event: CreditsIssued (+${addedCredits.toLocaleString()} tCO2e)`,
          description: `Oracle Attestation verified at Block #${nextBlock}: Batch minted for ${targetProj.name}`,
          from: "0x0000000000000000000000000000000000000000",
          to: targetProj.developerAddress,
          amountTons: addedCredits,
          txHash,
          blockNumber: nextBlock,
          status: 'confirmed'
        });

        eventSummary = `Polled 1 new event: CreditsIssued (+${addedCredits.toLocaleString()} tCO2e for ${targetProj.name})`;
      } else {
        // Institutional micro-retirement on-chain event
        const targetProj = projects.find(p => p.availableCredits > 500) || projects[0];
        const retiredTons = Math.floor(Math.random() * 600) + 300;
        const txHash = generateRandomHash();
        const certId = `CERT-AUTO-${Date.now().toString().slice(-4)}`;

        setProjects(prev => prev.map(p => {
          if (p.id === targetProj.id) {
            return {
              ...p,
              retiredCredits: p.retiredCredits + retiredTons,
              availableCredits: Math.max(0, p.availableCredits - retiredTons)
            };
          }
          return p;
        }));

        addLog({
          type: 'RETIRE',
          title: `Smart Contract Event: CreditsRetired (${retiredTons.toLocaleString()} tCO2e)`,
          description: `Automated ESG Pool retirement finalized at Block #${nextBlock} for ${targetProj.name}`,
          from: "0x71C8A3311822...AutoESGPool",
          amountTons: retiredTons,
          txHash,
          blockNumber: nextBlock,
          status: 'confirmed'
        });

        eventSummary = `Polled 1 new event: CreditsRetired (${retiredTons.toLocaleString()} tCO2e for ${targetProj.name})`;
      }
    }

    setIsPollingEvents(false);
    return { newEventsCount, blockNumber: nextBlock, eventSummary };
  };

  // ----------------------------------------------------
  // Alerts System Implementations
  // ----------------------------------------------------

  const triggerBrowserNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          const notif = new Notification(title, {
            body,
            icon: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=128&q=80',
            tag: `carbonx-alert-${Date.now()}`
          });
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        } catch (e) {
          console.warn('Browser notification error:', e);
        }
      }
    }
  };

  const evaluateAlertsAgainstListings = useCallback((targetListings: MarketplaceListing[], currentAlerts: PriceAlert[]) => {
    const activeAlerts = currentAlerts.filter(a => a.active);
    if (activeAlerts.length === 0 || targetListings.length === 0) return;

    const newNotifs: PriceAlertNotification[] = [];
    const alertUpdates = new Map<string, { lastTriggeredAt: number; triggerCount: number }>();

    targetListings.forEach(listing => {
      activeAlerts.forEach(alert => {
        const matchesProject = alert.projectId === 'ALL' || alert.projectId === listing.projectId;
        const matchesCategory = !alert.projectCategory || alert.projectCategory === 'ALL' || alert.projectCategory === listing.project.category;

        if (matchesProject && matchesCategory) {
          const isMatch = alert.condition === 'LESS_THAN_OR_EQUAL'
            ? listing.pricePerCreditUSD <= alert.targetPriceUSD
            : listing.pricePerCreditUSD >= alert.targetPriceUSD;

          if (isMatch) {
            const notif: PriceAlertNotification = {
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              alertId: alert.id,
              alertName: alert.projectName,
              projectId: listing.projectId,
              projectName: listing.project.name,
              listingId: listing.id,
              matchedPriceUSD: listing.pricePerCreditUSD,
              matchedPriceETH: listing.pricePerCreditETH,
              targetPriceUSD: alert.targetPriceUSD,
              availableCredits: listing.remainingAmount,
              sellerName: listing.sellerName,
              timestamp: Date.now(),
              read: false
            };
            newNotifs.push(notif);

            const currCount = alertUpdates.get(alert.id)?.triggerCount ?? alert.triggerCount;
            alertUpdates.set(alert.id, {
              lastTriggeredAt: Date.now(),
              triggerCount: currCount + 1
            });

            if (alert.notifyBrowser) {
              triggerBrowserNotification(
                "🎯 CarbonX Price Target Met!",
                `Matching listing for ${listing.project.name}: $${listing.pricePerCreditUSD.toFixed(2)}/tCO2e (Target: $${alert.targetPriceUSD.toFixed(2)}). ${listing.remainingAmount.toLocaleString()} tCO2e available.`
              );
            }
          }
        }
      });
    });

    if (newNotifs.length > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7ED321', '#38bdf8', '#fbbf24']
        });
      } catch {}

      setAlertNotifications(prev => [...newNotifs, ...prev]);

      if (alertUpdates.size > 0) {
        setAlerts(prev => prev.map(a => {
          const update = alertUpdates.get(a.id);
          if (update) {
            return {
              ...a,
              lastTriggeredAt: update.lastTriggeredAt,
              triggerCount: update.triggerCount
            };
          }
          return a;
        }));
      }
    }
  }, []);

  const requestBrowserNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBrowserNotificationPermission('unsupported');
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserNotificationPermission(permission);
      if (permission === 'granted') {
        triggerBrowserNotification(
          "CarbonX Price Alerts Enabled",
          "You will receive browser notifications whenever matching carbon credit listings hit the marketplace."
        );
      }
      return permission;
    } catch (e) {
      console.warn("Notification request permission failed:", e);
      return 'denied';
    }
  };

  const createPriceAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'lastTriggeredAt' | 'triggerCount'>): PriceAlert => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now(),
      triggerCount: 0
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Immediately evaluate against current active marketplace listings
    setTimeout(() => {
      evaluateAlertsAgainstListings(listings, [newAlert]);
    }, 100);

    return newAlert;
  };

  const updatePriceAlert = (alertId: string, alertData: Partial<PriceAlert>) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, ...alertData } : a));
  };

  const togglePriceAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: !a.active } : a));
  };

  const deletePriceAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const markAlertNotificationAsRead = (notificationId: string) => {
    setAlertNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const clearAllAlertNotifications = () => {
    setAlertNotifications([]);
  };

  const simulateMatchingListing = async (alertId?: string): Promise<{ success: boolean; listing: MarketplaceListing; alertName: string }> => {
    const targetAlert = alertId
      ? alerts.find(a => a.id === alertId)
      : alerts.find(a => a.active) || alerts[0];

    if (!targetAlert) throw new Error("No active price alert available to simulate");

    const targetProject = targetAlert.projectId === 'ALL'
      ? projects[0]
      : projects.find(p => p.id === targetAlert.projectId) || projects[0];

    const discountedPriceUSD = Math.max(1, Math.round((targetAlert.targetPriceUSD * 0.94) * 100) / 100);
    const discountedPriceETH = Math.round((discountedPriceUSD / 3000) * 10000) / 10000;
    const amountTons = targetAlert.targetAmountTons || 2500;

    const newListing: MarketplaceListing = {
      id: listings.length + 100 + Math.floor(Math.random() * 100),
      tokenId: targetProject.id,
      projectId: targetProject.id,
      project: {
        ...targetProject,
        pricePerTonUSD: discountedPriceUSD,
        pricePerTonETH: discountedPriceETH
      },
      sellerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
      sellerName: `${targetProject.developerName} (Flash Offer)`,
      amount: amountTons,
      remainingAmount: amountTons,
      pricePerCreditETH: discountedPriceETH,
      pricePerCreditUSD: discountedPriceUSD,
      active: true,
      listedTimestamp: Date.now()
    };

    setListings(prev => [newListing, ...prev]);

    // Check alerts immediately
    evaluateAlertsAgainstListings([newListing], alerts);

    const txHash = generateRandomHash();
    addLog({
      type: 'LIST',
      title: `Marketplace Listing: ${targetProject.name}`,
      description: `New batch of ${amountTons.toLocaleString()} tCO2e listed at $${discountedPriceUSD.toFixed(2)}/tCO2e (Triggered Target Alert)`,
      from: newListing.sellerAddress,
      amountTons,
      ethValue: discountedPriceETH * amountTons,
      txHash,
      blockNumber: lastPolledBlock + 1,
      status: 'confirmed'
    });

    return {
      success: true,
      listing: newListing,
      alertName: targetAlert.projectName
    };
  };

  const unreadAlertCount = alertNotifications.filter(n => !n.read).length;

  return (
    <Web3Context.Provider
      value={{
        account: activeAccount,
        accountList,
        currentAccountIndex,
        isConnected,
        isConnecting,
        isMetaMask,
        projects,
        listings,
        certificates,
        logs,
        stats,
        projectUpdates,
        selectedProjectForDetail,
        setSelectedProjectForDetail,
        holdings,
        isQueryingHoldings,
        lastHoldingsQueryTimestamp,
        queryHoldingsFromContract,
        isPollingEvents,
        lastPolledBlock,
        lastPolledTime,
        pollSmartContractEvents,
        postProjectUpdate,
        connectMetaMask,
        switchAccount,
        disconnectWallet,
        registerProject,
        verifyProject,
        rejectProject,
        issueCredits,
        listCredits,
        buyCredits,
        retireCredits,
        selectedCertificate,
        setSelectedCertificate,
        alerts,
        alertNotifications,
        unreadAlertCount,
        browserNotificationPermission,
        requestBrowserNotificationPermission,
        createPriceAlert,
        updatePriceAlert,
        togglePriceAlert,
        deletePriceAlert,
        markAlertNotificationAsRead,
        clearAllAlertNotifications,
        simulateMatchingListing
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
