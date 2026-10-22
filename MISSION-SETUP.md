# Retired: CRUMB wallet-click mission

The previous 100,000-wallet participation, burn counter, 10,000-token reward and 90-day lock proposal was **cancelled by the project owner**. No clicks, free-participation signatures, registration or burn mechanics should be offered.

## Current CRUMB proposal

- **Fixed total supply:** 499,000,000 CRUMB.
- **Marketing and partnerships:** 5% = 24,950,000.
- **Treasury:** 5% = 24,950,000.
- **Remaining allocation:** 90% = 449,100,000, **not yet determined**.
- **No token burning. No click-to-earn or click-to-register.**
- **No token contract deployed or liquidity launched yet.**

The website no longer shows the old campaign or polls Redis for mission clicks.
Both `/api/mission` and `/api/counter` return HTTP 410 (Gone) and do not access Redis. Old Upstash keys may still exist as historical records; they do not represent a current campaign or token allocations.

## Contract draft

`contracts/CRUMB.sol` was changed to an un-deployed draft minting exactly 499 million CRUMB: 5% to a marketing and partnerships address, 5% to a treasury address and 90% to a designated unallocated holder address. All three addresses must be chosen and reviewed before deployment. A simple ERC-20 allocation alone is **not a lock, vesting or liquidity mechanism**.

Review and test the contract separately, including the handling of the unallocated 90%, before any on-chain deployment. Nothing has been deployed or sold.

## Independent AI Studio

The optional AI Studio remains separate, with MetaMask used only to authenticate image requests when the owner explicitly enables the paid API. Consult `AI-STUDIO-SETUP.md`. The AI Studio does not award CRUMB, register wallet clicks, or reduce token supply.
