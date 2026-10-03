# Add the partner UI to your existing GitHub project

This archive contains the complete earlier advertiser source plus the new partner UI. Your GitHub copy may include newer edits that are unavailable here. Use the feature-only integration below to preserve them.

1. Copy `app/partner/` into your existing `app/` directory (or `src/app/` if that is your layout).
2. Copy `components/partner/` into your existing `components/` directory (or `src/components/`).
3. Keep your existing root layout and global CSS. Partner styling is imported by `app/partner/layout.tsx` and uses `dp-` class names.
4. Ensure `@/*` resolves to your source root. The feature uses your existing `components/ui/dialog.tsx` and its dependencies, `lucide-react`, React and Next.js. If absent, copy the included shared dialog plus `lib/utils.ts`; retain the matching Radix UI, class-variance-authority, clsx and tailwind-merge dependencies from this archive.
5. Add a link to `/partner` in your existing advertiser navigation. This archive's `components/motion/workspace.tsx` includes that link, but copying the whole file could overwrite your newer advertiser changes.
6. Optionally copy `tests/partner-model.test.ts`. Add the archive's `test` script and `allowImportingTsExtensions: true` to tsconfig if using those Node TypeScript tests.
7. Run your normal install, typecheck and build commands. Start the app and visit `/partner`.

There are no database migrations, new API routes, secrets or map API keys in this feature. Do not overwrite your existing package.json, lockfile or deployment settings solely to copy these two folders.

## Routes

- `/partner`
- `/partner/cities/pune`
- `/partner/cities/pune/areas/baner`
- `/partner/cities/pune/areas/koregaon-park`
- `/partner/cities/pune/areas/viman-nagar`

The dynamic routes use `generateStaticParams` for these demo areas and reject unknown IDs. To add an area, update `AREAS` in the model; data, navigation and static route parameters are derived from that array.

## Backend connection points

- `provider.tsx`: replace localStorage hydration and save with authenticated API reads/writes; the editor already waits for save success before confirming.
- `model.ts`: replace illustrative fleet, restaurant and revenue values; preserve units and aggregation behavior.
- `coverage-map.tsx`: substitute authorized location data and a real map component when available.
- `fee-editor.tsx`: keep server-side validation and conflict/version checks authoritative when multiple operators can edit rates.

Local history is only a demo convenience, not a durable audit log. Cross-tab merging is best effort and does not provide transactional concurrency.
