export type CompressionTier = 1 | 2 | 3

export interface TierTokenUsage {
    tier1Tokens: number
    tier2Tokens: number
    tier3Tokens: number
}

export interface TierBudgetConfig {
    tier1Trigger: number
    tier2Trigger: number
    tier3Max: number
}

export interface TierTriggerResult {
    tier: CompressionTier | null
    shouldCompress: boolean
    reason: string
}

/**
 * @deprecated Since v1.2.0. Replaced by independent per-tier triggers in
 * opencode-acp (inject.ts). The 60/30/10 budget split was too aggressive;
 * each tier now uses nudgeGrowthTokens as its threshold directly.
 * Will be removed in v2.0.0.
 */
export function computeTierBudgets(totalSummaryBudget: number): TierBudgetConfig {
    return {
        tier1Trigger: Math.floor(totalSummaryBudget * 0.6),
        tier2Trigger: Math.floor(totalSummaryBudget * 0.3),
        tier3Max: Math.floor(totalSummaryBudget * 0.1),
    }
}

/**
 * @deprecated Since v1.2.0. Replaced by direct threshold comparison in
 * opencode-acp (inject.ts): `if (tier1Tokens >= nudgeGrowthTokens) triggerTier = 2`.
 * Will be removed in v2.0.0.
 */
export function computeTierTrigger(
    usage: TierTokenUsage,
    config: TierBudgetConfig,
): TierTriggerResult {
    if (usage.tier1Tokens >= config.tier1Trigger) {
        return {
            tier: 1,
            shouldCompress: true,
            reason: `Tier 1 at ${usage.tier1Tokens}tok, trigger ${config.tier1Trigger}tok`,
        }
    }

    if (usage.tier2Tokens >= config.tier2Trigger) {
        return {
            tier: 2,
            shouldCompress: true,
            reason: `Tier 2 at ${usage.tier2Tokens}tok, trigger ${config.tier2Trigger}tok`,
        }
    }

    if (usage.tier3Tokens >= config.tier3Max) {
        return {
            tier: 3,
            shouldCompress: true,
            reason: `Tier 3 at ${usage.tier3Tokens}tok, max ${config.tier3Max}tok`,
        }
    }

    return {
        tier: null,
        shouldCompress: false,
        reason: `All tiers below triggers (T1=${usage.tier1Tokens}/${config.tier1Trigger}, T2=${usage.tier2Tokens}/${config.tier2Trigger}, T3=${usage.tier3Tokens}/${config.tier3Max})`,
    }
}
