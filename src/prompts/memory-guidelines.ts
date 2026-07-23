/**
 * Memory guidelines — the single source of truth for WHEN to record a memory
 * and WHAT belongs in one.
 *
 * Used in:
 * - system.ts (system prompt) — prefix-cached, always present
 * - inject.ts (compress-time nudge) — appended to the compress reminder so the
 *   model records critical memories BEFORE compressing a range
 *
 * Memory is a standalone protected tool: its tool-call messages survive all
 * compression (hard-excluded from compress ranges, like protected tool outputs).
 * Memories are persistent by default — only an explicit forget clears them.
 */
export const MEMORY_GUIDELINES = `HOW TO USE MEMORY

The \`memory\` tool records facts that must survive for the rest of the task, even after compression. Memories are permanent — compression cannot remove them, and only an explicit forget (model-initiated or user via command) clears them. Record sparingly: each memory consumes context forever until forgotten.

RECORD a memory when the content is:
- A user-stated constraint, priority, or acceptance criterion that changes the task if lost ("never use \`as any\`", "must support Node 22", "ship before Friday").
- An irreversible decision and its rationale ("chose X over Y because Z" — the "because" is load-bearing).
- A load-bearing exact value: version, threshold, config key, credential-like string, magic number.
- The user's overall goal or a pivot in it ("initially: fix bug X → pivoted to: refactor module Y").
- A hard constraint discovered mid-task that earlier work would violate if forgotten.

DO NOT RECORD:
- Findings you can reconstruct by re-reading a file or re-running a command.
- Transient state (current todo, in-progress step, what you just tried).
- Routine tool output, file contents, or exploration results — those go in compress summaries.
- Anything already captured in a compression summary unless it meets the "changes the task if lost" bar.
- Duplicates of an existing memory — update or consolidate instead.

CONTENT GUIDANCE:
- Lead with the load-bearing fact, then the reason it matters. One memory = one fact (or one tightly-coupled set).
- Quote short user statements verbatim when they encode a constraint; mark them as quotes ("User said: ...").
- Include exact values, paths, signatures — never paraphrase a value that must be grepped later.
- A good memory reads as a single dense bullet a future reader (or you, after decompress) can act on without context.

COMPRESSION INTERACTION:
- Before compressing a range, scan it for content that meets the RECORD bar above. Record those with \`memory\` FIRST, then compress. Once compressed, the raw content is gone — a memory recorded after compression can only paraphrase the summary, losing fidelity.
- Memories you record are protected: they survive the compression that follows. Do not hesitate to record before compressing out of fear of losing the memory — that is exactly what they are for.
- If several memories cover related ground, consider consolidating them into one and forgetting the rest, rather than accumulating near-duplicates.`
