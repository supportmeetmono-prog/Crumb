// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// DRAFT ONLY — not deployed, not audited. Verify network support and wallet
// ownership, multisig threshold, liquidity policy, and timelock before mainnet.
// The 365-day lock is effective only if THIS CONTRACT is actually deployed.
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Simple, non-upgradeable reserve lock with no owner/admin bypass.
/// @dev Anyone may call release() after expiry, but the destination is fixed.
contract CRUMBReserveLock {
    IERC20 public immutable token;
    address public immutable beneficiaryMultisig;
    uint256 public immutable unlockAt;

    event ReserveReleased(address indexed beneficiary, uint256 amount);

    constructor(IERC20 token_, address beneficiaryMultisig_, uint256 unlockAt_) {
        require(address(token_) != address(0), "token missing");
        require(beneficiaryMultisig_ != address(0), "reserve beneficiary missing");
        require(unlockAt_ > block.timestamp, "unlock must be in future");
        token = token_;
        beneficiaryMultisig = beneficiaryMultisig_;
        unlockAt = unlockAt_;
    }

    function release() external {
        require(block.timestamp >= unlockAt, "reserve still locked");
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "no reserve to release");
        require(token.transfer(beneficiaryMultisig, amount), "reserve transfer failed");
        emit ReserveReleased(beneficiaryMultisig, amount);
    }
}

/// @title CRUMB — 499,000,000 tokens with proposed 80/10/5/5 distribution.
/// @notice DRAFT; deploying with an EOA instead of audited 3-of-5 multisig
///         recipient addresses would defeat the proposed custody policy.
/// @dev Multisig signatures and market/LP token locks are NOT implemented
///      in this ERC20: supplied recipients must be independently configured
///      smart-account vaults. Only the future-liquidity reserve is time-locked.
///      80% market tokens are NOT automatically deposited or locked into a DEX.
contract CRUMB is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 499_000_000 * 10 ** 18;
    uint256 public constant PUBLIC_LAUNCH_AND_MARKET = 399_200_000 * 10 ** 18; // 80%
    uint256 public constant FUTURE_LIQUIDITY_RESERVE = 49_900_000 * 10 ** 18; // 10%
    uint256 public constant MARKETING_PARTNERSHIPS = 24_950_000 * 10 ** 18; // 5%
    uint256 public constant TREASURY = 24_950_000 * 10 ** 18; // 5%
    uint256 public constant RESERVE_LOCK_DURATION = 365 days;

    address public immutable reserveLock;

    constructor(
        address publicLaunchCustodyMultisig,
        address reserveBeneficiaryMultisig,
        address marketingPartnershipsMultisig,
        address treasuryMultisig
    ) ERC20("CRUMB", "CRUMB") {
        require(publicLaunchCustodyMultisig != address(0), "market vault missing");
        require(reserveBeneficiaryMultisig != address(0), "reserve vault missing");
        require(marketingPartnershipsMultisig != address(0), "marketing vault missing");
        require(treasuryMultisig != address(0), "treasury vault missing");

        CRUMBReserveLock lock = new CRUMBReserveLock(
            IERC20(address(this)),
            reserveBeneficiaryMultisig,
            block.timestamp + RESERVE_LOCK_DURATION
        );
        reserveLock = address(lock);

        _mint(publicLaunchCustodyMultisig, PUBLIC_LAUNCH_AND_MARKET);
        _mint(address(lock), FUTURE_LIQUIDITY_RESERVE);
        _mint(marketingPartnershipsMultisig, MARKETING_PARTNERSHIPS);
        _mint(treasuryMultisig, TREASURY);
        assert(totalSupply() == INITIAL_SUPPLY);
    }

    // No public mint, burn, freeze, blacklist, owner tax or transfer tax.
}
