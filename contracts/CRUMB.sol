// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Pinned, published OpenZeppelin Contracts version for Remix IDE.
import {ERC20} from "@openzeppelin/contracts@5.4.0/token/ERC20/ERC20.sol";

/// @title CRUMB — fixed supply ERC-20
/// @notice Deploy directly with your EVM wallet on Robinhood Chain mainnet (chain ID 4663).
/// @dev All 1 trillion CRUMB go to msg.sender at deployment. No additional minting,
///      owner/admin functions, taxes, freezes, or liquidity operations.
contract CRUMB is ERC20 {
    constructor() ERC20("CRUMB", "CRUMB") {
        _mint(msg.sender, 1_000_000_000_000 * 10 ** 18);
    }
}
