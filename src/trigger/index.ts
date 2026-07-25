export type {
    TipsVariant,
    NudgeDecision,
    NudgeDecisionInput,
    CompressionTriggerPolicy,
} from "./types"
export {
    computeShouldNudge,
    resolveAdaptiveNudgeGrowth,
    defaultTriggerPolicy,
    registerTriggerPolicy,
} from "./default"
export type { CompressionTier, TierTokenUsage, TierBudgetConfig, TierTriggerResult } from "./tier"
export { computeTierTrigger, computeTierBudgets } from "./tier"
