# REQ: Release cc-alg v1.2.0

## Goal

Publish cc-alg 1.2.0 stable with multi-tier compression rules (TIER2_DISTILL_RULES, TIER3_CONDENSE_RULES) and mark deprecated budget trigger functions.

## Changes

1. Added `TIER2_DISTILL_RULES` — distillation rules for T1→T2 compression
2. Added `TIER3_CONDENSE_RULES` — ultra-condensation rules for T2→T3
3. Added `CompressionTier` type, `TierTokenUsage` interface
4. Marked `computeTierBudgets`/`computeTierTrigger` as `@deprecated` (replaced by independent per-tier triggers in host system)
5. Updated README with new exports + changelog

## Dependencies

opencode-acp will pin to `"context-compress-algorithms": "1.2.0"` after this release.
