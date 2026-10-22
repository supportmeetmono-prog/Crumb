# CRUMB website security notes

CRUMB runs as a public website on Vercel. Public clients can always inspect delivered HTML, CSS and JavaScript. Protect secrets in private production environment variables, not frontend code.

## Controls
- Restrictive Content Security Policy and browser security headers
- No inline application JavaScript; browser-side design studio uses textContent/canvas
- AI image endpoint is disabled unless owner explicitly enables it and configures OpenAI, Turnstile and Upstash secrets
- AI image generation enforces origin, signed nonce, Turnstile, atomic quotas, body-size limit and host validation
- Legacy mission and click counter routes always return 410
- Static source checks, dependency audit and Dependabot updates

## Owner checklist (cannot be enforced by the public repo)
1. Turn on passkeys or hardware-key 2FA for GitHub, Vercel, Hostinger, X and any DNS account.
2. Limit collaborator permissions and protect the main branch (reviews and passing CI).
3. Review Vercel deployment protection, WAF/bot controls, rate limits and spending alerts with the production team account.
4. Never commit service keys, seed phrases, wallet private keys, tokens or .env files.
5. Configure restricted API credentials and separate budget ceilings before enabling paid image generation.
6. Inspect DNS and SSL after each domain change, and periodically review account sessions.
7. Keep recoverable offline backups and an incident plan; test restore procedures.

No website is guaranteed 100% safe or protected against every denial-of-service attack. This repo is not a substitute for manual penetration testing of authorized systems or a professional contract audit before token launch.
