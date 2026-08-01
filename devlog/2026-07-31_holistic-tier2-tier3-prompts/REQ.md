# REQ: Holistic TIER2/TIER3 Prompts

## Problem

TIER2_DISTILL_RULES FORMAT required per-block processing:

- `Source: bN+bM` header per block
- 3-5 bullets per source block
- 50-150 tokens per source block

When compressing 70+ T1 blocks, this forced the model to COPY each block's
content into the summary instead of DISTILLING it. Result: 74 blocks × ~100
tokens = ~7400 tokens ≈ 30K chars, exceeding `maxSummaryLengthHard` (20000)
→ compress fails → model stuck in T2 trigger loop.

## Solution

Rewrite TIER2_DISTILL_RULES and TIER3_CONDENSE_RULES to use holistic summary
by theme:

- NO per-block headers
- Group related work by theme (releases, bug fixes, architecture decisions)
- Most blocks collapse into 1-2 bullets within a theme group
- Trivial blocks omitted entirely
- No per-block size target

## Scope

- `src/prompts/tier2-distill-rules.ts` — rewrite FORMAT section
- `src/prompts/tier3-condense-rules.ts` — rewrite FORMAT section
- `README.md` — update descriptions + changelog
