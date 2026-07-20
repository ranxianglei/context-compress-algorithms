# context-compress-algorithms Development Specification

> **This document is the highest-priority specification for this project. All developers (including AI Agents) MUST comply unconditionally.**

---

## 1. Project Overview

### 1.1 What Is context-compress-algorithms

A standalone, MIT-licensed library of algorithm implementations for conversation
context compression in LLM applications. Provides reusable building blocks —
quality gates, compression prompt principles, trigger policies — that any host
system (plugin, IDE, agent framework) can consume without taking on a runtime
dependency on the host.

### 1.2 Provenance

**This package contains 100% original work by ranxianglei.** It is structurally
inspired by the algorithmic needs of [opencode-acp](https://github.com/ranxianglei/opencode-acp)
but shares zero code with ACP or its upstream DCP. A formal provenance audit
(July 2026) confirmed:

- DCP upstream (`Opencode-DCP/opencode-dynamic-context-pruning`) contains none
  of the symbols, types, or text exported by this package.
- Every line was authored from scratch for this package's MIT-licensed
  distribution.

The standalone MIT license is therefore unencumbered. See `LICENSE`.

### 1.3 Tech Stack

| Category           | Technology                                                   |
| ------------------ | ------------------------------------------------------------ |
| Language           | TypeScript (strict, ESM)                                     |
| Runtime            | Node.js 22+                                                  |
| Build              | `tsup` (bundling) + `tsc --emitDeclarationOnly` (types)     |
| Test Runner        | Node.js built-in: `node --import tsx --test tests/*.test.ts` |
| Package Manager    | npm                                                          |
| Linting/Formatting | Prettier                                                     |
| Dependencies       | **Zero** runtime dependencies                                |

### 1.4 Repository Info

| Field       | Value                                                                  |
| ----------- | --------------------------------------------------------------------- |
| npm package | `context-compress-algorithms`                                         |
| Version     | 1.0.0                                                                 |
| GitHub      | https://github.com/ranxianglei/context-compress-algorithms            |
| License     | MIT                                                                   |
| Author      | ranxianglei                                                           |

---

## 2. Architecture

### 2.1 Module Map

```
context-compress-algorithms/
├── src/
│   ├── index.ts                          # Barrel: re-exports all submodules
│   │
│   ├── quality-gate/                     # Quality-gate algorithms
│   │   ├── types.ts                      # QualityGate, QualityGateContext, BlockSnapshot, etc.
│   │   ├── tokenizer.ts                  # tokenize, rouge1F1, rouge1Recall, topKRecall, jaccardSimilarity, etc.
│   │   ├── rouge-recall-v1.ts            # Default gate: L1 length floor + L2 ROUGE-1 F1 AND top-20 recall
│   │   └── index.ts                      # Barrel + registerQualityGates helper
│   │
│   ├── prompts/                          # Compression-principle constants
│   │   ├── compression-rules.ts          # HOW_TO_COMPRESS_RULES, COMPRESS_PHILOSOPHY
│   │   └── index.ts                      # Barrel
│   │
│   └── trigger/                          # Compression-trigger policies
│       ├── types.ts                      # CompressionTriggerPolicy, NudgeDecision, etc.
│       ├── default.ts                    # defaultTriggerPolicy (computeShouldNudge + resolveAdaptiveNudgeGrowth)
│       └── index.ts                      # Barrel + registerTriggerPolicy helper
│
├── tests/                                # Flat test directory
│   ├── quality-gate-tokenizer.test.ts    # 28 tests for tokenizer + ROUGE helpers
│   ├── quality-gate-rouge-recall-v1.test.ts # 27 tests for the default gate
│   ├── trigger-default.test.ts           # Tests for computeShouldNudge + resolveAdaptiveNudgeGrowth
│   └── prompts-compression-rules.test.ts # Snapshot/non-empty tests for prompt constants
│
├── devlog/                               # Development iteration logs
│   ├── README.md                         # Usage guide
│   └── YYYY-MM-DD_short-title/           # One folder per iteration
│
├── .github/workflows/
│   └── ci.yml                            # CI: typecheck + test + build (Node 22/24)
│
├── tsconfig.json
├── tsup.config.ts
├── .prettierrc
├── .gitignore
├── LICENSE                               # MIT
├── README.md
├── AGENTS.md                             # This file
└── package.json
```

### 2.2 Core Design Principle: Zero Host Coupling

This package MUST NOT import any host system at runtime. The dependency
direction is one-way: the host wires itself to this package, never the reverse.

The `register*` helpers (`registerQualityGates`, `registerTriggerPolicy`)
accept a host-supplied callback so the host owns its registry:

```typescript
// In host code:
import { rougeRecallV1, registerQualityGates } from "context-compress-algorithms/quality-gate"
import { registerQualityGate } from "host/lib/compress/quality-gate/registry"

registerQualityGates(registerQualityGate)  // cc-alg calls host's register
```

If you find yourself adding `import ... from "host-system/..."` anywhere in
`src/`, STOP — you are breaking the isolation contract.

### 2.3 Submodule Independence

Each submodule (`/quality-gate`, `/prompts`, `/trigger`) is independently
importable via a separate package export. Hosts can pick only what they need:

```typescript
import { rougeRecallV1 } from "context-compress-algorithms/quality-gate"
import { HOW_TO_COMPRESS_RULES } from "context-compress-algorithms/prompts"
```

This is enforced via the `exports` field in `package.json`. Do NOT add
cross-submodule imports inside `src/` — each submodule must stand alone.

### 2.4 Type Compatibility Strategy

`src/quality-gate/types.ts` defines `BlockSnapshot` as a deliberately minimal
subset of the host's `CompressionBlock`. This avoids importing the host's full
type while remaining structurally assignable.

TypeScript's structural typing means a host `CompressionBlock` object is
automatically assignable to `BlockSnapshot` — no adapter or cast needed.

---

## 3. Development Standards

### 3.1 Build Commands

```bash
npm run clean          # Remove dist/
npm run build          # Clean + tsup + tsc --emitDeclarationOnly
npm run typecheck      # TypeScript type checking (no emit)
npm run test           # Run tests: node --import tsx --test tests/*.test.ts
npm run format         # Format with Prettier
npm run format:check   # Check formatting
```

### 3.2 Build Output

- `dist/` — bundled JavaScript (ESM) per entry point
- `dist/**/*.d.ts` — TypeScript declaration files
- Published files (per `files` field): `dist/`, `README.md`, `LICENSE`

### 3.3 Testing

**Test runner**: `node --import tsx --test tests/*.test.ts`

**Test directory**: Flat `tests/` structure.

**Categories**:

| Category           | Files                                                | Description                            |
| ------------------ | ---------------------------------------------------- | -------------------------------------- |
| Pure-function      | `quality-gate-tokenizer.test.ts`                     | Tokenizer + ROUGE helpers              |
| Algorithm          | `quality-gate-rouge-recall-v1.test.ts`               | Default gate end-to-end                |
| Trigger            | `trigger-default.test.ts`                            | Trigger-policy pure functions          |
| Constants/Snapshot | `prompts-compression-rules.test.ts`                  | Non-empty / shape checks for prompts   |

### 3.4 npm Publishing

```bash
# Pre-publish
npm run build
npm run typecheck
npm test

# Verify package contents
npm pack --dry-run

# Publish
npm publish
```

The `files` whitelist prevents accidental inclusion of `node_modules/`, `tests/`,
or `devlog/` in the tarball.

---

## 4. Code Change Guidelines

### 4.1 Hard Rules

| Rule                                                                | Why                                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| **NEVER add a runtime dependency**                                  | Zero-deps is a load-bearing promise                            |
| **NEVER import host system code from `src/`**                       | Breaks the isolation contract (Section 2.2)                    |
| **NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`**            | Type safety                                                    |
| **NEVER suppress errors with empty catch blocks**                   | Error handling                                                 |
| **NEVER delete failing tests to "pass"**                            | Test integrity                                                 |

### 4.2 Adding a New Quality Gate

1. Create `src/quality-gate/<name>.ts` implementing the `QualityGate` interface
2. Add it to the `registerQualityGates` list in `src/quality-gate/index.ts`
3. Add tests in `tests/quality-gate-<name>.test.ts` covering:
   - Both pass and fail paths
   - Boundary conditions
   - All metrics in the result
4. Document the gate's contract in the file's top docstring

### 4.3 Adding a New Trigger Policy

1. Create `src/trigger/<name>.ts` exporting a `CompressionTriggerPolicy`
2. Add a `register<Name>Policy` helper that takes a host register callback
3. Add tests in `tests/trigger-<name>.test.ts`
4. Document the decision logic (when does it return `shouldNudge: true`?)

### 4.4 Style

- Match existing patterns (4-space indent, double quotes, no semicolons)
- Run `npm run format` before committing
- Run `npm run typecheck` and `npm test` before pushing

---

## 5. Contributing

### 5.1 Before Making Changes

1. Run `npm run typecheck` to ensure no type errors
2. Run `npm run format:check` to ensure formatting is consistent
3. Read Section 2 (Architecture) to understand module boundaries

### 5.2 Development Workflow

1. Create a feature branch (naming: `YYYY-MM-DD_short-title`)
2. Create devlog entry: `devlog/{YYYY-MM-DD_short-title}/` with `REQ.md`
3. Implement changes
4. Ensure `npm run build`, `npm run typecheck`, `npm test` all pass
5. Commit with descriptive messages
6. Push branch and create a GitHub PR
7. Wait for CI (`typecheck` + `test` + `build`) to pass
8. Merge after human review

### 5.3 Code Review (MANDATORY)

All source code changes (files under `src/`) MUST undergo independent review by
**at least 2 separate agents** before merge.

**Review checklist**:

| Category                    | What to Check                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| **Correctness**             | Logic matches intent, edge cases handled                                                       |
| **Backward compatibility**  | No breaking changes to exported types or function signatures ( SemVer major bump required)     |
| **Zero-dep invariant**      | No new runtime dependencies added                                                              |
| **Host-isolation invariant**| No `import ... from "host-system"` in `src/`                                                   |
| **Performance**             | No O(n²) where O(n) suffices; tokenizer stays linear in input size                             |
| **Type safety**             | No `as any`, no `@ts-ignore`                                                                   |

### 5.4 Release Workflow

Releases are fully automated through GitHub Actions. The workflow is: create a
release PR → merge → CI auto-tags, builds, tests, and publishes to npm.

**Step 1**: Create a release branch
```bash
git checkout master && git pull origin master
git checkout -b YYYY-MM-DD_release-v{VERSION}
```

**Step 2**: Bump version in `package.json`, update changelog in `README.md`,
create `devlog/YYYY-MM-DD_release-v{VERSION}/REQ.md` + `WORKLOG.md`.

**Step 3**: Verify locally, commit, push, create PR.

**Step 4**: Wait for CI to pass, then a human merges the PR.

**Step 5**: Push to master triggers `release.yml` automatically — no manual
`npm publish` needed.

### 5.5 Commit Convention

Use descriptive commit messages. Examples:

- `feat: add rouge-precision-v2 gate for tighter summary recall`
- `fix: rouge1F1 div-by-zero when both token sets empty`
- `chore: bump version to 1.0.1`
- `docs: clarify trigger policy contract in AGENTS.md`

---

## 6. License

MIT — see `LICENSE`.

By contributing, you agree your contributions are licensed under the same
MIT license as the rest of the project.
