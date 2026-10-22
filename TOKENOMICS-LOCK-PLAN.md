# CRUMB tokenomics and custody plan — PRE-LAUNCH DRAFT

**Status:** Token NOT deployed. No multisig vault is verified and no on-chain
reserve lock currently exists. This document specifies what MUST happen before
describing any token supply as safeguarded. CRUMB and the fictional character
are not affiliated with Elon Musk or his companies.

## Proposed fixed allocation (499,000,000 CRUMB)

| Bucket | Share | Amount | Intended control |
|---|---:|---:|---|
| Public launch and market liquidity | 80% | 399,200,000 | 3-of-5 multisig custody before distribution |
| Future liquidity reserve | 10% | 49,900,000 | Non-upgradeable 365-day on-chain time-lock, beneficiary 3-of-5 multisig |
| Marketing and partnerships | 5% | 24,950,000 | 3-of-5 multisig, published budget and outflows |
| Project treasury | 5% | 24,950,000 | 3-of-5 multisig, published expenses |
| TOTAL | 100% | 499,000,000 | All buckets accounted for |

No dedicated insider/team allocation, token-level buy/sell transfer taxes,
promised staking returns, click-to-earn, or scheduled burns. Normal network
and DEX fees may still apply. The market/launch allocation does **not** mean
80% will be deposited to the initial DEX pool: disclose the launch liquidity,
public distribution method, circulation and token custody BEFORE trading.

## What 3-of-5 multisig means

1. Choose **five genuinely independent authorized signers** and register five
   separate hardware-backed addresses on a network-compatible audited multisig
   platform. Never share a seed phrase or store all signing keys on one device.
2. Configure **three of five confirmations** to approve a transaction, confirm
   the actual settings on a block explorer, and test small-value proposals.
3. Limit signer-rotation, threshold changes and permission granting to
   reviewed governance processes; review any installed modules/guards.
4. Use separate purpose-built vaults for custody, marketing and treasury.
   Publish vault addresses and the actual threshold; do not publish private keys.
5. Report transfers, DEX deposits and budgets with block explorer transaction
   links. A multisig is **not** a time-lock: 3 signers can transfer unlocked
   tokens immediately.

Because the displayed network is Robinhood Chain (planned), validate live
chain availability, EVM support and Safe compatibility **before** suggesting
a specific multisig provider. For an EVM-compatible network, Safe is an
illustrative option: https://docs.safe.global/advanced/smart-account-concepts
Other networks need other tooling. Never create a fake vault address.

## How the reserve is locked for 365 days

- The *draft* `contracts/CRUMB.sol` contains an immutable `CRUMBReserveLock`
  implementation; on deployment it receives **49,900,000 CRUMB**.
- The lock starts **when the token contract is deployed** (not the website
  publication date) and sets `unlockAt = block.timestamp + 365 days`.
- No upgrade, owner override or early withdrawal is exposed by that contract.
  Before `unlockAt`, `release()` reverts regardless of multisig signatures.
- After `unlockAt`, anyone can trigger release, but the tokens can only go
  to the immutable `beneficiaryMultisig`, not a caller-chosen address.
- The 10% token reserve lock is **not** a lock on DEX liquidity-provider (LP)
  tokens. Separately disclose, audit and lock/burn LP positions if promising
  locked initial liquidity. Do not claim LP is locked on this basis alone.
- Users need verified deployment addresses, `unlockAt` timestamp, independent
  contract tests and review, balance proofs, and explorer links.

## Before any on-chain deployment or public sale

1. Confirm chain, token standard, audit scope, network deployment costs and
   applicable legal/compliance obligations.
2. Create and validate all multisig vaults and their signer diversity.
3. Audit the ERC20+lock contracts externally. The source is a DRAFT, not
   security-certified or production-ready solely because it compiles.
4. Verify reserve-lock ownership, unlock time, and release recipient.
5. Publish marketing and treasury spending policies, quarterly reporting,
   release rules, pool strategy, slippage and initial circulating supply.
6. Test the entire lifecycle on a testnet, including rejected early release
   and successful post-expiry release, before any mainnet funds are involved.
7. After launch, publicize verified contract, lock, vault and pool addresses
   and monitoring alerts. Until then: **no lock or multisig is active**.
