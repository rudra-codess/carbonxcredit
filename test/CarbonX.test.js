/**
 * @file CarbonX.test.js
 * Comprehensive unit test suite for CarbonX Smart Contract Suite.
 * Covers: Project Registration, Verification, ERC-1155 Issuance, Marketplace Listing,
 * Purchasing, Retirement, Certificate generation, and Double-Retirement Prevention.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonX Carbon Credit Protocol Test Suite", function () {
  let deployer, verifier, developer, buyer1, buyer2, unauthorizedUser;
  let projectRegistry, carbonCreditToken, marketplace, retirementRegistry;

  const PROJECT_NAME = "Amazonian Rainforest Basin Conservation";
  const COUNTRY = "Brazil";
  const COORDS = "-3.4653, -62.2159";
  const CATEGORY_FORESTRY = 0;
  const METHODOLOGY = "VM0007 / VCS Verified Carbon Standard";
  const EXPECTED_CO2E = 50000; // 50,000 tonnes
  const IPFS_HASH = "ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx";

  beforeEach(async function () {
    [deployer, verifier, developer, buyer1, buyer2, unauthorizedUser] = await ethers.getSigners();

    // 1. Deploy ProjectRegistry
    const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
    projectRegistry = await ProjectRegistry.deploy();
    await projectRegistry.waitForDeployment();

    // 2. Deploy CarbonCreditToken
    const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
    carbonCreditToken = await CarbonCreditToken.deploy(await projectRegistry.getAddress());
    await carbonCreditToken.waitForDeployment();

    // 3. Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(await carbonCreditToken.getAddress());
    await marketplace.waitForDeployment();

    // 4. Deploy RetirementRegistry
    const RetirementRegistry = await ethers.getContractFactory("RetirementRegistry");
    retirementRegistry = await RetirementRegistry.deploy(await carbonCreditToken.getAddress());
    await retirementRegistry.waitForDeployment();

    // Authorizations
    await projectRegistry.setCarbonCreditToken(await carbonCreditToken.getAddress());
    await carbonCreditToken.setMarketplace(await marketplace.getAddress());
    await carbonCreditToken.setRetirementRegistry(await retirementRegistry.getAddress());

    // Roles
    const VERIFIER_ROLE = await projectRegistry.VERIFIER_ROLE();
    const PROJECT_DEVELOPER_ROLE = await projectRegistry.PROJECT_DEVELOPER_ROLE();
    await projectRegistry.grantRole(VERIFIER_ROLE, verifier.address);
    await projectRegistry.grantRole(PROJECT_DEVELOPER_ROLE, developer.address);
  });

  describe("1. Project Registration & Verification", function () {
    it("Should allow a developer to register a climate project", async function () {
      const tx = await projectRegistry.connect(developer).registerProject(
        PROJECT_NAME,
        COUNTRY,
        COORDS,
        CATEGORY_FORESTRY,
        METHODOLOGY,
        EXPECTED_CO2E,
        IPFS_HASH
      );

      const receipt = await tx.wait();
      expect(await projectRegistry.getTotalProjectsCount()).to.equal(1);

      const project = await projectRegistry.getProject(1);
      expect(project.name).to.equal(PROJECT_NAME);
      expect(project.developer).to.equal(developer.address);
      expect(project.status).to.equal(0); // PendingVerification
    });

    it("Should prevent unauthorized users from verifying projects", async function () {
      await projectRegistry.connect(developer).registerProject(
        PROJECT_NAME, COUNTRY, COORDS, CATEGORY_FORESTRY, METHODOLOGY, EXPECTED_CO2E, IPFS_HASH
      );

      await expect(
        projectRegistry.connect(unauthorizedUser).verifyProject(1)
      ).to.be.revertedWith("ProjectRegistry: unauthorized access");
    });

    it("Should allow an accredited verifier to approve a project", async function () {
      await projectRegistry.connect(developer).registerProject(
        PROJECT_NAME, COUNTRY, COORDS, CATEGORY_FORESTRY, METHODOLOGY, EXPECTED_CO2E, IPFS_HASH
      );

      await expect(projectRegistry.connect(verifier).verifyProject(1))
        .to.emit(projectRegistry, "ProjectVerified")
        .withArgs(1, verifier.address, (val) => val > 0);

      const project = await projectRegistry.getProject(1);
      expect(project.status).to.equal(1); // Verified
      expect(project.verifiedBy).to.equal(verifier.address);
    });
  });

  describe("2. ERC-1155 Tokenized Credit Issuance", function () {
    beforeEach(async function () {
      await projectRegistry.connect(developer).registerProject(
        PROJECT_NAME, COUNTRY, COORDS, CATEGORY_FORESTRY, METHODOLOGY, EXPECTED_CO2E, IPFS_HASH
      );
      await projectRegistry.connect(verifier).verifyProject(1);
    });

    it("Should issue tokenized credits to developer with serial numbers and IPFS URI", async function () {
      const vintageYear = 2026;
      const serialRange = "CX-2026-BR-000001-010000";
      const amount = 10000;

      await expect(
        carbonCreditToken.connect(deployer).issueCredits(
          1,
          developer.address,
          amount,
          vintageYear,
          serialRange,
          IPFS_HASH
        )
      ).to.emit(carbonCreditToken, "CreditsIssued")
       .withArgs(1, 1, developer.address, amount, vintageYear, serialRange, IPFS_HASH);

      expect(await carbonCreditToken.balanceOf(developer.address, 1)).to.equal(amount);
      expect(await carbonCreditToken.totalCreditsIssuedAllTime()).to.equal(amount);

      const batch = await carbonCreditToken.getBatch(1);
      expect(batch.totalSupply).to.equal(amount);
      expect(batch.serialNumberRange).to.equal(serialRange);
    });

    it("Should revert if credit issuance exceeds total verified project capacity", async function () {
      const overCapacity = 60000; // Capacity is 50000
      await expect(
        carbonCreditToken.connect(deployer).issueCredits(
          1,
          developer.address,
          overCapacity,
          2026,
          "CX-2026-BR-000001-060000",
          IPFS_HASH
        )
      ).to.be.revertedWith("Exceeds total verified capacity");
    });
  });

  describe("3. Marketplace Trading & Pull Payments", function () {
    const tokenId = 1;
    const issueAmount = 5000;
    const listAmount = 2000;
    const pricePerCredit = ethers.parseEther("0.01"); // 0.01 ETH per tCO2e

    beforeEach(async function () {
      await projectRegistry.connect(developer).registerProject(
        PROJECT_NAME, COUNTRY, COORDS, CATEGORY_FORESTRY, METHODOLOGY, EXPECTED_CO2E, IPFS_HASH
      );
      await projectRegistry.connect(verifier).verifyProject(1);
      await carbonCreditToken.connect(deployer).issueCredits(
        1, developer.address, issueAmount, 2026, "CX-2026-BR-000001-005000", IPFS_HASH
      );
      // Approve marketplace
      await carbonCreditToken.connect(developer).setApprovalForAll(await marketplace.getAddress(), true);
    });

    it("Should allow a credit holder to list credits on the marketplace", async function () {
      await expect(
        marketplace.connect(developer).listCredits(tokenId, listAmount, pricePerCredit)
      ).to.emit(marketplace, "ListingCreated")
       .withArgs(1, developer.address, tokenId, listAmount, pricePerCredit, (t) => t > 0);

      const listing = await marketplace.getListing(1);
      expect(listing.amount).to.equal(listAmount);
      expect(listing.remainingAmount).to.equal(listAmount);
      expect(listing.active).to.be.true;
    });

    it("Should allow a buyer to purchase credits and transfer ERC-1155 tokens", async function () {
      await marketplace.connect(developer).listCredits(tokenId, listAmount, pricePerCredit);

      const buyAmount = 500;
      const totalCost = pricePerCredit * BigInt(buyAmount);

      await expect(
        marketplace.connect(buyer1).buyCredits(1, buyAmount, { value: totalCost })
      ).to.emit(marketplace, "CreditsPurchased")
       .withArgs(1, buyer1.address, developer.address, tokenId, buyAmount, totalCost, (t) => t > 0);

      // Buyer receives credits
      expect(await carbonCreditToken.balanceOf(buyer1.address, tokenId)).to.equal(buyAmount);

      // Seller accumulates pending withdrawal funds
      const fee = (totalCost * 100n) / 10000n; // 1% fee
      const expectedSellerProceeds = totalCost - fee;
      expect(await marketplace.pendingWithdrawals(developer.address)).to.equal(expectedSellerProceeds);
    });

    it("Should allow seller to withdraw sales proceeds via pull-payment", async function () {
      await marketplace.connect(developer).listCredits(tokenId, listAmount, pricePerCredit);
      const buyAmount = 1000;
      const totalCost = pricePerCredit * BigInt(buyAmount);
      await marketplace.connect(buyer1).buyCredits(1, buyAmount, { value: totalCost });

      const initialBal = await ethers.provider.getBalance(developer.address);
      const pending = await marketplace.pendingWithdrawals(developer.address);

      const tx = await marketplace.connect(developer).withdrawFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const finalBal = await ethers.provider.getBalance(developer.address);
      expect(finalBal + gasUsed - initialBal).to.equal(pending);
      expect(await marketplace.pendingWithdrawals(developer.address)).to.equal(0);
    });
  });

  describe("4. Permanent Retirement, Immutability & Anti-Double-Counting", function () {
    const tokenId = 1;
    const initialBalance = 1000;

    beforeEach(async function () {
      await projectRegistry.connect(developer).registerProject(
        PROJECT_NAME, COUNTRY, COORDS, CATEGORY_FORESTRY, METHODOLOGY, EXPECTED_CO2E, IPFS_HASH
      );
      await projectRegistry.connect(verifier).verifyProject(1);
      await carbonCreditToken.connect(deployer).issueCredits(
        1, buyer1.address, initialBalance, 2026, "CX-2026-BR-000001-001000", IPFS_HASH
      );
    });

    it("Should retire carbon credits and generate an immutable certificate", async function () {
      const retireAmount = 400;
      const retireeName = "Acme Global Technologies Inc.";
      const beneficiary = "Corporate Scope 1 & 2 ESG Offset";
      const reason = "Zero Emission 2026 Campaign";

      const tx = await retirementRegistry.connect(buyer1).retireCredits(
        tokenId,
        retireAmount,
        retireeName,
        beneficiary,
        reason
      );

      const receipt = await tx.wait();
      expect(await carbonCreditToken.balanceOf(buyer1.address, tokenId)).to.equal(initialBalance - retireAmount);
      expect(await retirementRegistry.totalTonnesOffsetAllTime()).to.equal(retireAmount);
      expect(await retirementRegistry.totalCertificatesIssued()).to.equal(1);

      const cert = await retirementRegistry.getCertificateById(1);
      expect(cert.retireeName).to.equal(retireeName);
      expect(cert.amountTonsCO2e).to.equal(retireAmount);
      expect(cert.valid).to.be.true;

      const [isValid, certData] = await retirementRegistry.verifyCertificate(cert.certificateHash);
      expect(isValid).to.be.true;
      expect(certData.retireeAddress).to.equal(buyer1.address);
    });

    it("STRICT ANTI-DOUBLE COUNTING: Should revert if user tries to retire more credits than owned", async function () {
      const excessiveAmount = initialBalance + 100;

      await expect(
        retirementRegistry.connect(buyer1).retireCredits(
          tokenId,
          excessiveAmount,
          "Fraudulent Corp",
          "None",
          "Attempting double count"
        )
      ).to.be.revertedWith("Insufficient credit balance to retire");
    });

    it("STRICT ANTI-DOUBLE COUNTING: Should revert if user tries to transfer or resell retired credits", async function () {
      // Retire all credits
      await retirementRegistry.connect(buyer1).retireCredits(
        tokenId,
        initialBalance,
        "Clean Tech Corp",
        "Self",
        "100% offset"
      );

      expect(await carbonCreditToken.balanceOf(buyer1.address, tokenId)).to.equal(0);

      // Attempt to transfer retired tokens
      await expect(
        carbonCreditToken.connect(buyer1).safeTransferFrom(
          buyer1.address,
          buyer2.address,
          tokenId,
          100,
          "0x"
        )
      ).to.be.revertedWith("Insufficient credit balance");
    });
  });
});
