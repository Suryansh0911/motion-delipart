# Motion — advertiser and delivery partner frontend

A runnable React + TypeScript application using Next.js App Router. The advertiser workspace is at `/`; the new delivery partner workspace is at `/partner`.

## Run locally

Use Node.js 22.13 or newer and pnpm 11.25.0. From the extracted `motion-frontend` folder:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open **http://localhost:3000/partner** for the partner UI, or **http://localhost:3000** for the advertiser UI. Keep the terminal running. If Corepack is unavailable, use your existing pnpm installation and omit `corepack`.

A build alone does not start a web server. To run a production build:

```sh
corepack pnpm build
corepack pnpm start
```

## Included partner screens

- Partner overview with city search and summary metrics.
- Pune overview with monthly revenue chart/table, area search and sorting, coverage schematic, and CSV export.
- Baner, Koregaon Park, and Viman Nagar area pages.
- Editable Morning (08:00–12:00), Afternoon (12:00–15:00), and Night (18:00–23:00) rates, in INR per box-hour.
- Input validation, cancel/save flows, browser persistence, local change history, and cross-tab storage notifications.
- Current/average box counts, weekly/monthly sample selector, restaurant counts, revenue, and earnings-per-delivery calculation.
- Responsive navigation, fee dialog, accessible labels, focus indicators, and reduced-motion support.

## Prototype boundaries

All restaurants, fleet numbers, revenue, and coverage are illustrative. No real partner, GPS, payout, authentication, or billing service is connected. The map is a schematic. Fee edits affect future local pricing scenarios; they do not recalculate historical revenue or change the advertiser workspace's prices.

Partner changes are stored in this browser's localStorage under `motion-delivery-partner-v1`. They are not shared between devices or users and are not secure account storage. The advertiser workspace retains its separate browser-local data. Clearing browser site data removes local edits and uploaded creatives.

The source month is October 2026, deliberately fixed for a reproducible demo. Sample data and formulas live in `components/partner/model.ts`.

## Calculations

- Delivery estimate: current boxes × 17 deliveries per day × 30 days.
- Estimated earnings/delivery: monthly partner ad revenue ÷ estimated deliveries.
- City earnings/delivery uses summed revenue divided by summed deliveries, not the mean of area ratios.
- Full-capacity price scenario: `(morning rate × 4 + afternoon rate × 3 + night rate × 5) × boxes`. Monthly scenario multiplies by 30. This assumes every listed hour is booked; it is not a forecast or profit.
- Revenue is before partner expenses. No profit figure is claimed.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/partner/` | Routes, scoped styles and not-found view |
| `components/partner/` | Partner screens, state, fee editor, model and calculations |
| `components/motion/` | Existing advertiser frontend |
| `components/ui/` | Shared UI components, including dialogs |
| `tests/partner-model.test.ts` | Calculation, validation, persistence-shape and CSV tests |
| `docs/INTEGRATION.md` | Add just the partner UI to your existing GitHub project |
| `docs/VALIDATION.md` | Completed checks and limitations |

## Checks

```sh
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
```

`lint` is scoped to the new partner feature. `test` runs the seven partner model tests. The package retains the original project's dependency versions and lockfile; the new partner screens require no additional package.

## Deployment

Use the existing Next.js setup with your chosen hosting provider. No environment variables or API keys are needed for this frontend demo. Partner routes are directly addressable under `/partner`; do not add a SPA rewrite that sends every route to `/`.

Before connecting real operations, replace browser persistence with authenticated server APIs, enforce partner/area authorization on the server, and source financial figures from verified campaign records.
