import { rougeRecallV1 } from "./rouge-recall-v1"
import type { QualityGate } from "./types"

export { rougeRecallV1, DEFAULT_ROUGE_RECALL_V1_CONFIG } from "./rouge-recall-v1"
export type { RougeRecallV1Config } from "./rouge-recall-v1"
export type {
    QualityGate,
    QualityGateContext,
    QualityGateResult,
    QualityGateMetric,
    BlockSnapshot,
} from "./types"
export {
    tokenize,
    rouge1F1,
    rouge1Recall,
    rouge1Precision,
    topKRecall,
    topKByTf,
    termFrequency,
    jaccardSimilarity,
    extractFilePaths,
} from "./tokenizer"
export type { TokenizeOptions } from "./tokenizer"

/**
 * Register all built-in quality gates with host system's quality-gate registry.
 *
 * Usage:
 *   import { registerQualityGates } from "context-compress-algorithms/quality-gate"
 *   import { registerQualityGate } from "host system/lib/compress/quality-gate"
 *
 *   registerQualityGates(registerQualityGate)
 *
 * Or register individually:
 *   import { rougeRecallV1 } from "context-compress-algorithms/quality-gate"
 *   import { registerQualityGate } from "host system/lib/compress/quality-gate"
 *
 *   registerQualityGate(rougeRecallV1)
 *
 * context-compress-algorithms deliberately does NOT import host system at runtime.
 * Callers pass in the host's register function explicitly. This keeps the
 * dependency direction clear: host application wires the two together.
 */
export function registerQualityGates(
    register: (gate: QualityGate) => void,
): void {
    register(rougeRecallV1)
}
