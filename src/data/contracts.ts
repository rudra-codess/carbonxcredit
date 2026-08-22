/**
 * @file contracts.ts
 * Smart contract addresses, ABI signatures, and deployment metadata for CarbonX Protocol.
 */

export const CONTRACT_ADDRESSES = {
  projectRegistry: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  carbonCreditToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  marketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  retirementRegistry: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
};

export const CONTRACT_SOURCE_CODE = {
  projectRegistry: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProjectRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");

    enum ProjectStatus { PendingVerification, Verified, Rejected, Active, Completed }

    struct ProjectData {
        uint256 id;
        string name;
        string country;
        string methodology;
        address developer;
        uint256 expectedCO2eTons;
        uint256 issuedCredits;
        string ipfsHash;
        ProjectStatus status;
        address verifiedBy;
    }

    mapping(uint256 => ProjectData) public projects;
    uint256 public projectCount;

    event ProjectRegistered(uint256 indexed id, string name, address developer, string ipfsHash);
    event ProjectVerified(uint256 indexed id, address verifier);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerProject(
        string memory name,
        string memory country,
        string memory methodology,
        uint256 expectedCO2eTons,
        string memory ipfsHash
    ) external returns (uint256) {
        projectCount++;
        projects[projectCount] = ProjectData({
            id: projectCount,
            name: name,
            country: country,
            methodology: methodology,
            developer: msg.sender,
            expectedCO2eTons: expectedCO2eTons,
            issuedCredits: 0,
            ipfsHash: ipfsHash,
            status: ProjectStatus.PendingVerification,
            verifiedBy: address(0)
        });

        emit ProjectRegistered(projectCount, name, msg.sender, ipfsHash);
        return projectCount;
    }

    function verifyProject(uint256 projectId) external onlyRole(VERIFIER_ROLE) {
        require(projects[projectId].status == ProjectStatus.PendingVerification, "Invalid state");
        projects[projectId].status = ProjectStatus.Verified;
        projects[projectId].verifiedBy = msg.sender;
        emit ProjectVerified(projectId, msg.sender);
    }
}`,
  carbonCreditToken: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CarbonCreditToken is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    struct BatchInfo {
        uint256 projectId;
        uint256 vintageYear;
        uint256 totalSupply;
        uint256 retiredSupply;
        string serialPrefix;
    }

    mapping(uint256 => BatchInfo) public batches;

    event CreditsIssued(uint256 indexed tokenId, uint256 indexed projectId, uint256 amount);
    event CreditsRetired(uint256 indexed tokenId, address indexed retiree, uint256 amount);

    constructor(string memory uri) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintBatchCredits(
        address to,
        uint256 tokenId,
        uint256 projectId,
        uint256 amount,
        uint256 vintageYear,
        string memory serialPrefix
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, tokenId, amount, "");
        batches[tokenId] = BatchInfo({
            projectId: projectId,
            vintageYear: vintageYear,
            totalSupply: batches[tokenId].totalSupply + amount,
            retiredSupply: 0,
            serialPrefix: serialPrefix
        });
        emit CreditsIssued(tokenId, projectId, amount);
    }

    function burnCredits(address account, uint256 tokenId, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(account, tokenId, amount);
        batches[tokenId].retiredSupply += amount;
        emit CreditsRetired(tokenId, account, amount);
    }
}`,
  marketplace: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract CarbonXMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 listingId;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerCreditWei;
        bool active;
    }

    IERC1155 public immutable carbonToken;
    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed listingId, address indexed seller, uint256 tokenId, uint256 amount, uint256 price);
    event Purchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalCost);

    constructor(address _carbonToken) {
        carbonToken = IERC1155(_carbonToken);
    }

    function listCredits(uint256 tokenId, uint256 amount, uint256 pricePerCreditWei) external nonReentrant {
        require(amount > 0, "Invalid amount");
        carbonToken.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

        listingCounter++;
        listings[listingCounter] = Listing(listingCounter, msg.sender, tokenId, amount, pricePerCreditWei, true);
        emit Listed(listingCounter, msg.sender, tokenId, amount, pricePerCreditWei);
    }

    function buyCredits(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage item = listings[listingId];
        require(item.active && item.amount >= amount, "Listing unavailable");
        uint256 totalCost = item.pricePerCreditWei * amount;
        require(msg.value >= totalCost, "Insufficient ETH");

        item.amount -= amount;
        if (item.amount == 0) item.active = false;

        carbonToken.safeTransferFrom(address(this), msg.sender, item.tokenId, amount, "");
        (bool sent, ) = item.seller.call{value: totalCost}("");
        require(sent, "ETH transfer failed");

        emit Purchased(listingId, msg.sender, amount, totalCost);
    }
}`,
  retirementRegistry: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RetirementRegistry {
    struct Certificate {
        uint256 certificateId;
        bytes32 certificateHash;
        address retiree;
        string retireeName;
        string beneficiary;
        uint256 tokenId;
        uint256 amountTonsCO2e;
        uint256 timestamp;
        string reason;
        bool valid;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(bytes32 => bool) public certificateHashes;
    uint256 public certificateCount;

    event CertificateMinted(uint256 indexed certId, bytes32 indexed certHash, address indexed retiree, uint256 amount);

    function recordRetirement(
        address retiree,
        string memory retireeName,
        string memory beneficiary,
        uint256 tokenId,
        uint256 amountTonsCO2e,
        string memory reason
    ) external returns (uint256, bytes32) {
        certificateCount++;
        bytes32 certHash = keccak256(
            abi.encodePacked(certificateCount, retiree, retireeName, tokenId, amountTonsCO2e, block.timestamp, block.prevrandao)
        );

        certificates[certificateCount] = Certificate({
            certificateId: certificateCount,
            certificateHash: certHash,
            retiree: retiree,
            retireeName: retireeName,
            beneficiary: beneficiary,
            tokenId: tokenId,
            amountTonsCO2e: amountTonsCO2e,
            timestamp: block.timestamp,
            reason: reason,
            valid: true
        });

        certificateHashes[certHash] = true;
        emit CertificateMinted(certificateCount, certHash, retiree, amountTonsCO2e);
        return (certificateCount, certHash);
    }
}`
};
