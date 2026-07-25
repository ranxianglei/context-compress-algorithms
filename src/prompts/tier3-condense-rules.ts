/**
 * Tier 3 compression rules — ULTRA-CONDENSATION.
 *
 * Used when compressing Tier 2 distilled blocks into Tier 3 ultra-condensed blocks.
 * Tier 2 already extracted decisions/outcomes. Tier 3 reduces them to bare facts.
 *
 * Target compression ratio: ~1/3 (100 tok → 30 tok)
 */
export const TIER3_CONDENSE_RULES = `TIER 3 COMPRESSION — ULTRA-CONDENSATION

You are compressing distilled summaries (Tier 2) into ultra-condensed facts (Tier 3). The distilled summaries already contain only decisions and outcomes. Your job is to reduce them to bare factual references.

RULES:
- Start with a source header line:
  \`Source: bN+bM+... (XK→YK tok, Zx). [original topic]\`
- Output 1-3 facts per block. Each fact is a single line: subject + outcome.
- No explanations, no rationale, no process — just the fact.
- Format: "[PR/Issue/Version] — [outcome in ≤8 words]"
- Merge related facts from different blocks if they concern the same topic.

EXAMPLES:
- "v1.13.0 shipped — quality gate + GC fix (7 PRs)"
- "PR #196 merged — preserve-first-user (supersedes #169)"
- "Issue #176 — subagent history rewrite (PR #180 open)"

DROP:
- Multi-sentence context. If a fact needs >1 sentence, it's too detailed for Tier 3.
- Lessons learned, constraints, design rationale — these either made it into Memory already, or they're too old to matter.
- Anything marked [OBSOLETE] or [SUPERSEDED] — drop entirely, just note "[N blocks obsolete]" in the summary.

SIZE TARGET: 10-30 tokens per condensed block. Absolute minimum.`
