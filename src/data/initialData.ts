/**
 * @file initialData.ts
 * Real-world calibrated carbon credit projects, listings, and Web3 test personas.
 */

import { Project, MarketplaceListing, RetirementCertificate, Web3Account, TransactionLog, ProjectUpdate, PriceAlert, PriceAlertNotification } from '../types';

export const INITIAL_TEST_ACCOUNTS: Web3Account[] = [
  {
    address: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    name: "Apex Green Infrastructure Ltd.",
    role: "DEVELOPER",
    roleLabel: "Project Developer",
    balanceETH: 14.85,
    isMetaMask: false,
    avatar: "🌱",
    ownedCredits: { 1: 15400, 2: 8200 }
  },
  {
    address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    name: "TÜV SÜD & Global Carbon Bureau",
    role: "VERIFIER",
    roleLabel: "Accredited Verifier (VCS/GS)",
    balanceETH: 5.2,
    isMetaMask: false,
    avatar: "🔬",
    ownedCredits: {}
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    name: "Novartis ESG & Climate Fund",
    role: "BUYER",
    roleLabel: "Corporate ESG Buyer",
    balanceETH: 45.0,
    isMetaMask: false,
    avatar: "🏢",
    ownedCredits: { 1: 2500, 3: 4000 }
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    name: "CarbonX Protocol Admin / DAO",
    role: "ADMIN",
    roleLabel: "Protocol Administrator",
    balanceETH: 120.0,
    isMetaMask: false,
    avatar: "⚡",
    ownedCredits: {}
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Amazonian Basin Canopy Reforestation",
    country: "Brazil",
    countryCode: "BR",
    location: "Pará State, Amazon Rainforest",
    coordinates: "-3.4653° S, -62.2159° W",
    category: "Forestry",
    categoryIcon: "Trees",
    methodology: "VM0007 / VCS Verified Carbon Standard",
    developerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    developerName: "Amazonia BioTrust",
    expectedCO2eTons: 120000,
    issuedCredits: 85000,
    availableCredits: 38400,
    retiredCredits: 46600,
    pricePerTonUSD: 18.5,
    pricePerTonETH: 0.0062,
    vintageYear: 2025,
    ipfsHash: "ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    status: "Active",
    verifiedBy: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    verifierName: "TÜV SÜD Climate Services",
    submissionDate: "2025-01-14",
    verificationDate: "2025-03-02",
    description: "Restores 45,000 hectares of degraded indigenous land through native tree planting, protecting endangered jaguar corridors and empowering riverine communities.",
    coBenefits: ["Biodiversity Protection", "Indigenous Land Rights", "Water Table Restoration", "SDG 13 & 15"],
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",
    auditDocumentsUrl: "https://ipfs.io/ipfs/QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx"
  },
  {
    id: 2,
    name: "Kenya Blue Carbon Coastal Mangrove Sanctuary",
    country: "Kenya",
    countryCode: "KE",
    location: "Gazi Bay, Kwale County",
    coordinates: "-4.4239° S, 39.5167° E",
    category: "Blue Carbon",
    categoryIcon: "Waves",
    methodology: "VM0033 / Gold Standard",
    developerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    developerName: "Mikoko Pamoja Community Trust",
    expectedCO2eTons: 65000,
    issuedCredits: 42000,
    availableCredits: 19800,
    retiredCredits: 22200,
    pricePerTonUSD: 24.0,
    pricePerTonETH: 0.0080,
    vintageYear: 2026,
    ipfsHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    status: "Active",
    verifiedBy: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    verifierName: "Verra Accredited Auditor",
    submissionDate: "2025-04-10",
    verificationDate: "2025-06-18",
    description: "Mangrove ecosystems sequester carbon up to 4x faster than terrestrial tropical forests. Funds coastal education, clean water wells, and sustainable artisanal fishing.",
    coBenefits: ["High Sequestration Rate", "Coastal Storm Surge Defense", "Fisheries Revival", "SDG 14"],
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Hellisheiði Geothermal Direct Air Capture (DAC)",
    country: "Iceland",
    countryCode: "IS",
    location: "Hengill Geothermal Plateau",
    coordinates: "64.0411° N, 21.4014° W",
    category: "Direct Air Capture",
    categoryIcon: "Wind",
    methodology: "Puro.earth Standard DAC+Mineralization",
    developerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    developerName: "CarbFix Nordic Direct",
    expectedCO2eTons: 35000,
    issuedCredits: 28000,
    availableCredits: 11200,
    retiredCredits: 16800,
    pricePerTonUSD: 145.0,
    pricePerTonETH: 0.0483,
    vintageYear: 2026,
    ipfsHash: "ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR",
    status: "Active",
    verifiedBy: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    verifierName: "Puro.earth Accredited Verifier",
    submissionDate: "2025-08-20",
    verificationDate: "2025-10-15",
    description: "Permanent mineralization of atmospheric CO2 into solid basalt rock formations with zero leakage risk for >10,000 years, powered by 100% clean geothermal energy.",
    coBenefits: ["Permanent 10,000+ yr Storage", "Zero Land Footprint", "Puro-Verified CDR", "SDG 9 & 13"],
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "West Texas Wind Energy Grid Decarbonization",
    country: "United States",
    countryCode: "US",
    location: "Sweetwater, Nolan County, TX",
    coordinates: "32.4709° N, 100.4059° W",
    category: "Renewable Energy",
    categoryIcon: "Zap",
    methodology: "ACM0002 / American Carbon Registry",
    developerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    developerName: "Lone Star Clean Power",
    expectedCO2eTons: 95000,
    issuedCredits: 68000,
    availableCredits: 34500,
    retiredCredits: 33500,
    pricePerTonUSD: 12.0,
    pricePerTonETH: 0.0040,
    vintageYear: 2025,
    ipfsHash: "ipfs://QmUNLLsPACCz1vLxQVkXqqLX5R1X345jhf9e2889240",
    status: "Active",
    verifiedBy: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    verifierName: "American Carbon Registry Auditor",
    submissionDate: "2025-02-12",
    verificationDate: "2025-04-05",
    description: "Displaces heavy coal and gas peaking plants across the ERCOT electric grid by supplying 280 MW of utility-scale zero-emission wind energy.",
    coBenefits: ["Grid Decarbonization", "Local Job Creation", "Air Quality Improvement", "SDG 7"],
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Mekong Delta Agricultural Rice Methane Reduction",
    country: "Vietnam",
    countryCode: "VN",
    location: "An Giang Province, Mekong Delta",
    coordinates: "10.5216° N, 105.1259° E",
    category: "Methane Capture",
    categoryIcon: "Flame",
    methodology: "AMS-III.AU / Gold Standard",
    developerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    developerName: "AgroClimate Asia Foundation",
    expectedCO2eTons: 48000,
    issuedCredits: 31000,
    availableCredits: 14200,
    retiredCredits: 16800,
    pricePerTonUSD: 16.5,
    pricePerTonETH: 0.0055,
    vintageYear: 2026,
    ipfsHash: "ipfs://QmPZ9gcCEpqKTo6aq61g2Nx7jkCQTq4F3nm3YN2ewDHUDp",
    status: "Active",
    verifiedBy: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    verifierName: "Gold Standard Technical Team",
    submissionDate: "2025-05-19",
    verificationDate: "2025-07-22",
    description: "Implements Alternate Wetting and Drying (AWD) water management across 18,000 smallholder rice paddies, cutting potent anaerobic methane emissions by 48%.",
    coBenefits: ["Water Conservation", "Farmer Income +22%", "Food Security", "SDG 2 & 13"],
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Nordic Peatland Rewetting & Soil Carbon Banking",
    country: "Finland",
    countryCode: "FI",
    location: "North Karelia Biosphere Reserve",
    coordinates: "62.6010° N, 29.7636° E",
    category: "Soil Carbon",
    categoryIcon: "Sprout",
    methodology: "VM0036 / VCS Wetlands Restorations",
    developerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    developerName: "Suomi Peatland Trust",
    expectedCO2eTons: 38000,
    issuedCredits: 22000,
    availableCredits: 11500,
    retiredCredits: 10500,
    pricePerTonUSD: 22.0,
    pricePerTonETH: 0.0073,
    vintageYear: 2026,
    ipfsHash: "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    status: "Active",
    verifiedBy: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    verifierName: "TÜV SÜD Climate Services",
    submissionDate: "2025-06-05",
    verificationDate: "2025-08-11",
    description: "Rewets drained boreal forestry peatlands to halt microbial decomposition, locking gigatons of ancient soil carbon while revitalizing natural cranberry bogs.",
    coBenefits: ["Soil Carbon Sequestration", "Wetland Biodiversity", "Microclimate Stabilization", "SDG 15"],
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_LISTINGS: MarketplaceListing[] = [
  {
    id: 1,
    tokenId: 1,
    projectId: 1,
    project: INITIAL_PROJECTS[0],
    sellerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    sellerName: "Amazonia BioTrust",
    amount: 15000,
    remainingAmount: 12400,
    pricePerCreditETH: 0.0062,
    pricePerCreditUSD: 18.5,
    active: true,
    listedTimestamp: Date.now() - 86400000 * 4
  },
  {
    id: 2,
    tokenId: 2,
    projectId: 2,
    project: INITIAL_PROJECTS[1],
    sellerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    sellerName: "Mikoko Pamoja Trust",
    amount: 8000,
    remainingAmount: 6500,
    pricePerCreditETH: 0.0080,
    pricePerCreditUSD: 24.0,
    active: true,
    listedTimestamp: Date.now() - 86400000 * 2
  },
  {
    id: 3,
    tokenId: 3,
    projectId: 3,
    project: INITIAL_PROJECTS[2],
    sellerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    sellerName: "CarbFix Nordic",
    amount: 5000,
    remainingAmount: 3800,
    pricePerCreditETH: 0.0483,
    pricePerCreditUSD: 145.0,
    active: true,
    listedTimestamp: Date.now() - 86400000 * 1
  },
  {
    id: 4,
    tokenId: 4,
    projectId: 4,
    project: INITIAL_PROJECTS[3],
    sellerAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    sellerName: "Lone Star Power",
    amount: 12000,
    remainingAmount: 9800,
    pricePerCreditETH: 0.0040,
    pricePerCreditUSD: 12.0,
    active: true,
    listedTimestamp: Date.now() - 86400000 * 6
  }
];

export const INITIAL_CERTIFICATES: RetirementCertificate[] = [
  {
    certificateId: 1042,
    certificateHash: "0x8e42f9a912cf302a9b348d6175e2b4f9104ad59918239cb1a5e305e76a084ef7",
    retireeAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    retireeName: "Novartis Global ESG Operations",
    beneficiary: "Global Logistics & Data Center Scope 2 Emissions 2026",
    tokenId: 1,
    projectId: 1,
    projectName: "Amazonian Basin Canopy Reforestation",
    category: "Forestry",
    amountTonsCO2e: 2500,
    timestamp: Date.now() - 86400000 * 3,
    retirementReason: "Corporate Scope 2 Carbon Neutrality Commitment",
    serialNumberRange: "CX-2025-BR-000001-002500",
    transactionHash: "0x3a9f0e1d2c4b5a67890123456789abcdef0123456789abcdef0123456789abcd",
    valid: true
  },
  {
    certificateId: 1043,
    certificateHash: "0x12d59a8c439f0b12759e612cb34891a0ef61783452390abdf192847192847102",
    retireeAddress: "0x7890123456789012345678901234567890123456",
    retireeName: "Stripe Climate Collective & Tech Partners",
    beneficiary: "Carbon Negative Cloud Computing Initiative",
    tokenId: 3,
    projectId: 3,
    projectName: "Hellisheiði Geothermal Direct Air Capture (DAC)",
    category: "Direct Air Capture",
    amountTonsCO2e: 850,
    timestamp: Date.now() - 86400000 * 1,
    retirementReason: "Permanent 10,000-Year Carbon Removal",
    serialNumberRange: "CX-2026-IS-000001-000850",
    transactionHash: "0x7e8b9a0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    valid: true
  }
];

export const INITIAL_LOGS: TransactionLog[] = [
  {
    id: "tx-1",
    type: "RETIRE",
    title: "Carbon Credits Permanently Retired",
    description: "Novartis ESG retired 2,500 tCO2e (Amazonian Basin) -> Certificate #1042 minted",
    from: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    amountTons: 2500,
    txHash: "0x3a9f0e1d2c4b5a67890123456789abcdef0123456789abcdef0123456789abcd",
    blockNumber: 19482015,
    timestamp: Date.now() - 86400000 * 3,
    status: "confirmed"
  },
  {
    id: "tx-2",
    type: "BUY",
    title: "Marketplace Purchase Executed",
    description: "Novartis bought 2,500 tCO2e for 15.5 ETH from Amazonia BioTrust",
    from: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    to: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    amountTons: 2500,
    ethValue: 15.5,
    txHash: "0x4b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
    blockNumber: 19481950,
    timestamp: Date.now() - 86400000 * 3 - 3600000,
    status: "confirmed"
  },
  {
    id: "tx-3",
    type: "ISSUE",
    title: "ERC-1155 Batch Tokens Minted",
    description: "Issued 42,000 tCO2e to Kenya Mangrove Sanctuary (Token ID #2)",
    from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    to: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    amountTons: 42000,
    txHash: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    blockNumber: 19480100,
    timestamp: Date.now() - 86400000 * 5,
    status: "confirmed"
  },
  {
    id: "tx-4",
    type: "VERIFY",
    title: "MRV Audit Approved by Verifier",
    description: "TÜV SÜD approved Project #2 (Kenya Blue Carbon) under Gold Standard",
    from: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    txHash: "0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
    blockNumber: 19479500,
    timestamp: Date.now() - 86400000 * 6,
    status: "confirmed"
  }
];

export const MONTHLY_TREND_DATA = [
  { month: "Sep '25", issued: 45000, retired: 18000, cumulative: 45000 },
  { month: "Oct '25", issued: 82000, retired: 39000, cumulative: 127000 },
  { month: "Nov '25", issued: 64000, retired: 48000, cumulative: 191000 },
  { month: "Dec '25", issued: 95000, retired: 72000, cumulative: 286000 },
  { month: "Jan '26", issued: 110000, retired: 89000, cumulative: 396000 },
  { month: "Feb '26", issued: 135000, retired: 112000, cumulative: 531000 },
  { month: "Mar '26", issued: 168000, retired: 146000, cumulative: 699000 }
];

export const INITIAL_PROJECT_UPDATES: ProjectUpdate[] = [
  {
    id: "upd-101",
    projectId: 1,
    projectName: "Amazonian Basin Canopy Reforestation",
    projectCategory: "Forestry",
    timestamp: Date.now() - 1000 * 60 * 24, // 24 mins ago
    authorAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    authorName: "Amazonia BioTrust MRV Station",
    updateType: "MRV_SATELLITE",
    title: "Sentinel-2 Multi-Spectral Canopy Growth & NDVI Surge",
    summary: "Bi-weekly ESA Copernicus satellite pass confirms 4.8% biomass density gain across Sector 4B. Automated machine learning computer vision detected 0.00% illegal logging incursions.",
    metrics: [
      { label: "Canopy NDVI Index", value: "0.84", change: "+0.04 vs baseline", trend: "up", verified: true },
      { label: "Biomass Sequestration", value: "1,420", unit: "tCO2e/month", change: "+6.2%", trend: "up", verified: true },
      { label: "Tree Canopy Coverage", value: "92.4%", unit: "Hectares", change: "+140 ha", trend: "up", verified: true },
      { label: "Thermal Hotspot Anomaly", value: "0 Detected", trend: "stable", verified: true }
    ],
    ipfsEvidenceHash: "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    oracleSignature: "0x8f2d1e0a9b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
    coordinates: "-3.4653° S, -62.2159° W",
    satelliteProvider: "ESA Sentinel-2 MSI (10m Optical Resolution)",
    verifiedOnChain: true,
    blockNumber: 19483120
  },
  {
    id: "upd-102",
    projectId: 3,
    projectName: "Hellisheiði Geothermal Direct Air Capture (DAC)",
    projectCategory: "Direct Air Capture",
    timestamp: Date.now() - 1000 * 60 * 95, // 95 mins ago
    authorAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    authorName: "CarbFix & Climeworks Core Sensor Grid",
    updateType: "SENSOR_TELEMETRY",
    title: "Basalt Mineralization Chamber Pressure & Flow Attestation",
    summary: "Downhole pressure transducer telemetry logs continuous dissolution of aqueous CO2 into subsurface basaltic rock formations at 750m depth with 99.8% capture efficiency.",
    metrics: [
      { label: "Subsurface Chamber Pressure", value: "25.4", unit: "Bar", trend: "stable", verified: true },
      { label: "Daily CO2 Mineralized", value: "11.2", unit: "tCO2e/day", change: "+1.1 t", trend: "up", verified: true },
      { label: "Pumping Energy Source", value: "100% Geothermal", trend: "stable", verified: true },
      { label: "Dissolution Permanence", value: "10,000+ Years", trend: "stable", verified: true }
    ],
    ipfsEvidenceHash: "ipfs://QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRCGu6x1AwQH",
    oracleSignature: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    coordinates: "64.0413° N, 21.4022° W",
    satelliteProvider: "IoT SCADA Basalt Pressure Ring #4",
    verifiedOnChain: true,
    blockNumber: 19483084
  },
  {
    id: "upd-103",
    projectId: 2,
    projectName: "Kenya Blue Carbon Coastal Mangrove Sanctuary",
    projectCategory: "Blue Carbon",
    timestamp: Date.now() - 1000 * 60 * 240, // 4 hours ago
    authorAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    authorName: "Mikoko Pamoja Marine Labs",
    updateType: "BIOMASS_AUDIT",
    title: "Tidal Substrate Core Analysis & Carbon Accretion Rate",
    summary: "Quarterly sediment core sampling in Gazi Bay recorded 2.1mm sediment carbon accretion rate. Acoustic hydrophone array confirms zero mangrove root disturbance.",
    metrics: [
      { label: "Sediment Accretion Rate", value: "2.1", unit: "mm/year", change: "+0.3 mm", trend: "up", verified: true },
      { label: "Soil Organic Carbon (SOC)", value: "348", unit: "Mg C/ha", change: "+12 Mg", trend: "up", verified: true },
      { label: "Salinity Gradient (TDS)", value: "32.4", unit: "ppt", trend: "stable", verified: true },
      { label: "Fish Nursery Biodiversity", value: "+28% Juvenile taxa", trend: "up", verified: true }
    ],
    ipfsEvidenceHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    oracleSignature: "0x3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
    coordinates: "-4.4239° S, 39.5167° E",
    satelliteProvider: "PlanetScope 3m Planet Labs Constellation",
    verifiedOnChain: true,
    blockNumber: 19482910
  },
  {
    id: "upd-104",
    projectId: 4,
    projectName: "West Texas SuperGrid Wind Power Offset",
    projectCategory: "Renewable Energy",
    timestamp: Date.now() - 1000 * 60 * 480, // 8 hours ago
    authorAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    authorName: "ERCOT Settlement Node 84A",
    updateType: "SENSOR_TELEMETRY",
    title: "High-Wind Yield Attestation & Grid Carbon Avoidance",
    summary: "Turbines operated at 44.2% average capacity factor over the preceding 7-day front. Displaced 18,400 MWh of thermal generation from ERCOT regional grid.",
    metrics: [
      { label: "Displaced Grid Power", value: "18,400", unit: "MWh", change: "+1,200 MWh", trend: "up", verified: true },
      { label: "Grid Carbon Avoidance", value: "14,200", unit: "tCO2e", trend: "up", verified: true },
      { label: "Turbine Inverter Uptime", value: "99.4%", trend: "stable", verified: true },
      { label: "Nacelle Vibration Index", value: "Nominal (0.12g)", trend: "stable", verified: true }
    ],
    ipfsEvidenceHash: "ipfs://QmPJZq9PZ4a5hM6w2q6r7t8y9u0i1o2p3a4s5d6f7g8h9j",
    oracleSignature: "0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    coordinates: "31.8457° N, -102.3676° W",
    satelliteProvider: "SCADA IEC-61850 Real-time Gateway",
    verifiedOnChain: true,
    blockNumber: 19482400
  },
  {
    id: "upd-105",
    projectId: 5,
    projectName: "Mekong Delta Agricultural Soil Carbon & Biochar",
    projectCategory: "Soil Carbon",
    timestamp: Date.now() - 1000 * 60 * 720, // 12 hours ago
    authorAddress: "0x71C80917030F55716E56fC3A7d1d28FE25F255a8",
    authorName: "An Giang Rice Ag-Tech Cooperative",
    updateType: "SEQUESTRATION_MILESTONE",
    title: "Pyrolysis Temperature & Biochar Carbon Stability Audit",
    summary: "Continuous temperature monitoring on Pyreg continuous pyrolyzers certified average reaction temperature of 680°C. Hydrogen/Organic Carbon ratio certified at 0.28 (EBC Premium Grade).",
    metrics: [
      { label: "H/C Organic Ratio", value: "0.28", unit: "EBC Standard", trend: "stable", verified: true },
      { label: "Permanence Half-life", value: ">500 Years", trend: "stable", verified: true },
      { label: "Biochar Incorporated", value: "480", unit: "Tonnes", change: "+65 t", trend: "up", verified: true },
      { label: "Paddy Methane Avoided", value: "1,850", unit: "tCO2e", trend: "up", verified: true }
    ],
    ipfsEvidenceHash: "ipfs://QmZ5rT6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z1x2c3v4b5n",
    oracleSignature: "0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
    coordinates: "10.3759° N, 105.4372° E",
    satelliteProvider: "Agri-IoT LoRaWAN Soil Array & Pyreg SCADA",
    verifiedOnChain: true,
    blockNumber: 19481900
  }
];

export const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: "alert-1",
    projectId: 1,
    projectName: "Amazonian Basin Canopy Reforestation",
    projectCategory: "Forestry",
    condition: "LESS_THAN_OR_EQUAL",
    targetPriceUSD: 18.00,
    targetPriceETH: 0.0060,
    targetAmountTons: 1000,
    createdAt: Date.now() - 86400000 * 2,
    active: true,
    notifyBrowser: true,
    notifyInApp: true,
    triggerCount: 1,
    lastTriggeredAt: Date.now() - 3600000 * 4
  },
  {
    id: "alert-2",
    projectId: 2,
    projectName: "Mikoko Pamoja Kenya Mangrove Sanctuary",
    projectCategory: "Blue Carbon",
    condition: "LESS_THAN_OR_EQUAL",
    targetPriceUSD: 22.50,
    targetPriceETH: 0.0075,
    targetAmountTons: 500,
    createdAt: Date.now() - 86400000 * 1,
    active: true,
    notifyBrowser: true,
    notifyInApp: true,
    triggerCount: 0
  },
  {
    id: "alert-3",
    projectId: 'ALL',
    projectName: "Any Direct Air Capture (DAC) Project",
    projectCategory: "Direct Air Capture",
    condition: "LESS_THAN_OR_EQUAL",
    targetPriceUSD: 140.00,
    targetPriceETH: 0.0460,
    createdAt: Date.now() - 86400000 * 3,
    active: true,
    notifyBrowser: true,
    notifyInApp: true,
    triggerCount: 0
  }
];

export const INITIAL_ALERT_NOTIFICATIONS: PriceAlertNotification[] = [
  {
    id: "notif-1",
    alertId: "alert-1",
    alertName: "Amazonian Basin ≤ $18.00/tCO2e",
    projectId: 1,
    projectName: "Amazonian Basin Canopy Reforestation",
    listingId: 1,
    matchedPriceUSD: 17.80,
    matchedPriceETH: 0.0059,
    targetPriceUSD: 18.00,
    availableCredits: 2400,
    sellerName: "Amazonia BioTrust",
    timestamp: Date.now() - 3600000 * 4,
    read: false
  }
];

