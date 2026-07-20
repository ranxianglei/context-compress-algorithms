/**
 * Quality gate types — structurally compatible with host system's quality-gate types.
 *
 * Why duplicated (not imported from host system):
 * - Type-only imports would still create an npm dependency edge.
 * - For maximum isolation, context-compress-algorithms is self-contained.
 * - TypeScript's structural typing means an object of these types is also
 *   assignable to the host's QualityGate interface.
 *
 * If the host's types change, update these to match.
 */

/**
 * Subset of CompressionBlock fields used by quality gates.
 * Avoids importing the host's full CompressionBlock type.
 */
export interface BlockSnapshot {
    blockId: number
    summary?: string
    compressedTokens: number
    directMessageIds: string[]
    effectiveMessageIds: string[]
}

export interface QualityGateContext {
    block: BlockSnapshot
    summary: string
    originalChunks: string[]
    originalText: string
    originalTokens: number
}

export interface QualityGateMetric {
    name: string
    value: number
    format?: "raw" | "percent" | "ratio"
}

export interface QualityGateResult {
    passed: boolean
    layer?: string
    reason?: string
    metrics: QualityGateMetric[]
}

/**
 * Pluggable quality-gate algorithm.
 *
 * Contract (matches the host's QualityGate):
 * - `name` MUST be globally unique and stable across versions.
 * - `version` SHOULD bump when thresholds or logic change.
 * - `evaluate` MUST NOT throw — on internal error, return `{ passed: true, metrics: [] }`.
 */
export interface QualityGate {
    name: string
    version: string
    description: string
    evaluate(ctx: QualityGateContext, config: unknown): QualityGateResult
}
