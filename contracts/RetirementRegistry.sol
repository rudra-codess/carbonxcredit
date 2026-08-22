// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RetirementRegistry
 * @dev On-chain registry for permanently retiring carbon credits and minting tamper-proof
 * Certificate of Retirement records. Prevents double-counting and provides verifiable proof.
 */
interface ICarbonCreditTokenForRetirement {
    function lockAndRetireCredits(address from, uint256 tokenId, uint256 amount) external;
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function getBatch(uint256 tokenId) external view returns (
        uint256 tokenIdOut,
        uint256 projectId,
        uint256 vintageYear,
        uint256 totalSupply,
        uint256 retiredSupply,
        string memory serialNumberRange,
        string memory ipfsMetadataUri,
        uint256 issuanceTimestamp
    );
}

contract RetirementRegistry {
    struct RetirementCertificate {
        bytes32 certificateHash;
        uint256 certificateId;
        address retireeAddress;
        string retireeName;
        string beneficiary;
        uint256 tokenId;
        uint256 projectId;
        uint256 amountTonsCO2e;
        uint256 timestamp;
        string retirementReason;
        string serialNumberRange;
        bool valid;
    }

    address public admin;
    ICarbonCreditTokenForRetirement public carbonCreditToken;
    uint256 private _certificateIdCounter;

    // Total metric tonnes offset through this registry
    uint256 public totalTonnesOffsetAllTime;
    uint256 public totalCertificatesIssued;

    mapping(bytes32 => RetirementCertificate) public certificatesByHash;
    mapping(uint256 => RetirementCertificate) public certificatesById;
    mapping(address => uint256[]) public retireeCertificateIds;
    uint256[] public allCertificateIds;

    // --- Events ---
    event CarbonCreditsRetired(
        bytes32 indexed certificateHash,
        uint256 indexed certificateId,
        address indexed retireeAddress,
        string retireeName,
        uint256 tokenId,
        uint256 amountTonsCO2e,
        uint256 timestamp,
        string retirementReason
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "RetirementRegistry: caller is not admin");
        _;
    }

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        admin = msg.sender;
        carbonCreditToken = ICarbonCreditTokenForRetirement(_tokenAddress);
    }

    /**
     * @notice Permanently retires carbon credits to offset carbon footprint.
     * Tokens are locked/burned permanently on-chain to strictly prevent double-counting.
     * @param tokenId ERC-1155 token ID of the credit batch
     * @param amount Metric tonnes of CO2e to retire
     * @param retireeName Name of individual or corporation retiring the credits
     * @param beneficiary Entity on whose behalf the offset is made
     * @param retirementReason Reason for offset (e.g. "Scope 1 Corporate Emissions 2026")
     */
    function retireCredits(
        uint256 tokenId,
        uint256 amount,
        string calldata retireeName,
        string calldata beneficiary,
        string calldata retirementReason
    ) external returns (bytes32 certificateHash, uint256 certificateId) {
        require(amount > 0, "Retirement amount must be > 0");
        require(bytes(retireeName).length > 0, "Retiree name required");

        // Lock & Burn tokens from msg.sender to guarantee no double-spending
        carbonCreditToken.lockAndRetireCredits(msg.sender, tokenId, amount);

        _certificateIdCounter++;
        certificateId = _certificateIdCounter;

        // Fetch batch details
        (, uint256 projectId, , , , string memory serialRange, , ) = carbonCreditToken.getBatch(tokenId);

        // Generate unique cryptographic SHA-3/Keccak256 certificate hash
        certificateHash = keccak256(
            abi.encodePacked(
                certificateId,
                msg.sender,
                retireeName,
                beneficiary,
                tokenId,
                projectId,
                amount,
                block.timestamp,
                block.prevrandao
            )
        );

        RetirementCertificate memory cert = RetirementCertificate({
            certificateHash: certificateHash,
            certificateId: certificateId,
            retireeAddress: msg.sender,
            retireeName: retireeName,
            beneficiary: beneficiary,
            tokenId: tokenId,
            projectId: projectId,
            amountTonsCO2e: amount,
            timestamp: block.timestamp,
            retirementReason: retirementReason,
            serialNumberRange: serialRange,
            valid: true
        });

        certificatesByHash[certificateHash] = cert;
        certificatesById[certificateId] = cert;
        retireeCertificateIds[msg.sender].push(certificateId);
        allCertificateIds.push(certificateId);

        totalTonnesOffsetAllTime += amount;
        totalCertificatesIssued++;

        emit CarbonCreditsRetired(
            certificateHash,
            certificateId,
            msg.sender,
            retireeName,
            tokenId,
            amount,
            block.timestamp,
            retirementReason
        );

        return (certificateHash, certificateId);
    }

    function verifyCertificate(bytes32 certificateHash) external view returns (bool, RetirementCertificate memory) {
        RetirementCertificate memory cert = certificatesByHash[certificateHash];
        return (cert.valid, cert);
    }

    function getCertificateById(uint256 certificateId) external view returns (RetirementCertificate memory) {
        require(certificatesById[certificateId].valid, "Certificate not found");
        return certificatesById[certificateId];
    }

    function getCertificatesForRetiree(address retiree) external view returns (uint256[] memory) {
        return retireeCertificateIds[retiree];
    }

    function getTotalCertificatesCount() external view returns (uint256) {
        return allCertificateIds.length;
    }
}
