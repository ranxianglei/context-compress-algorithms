# WORKLOG: Release cc-alg v1.2.0

## Steps

1. ✅ Marked `computeTierBudgets`/`computeTierTrigger` as `@deprecated` with JSDoc
2. ✅ Updated TIER2_DISTILL_RULES: keep function/module refs + source header format
3. ✅ Updated TIER3_CONDENSE_RULES: source header format
4. ✅ Bumped version: `1.2.0-dev.1` → `1.2.0`
5. ✅ Updated README: new exports + changelog
6. ✅ Typecheck + build + tests pass
7. ⬜ Commit, push, create PR
8. ⬜ Human merge
9. ⬜ Manual npm publish (no release.yml in cc-alg)
10. ⬜ Verify `npm view context-compress-algorithms version` = 1.2.0

## Test Results

- Typecheck: PASS
- Build: PASS (tsup, 49ms)
- Tests: 9 pass, 0 fail
