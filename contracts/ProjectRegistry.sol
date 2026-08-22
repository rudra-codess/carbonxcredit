// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProjectRegistry
 * @dev Registry for verifying and managing carbon offset projects on CarbonX.
 * Facilitates the 8-step lifecycle: Registration -> Verification -> Issuance pipeline.
 */
contract ProjectRegistry {
    // --- Roles ---
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PROJECT_DEVELOPER_ROLE = keccak256("PROJECT_DEVELOPER_ROLE");

    // Simple role-based access control mapping
    mapping(bytes32 => mapping(address => bool)) private _roles;

    enum ProjectStatus {
        PendingVerification,
        Verified,
        Rejected,
        Active,
        Completed
    }

    enum ProjectCategory {
        ForestryAndReforestation,
        RenewableEnergy,
        BlueCarbon,
        DirectAirCapture,
        MethaneCapture,
        SoilCarbon
    }

    struct Project {
        uint256 projectId;
        address developer;
        string name;
        string country;
        string locationCoordinates;
        ProjectCategory category;
        string methodology; // e.g. "VM0007 / VCS Verified"
        uint256 expectedCO2eTons;
        uint256 issuedCredits;
        string ipfsMetadataHash; // IPFS CID containing project MRV documents & audit files
        ProjectStatus status;
        address verifiedBy;
        uint256 submissionTimestamp;
        uint256 verificationTimestamp;
        string rejectionReason;
    }

    uint256 private _projectIdCounter;
    mapping(uint256 => Project) public projects;
    uint256[] public allProjectIds;

    // Authorized carbon credit token contract address
    address public carbonCreditTokenContract;

    // --- Events for Live Impact Dashboard and off-chain indexing ---
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    
    event ProjectRegistered(
        uint256 indexed projectId,
        address indexed developer,
        string name,
        ProjectCategory category,
        uint256 expectedCO2eTons,
        string ipfsMetadataHash,
        uint256 timestamp
    );

    event ProjectVerified(
        uint256 indexed projectId,
        address indexed verifier,
        uint256 timestamp
    );

    event ProjectRejected(
        uint256 indexed projectId,
        address indexed verifier,
        string reason,
        uint256 timestamp
    );

    event ProjectCreditsIssued(
        uint256 indexed projectId,
        uint256 amountIssued,
        uint256 totalIssued,
        uint256 timestamp
    );

    modifier onlyRole(bytes32 role) {
        require(_roles[role][msg.sender], "ProjectRegistry: unauthorized access");
        _;
    }

    constructor() {
        _roles[ADMIN_ROLE][msg.sender] = true;
        _roles[VERIFIER_ROLE][msg.sender] = true;
        _roles[PROJECT_DEVELOPER_ROLE][msg.sender] = true;
    }

    function grantRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        _roles[role][account] = true;
        emit RoleGranted(role, account, msg.sender);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        _roles[role][account] = false;
        emit RoleRevoked(role, account, msg.sender);
    }

    function hasRole(bytes32 role, address account) external view returns (bool) {
        return _roles[role][account];
    }

    function setCarbonCreditToken(address tokenContract) external onlyRole(ADMIN_ROLE) {
        require(tokenContract != address(0), "Invalid token contract address");
        carbonCreditTokenContract = tokenContract;
    }

    /**
     * @notice Registers a new climate project with MRV IPFS documentation.
     * @param name Project title
     * @param country Host country
     * @param locationCoordinates GPS or regional coordinates
     * @param category Carbon project category
     * @param methodology Standard methodology code (e.g. VCS, Gold Standard)
     * @param expectedCO2eTons Total expected metric tonnes of CO2 equivalent offset
     * @param ipfsMetadataHash IPFS CID containing verification docs, satellite baseline, and PDD
     */
    function registerProject(
        string calldata name,
        string calldata country,
        string calldata locationCoordinates,
        ProjectCategory category,
        string calldata methodology,
        uint256 expectedCO2eTons,
        string calldata ipfsMetadataHash
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(expectedCO2eTons > 0, "Expected CO2e must be > 0");
        require(bytes(ipfsMetadataHash).length > 0, "IPFS hash required");

        _projectIdCounter++;
        uint256 newProjectId = _projectIdCounter;

        projects[newProjectId] = Project({
            projectId: newProjectId,
            developer: msg.sender,
            name: name,
            country: country,
            locationCoordinates: locationCoordinates,
            category: category,
            methodology: methodology,
            expectedCO2eTons: expectedCO2eTons,
            issuedCredits: 0,
            ipfsMetadataHash: ipfsMetadataHash,
            status: ProjectStatus.PendingVerification,
            verifiedBy: address(0),
            submissionTimestamp: block.timestamp,
            verificationTimestamp: 0,
            rejectionReason: ""
        });

        allProjectIds.push(newProjectId);

        emit ProjectRegistered(
            newProjectId,
            msg.sender,
            name,
            category,
            expectedCO2eTons,
            ipfsMetadataHash,
            block.timestamp
        );

        return newProjectId;
    }

    /**
     * @notice Verifies and approves a pending project (Accredited Verifier role required).
     */
    function verifyProject(uint256 projectId) external onlyRole(VERIFIER_ROLE) {
        Project storage proj = projects[projectId];
        require(proj.projectId != 0, "Project does not exist");
        require(proj.status == ProjectStatus.PendingVerification, "Project is not pending verification");

        proj.status = ProjectStatus.Verified;
        proj.verifiedBy = msg.sender;
        proj.verificationTimestamp = block.timestamp;

        emit ProjectVerified(projectId, msg.sender, block.timestamp);
    }

    /**
     * @notice Rejects a project with documented audit findings.
     */
    function rejectProject(uint256 projectId, string calldata reason) external onlyRole(VERIFIER_ROLE) {
        Project storage proj = projects[projectId];
        require(proj.projectId != 0, "Project does not exist");
        require(proj.status == ProjectStatus.PendingVerification, "Project is not pending verification");

        proj.status = ProjectStatus.Rejected;
        proj.verifiedBy = msg.sender;
        proj.verificationTimestamp = block.timestamp;
        proj.rejectionReason = reason;

        emit ProjectRejected(projectId, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Records credit issuance for an approved project. Called by CarbonCreditToken contract.
     */
    function recordCreditIssuance(uint256 projectId, uint256 amount) external {
        require(
            msg.sender == carbonCreditTokenContract || _roles[ADMIN_ROLE][msg.sender],
            "Only token contract or admin can record issuance"
        );
        Project storage proj = projects[projectId];
        require(proj.status == ProjectStatus.Verified || proj.status == ProjectStatus.Active, "Project not verified");
        require(proj.issuedCredits + amount <= proj.expectedCO2eTons, "Exceeds total verified capacity");

        proj.issuedCredits += amount;
        proj.status = ProjectStatus.Active;

        emit ProjectCreditsIssued(projectId, amount, proj.issuedCredits, block.timestamp);
    }

    function getProject(uint256 projectId) external view returns (Project memory) {
        require(projects[projectId].projectId != 0, "Project not found");
        return projects[projectId];
    }

    function getTotalProjectsCount() external view returns (uint256) {
        return allProjectIds.length;
    }
}
