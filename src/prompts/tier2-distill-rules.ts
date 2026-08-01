/**
 * Tier 2 compression rules — DISTILLATION.
 *
 * Used when compressing Tier 1 summaries (blocks) into Tier 2 distilled blocks.
 * The philosophy is fundamentally different from Tier 1:
 * - Tier 1 (HOW_TO_COMPRESS_RULES): CAPTURE everything — paths, signatures, errors verbatim
 * - Tier 2 (this): DISTILL to decisions, outcomes, and lessons — drop implementation details
 *
 * Target compression ratio: ~1/10 to 1/15 (1000 tok → 70-100 tok)
 */
export const TIER2_DISTILL_RULES = `TIER 2 COMPRESSION — DISTILLATION

You are compressing historical summaries (not raw conversation). These summaries have already captured the details. Your job is to DISTILL them: write a holistic summary of what matters for future work, discarding the process.

KEEP — these are the only things that survive distillation:
- Decisions and their rationale ("chose X over Y because Z" — the "because" is load-bearing).
- Final outcomes: version numbers shipped, PR numbers merged/closed, bugs fixed or deferred.
- Key lessons: what failed and why ("tried X, failed because Y"). These prevent repeating mistakes.
- Critical constraints discovered ("must support Node 22", "AGENTS.md forbids as any").
- Design decisions with architectural impact ("chose compress-as-anchor over synthetic messages because prefix cache").
- Whether content is OBSOLETE or SUPERSEDED — mark with one line: "[SUPERSEDED by PR #NNN]" or "[OBSOLETE: deleted in vX.Y.Z]".
- Function/class/type names and module paths that are the SUBJECT of the work — e.g., "fixed filterCompressedRanges in prune.ts". Not exact line numbers or full signatures — just enough to LOCATE the code.
- Exploration findings: if a block was exploratory with no decision, keep the CONCLUSION in one line.

DROP — these were useful during the work but are no longer needed:
- Exact line numbers, diffs, verbose function signatures, full code listings.
- Build/deploy process details, test execution steps.
- Review process details (who reviewed, what rounds, test counts).
- Verbose logs, command output, intermediate debugging steps.

FORMAT:
- Write a HOLISTIC summary grouped by THEME, not by source block.
- NO per-block headers. NO "Source: bN" lines. This is a review of what happened, not a catalog of blocks.
- Group related work together: all releases in one section, all bug fixes in another, all architecture decisions in a third.
- Start with the most important outcomes (shipped releases, merged PRs, critical bugs).
- Dense, scannable bullets — no narrative prose.
- Most blocks will collapse into 1-2 bullets within a theme group. Many will have nothing worth keeping — omit them entirely.`
