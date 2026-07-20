import type {
    CompressionTriggerPolicy,
    NudgeDecision,
    NudgeDecisionInput,
    TipsVariant,
} from "./types"

const NUDGE_GROWTH_FLOOR = 6000
const NUDGE_GROWTH_CAP = 50000
const NUDGE_GROWTH_RATIO = 0.05

export function computeShouldNudge(params: NudgeDecisionInput): NudgeDecision {
    const { currentTokens, overMinLimit, overMaxLimit } = params

    if (currentTokens === undefined) {
        return { shouldNudge: false, tipsVariant: null }
    }

    if (params.lastNudgeTokens === undefined) {
        return { shouldNudge: false, tipsVariant: null }
    }

    const growthSinceLastNudge = currentTokens - params.lastNudgeTokens
    const shouldNudge = growthSinceLastNudge >= params.nudgeGrowthTokens || overMaxLimit

    if (!shouldNudge) {
        return { shouldNudge: false, tipsVariant: null }
    }

    const tipsVariant: TipsVariant = overMaxLimit ? "maxLimit" : overMinLimit ? "minLimit" : "normal"
    return { shouldNudge: true, tipsVariant }
}

export function resolveAdaptiveNudgeGrowth(modelContextLimit: number | undefined): number {
    if (!modelContextLimit || modelContextLimit <= 0) return NUDGE_GROWTH_FLOOR
    return Math.min(
        NUDGE_GROWTH_CAP,
        Math.max(NUDGE_GROWTH_FLOOR, Math.round(modelContextLimit * NUDGE_GROWTH_RATIO)),
    )
}

export const defaultTriggerPolicy: CompressionTriggerPolicy = {
    name: "context-compress-algorithms-trigger",
    version: "1.0.0",
    description:
        "Growth-only cadence: nudge when context growth since last nudge exceeds adaptive threshold, or when over max limit.",
    computeShouldNudge,
    resolveAdaptiveNudgeGrowth,
}

export function registerTriggerPolicy(
    register: (policy: CompressionTriggerPolicy) => void,
): void {
    register(defaultTriggerPolicy)
}
