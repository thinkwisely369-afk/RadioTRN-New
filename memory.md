# Project Memory - RadioTRN New

## Status: 2026-03-16
### Accomplishments:
1. **WAF Challenge Resolution for iOS/Safari:**
   - Problem: Managed Challenges (CAPTCHAs) were blocking background API calls, causing "Failed to load stations" errors on iOS.
   - Mechanism: 
     - Created `validatedFetch` in `api.ts` to intercept HTML responses when JSON is expected.
     - Created `PreflightCheck.tsx` component as a UI fallback.
     - Updated `Index.tsx` and `StationPage.tsx` to handle the `WAF_CHALLENGE_DETECTED` state.
   - PWA Optimization: Updated `vite.config.ts` to ensure only JSON responses are cached in the `api-cache`, preventing CAPTCHA pages from being stored offline.

### Next Steps / Recommendations:
- **Subdomain Migration:** Consider moving the backend API to `api.radiotrn.com`. This allows configuring specific WAF rules (like lowering security level) just for the API without affecting the main site's protection.
- **Cache-Control Headers:** Backend should explicitly set `Cache-Control: private, no-cache` for dynamic endpoints to avoid ITP dropping data or proxied caching of user-specific challenges.
- **Production Verification:** Test on a physical iOS device in a network environment where challenges are triggered (e.g., VPN or cellular data).

## Key Files:
- `src/lib/api.ts`: Central API logic with WAF interception.
- `src/components/PreflightCheck.tsx`: UI for security verification.
- `vite.config.ts`: Service Worker configuration.
