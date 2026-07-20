# devlog

Each iteration lives in `devlog/{YYYY-MM-DD_short-title}/` and MUST contain at minimum:

- `REQ.md` — the requirement / ticket (filled BEFORE implementation)
- `WORKLOG.md` — what was done, why, and what changed (filled DURING and AFTER)

`DESIGN.md` is required only for changes that affect architecture, data flow,
or module boundaries (per AGENTS.md §5.1.2).

## Naming

Folder names mirror branch names: `YYYY-MM-DD_short-title` (kebab-case, date-prefixed).
Examples:

- `2026-07-20_initial-extraction`
- `2026-07-21_add-rouge-precision-v2`

## Why

- Future you (or an agent) can decompress the reasoning behind any change.
- PR review can reference the devlog instead of re-explaining context.
- Provides audit trail for license-provenance claims — every iteration
  records what was added/changed and why.
