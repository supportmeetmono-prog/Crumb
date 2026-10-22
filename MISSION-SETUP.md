# CRUMB Mission — deployment configuration

This is a **pre-launch planned-supply cancellation campaign**, not an on-chain token burn.

## Required on Vercel Production
The Upstash Redis integration for project CRUMB was connected on October 21, 2026.
The integration automatically created these variables in Production and Preview:
- KV_REST_API_URL = Redis REST HTTPS endpoint (already present)
- KV_REST_API_TOKEN = Redis REST secret (already present)

The mission API also supports UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN as alternatives.
The following variables were added in **Vercel → Project CRUMB → Settings → Environment Variables → Production** on October 21, 2026:
- TURNSTILE_SITE_KEY = Cloudflare Turnstile PUBLIC site key
- TURNSTILE_SECRET_KEY = Cloudflare Turnstile PRIVATE secret

Keep the private values in Vercel only. Redeploy Production whenever security variables change.
Do **not** commit credentials or send private keys via chat.

Cloudflare Turnstile → allow `crumb-ochre.vercel.app` in Allowed Hostnames.
Also allow `crumb.vision` only after it is connected to the website.

## Participation
Each verified EVM wallet gets ONE free participation on the website:
- `GET /api/mission` → authoritative progress; returns HTTP 503 until properly configured
- `POST /api/mission` with `{"action":"nonce","wallet":"0x..."}` → unique 5-minute challenge
- User signs challenge using MetaMask (message signature only; NO blockchain transaction)
- `POST /api/mission` with `{"action":"participate","wallet":"0x...","nonce":"...","signature":"...","turnstile":"..."}`
- Server checks signature, Turnstile hostname, single-use nonce and per-address uniqueness, then atomically records the click using Redis Lua EVAL.
- Max 100,000 participating wallets. Each approved wallet represents 9,980,000 units cancelled from the **planned** 1 trillion supply and proposed eligibility for 10,000 future CRUMB rewards.
- Proposed final distribution: burn 998,000,000,000 CRUMB on-chain; reserve 1,000,000,000 for participant rewards (100,000 × 10,000, locked 90 days after official token launch); and reserve 1,000,000,000 for launch. Planned supply after burn: 2,000,000,000.
- There is no deployed CRUMB token, verified on-chain burn, reward escrow or 90-day-lock contract yet. The site is NOT a sale or a completed allocation. Do not claim rewards are guaranteed.

No ETH required and no ERC-20 is sent, created, or destroyed when clicking.
This does NOT prove one unique human per wallet; Sybil checks may need strengthening before opening at scale.
Never show test or invented participation numbers. Until all services are configured, the button remains disabled.

## Capacity and safety
The Upstash Free plan has a finite monthly command quota. The homepage polls while visible, and each signup uses several Redis commands. Monitor Upstash usage, do load testing, and consider paid capacity before public promotion to tens of thousands of wallets.
One wallet is not proof of one person. Do not advertise 100,000 unique humans unless stronger personhood protections are introduced.

## Contract safety warning
`contracts/CRUMB.sol` is a legacy prototype that mints the full 1 trillion to the deployer. **DO NOT DEPLOY THIS OLD CONTRACT** for the 998-billion-burn and 90-day reward plan: it does not enforce escrow, immutable unlock conditions, real burn accounting or trading restrictions. Final contracts need development, testing, and independent security review before mainnet deployment.
