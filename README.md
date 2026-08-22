# CarbonX Credits: Decentralized Carbon Credit Marketplace

CarbonX Credits is an enterprise-grade blockchain platform bringing end-to-end transparency, mathematical trust, and immutable on-chain traceability to the global carbon market.
LINK TO CarbonX = https://carbon-x-2.vercel.app/

---

## 🏗️ Architecture & Contract Mapping

CarbonX coordinates four core smart contracts implementing role-based access control, ERC-1155 batch tokenization, non-custodial marketplace trading, and an immutable retirement registry.

| Smart Contract | Solidity File | Purpose & Standards |
| :--- | :--- | :--- |
| **`ProjectRegistry`** | `contracts/ProjectRegistry.sol` | Project onboarding, MRV metadata IPFS storage, verifier accreditation (VCS, Gold Standard), validation status machine. |
| **`CarbonCreditToken`** | `contracts/CarbonCreditToken.sol` | **ERC-1155 Multi-Token Standard**. 1 Token = 1 metric tonne $CO_2e$. Tracks vintages, serial numbers, metadata CIDs, and burns retired tokens. |
| **`Marketplace`** | `contracts/Marketplace.sol` | Fixed-price trading escrow, ReentrancyGuard protection, pull-payment pattern (`withdrawFunds`), and 1% platform fee. |
| **`RetirementRegistry`** | `contracts/RetirementRegistry.sol` | Irreversible token burning, Keccak256 certificate hashing, unique certificate issuance, and anti-double-counting guarantees. |

---

## 🔄 Mapping to the 8-Step "How CarbonX Works" Flow

1. **Step 1: Project Registration** → Developer registers project metadata on `ProjectRegistry.sol` with IPFS documentation CID.
2. **Step 2: Verification & Validation** → Accredited verifier with `VERIFIER_ROLE` audits MRV data and calls `verifyProject()`.
3. **Step 3: Credit Issuance** → Project gets minted tokenized credits via `CarbonCreditToken.sol` with serial batch ranges (e.g., `CX-2026-BR-000001-050000`).
4. **Step 4: Listing on Marketplace** → Credit holder deposits ERC-1155 tokens into `Marketplace.sol` escrow via `listCredits()`.
5. **Step 5: Purchase by Buyer** → Organization/individual purchases credits with ETH via `buyCredits()`.
6. **Step 6: Transfer & Ownership** → Ownership transfers securely on-chain via `safeTransferFrom()`.
7. **Step 7: Permanent Retirement** → Buyer invokes `RetirementRegistry.sol::retireCredits()` to lock & burn tokens permanently.
8. **Step 8: Impact Tracking** → On-chain event `CarbonCreditsRetired` emits certificate hash and updates live metrics.

---

## ⏳ Mapping to the 6-Step "Carbon Credit Life Cycle"

```
[1. Project Development] ──> [2. Verification & Validation] ──> [3. Credit Issuance]
         │                                   │                                │
         ▼                                   ▼                                ▼
 ProjectRegistry.registerProject()   ProjectRegistry.verifyProject()   CarbonCreditToken.issueCredits()

                                             │
                                             ▼
[6. Impact & Reporting]   <─── [5. Retirement]   <─── [4. Trading & Transfer]
         │                                │                                │
         ▼                                ▼                                ▼
RetirementRegistry.verifyCertificate()  RetirementRegistry.retireCredits()  Marketplace.buyCredits()
```

---

## 🚀 Local Hardhat Run & Deploy Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### 1. Compile Smart Contracts
```bash
npx hardhat compile
```

### 2. Run Test Suite
```bash
npx hardhat test
```

### 3. Start Local Hardhat Node & Deploy
```bash
# Terminal 1:
npx hardhat node

# Terminal 2:
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🔒 Security & Anti-Double-Counting Guarantees

- **Non-Transferable Retirement**: Once retired, credits are burnt (`TransferSingle(operator, owner, address(0), id, amount)`). They cannot be re-listed or re-transferred.
- **Serial Tracking**: Every credit batch encodes its immutable serial range directly within the contract state.
- **ReentrancyGuard**: Marketplace operations are guarded against reentrancy attacks.
- **Pull-Payment Pattern**: Proceeds from credit sales are stored in `pendingWithdrawals` to prevent denial-of-service vector exploits.
