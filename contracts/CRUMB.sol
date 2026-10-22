// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// CRUMB draft fixed-supply token (NOT DEPLOYED). Review and test before mainnet.
import {ERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/ERC20.sol";

/// @title CRUMB — 499,000,000 fixed supply, no burn mechanism.
/// @notice Constructor addresses must be approved by the project before deployment.
/// @dev The remaining 90% is UNALLOCATED in the current tokenomics; it is not
///      marketed as liquidity, community rewards or a sale until finalized.
///      ERC20 alone does not restrict when a holder may transfer their tokens.
contract CRUMB is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 499_000_000 * 10 ** 18;
    uint256 public constant MARKETING_PARTNERSHIPS = 24_950_000 * 10 ** 18;
    uint256 public constant TREASURY = 24_950_000 * 10 ** 18;
    uint256 public constant UNALLOCATED = 449_100_000 * 10 ** 18;

    constructor(
        address marketingPartnershipsWallet,
        address treasuryWallet,
        address unallocatedHolder
    ) ERC20("CRUMB", "CRUMB") {
        require(marketingPartnershipsWallet != address(0), "marketing wallet missing");
        require(treasuryWallet != address(0), "treasury wallet missing");
        require(unallocatedHolder != address(0), "reserve wallet missing");
        _mint(marketingPartnershipsWallet, MARKETING_PARTNERSHIPS);
        _mint(treasuryWallet, TREASURY);
        _mint(unallocatedHolder, UNALLOCATED);
    }
}
