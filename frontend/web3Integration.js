/**
 * @file web3Integration.js
 * Ethers.js helper functions for CarbonX decentralized application.
 * Handles MetaMask connection, smart contract instantiation, transaction status tracking,
 * and calling register, verify, issue, list, buy, and retire functions.
 */

import { ethers } from "ethers";

// Contract ABIs
export const PROJECT_REGISTRY_ABI = [
  "function registerProject(string name, string country, string locationCoordinates, uint8 category, string methodology, uint256 expectedCO2eTons, string ipfsMetadataHash) external returns (uint256)",
  "function verifyProject(uint256 projectId) external",
  "function rejectProject(uint256 projectId, string reason) external",
  "function getProject(uint256 projectId) external view returns (tuple(uint256 projectId, address developer, string name, string country, string locationCoordinates, uint8 category, string methodology, uint256 expectedCO2eTons, uint256 issuedCredits, string ipfsMetadataHash, uint8 status, address verifiedBy, uint256 submissionTimestamp, uint256 verificationTimestamp, string rejectionReason))",
  "function getTotalProjectsCount() external view returns (uint256)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "event ProjectRegistered(uint256 indexed projectId, address indexed developer, string name, uint8 category, uint256 expectedCO2eTons, string ipfsMetadataHash, uint256 timestamp)",
  "event ProjectVerified(uint256 indexed projectId, address indexed verifier, uint256 timestamp)",
  "event ProjectCreditsIssued(uint256 indexed projectId, uint256 amountIssued, uint256 totalIssued, uint256 timestamp)"
];

export const CARBON_CREDIT_TOKEN_ABI = [
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external",
  "function issueCredits(uint256 projectId, address recipient, uint256 amount, uint256 vintageYear, string serialNumberRange, string ipfsMetadataUri) external returns (uint256)",
  "function getBatch(uint256 tokenId) external view returns (tuple(uint256 tokenId, uint256 projectId, uint256 vintageYear, uint256 totalSupply, uint256 retiredSupply, string serialNumberRange, string ipfsMetadataUri, uint256 issuanceTimestamp))",
  "function totalCreditsIssuedAllTime() external view returns (uint256)",
  "function totalCreditsRetiredAllTime() external view returns (uint256)",
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
  "event CreditsIssued(uint256 indexed tokenId, uint256 indexed projectId, address indexed recipient, uint256 amount, uint256 vintageYear, string serialNumberRange, string ipfsMetadataUri)"
];

export const MARKETPLACE_ABI = [
  "function listCredits(uint256 tokenId, uint256 amount, uint256 pricePerCreditWei) external returns (uint256)",
  "function buyCredits(uint256 listingId, uint256 amountToBuy) external payable",
  "function cancelListing(uint256 listingId) external",
  "function withdrawFunds() external",
  "function pendingWithdrawals(address payee) external view returns (uint256)",
  "function getListing(uint256 listingId) external view returns (tuple(uint256 listingId, address seller, uint256 tokenId, uint256 amount, uint256 remainingAmount, uint256 pricePerCreditWei, bool active, uint256 listedTimestamp))",
  "function getTotalListingsCount() external view returns (uint256)",
  "function totalVolumeTradedWei() external view returns (uint256)",
  "function totalCreditsTraded() external view returns (uint256)",
  "event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 pricePerCreditWei, uint256 timestamp)",
  "event CreditsPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 tokenId, uint256 amountBought, uint256 totalPricePaidWei, uint256 timestamp)"
];

export const RETIREMENT_REGISTRY_ABI = [
  "function retireCredits(uint256 tokenId, uint256 amount, string retireeName, string beneficiary, string retirementReason) external returns (bytes32 certificateHash, uint256 certificateId)",
  "function verifyCertificate(bytes32 certificateHash) external view returns (bool valid, tuple(bytes32 certificateHash, uint256 certificateId, address retireeAddress, string retireeName, string beneficiary, uint256 tokenId, uint256 projectId, uint256 amountTonsCO2e, uint256 timestamp, string retirementReason, string serialNumberRange, bool valid) cert)",
  "function getCertificateById(uint256 certificateId) external view returns (tuple(bytes32 certificateHash, uint256 certificateId, address retireeAddress, string retireeName, string beneficiary, uint256 tokenId, uint256 projectId, uint256 amountTonsCO2e, uint256 timestamp, string retirementReason, string serialNumberRange, bool valid))",
  "function getCertificatesForRetiree(address retiree) external view returns (uint256[])",
  "function totalTonnesOffsetAllTime() external view returns (uint256)",
  "function totalCertificatesIssued() external view returns (uint256)",
  "event CarbonCreditsRetired(bytes32 indexed certificateHash, uint256 indexed certificateId, address indexed retireeAddress, string retireeName, uint256 tokenId, uint256 amountTonsCO2e, uint256 timestamp, string retirementReason)"
];

// Default Deployed Addresses (Configurable for local / testnet)
export const CONTRACT_ADDRESSES = {
  projectRegistry: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  carbonCreditToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  marketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  retirementRegistry: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
};

/**
 * Connect to MetaMask or injected Web3 provider
 */
export async function connectWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Web3 provider found. Please install MetaMask or use our simulated Testnet account.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  const signer = await provider.getSigner();
  const balance = await provider.getBalance(accounts[0]);

  return {
    address: accounts[0],
    chainId: Number(network.chainId),
    networkName: network.name,
    balance: ethers.formatEther(balance),
    signer,
    provider
  };
}

/**
 * Buy Carbon Credits on-chain from Marketplace
 */
export async function executeBuyCredits(listingId, amount, pricePerCreditWei, signer, onStatusUpdate) {
  if (onStatusUpdate) onStatusUpdate({ status: "pending", message: "Submitting buy order to blockchain..." });
  
  const marketplace = new ethers.Contract(CONTRACT_ADDRESSES.marketplace, MARKETPLACE_ABI, signer);
  const totalCost = BigInt(pricePerCreditWei) * BigInt(amount);

  const tx = await marketplace.buyCredits(listingId, amount, { value: totalCost });
  if (onStatusUpdate) onStatusUpdate({ status: "confirming", hash: tx.hash, message: "Awaiting block confirmation..." });

  const receipt = await tx.wait();
  if (onStatusUpdate) onStatusUpdate({ status: "success", hash: receipt.hash, message: "Credits purchased successfully!" });

  return receipt;
}

/**
 * Permanently Retire Carbon Credits & Mint Certificate
 */
export async function executeRetireCredits(tokenId, amount, retireeName, beneficiary, reason, signer, onStatusUpdate) {
  if (onStatusUpdate) onStatusUpdate({ status: "pending", message: "Executing permanent on-chain retirement..." });

  const retirementRegistry = new ethers.Contract(CONTRACT_ADDRESSES.retirementRegistry, RETIREMENT_REGISTRY_ABI, signer);
  const tx = await retirementRegistry.retireCredits(tokenId, amount, retireeName, beneficiary, reason);

  if (onStatusUpdate) onStatusUpdate({ status: "confirming", hash: tx.hash, message: "Locking & burning tokens irrevocably..." });
  const receipt = await tx.wait();

  // Extract certificate hash from event logs
  let certificateHash = null;
  let certificateId = null;

  for (const log of receipt.logs) {
    try {
      const parsed = retirementRegistry.interface.parseLog(log);
      if (parsed && parsed.name === "CarbonCreditsRetired") {
        certificateHash = parsed.args.certificateHash;
        certificateId = parsed.args.certificateId.toString();
        break;
      }
    } catch {
      // Non-matching log
    }
  }

  if (onStatusUpdate) onStatusUpdate({
    status: "success",
    hash: receipt.hash,
    certificateHash,
    certificateId,
    message: "Retirement recorded permanently on-chain!"
  });

  return { receipt, certificateHash, certificateId };
}
