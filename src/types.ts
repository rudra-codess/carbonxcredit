/**
 * @file types.ts
 * Shared TypeScript interfaces and enums for CarbonX decentralized application.
 */

export type ProjectCategory =
  | 'Forestry'
  | 'Renewable Energy'
  | 'Blue Carbon'
  | 'Direct Air Capture'
  | 'Methane Capture'
  | 'Soil Carbon';

export type ProjectStatus = 'PendingVerification' | 'Verified' | 'Rejected' | 'Active' | 'Completed';

export interface Project {
  id: number;
  name: string;
  country: string;
  countryCode: string; // e.g. "BR", "KE", "US", "IS", "VN"
  location: string;
  coordinates: string;
  category: ProjectCategory;
  categoryIcon: string;
  methodology: string; // e.g. "VM0007 / VCS Verified"
  developerAddress: string;
  developerName: string;
  expectedCO2eTons: number;
  issuedCredits: number;
  availableCredits: number;
  retiredCredits: number;
  pricePerTonUSD: number;
  pricePerTonETH: number;
  vintageYear: number;
  ipfsHash: string;
  status: ProjectStatus;
  verifiedBy?: string;
  verifierName?: string;
  submissionDate: string;
  verificationDate?: string;
  description: string;
  coBenefits: string[];
  imageUrl: string;
  auditDocumentsUrl?: string;
}

export interface CreditBatch {
  tokenId: number;
  projectId: number;
  projectName: string;
  vintageYear: number;
  totalSupply: number;
  availableSupply: number;
  retiredSupply: number;
  serialNumberRange: string;
  ipfsMetadataUri: string;
  issuanceTimestamp: number;
}

export interface MarketplaceListing {
  id: number;
  tokenId: number;
  projectId: number;
  project: Project;
  sellerAddress: string;
  sellerName: string;
  amount: number;
  remainingAmount: number;
  pricePerCreditETH: number;
  pricePerCreditUSD: number;
  active: boolean;
  listedTimestamp: number;
}

export interface RetirementCertificate {
  certificateId: number;
  certificateHash: string;
  retireeAddress: string;
  retireeName: string;
  beneficiary: string;
  tokenId: number;
  projectId: number;
  projectName: string;
  category: ProjectCategory;
  amountTonsCO2e: number;
  timestamp: number;
  retirementReason: string;
  serialNumberRange: string;
  transactionHash: string;
  valid: boolean;
  qrCodeSeed?: string;
}

export interface Web3Account {
  address: string;
  name: string;
  role: 'ADMIN' | 'VERIFIER' | 'DEVELOPER' | 'BUYER';
  roleLabel: string;
  balanceETH: number;
  isMetaMask: boolean;
  avatar: string;
  ownedCredits: { [tokenId: number]: number };
}

export interface WalletCreditHolding {
  tokenId: number;
  projectId: number;
  project: Project;
  balanceTons: number;
  vintageYear: number;
  valueUSD: number;
  valueETH: number;
  serialNumberRange: string;
  contractAddress: string;
  tokenStandard: 'ERC-1155';
  lastQueriedBlock: number;
  tokenMetadataUri: string;
}

export interface TransactionLog {
  id: string;
  type: 'REGISTER' | 'VERIFY' | 'ISSUE' | 'LIST' | 'BUY' | 'RETIRE' | 'TRANSFER';
  title: string;
  description: string;
  from: string;
  to?: string;
  amountTons?: number;
  ethValue?: number;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface PlatformStats {
  totalCreditsIssued: number;
  totalCreditsRetired: number;
  totalCO2eOffsetTons: number;
  activeProjects: number;
  totalVolumeETH: number;
  totalVolumeUSD: number;
}

export interface TelemetryMetric {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  verified: boolean;
}

export type UpdateType = 
  | 'MRV_SATELLITE'
  | 'BIOMASS_AUDIT'
  | 'SENSOR_TELEMETRY'
  | 'COMMUNITY_BENEFIT'
  | 'SEQUESTRATION_MILESTONE';

export interface ProjectUpdate {
  id: string;
  projectId: number;
  projectName: string;
  projectCategory: ProjectCategory;
  timestamp: number;
  authorAddress: string;
  authorName: string;
  updateType: UpdateType;
  title: string;
  summary: string;
  metrics: TelemetryMetric[];
  ipfsEvidenceHash: string;
  oracleSignature: string;
  coordinates?: string;
  satelliteProvider?: string;
  verifiedOnChain: boolean;
  blockNumber: number;
}

export interface EmissionsBreakdown {
  scope1: number; // Direct emissions (vehicles, boilers)
  scope2: number; // Purchased electricity, heating
  scope3: number; // Supply chain, flights, server cloud
  customTotal: number;
  totalTons: number;
  estimatedCostUSD: number;
  estimatedCostETH: number;
  recommendedProject?: Project;
}

export interface PriceAlert {
  id: string;
  projectId: number | 'ALL';
  projectName: string;
  projectCategory?: ProjectCategory | 'ALL';
  condition: 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN_OR_EQUAL';
  targetPriceUSD: number;
  targetPriceETH: number;
  targetAmountTons?: number;
  createdAt: number;
  active: boolean;
  notifyBrowser: boolean;
  notifyInApp: boolean;
  lastTriggeredAt?: number;
  triggerCount: number;
}

export interface PriceAlertNotification {
  id: string;
  alertId: string;
  alertName: string;
  projectId: number;
  projectName: string;
  listingId: number;
  matchedPriceUSD: number;
  matchedPriceETH: number;
  targetPriceUSD: number;
  availableCredits: number;
  sellerName: string;
  timestamp: number;
  read: boolean;
}

export type GasSpeedTier = 'eco' | 'standard' | 'fast';

export interface GasTierDetail {
  label: string;
  priorityFeeGwei: number;
  estimatedSeconds: number;
  gasCostETH: number;
  gasCostUSD: number;
}

export interface GasEstimationData {
  baseFeeGwei: number;
  priorityFeeGwei: number;
  maxFeePerGasGwei: number;
  estimatedGasUnits: number;
  gasCostETH: number;
  gasCostUSD: number;
  networkCongestion: 'low' | 'medium' | 'high';
  blockNumber: number;
  timestamp: number;
  ethPriceUSD: number;
  selectedTier: GasSpeedTier;
  speedTiers: Record<GasSpeedTier, GasTierDetail>;
}


