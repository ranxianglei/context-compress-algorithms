# REQ: Release v1.1.0 — MEMORY_GUIDELINES prompt

## Problem

opencode-acp is developing a standalone `memory` tool (facts that must survive
compression for the rest of a task). The reusable, host-agnostic guidance text —
_when_ to record a memory, _what_ belongs in one, and how memory interacts with
compression — belongs in this MIT-licensed package, not in ACP's GPL-bound code.
ACP will interpolate it into its system prompt and compress-time nudges.

## Scope

- Add `MEMORY_GUIDELINES` export to `/prompts`.
- No `MemoryStore` abstraction yet (future quality-detection work).
- Minor version bump `1.0.0 → 1.1.0`.

## Acceptance Criteria

- [x] `MEMORY_GUIDELINES` exported from `context-compress-algorithms/prompts`.
- [x] No host-system references (zero-coupling invariant preserved).
- [x] `npm run typecheck`, `npm test` (95), `npm run build` pass.
- [x] Version bumped, README updated (What's included + usage example + changelog).
- [x] Release branch + devlog + PR created.
