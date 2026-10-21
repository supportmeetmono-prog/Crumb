# CRUMB Mission — deployment configuration

This is a **pre-launch planned-supply cancellation campaign**, not an on-chain token burn.

## Required on Vercel Production
- UPSTASH_REDIS_REST_URL = your Redis REST HTTPS endpoint
- UPSTASH_REDIS_REST_TOKEN = Redis REST secret
- TURNSTILE_SITE_KEY = Cloudflare Turnstile PUBLIC site key
- TURNSTILE_SECRET_KEY = Cloudflare Turnstile PRIVATE secret

Set all four in **Vercel → Project CRUMB → Settings → Environment Variables → Production**, then redeploy.
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
- Max 100,000 participating wallets, each cancels 9,990,000 units from the **planned** trillion; plan is to deploy 1 billion at completion.

No ETH required and no ERC-20 is sent, created, or destroyed when clicking.
This does NOT prove one unique human per wallet; Sybil checks may need strengthening before opening at scale.
Never show test or invented participation numbers. Until all services are configured, the button remains disabled.
