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

You are compressing historical summaries (not raw conversation). These summaries have already captured the details. Your job is to DISTILL them: extract only what matters for future work, discard the process.

KEEP — these are the only things that survive distillation:
- Decisions and their rationale ("chose X over Y because Z" — the "because" is load-bearing).
- Final outcomes: version numbers shipped, PR numbers merged/closed, bugs fixed or deferred.
- Key lessons: what failed and why ("tried X, failed because Y"). These prevent repeating mistakes.
- Critical constraints discovered ("must support Node 22", "AGENTS.md forbids as any").
- Design decisions with architectural impact ("chose compress-as-anchor over synthetic messages because prefix cache").
- Whether content is OBSOLETE or SUPERSEDED — mark with one line: "[SUPERSEDED by PR #NNN]" or "[OBSOLETE: deleted in vX.Y.Z]". Do NOT keep the obsolete content's details — just the marker and reason.
- Function/class/type names and module paths that are the SUBJECT of the work — e.g., "fixed filterCompressedRanges in prune.ts", "added SessionStateRegistry in state.ts". Not exact line numbers or full signatures — just enough to LOCATE the code without searching.
- Exploration findings: if a block was exploratory with no decision, keep the CONCLUSION in one line ("explored X, not viable because Y"). Do not keep the exploration process.

DROP — these were useful during the work but are no longer needed:
- Exact line numbers, diffs, verbose function signatures, full code listings.
- Build/deploy process details, test execution steps.
- Review process details (who reviewed, what rounds, test counts).
- Verbose logs, command output, intermediate debugging steps.

FORMAT:
- Start each distilled block with a source header line:
  \`Source: bN+bM+... (XK→YK tok, Zx). [original topic]\`
  Example: \`Source: b5+b7 (56K+44K→268 tok, 375x). [Tool-result recap + publish]\`
- 3-5 bullet points per source block, each a self-contained fact.
- Dense, scannable — no narrative prose.
- Start with the outcome, not the process: "v1.13.0 shipped (7 PRs bundled)" not "implemented 7 PRs then reviewed then merged".
- Cross-block synthesis: if multiple source blocks cover the same topic (same PR, same feature, same bug), MERGE them into a single group of bullets. Do not repeat the same fact from different blocks — keep it once under the most relevant source header.

SIZE TARGET: 50-150 tokens per source block (excluding the header). If you can't fit it in 150 tokens, you're keeping too much process. If a block has nothing worth keeping (pure noise), output just the header followed by "[no actionable content]".`
