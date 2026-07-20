import assert from "node:assert/strict"
import test from "node:test"

import {
    computeShouldNudge,
    resolveAdaptiveNudgeGrowth,
    defaultTriggerPolicy,
    registerTriggerPolicy,
} from "../src/trigger/default"
import type { NudgeDecisionInput } from "../src/trigger/types"

function makeInput(overrides: Partial<NudgeDecisionInput> = {}): NudgeDecisionInput {
    return {
        currentTokens: 50000,
        modelContextLimit: 200000,
        overMinLimit: false,
        overMaxLimit: false,
        lastNudgeTokens: 40000,
        minNudgeContextPercent: 15,
        nudgeGrowthTokens: 10000,
        ...overrides,
    }
}

test("computeShouldNudge: returns shouldNudge=false when currentTokens is undefined", () => {
    const r = computeShouldNudge(makeInput({ currentTokens: undefined }))
    assert.equal(r.shouldNudge, false)
    assert.equal(r.tipsVariant, null)
})

test("computeShouldNudge: returns shouldNudge=false when lastNudgeTokens is undefined", () => {
    const r = computeShouldNudge(makeInput({ lastNudgeTokens: undefined }))
    assert.equal(r.shouldNudge, false)
    assert.equal(r.tipsVariant, null)
})

test("computeShouldNudge: growth >= nudgeGrowthTokens triggers nudge (normal variant)", () => {
    const r = computeShouldNudge(
        makeInput({ currentTokens: 50000, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    assert.equal(r.shouldNudge, true)
    assert.equal(r.tipsVariant, "normal")
})

test("computeShouldNudge: growth exactly equal to threshold triggers nudge (>=)", () => {
    const r = computeShouldNudge(
        makeInput({ currentTokens: 50000, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    assert.equal(r.shouldNudge, true)
})

test("computeShouldNudge: growth one token below threshold does NOT trigger", () => {
    const r = computeShouldNudge(
        makeInput({ currentTokens: 49999, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    assert.equal(r.shouldNudge, false)
    assert.equal(r.tipsVariant, null)
})

test("computeShouldNudge: growth well below threshold does NOT trigger", () => {
    const r = computeShouldNudge(
        makeInput({ currentTokens: 42000, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    assert.equal(r.shouldNudge, false)
})

test("computeShouldNudge: negative growth (context shrank) does NOT trigger on growth axis", () => {
    const r = computeShouldNudge(
        makeInput({ currentTokens: 30000, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    assert.equal(r.shouldNudge, false)
})

test("computeShouldNudge: overMaxLimit triggers nudge even with zero growth", () => {
    const r = computeShouldNudge(
        makeInput({
            currentTokens: 40000,
            lastNudgeTokens: 40000,
            nudgeGrowthTokens: 10000,
            overMaxLimit: true,
        }),
    )
    assert.equal(r.shouldNudge, true)
    assert.equal(r.tipsVariant, "maxLimit")
})

test("computeShouldNudge: overMaxLimit triggers nudge even with negative growth", () => {
    const r = computeShouldNudge(
        makeInput({
            currentTokens: 30000,
            lastNudgeTokens: 40000,
            nudgeGrowthTokens: 10000,
            overMaxLimit: true,
        }),
    )
    assert.equal(r.shouldNudge, true)
    assert.equal(r.tipsVariant, "maxLimit")
})

test("computeShouldNudge: tipsVariant=maxLimit wins over minLimit when both true", () => {
    const r = computeShouldNudge(
        makeInput({
            currentTokens: 50000,
            lastNudgeTokens: 40000,
            nudgeGrowthTokens: 10000,
            overMinLimit: true,
            overMaxLimit: true,
        }),
    )
    assert.equal(r.tipsVariant, "maxLimit")
})

test("computeShouldNudge: tipsVariant=minLimit when overMinLimit only (growth triggers)", () => {
    const r = computeShouldNudge(
        makeInput({
            currentTokens: 50000,
            lastNudgeTokens: 40000,
            nudgeGrowthTokens: 10000,
            overMinLimit: true,
            overMaxLimit: false,
        }),
    )
    assert.equal(r.shouldNudge, true)
    assert.equal(r.tipsVariant, "minLimit")
})

test("computeShouldNudge: tipsVariant=normal when neither over min nor max", () => {
    const r = computeShouldNudge(
        makeInput({
            currentTokens: 50000,
            lastNudgeTokens: 40000,
            nudgeGrowthTokens: 10000,
            overMinLimit: false,
            overMaxLimit: false,
        }),
    )
    assert.equal(r.tipsVariant, "normal")
})

test("computeShouldNudge: overMaxLimit does NOT override undefined currentTokens guard", () => {
    const r = computeShouldNudge(
        makeInput({ currentTokens: undefined, overMaxLimit: true }),
    )
    assert.equal(r.shouldNudge, false)
    assert.equal(r.tipsVariant, null)
})

test("computeShouldNudge: overMaxLimit does NOT override undefined lastNudgeTokens guard", () => {
    const r = computeShouldNudge(
        makeInput({ lastNudgeTokens: undefined, overMaxLimit: true }),
    )
    assert.equal(r.shouldNudge, false)
    assert.equal(r.tipsVariant, null)
})

test("resolveAdaptiveNudgeGrowth: returns 6000 floor for undefined limit", () => {
    assert.equal(resolveAdaptiveNudgeGrowth(undefined), 6000)
})

test("resolveAdaptiveNudgeGrowth: returns 6000 floor for zero", () => {
    assert.equal(resolveAdaptiveNudgeGrowth(0), 6000)
})

test("resolveAdaptiveNudgeGrowth: returns 6000 floor for negative", () => {
    assert.equal(resolveAdaptiveNudgeGrowth(-100000), 6000)
})

test("resolveAdaptiveNudgeGrowth: returns 6000 floor when 5% would be below floor", () => {
    // 100000 * 0.05 = 5000 < 6000 floor
    assert.equal(resolveAdaptiveNudgeGrowth(100000), 6000)
    // 120000 * 0.05 = 6000 = floor (boundary)
    assert.equal(resolveAdaptiveNudgeGrowth(120000), 6000)
})

test("resolveAdaptiveNudgeGrowth: returns 5% of limit for typical values", () => {
    // 200000 * 0.05 = 10000
    assert.equal(resolveAdaptiveNudgeGrowth(200000), 10000)
    // 500000 * 0.05 = 25000
    assert.equal(resolveAdaptiveNudgeGrowth(500000), 25000)
})

test("resolveAdaptiveNudgeGrowth: returns 50000 cap for very large limits", () => {
    // 1000000 * 0.05 = 50000 = cap (boundary)
    assert.equal(resolveAdaptiveNudgeGrowth(1000000), 50000)
    // 2000000 * 0.05 = 100000 > 50000 cap
    assert.equal(resolveAdaptiveNudgeGrowth(2000000), 50000)
})

test("resolveAdaptiveNudgeGrowth: rounds 5% to nearest integer", () => {
    // 200001 * 0.05 = 10000.05 → round → 10000
    assert.equal(resolveAdaptiveNudgeGrowth(200001), 10000)
    // 200010 * 0.05 = 10000.5 → round → 10001 (JS Math.round rounds .5 toward +inf)
    assert.equal(resolveAdaptiveNudgeGrowth(200010), 10001)
})

test("defaultTriggerPolicy: name is stable identifier", () => {
    assert.equal(defaultTriggerPolicy.name, "context-compress-algorithms-trigger")
})

test("defaultTriggerPolicy: version is non-empty string", () => {
    assert.equal(typeof defaultTriggerPolicy.version, "string")
    assert.ok(defaultTriggerPolicy.version.length > 0)
})

test("defaultTriggerPolicy: description is non-empty", () => {
    assert.ok(defaultTriggerPolicy.description.length > 0)
})

test("defaultTriggerPolicy: exposes computeShouldNudge and resolveAdaptiveNudgeGrowth", () => {
    assert.equal(typeof defaultTriggerPolicy.computeShouldNudge, "function")
    assert.equal(typeof defaultTriggerPolicy.resolveAdaptiveNudgeGrowth, "function")
})

test("defaultTriggerPolicy: methods behave same as standalone exports", () => {
    const viaPolicy = defaultTriggerPolicy.computeShouldNudge(
        makeInput({ currentTokens: 50000, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    const direct = computeShouldNudge(
        makeInput({ currentTokens: 50000, lastNudgeTokens: 40000, nudgeGrowthTokens: 10000 }),
    )
    assert.deepEqual(viaPolicy, direct)
})

test("registerTriggerPolicy: invokes host register with defaultTriggerPolicy", () => {
    const registered: unknown[] = []
    registerTriggerPolicy((p) => registered.push(p))
    assert.equal(registered.length, 1)
    assert.equal(registered[0], defaultTriggerPolicy)
})
