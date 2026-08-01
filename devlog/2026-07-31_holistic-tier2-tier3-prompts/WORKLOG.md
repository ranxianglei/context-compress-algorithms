# WORKLOG: Holistic TIER2/TIER3 Prompts

## Changes

1. `src/prompts/tier2-distill-rules.ts`:
    - Removed FORMAT per-block requirements (Source headers, 3-5 bullets/block, 50-150 tokens/block)
    - New FORMAT: holistic summary grouped by theme, no per-block headers
    - KEEP/DROP guidance unchanged (decisions, outcomes, lessons stay; line numbers, diffs, process details go)

2. `src/prompts/tier3-condense-rules.ts`:
    - Same treatment: removed per-block format
    - New FORMAT: holistic fact list by theme, aggressively merged
    - PRIORITY/DROP guidance unchanged

3. `README.md`:
    - Updated TIER2/TIER3 descriptions in Prompts section
    - Added v1.3.0 changelog entry

4. `package.json`: version 1.2.1 → 1.3.0

## Verification

- `npm run build`: passes
- `npm test`: 104 tests pass
- Typecheck: clean
