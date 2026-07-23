# WORKLOG: Release v1.1.0 — MEMORY_GUIDELINES

## Changes

- `src/prompts/memory-guidelines.ts` (NEW): `MEMORY_GUIDELINES` constant.
  Sections: RECORD when / DO NOT RECORD / CONTENT GUIDANCE / COMPRESSION
  INTERACTION (record before compress; memories are protected from
  compression).
- `src/prompts/index.ts`: re-export `MEMORY_GUIDELINES`.
- `package.json`: `1.0.0 → 1.1.0`.
- `README.md`: added `MEMORY_GUIDELINES` to "What's included" → Prompts;
  updated usage example import; added Changelog section.

## Verification

- `npm run typecheck` — pass.
- `npm test` — 95/95 pass.
- `npm run build` — pass; `dist/prompts/index.d.ts` contains the export.
- Manual import: `MEMORY_GUIDELINES` resolves, 2443 chars.

## SemVer

Minor bump: new exported constant, backward-compatible addition.
