// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CarbonCreditToken
 * @dev ERC-1155 Multi-Token representing verified Carbon Credits (1 token = 1 tCO2e).
 * Implements batch tracking, immutable serial ranges, and metadata URIs pointing to IPFS.
 */
interface IERC1155Receiver {
    function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data) external returns (bytes4);
    function onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external returns (bytes4);
}

interface IProjectRegistry {
    enum ProjectStatus { PendingVerification, Verified, Rejected, Active, Completed }
    function recordCreditIssuance(uint256 projectId, uint256 amount) external;
    function hasRole(bytes32 role, address account) external view returns (bool);
}

contract CarbonCreditToken {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string public name = "CarbonX Verified Credits";
    string public symbol = "CXC";

    // Mapping from token ID to account balances: tokenId => (account => balance)
    mapping(uint256 => mapping(address => uint256)) private _balances;

    // Operator approvals: owner => (operator => approved)
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Batch details for each tokenId
    struct CreditBatch {
        uint256 tokenId;
        uint256 projectId;
        uint256 vintageYear;
        uint256 totalSupply;
        uint256 retiredSupply;
        string serialNumberRange; // e.g. "CX-2026-US-000001-050000"
        string ipfsMetadataUri;   // IPFS URI to batch issuance certificate & audit
        uint256 issuanceTimestamp;
    }

    mapping(uint256 => CreditBatch) public creditBatches;
    uint256[] public allTokenIds;
    uint256 private _tokenIdCounter;

    address public registryAddress;
    address public marketplaceAddress;
    address public retirementRegistryAddress;
    address public admin;

    // Global Impact Statistics
    uint256 public totalCreditsIssuedAllTime;
    uint256 public totalCreditsRetiredAllTime;

    // --- Events ---
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);

    event CreditsIssued(
        uint256 indexed tokenId,
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount,
        uint256 vintageYear,
        string serialNumberRange,
        string ipfsMetadataUri
    );

    event CreditsLockedForRetirement(
        uint256 indexed tokenId,
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "CarbonCreditToken: caller is not admin");
        _;
    }

    modifier onlyAuthorizedOrAdmin() {
        require(
            msg.sender == admin || 
            msg.sender == retirementRegistryAddress || 
            msg.sender == marketplaceAddress,
            "CarbonCreditToken: caller unauthorized"
        );
        _;
    }

    constructor(address _projectRegistry) {
        require(_projectRegistry != address(0), "Invalid registry address");
        admin = msg.sender;
        registryAddress = _projectRegistry;
    }

    function setMarketplace(address _marketplace) external onlyAdmin {
        marketplaceAddress = _marketplace;
    }

    function setRetirementRegistry(address _retirementRegistry) external onlyAdmin {
        retirementRegistryAddress = _retirementRegistry;
    }

    function setRegistryAddress(address _registry) external onlyAdmin {
        registryAddress = _registry;
    }

    /**
     * @notice Issues verified tokenized carbon credits (1 token = 1 metric tonne CO2e).
     * Only Admin or ProjectRegistry authorized entities can issue credits.
     */
    function issueCredits(
        uint256 projectId,
        address recipient,
        uint256 amount,
        uint256 vintageYear,
        string calldata serialNumberRange,
        string calldata ipfsMetadataUri
    ) external onlyAdmin returns (uint256) {
        require(recipient != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be > 0");

        // Notify project registry of issuance to check caps
        IProjectRegistry(registryAddress).recordCreditIssuance(projectId, amount);

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        creditBatches[newTokenId] = CreditBatch({
            tokenId: newTokenId,
            projectId: projectId,
            vintageYear: vintageYear,
            totalSupply: amount,
            retiredSupply: 0,
            serialNumberRange: serialNumberRange,
            ipfsMetadataUri: ipfsMetadataUri,
            issuanceTimestamp: block.timestamp
        });

        allTokenIds.push(newTokenId);

        _balances[newTokenId][recipient] += amount;
        totalCreditsIssuedAllTime += amount;

        emit TransferSingle(msg.sender, address(0), recipient, newTokenId, amount);
        emit URI(ipfsMetadataUri, newTokenId);
        emit CreditsIssued(newTokenId, projectId, recipient, amount, vintageYear, serialNumberRange, ipfsMetadataUri);

        return newTokenId;
    }

    function balanceOf(address account, uint256 id) public view returns (uint256) {
        require(account != address(0), "Zero address query");
        return _balances[id][account];
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(msg.sender != operator, "Setting approval for self");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) public view returns (bool) {
        // Auto-approve marketplace or retirement registry if configured
        if (operator == marketplaceAddress || operator == retirementRegistryAddress) {
            return true;
        }
        return _operatorApprovals[account][operator];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "Transfer caller is not owner nor approved"
        );
        require(to != address(0), "Cannot transfer to zero address");

        uint256 fromBalance = _balances[id][from];
        require(fromBalance >= amount, "Insufficient credit balance");

        _balances[id][from] = fromBalance - amount;
        _balances[id][to] += amount;

        emit TransferSingle(msg.sender, from, to, id, amount);

        _doSafeTransferAcceptanceCheck(msg.sender, from, to, id, amount, data);
    }

    /**
     * @notice Permanently locks and burns tokens for retirement. Only RetirementRegistry can call this.
     */
    function lockAndRetireCredits(
        address from,
        uint256 tokenId,
        uint256 amount
    ) external {
        require(
            msg.sender == retirementRegistryAddress || msg.sender == admin,
            "Only RetirementRegistry or admin can retire"
        );
        require(from != address(0), "Cannot retire from zero address");

        uint256 fromBalance = _balances[tokenId][from];
        require(fromBalance >= amount, "Insufficient credit balance to retire");

        _balances[tokenId][from] = fromBalance - amount;
        creditBatches[tokenId].retiredSupply += amount;
        totalCreditsRetiredAllTime += amount;

        // Burn to address(0)
        emit TransferSingle(msg.sender, from, address(0), tokenId, amount);
        emit CreditsLockedForRetirement(tokenId, from, amount, block.timestamp);
    }

    function getBatch(uint256 tokenId) external view returns (CreditBatch memory) {
        require(creditBatches[tokenId].tokenId != 0, "Token batch does not exist");
        return creditBatches[tokenId];
    }

    function uri(uint256 tokenId) external view returns (string memory) {
        return creditBatches[tokenId].ipfsMetadataUri;
    }

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private {
        if (to.code.length > 0) {
            try IERC1155Receiver(to).onERC1155Received(operator, from, id, amount, data) returns (bytes4 response) {
                if (response != IERC1155Receiver.onERC1155Received.selector) {
                    revert("ERC1155Receiver rejected tokens");
                }
            } catch {
                // Ignore for plain non-receiver contracts
            }
        }
    }
}
