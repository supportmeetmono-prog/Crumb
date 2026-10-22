# CRUMB AI Studio — activation checklist

The website now includes **CRUMB AI Studio** alongside the existing, free browser-based Meme Lab.

## Safe default: OFF

The server route `/api/ai-image` fails closed and cannot call a paid provider unless the Vercel **Production** environment has **both**:

- `OPENAI_API_KEY` — private OpenAI Platform API key, kept only in Vercel, type **Secret**.
- `AI_STUDIO_ENABLED` — set to exactly `true` *after* the owner finishes billing, account verification, budget setup and real end-to-end testing.

Also requires existing `KV_REST_API_URL`, `KV_REST_API_TOKEN`,
`TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.

The client checks GET `/api/ai-image` for readiness. Until enabled, the Generate button is intentionally disabled and the page displays a transparent launch-pending message. Adding the API key *alone* does NOT enable paid calls.

## Security and quotas

- Backend model: `gpt-image-1-mini`, quality `low`, one image per successful request. It is currently listed as deprecated but still supported; verify continued availability and pricing before activation.
- A user signs a short, free EVM wallet message using MetaMask. A unique five-minute challenge nonce is stored in Upstash.
- Cloudflare Turnstile is verified server-side for the current host.
- Atomic Redis Lua script reserves quota *before* the provider is called.
- Hard-coded defaults: **1 image / wallet / UTC day**; **2 images / hashed IP / UTC day**; **10 images / site / UTC day**; **100 images / site / UTC month**. Even many fresh wallets cannot exceed global caps.
- The quota counts **attempts reserved**, not successful images. It is intentionally *not* refunded after provider failure so retries cannot bypass the monthly cap.
- Upstash data should be monitored for free plan limits; production rate testing must be done before broad public promotion.
- Monthly image count is a safety limit, **not a fixed BRL spend cap**: prompt and input image tokens plus provider pricing may vary. Configure spend budgets and alerts at the OpenAI Platform billing dashboard as a separate guard.
- Wallet uniqueness does not prove one unique human. Limits also apply by IP, and one global cap is mandatory.
- OpenAI moderation is requested with the provider default. It is not a guarantee that every output is suitable.
- No private keys, seed phrases or token transfers. `OPENAI_API_KEY` is never sent to the browser.

## Image identity and user flow

The page sends the existing official CRUMB artwork, converted from embedded AVIF into a browser-made PNG file, as an image reference. The server sends it to OpenAI's `POST /v1/images/edits` endpoint with the visitor's prompt and a fixed identity-preservation instruction. Consistency is not guaranteed, especially on low-cost models.

Options: square meme, landscape cover, transparent sticker. Image output is WebP.

Sign in with MetaMask (the site's existing connect button), complete the AI Studio Turnstile check, enter a prompt, choose a format, click Generate, sign the wallet message, then download the result. For X, the website opens a prefilled *text* post; the user manually attaches the downloaded image. It does not pretend to upload the image directly to X.

## Launch steps

1. In OpenAI Platform, create a separate API project with billing oversight and a restricted key when possible; never paste the secret into chat or GitHub.
2. Set a low OpenAI Platform **budget and usage alerts** before enabling any call. Start with test quantities; review current model pricing, including input-image costs.
3. In Vercel → Project `crumb` → Settings → Environment Variables → Production, add `OPENAI_API_KEY` as a Secret. Redeploy.
4. Confirm the intended hostname `crumb-ochre.vercel.app` is allowed in Cloudflare Turnstile. Add `crumb.vision` separately only when connected and configured.
5. Only after checking costs and protections, add `AI_STUDIO_ENABLED` value `true` for Production, and redeploy.
6. Test with **one** wallet and **one** image; confirm success and usage counters in OpenAI Platform and Upstash.
7. Monitor billing after launch. Switch `AI_STUDIO_ENABLED` to `false` and redeploy to disable the generator immediately if needed.

## Notes

The **mission participation counter**, its 998-billion proposed burn, and its wallet verification are separate from the AI Studio. Generating images does not register a mission click or create/transfer/burn CRUMB tokens.
