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
