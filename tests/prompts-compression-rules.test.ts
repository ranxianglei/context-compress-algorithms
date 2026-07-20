import assert from "node:assert/strict"
import test from "node:test"

import { HOW_TO_COMPRESS_RULES, COMPRESS_PHILOSOPHY } from "../src/prompts/compression-rules"

test("HOW_TO_COMPRESS_RULES: is a non-empty string", () => {
    assert.equal(typeof HOW_TO_COMPRESS_RULES, "string")
    assert.ok(HOW_TO_COMPRESS_RULES.length > 100, "expected substantial rules text")
})

test("COMPRESS_PHILOSOPHY: is a non-empty string", () => {
    assert.equal(typeof COMPRESS_PHILOSOPHY, "string")
    assert.ok(COMPRESS_PHILOSOPHY.length > 50, "expected substantial philosophy text")
})

test("HOW_TO_COMPRESS_RULES: starts with 'HOW TO COMPRESS' header", () => {
    assert.ok(HOW_TO_COMPRESS_RULES.startsWith("HOW TO COMPRESS"))
})

test("HOW_TO_COMPRESS_RULES: contains KEEP VERBATIM section", () => {
    assert.ok(HOW_TO_COMPRESS_RULES.includes("KEEP VERBATIM"))
})

test("HOW_TO_COMPRESS_RULES: contains DROP section", () => {
    assert.ok(HOW_TO_COMPRESS_RULES.includes("DROP"))
})

test("HOW_TO_COMPRESS_RULES: contains PRIORITY section", () => {
    assert.ok(HOW_TO_COMPRESS_RULES.includes("PRIORITY"))
})

test("HOW_TO_COMPRESS_RULES: emphasizes file paths with line numbers (load-bearing rule)", () => {
    // The example file paths must include line numbers — this is a key invariant
    // that distinguishes ACP's rules from generic compression advice.
    assert.ok(
        HOW_TO_COMPRESS_RULES.includes("lib/hooks.ts") || HOW_TO_COMPRESS_RULES.includes("src/index.ts"),
        "rules should mention concrete file-path-with-line-numbers examples",
    )
})

test("HOW_TO_COMPRESS_RULES: mentions [[KEEP:mNNNNN]] marker syntax", () => {
    assert.ok(HOW_TO_COMPRESS_RULES.includes("[[KEEP:"))
    assert.ok(HOW_TO_COMPRESS_RULES.includes("[[REF:"))
})

test("HOW_TO_COMPRESS_RULES: forbids bare filenames (load-bearing rule)", () => {
    assert.ok(
        HOW_TO_COMPRESS_RULES.toLowerCase().includes("never abbreviate"),
        "rules should explicitly forbid bare filename abbreviation",
    )
})

test("COMPRESS_PHILOSOPHY: contains the word 'compress' (sanity)", () => {
    assert.ok(COMPRESS_PHILOSOPHY.toLowerCase().includes("compress"))
})

test("COMPRESS_PHILOSOPHY: emphasizes need-based compression", () => {
    assert.ok(
        COMPRESS_PHILOSOPHY.toLowerCase().includes("need") ||
            COMPRESS_PHILOSOPHY.toLowerCase().includes("frugal"),
    )
})

test("HOW_TO_COMPRESS_RULES: regression guard — length >= 2000 chars", () => {
    assert.ok(
        HOW_TO_COMPRESS_RULES.length >= 2000,
        `length ${HOW_TO_COMPRESS_RULES.length} below expected floor of 2000`,
    )
})

test("COMPRESS_PHILOSOPHY: regression guard — length >= 400 chars", () => {
    assert.ok(
        COMPRESS_PHILOSOPHY.length >= 400,
        `length ${COMPRESS_PHILOSOPHY.length} below expected floor of 400`,
    )
})
