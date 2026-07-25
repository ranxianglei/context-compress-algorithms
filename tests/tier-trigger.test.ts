import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
    computeTierTrigger,
    computeTierBudgets,
} from "../src/trigger/tier.ts"
import type { TierTokenUsage, TierBudgetConfig } from "../src/trigger/tier.ts"

describe("computeTierBudgets", () => {
    it("splits 100K budget into 60K/30K/10K", () => {
        const config = computeTierBudgets(100_000)
        assert.equal(config.tier1Trigger, 60_000)
        assert.equal(config.tier2Trigger, 30_000)
        assert.equal(config.tier3Max, 10_000)
    })

    it("floors fractional results", () => {
        const config = computeTierBudgets(95_000)
        assert.equal(config.tier1Trigger, 57_000)
        assert.equal(config.tier2Trigger, 28_500)
        assert.equal(config.tier3Max, 9_500)
    })
})

describe("computeTierTrigger", () => {
    const config: TierBudgetConfig = {
        tier1Trigger: 60_000,
        tier2Trigger: 30_000,
        tier3Max: 10_000,
    }

    it("returns tier 1 when tier1Tokens exceeds trigger", () => {
        const usage: TierTokenUsage = { tier1Tokens: 65_000, tier2Tokens: 0, tier3Tokens: 0 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, 1)
        assert.equal(result.shouldCompress, true)
        assert.match(result.reason, /Tier 1 at 65000/)
    })

    it("returns tier 2 when tier1 is fine but tier2 exceeds trigger", () => {
        const usage: TierTokenUsage = { tier1Tokens: 30_000, tier2Tokens: 35_000, tier3Tokens: 0 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, 2)
        assert.equal(result.shouldCompress, true)
        assert.match(result.reason, /Tier 2 at 35000/)
    })

    it("returns tier 3 when tier1 and tier2 are fine but tier3 exceeds max", () => {
        const usage: TierTokenUsage = { tier1Tokens: 10_000, tier2Tokens: 5_000, tier3Tokens: 11_000 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, 3)
        assert.equal(result.shouldCompress, true)
        assert.match(result.reason, /Tier 3 at 11000/)
    })

    it("returns null when all tiers are below thresholds", () => {
        const usage: TierTokenUsage = { tier1Tokens: 10_000, tier2Tokens: 5_000, tier3Tokens: 1_000 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, null)
        assert.equal(result.shouldCompress, false)
    })

    it("prioritizes tier 1 over tier 2 when both exceed", () => {
        const usage: TierTokenUsage = { tier1Tokens: 70_000, tier2Tokens: 40_000, tier3Tokens: 0 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, 1)
    })

    it("triggers at exact threshold boundary (>=)", () => {
        const usage: TierTokenUsage = { tier1Tokens: 60_000, tier2Tokens: 0, tier3Tokens: 0 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, 1)
        assert.equal(result.shouldCompress, true)
    })

    it("does not trigger one below boundary", () => {
        const usage: TierTokenUsage = { tier1Tokens: 59_999, tier2Tokens: 0, tier3Tokens: 0 }
        const result = computeTierTrigger(usage, config)
        assert.equal(result.tier, null)
        assert.equal(result.shouldCompress, false)
    })
})
