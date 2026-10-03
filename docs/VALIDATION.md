# Verification record

Checked on 3 October 2026.

## Passed

- Next.js 16.3.4 production compilation, TypeScript validation and static page generation using `next build --webpack`.
- ESLint over `components/partner` and `app/partner`.
- Seven Node model tests: weighted city totals, phase duration/price math, zero-fleet behavior, invalid/zero/decimal rates, per-area isolation and history, corrupt persisted data, and CSV units.
- Actual tests ran with `node --experimental-strip-types --test --test-isolation=none tests/partner-model.test.ts` in the build environment.
- Browser: opening partner overview, Pune overview and area pages.
- Browser: a negative fee is rejected; cancel discards the draft.
- Browser: Baner rates changed to 20/24/30 and persisted through a full reload, producing ₹302 per box/day and ₹72,480 across 8 boxes for 30 days at full capacity.
- Browser: Baner's historical monthly revenue stayed ₹24,360 after the fee change; Koregaon Park retained its own 22/28/35 fees.
- Responsive inspection at a 390px iframe viewport: fee dialog fits, navigation drawer opens, no document-wide horizontal overflow. Wide data tables have their own horizontal scrolling.

## Scope and limitations

This is frontend and model validation, not a backend, financial, security or hardware acceptance test. No real GPS, fleet, payment, partner login or multi-device persistence was tested. The responsive check used a narrow browser iframe, not a physical phone. The production build was checked with webpack; the normal package scripts retain Next.js defaults.

No real business profitability or advertising impressions can be inferred from the supplied sample data.
