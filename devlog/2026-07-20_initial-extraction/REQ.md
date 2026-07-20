# REQ: Initial extraction from opencode-acp

## Background

`opencode-acp` (AGPL-3.0-or-later) is a fork of DCP with 39 bug fixes. As
part of making ACP's algorithmic contributions consumable by the broader
ecosystem — including projects that cannot accept AGPL code — the
wholly-original algorithms were extracted into this standalone MIT package.

## Provenance

This package contains ZERO code derived from DCP upstream. A formal audit
(July 2026) verified:

- DCP `Opencode-DCP/opencode-dynamic-context-pruning` master branch has no
  `lib/compress/quality-gate/` directory
- DCP code search for `rouge`, `qualityGate`, `nudgeGrowthTokens`,
  `lastNudgeTokens`, `resolveAdaptiveNudgeGrowth`, `HOW_TO_COMPRESS_RULES`,
  `COMPRESS_PHILOSOPHY`, `KEEP VERBATIM` returns zero hits
- DCP's `lib/prompts/context-limit-nudge.ts` and `lib/prompts/turn-nudge.ts`
  are empty strings — no shared text with this package's prompts
- DCP's `lib/prompts/system.ts` uses abstract metaphors ("crystallization",
  "phase transitions") that share no expression with this package's
  operational rules

Every line in `src/` was authored from scratch for this distribution. The
MIT license is unencumbered.

## Scope

Three submodules, each independently importable:

1. `quality-gate/` — `rougeRecallV1` default gate + tokenizer + ROUGE helpers
2. `prompts/` — `HOW_TO_COMPRESS_RULES` + `COMPRESS_PHILOSOPHY` constants
3. `trigger/` — `defaultTriggerPolicy` (growth-based cadence + adaptive threshold)

## Acceptance criteria

- [x] Zero runtime dependencies
- [x] Zero host-system imports (host wires itself to this package, never reverse)
- [x] MIT license file present
- [x] Each submodule has dedicated tests (≥ 5 tests per submodule)
- [x] `npm run build`, `npm run typecheck`, `npm test` all pass
- [x] Type definitions (.d.ts) generated for all entry points
- [x] README documents each submodule with usage examples
- [x] Tarball (`npm pack`) excludes `tests/`, `src/`, `devlog/`, `node_modules/`

## Out of scope

- npm publish (separate iteration)
- Dual-use notice in README (separate iteration)
- Host-system integration guide (lives in host's own docs)
