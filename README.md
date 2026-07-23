# context-compress-algorithms

Standalone, MIT-licensed algorithm implementations for conversation context
compression in LLM applications.

## What's included

### Quality Gate (`/quality-gate`)

Algorithms for evaluating the quality of a compression summary against its
original content.

- `rouge-recall-v1` — Two-layer ROUGE-1 + top-20 keyword recall gate
  - L1: Length floor (200 chars AND 1% retention)
  - L2: ROUGE-1 F1 < 0.05 AND top-20 keyword recall < 0.20 (AND-combine)

Also exports the underlying metrics as standalone utilities:
`tokenize`, `rouge1F1`, `rouge1Recall`, `rouge1Precision`, `topKRecall`,
`topKByTf`, `termFrequency`, `jaccardSimilarity`, `extractFilePaths`.

### Prompts (`/prompts`)

Compression *principles* — general-purpose rules for writing high-fidelity
summaries. Host-system prompt templates can interpolate these as building
blocks; the principles themselves make no reference to host-specific tools.

- `HOW_TO_COMPRESS_RULES` — verbatim / drop / priority rules for summary
  content. Tool-agnostic.
- `COMPRESS_PHILOSOPHY` — short companion block on need-based compression.
- `MEMORY_GUIDELINES` — when to record a durable memory vs. a compression
  summary, what belongs in each, and how memory interacts with compression
  (record before compress; memories are protected from compression).

Tool-specific prompt templates (compress tool description, system prompt,
nudges) are deliberately NOT in this package — they belong to whichever host
system is doing the compression.

### Trigger Policy (`/trigger`)

Decision algorithms for *when* to prompt the model to compress.

- `computeShouldNudge(input)` — growth-only cadence decision: returns
  `{ shouldNudge, tipsVariant }` based on token growth since last nudge,
  context limits, and caller-provided thresholds.
- `resolveAdaptiveNudgeGrowth(modelLimit)` — adaptive growth threshold
  (5% of model context limit, clamped to `[6000, 50000]`).

## Installation

```bash
npm install context-compress-algorithms
```

## Usage

Each submodule is self-contained and can be imported independently.

### Quality Gate

```typescript
import {
    rougeRecallV1,
    type QualityGateContext,
} from "context-compress-algorithms/quality-gate"

const ctx: QualityGateContext = {
    block: { blockId: 1, summary: "...", compressedTokens: 1000, directMessageIds: [], effectiveMessageIds: [] },
    summary: "...",
    originalChunks: [],
    originalText: "original content",
    originalTokens: 1000,
}

const result = rougeRecallV1.evaluate(ctx, {
    layer1MinChars: 200,
    layer1MinRetentionPct: 1.0,
    layer2MaxRougeF1: 0.05,
    layer2MaxTop20Recall: 0.20,
})

console.log(result.passed, result.layer, result.reason, result.metrics)
```

### Prompts (compression principles)

```typescript
import {
    HOW_TO_COMPRESS_RULES,
    COMPRESS_PHILOSOPHY,
    MEMORY_GUIDELINES,
} from "context-compress-algorithms/prompts"

// Interpolate into your own system / nudge templates
const systemPrompt = `
You operate in a context-constrained environment.

${HOW_TO_COMPRESS_RULES}

${COMPRESS_PHILOSOPHY}

${MEMORY_GUIDELINES}
`
```

### Trigger Policy

```typescript
import {
    computeShouldNudge,
    resolveAdaptiveNudgeGrowth,
} from "context-compress-algorithms/trigger"

const growth = resolveAdaptiveNudgeGrowth(200000) // 10000

const decision = computeShouldNudge({
    currentTokens: 50000,
    modelContextLimit: 200000,
    overMinLimit: false,
    overMaxLimit: false,
    lastNudgeTokens: 30000,
    minNudgeContextPercent: 15,
    nudgeGrowthTokens: growth,
})

if (decision.shouldNudge) {
    console.log(`Nudge variant: ${decision.tipsVariant}`)
}
```

## Integration with host systems

This package exposes default implementations of three interfaces
(`QualityGate`, `CompressionTriggerPolicy`) plus standalone compression
principles. A host system that defines its own interface types can register
these defaults via the helper functions:

```typescript
import { rougeRecallV1, registerQualityGates } from "context-compress-algorithms/quality-gate"
import { defaultTriggerPolicy, registerTriggerPolicy } from "context-compress-algorithms/trigger"

// Each `register*` helper takes a host-supplied register callback and
// invokes it with the default implementation. The host owns the registry.
registerQualityGates(myHostRegister)
registerTriggerPolicy(myHostRegister)
```

The host's registry types must be structurally compatible with the types
declared in this package. TypeScript's structural typing makes this work
without a hard runtime dependency in either direction.

## Changelog

### v1.1.0

**Added**: `MEMORY_GUIDELINES` prompt constant — when to record a durable
memory vs. a compression summary, what belongs in each, and how memory
interacts with compression (record before compress; memories are protected
from compression). Host systems with a persistent-memory tool can interpolate
this into their system prompt and compress-time nudges.
Files: `src/prompts/memory-guidelines.ts`, `src/prompts/index.ts`.

### v1.0.0

Initial release: quality gate (`rouge-recall-v1`), compression prompt
principles (`HOW_TO_COMPRESS_RULES`, `COMPRESS_PHILOSOPHY`), and trigger
policy (`computeShouldNudge`, `resolveAdaptiveNudgeGrowth`).

## License

MIT — see [LICENSE](./LICENSE).
