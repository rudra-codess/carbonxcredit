// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Marketplace
 * @dev Fixed-price marketplace for listing and trading tokenized Carbon Credits.
 * Features ReentrancyGuard, pull-payment pattern for gas safety, and full event indexing.
 */
interface ICarbonCreditToken {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

contract Marketplace {
    struct Listing {
        uint256 listingId;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 remainingAmount;
        uint256 pricePerCreditWei; // in Wei or test token units (e.g. 0.005 ETH per tonne)
        bool active;
        uint256 listedTimestamp;
    }

    address public admin;
    ICarbonCreditToken public carbonCreditToken;
    uint256 private _listingIdCounter;
    uint256 private _status; // Reentrancy guard status

    // Fee percentage (e.g. 1% platform fee = 100 basis points out of 10,000)
    uint256 public platformFeeBps = 100; // 1%
    address public feeRecipient;

    mapping(uint256 => Listing) public listings;
    uint256[] public allListingIds;

    // Pull-payment pattern balances: address => pending withdrawal balance
    mapping(address => uint256) public pendingWithdrawals;

    // Global volume stats
    uint256 public totalVolumeTradedWei;
    uint256 public totalCreditsTraded;

    // --- Events ---
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 pricePerCreditWei,
        uint256 timestamp
    );

    event CreditsPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 tokenId,
        uint256 amountBought,
        uint256 totalPricePaidWei,
        uint256 timestamp
    );

    event ListingCancelled(
        uint256 indexed listingId,
        address indexed seller,
        uint256 timestamp
    );

    event FundsWithdrawn(
        address indexed payee,
        uint256 amount,
        uint256 timestamp
    );

    modifier nonReentrant() {
        require(_status != 2, "ReentrancyGuard: reentrant call");
        _status = 2;
        _;
        _status = 1;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Marketplace: caller is not admin");
        _;
    }

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        admin = msg.sender;
        feeRecipient = msg.sender;
        carbonCreditToken = ICarbonCreditToken(_tokenAddress);
        _status = 1;
    }

    function setFeeParameters(uint256 _feeBps, address _recipient) external onlyAdmin {
        require(_feeBps <= 1000, "Max fee is 10%");
        require(_recipient != address(0), "Invalid recipient");
        platformFeeBps = _feeBps;
        feeRecipient = _recipient;
    }

    /**
     * @notice Lists carbon credits for sale on the marketplace.
     * @param tokenId ERC-1155 token ID of the credit batch
     * @param amount Number of tonnes (credits) to list
     * @param pricePerCreditWei Price per credit in Wei
     */
    function listCredits(
        uint256 tokenId,
        uint256 amount,
        uint256 pricePerCreditWei
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be > 0");
        require(pricePerCreditWei > 0, "Price must be > 0");
        require(carbonCreditToken.balanceOf(msg.sender, tokenId) >= amount, "Insufficient credit balance");

        // Transfer tokens into marketplace escrow
        carbonCreditToken.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

        _listingIdCounter++;
        uint256 newListingId = _listingIdCounter;

        listings[newListingId] = Listing({
            listingId: newListingId,
            seller: msg.sender,
            tokenId: tokenId,
            amount: amount,
            remainingAmount: amount,
            pricePerCreditWei: pricePerCreditWei,
            active: true,
            listedTimestamp: block.timestamp
        });

        allListingIds.push(newListingId);

        emit ListingCreated(
            newListingId,
            msg.sender,
            tokenId,
            amount,
            pricePerCreditWei,
            block.timestamp
        );

        return newListingId;
    }

    /**
     * @notice Purchases listed carbon credits with ETH/native currency.
     * @param listingId Identifier of the listing
     * @param amountToBuy Tonnes to purchase
     */
    function buyCredits(uint256 listingId, uint256 amountToBuy) external payable nonReentrant {
        Listing storage item = listings[listingId];
        require(item.active, "Listing is not active");
        require(amountToBuy > 0, "Amount to buy must be > 0");
        require(item.remainingAmount >= amountToBuy, "Not enough credits available in listing");

        uint256 totalCost = item.pricePerCreditWei * amountToBuy;
        require(msg.value >= totalCost, "Insufficient ETH sent for purchase");

        // Calculate platform fee and seller amount
        uint256 fee = (totalCost * platformFeeBps) / 10000;
        uint256 sellerProceeds = totalCost - fee;

        // Update listing state before external interactions
        item.remainingAmount -= amountToBuy;
        if (item.remainingAmount == 0) {
            item.active = false;
        }

        // Credit seller and fee recipient via Pull-Payment pattern
        pendingWithdrawals[item.seller] += sellerProceeds;
        if (fee > 0) {
            pendingWithdrawals[feeRecipient] += fee;
        }

        // Global stats
        totalVolumeTradedWei += totalCost;
        totalCreditsTraded += amountToBuy;

        // Refund any excess ETH sent
        uint256 excess = msg.value - totalCost;
        if (excess > 0) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}("");
            require(refundSuccess, "Refund of excess ETH failed");
        }

        // Transfer tokens from escrow to buyer
        carbonCreditToken.safeTransferFrom(address(this), msg.sender, item.tokenId, amountToBuy, "");

        emit CreditsPurchased(
            listingId,
            msg.sender,
            item.seller,
            item.tokenId,
            amountToBuy,
            totalCost,
            block.timestamp
        );
    }

    /**
     * @notice Cancels an active listing and returns remaining credits to seller.
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage item = listings[listingId];
        require(item.active, "Listing already inactive");
        require(item.seller == msg.sender || msg.sender == admin, "Only seller or admin can cancel");

        uint256 returnAmount = item.remainingAmount;
        item.remainingAmount = 0;
        item.active = false;

        if (returnAmount > 0) {
            carbonCreditToken.safeTransferFrom(address(this), item.seller, item.tokenId, returnAmount, "");
        }

        emit ListingCancelled(listingId, msg.sender, block.timestamp);
    }

    /**
     * @notice Pull-Payment pattern: withdraw accrued sales proceeds or fees.
     */
    function withdrawFunds() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending withdrawal balance");

        pendingWithdrawals[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit FundsWithdrawn(msg.sender, amount, block.timestamp);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        require(listings[listingId].listingId != 0, "Listing does not exist");
        return listings[listingId];
    }

    function getTotalListingsCount() external view returns (uint256) {
        return allListingIds.length;
    }

    // Support ERC1155 reception into escrow
    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
