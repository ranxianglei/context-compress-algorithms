export type TipsVariant = "maxLimit" | "minLimit" | "normal"

export interface NudgeDecision {
    shouldNudge: boolean
    tipsVariant: TipsVariant | null
}

export interface NudgeDecisionInput {
    currentTokens: number | undefined
    modelContextLimit: number | undefined
    overMinLimit: boolean
    overMaxLimit: boolean
    lastNudgeTokens: number | undefined
    minNudgeContextPercent: number
    nudgeGrowthTokens: number
}

export interface CompressionTriggerPolicy {
    name: string
    version: string
    description: string
    computeShouldNudge(input: NudgeDecisionInput): NudgeDecision
    resolveAdaptiveNudgeGrowth(modelContextLimit: number | undefined): number
}
