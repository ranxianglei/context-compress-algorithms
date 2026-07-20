# WORKLOG: Initial extraction

## What was done

Migrated three modules from `opencode-acp/lib/` into this standalone package:

| Source (ACP, AGPL)                                              | Destination (cc-alg, MIT)              |
| -------------------------------------------------------------- | -------------------------------------- |
| `lib/compress/quality-gate/tokenizer.ts`                       | `src/quality-gate/tokenizer.ts`        |
| `lib/compress/quality-gate/algorithms/rouge-recall-v1.ts`      | `src/quality-gate/rouge-recall-v1.ts`  |
| `lib/compress/quality-gate/types.ts` (subset)                  | `src/quality-gate/types.ts`            |
| `lib/prompts/compression-rules.ts`                             | `src/prompts/compression-rules.ts`     |
| `lib/messages/inject/utils.ts` (trigger helpers, partial)      | `src/trigger/default.ts`               |
| `lib/messages/inject/policy/types.ts`                          | `src/trigger/types.ts`                 |

ACP versions of these files were deleted after extraction (ACP now imports
from this package via a `file:` symlink, will switch to npm version once
this package is published).

## Scope of this iteration (post-extraction polish)

After provenance audit confirmed zero DCP derivation, this iteration added
the infrastructure needed for a public open-source release:

### Added

- `AGENTS.md` — full development spec modeled on ACP's (project overview,
  architecture, dev standards, contributing workflow, review requirements)
- `.prettierrc` — copied from ACP for style consistency
- `.github/workflows/ci.yml` — typecheck + test + build on Node 22/24
- `devlog/README.md` + this iteration's `REQ.md` / `WORKLOG.md`
- `tests/trigger-default.test.ts` — 25 tests covering:
  - Undefined-input guards for `computeShouldNudge`
  - Growth-vs-threshold boundary conditions (including `>=` semantics)
  - `overMaxLimit` override of growth axis
  - `tipsVariant` priority (`maxLimit` > `minLimit` > `normal`)
  - `resolveAdaptiveNudgeGrowth` floor/cap/ratio behavior
  - `defaultTriggerPolicy` shape and method equivalence
  - `registerTriggerPolicy` helper behavior
- `tests/prompts-compression-rules.test.ts` — 15 tests covering:
  - Non-empty / shape invariants
  - Structural invariants (sections present: KEEP VERBATIM, DROP, PRIORITY)
  - Load-bearing rules (file paths with line numbers, `[[KEEP:mNNNNN]]`
    markers, "never abbreviate" forbiddance)
  - Regression guards (length lower bounds)

### Modified

- `package.json`:
  - Bumped `0.1.0` → `1.0.0` (API is stable)
  - Added `repository`, `bugs`, `homepage` fields
  - Added `AGENTS.md` to `files` whitelist
- `src/quality-gate/types.ts`: removed broken `host-compat.test.ts`
  reference from docstring (no such file exists; structural typing makes
  the assignability implicit, no dedicated test needed)

## Test counts

| Suite                                | Tests | Notes                                  |
| ------------------------------------ | ----- | -------------------------------------- |
| `quality-gate-tokenizer`             |    28 | Migrated from ACP unchanged            |
| `quality-gate-rouge-recall-v1`       |    27 | Migrated from ACP unchanged            |
| `trigger-default`                    |    25 | NEW in this iteration                  |
| `prompts-compression-rules`          |    15 | NEW in this iteration                  |
| **Total**                            | **95**| all pass                               |

## Verification

- `npm run build` — succeeds (5 entry points, 3 shared chunks, sourcemaps)
- `npm run typecheck` — clean
- `npm test` — 95/95 pass
- `npm pack --dry-run` — tarball contains only `dist/`, `README.md`,
  `LICENSE`, `AGENTS.md`, `package.json` (no `src/`, `tests/`, `devlog/`)

## What's NOT in this iteration

- **npm publish** — deferred to next iteration per user direction. Current
  state is GitHub-only.
- **README dual-use disclosure** — the README does not yet explain the
  inline-into-AGPL scenario (where this package's bytes are bundled into
  opencode-acp and become part of the AGPL combined work). Will add in a
  follow-up before the npm release.
- **ACP integration switch** — ACP still uses `file:../context-compress-algorithms`
  devDependency + tsup `noExternal` bundling. Once this package is on npm,
  ACP can switch to a versioned dependency (still bundled, but resolvable
  from npm registry for type-only consumers).

## Followups

- Publish to npm as `context-compress-algorithms@1.0.0`
- Update ACP `package.json` to use `^1.0.0` from npm (drop `file:` URL)
- Add dual-use license section to README
- Consider a host-compat integration test in ACP that verifies
  `BlockSnapshot` structural assignability to ACP's `CompressionBlock`
