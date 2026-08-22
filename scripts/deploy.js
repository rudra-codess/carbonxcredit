/**
 * @file deploy.js
 * Hardhat deployment script for CarbonX Smart Contract Suite.
 * Deploys ProjectRegistry, CarbonCreditToken (ERC-1155), Marketplace, and RetirementRegistry.
 */

async function main() {
  const [deployer, verifier, developer, buyer] = await ethers.getSigners();

  console.log("----------------------------------------------------");
  console.log("Deploying CarbonX Blockchain Protocol with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  console.log("----------------------------------------------------");

  // 1. Deploy ProjectRegistry
  const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.waitForDeployment();
  const projectRegistryAddress = await projectRegistry.getAddress();
  console.log("1. ProjectRegistry deployed to:", projectRegistryAddress);

  // 2. Deploy CarbonCreditToken
  const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
  const carbonCreditToken = await CarbonCreditToken.deploy(projectRegistryAddress);
  await carbonCreditToken.waitForDeployment();
  const tokenAddress = await carbonCreditToken.getAddress();
  console.log("2. CarbonCreditToken (ERC-1155) deployed to:", tokenAddress);

  // 3. Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(tokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("3. Marketplace deployed to:", marketplaceAddress);

  // 4. Deploy RetirementRegistry
  const RetirementRegistry = await ethers.getContractFactory("RetirementRegistry");
  const retirementRegistry = await RetirementRegistry.deploy(tokenAddress);
  await retirementRegistry.waitForDeployment();
  const retirementRegistryAddress = await retirementRegistry.getAddress();
  console.log("4. RetirementRegistry deployed to:", retirementRegistryAddress);

  // 5. Wire contract authorizations
  console.log("\nConfiguring contract permissions & cross-references...");
  await projectRegistry.setCarbonCreditToken(tokenAddress);
  await carbonCreditToken.setMarketplace(marketplaceAddress);
  await carbonCreditToken.setRetirementRegistry(retirementRegistryAddress);

  // Grant VERIFIER_ROLE and PROJECT_DEVELOPER_ROLE
  const VERIFIER_ROLE = await projectRegistry.VERIFIER_ROLE();
  const PROJECT_DEVELOPER_ROLE = await projectRegistry.PROJECT_DEVELOPER_ROLE();

  if (verifier) {
    await projectRegistry.grantRole(VERIFIER_ROLE, verifier.address);
    console.log("Granted VERIFIER_ROLE to:", verifier.address);
  }
  if (developer) {
    await projectRegistry.grantRole(PROJECT_DEVELOPER_ROLE, developer.address);
    console.log("Granted PROJECT_DEVELOPER_ROLE to:", developer.address);
  }

  console.log("----------------------------------------------------");
  console.log("CarbonX Protocol Deployment Complete!");
  console.log({
    ProjectRegistry: projectRegistryAddress,
    CarbonCreditToken: tokenAddress,
    Marketplace: marketplaceAddress,
    RetirementRegistry: retirementRegistryAddress
  });
  console.log("----------------------------------------------------");
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };
