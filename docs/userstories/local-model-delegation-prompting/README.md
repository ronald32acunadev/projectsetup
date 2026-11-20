# Local Model Delegation Prompting

**Goal:** Every delegated implementer (local model first, lightweight hosted model as fallback) receives a fixed set of code-generation best practices, the hosted fallback runs at high reasoning effort, and delegation covers creating and editing code, not only writing new code.

**Surfaces:** `AGENTS.md`, `.agents/rules/AGENTS.md` (byte-identical copy), `CLAUDE.md`, `README.md`, `.agents/local-llm-guide.md`, `.agents/code-generation-instructions.md` (new), `scripts/ask_local_llm.py` (changed by a delegated implementer per `AGENTS.md`), `.agents/global-skills/pumba-projectsetup/SKILL.md`.

## Approval and execution

- Backlog: Approved 2026-11-20.
- Execution mode: All stories.
- Implementation: Complete (script change by local model `zai-org/glm-4.7-flash` via `scripts/ask_local_llm.py`; see Log).

## Confirmed decisions

- 2026-11-20: **Scope of "creation and editing" is both (C):** the delegated model also writes edits to existing code (including mechanical edits now owned by the planner), and a hosted implementer that has file tools creates and edits files on disk directly instead of returning code for the planner to apply (user answer: "C").
- 2026-11-20: **Hosted fallback:** when no local model is available, use the lightest model the current agent offers, with reasoning effort set to high.

## Assumptions (confirm or revise at approval)

- **A1 — Separate instructions file:** the best practices live in a new `.agents/code-generation-instructions.md`, separate from `.agents/local-llm-prompt-rules.md`. The rules file stays a short list learned from rejected answers (under 300 words); the new file holds stable, general guidance. Both are sent in the system message of every request.
- **A2 — No hardcoded model names:** rules say "the lightest model the client offers" and "reasoning effort high where the client supports it". Client-specific mechanics (for Claude Code: the Agent tool's `model` and `effort` parameters) go in `CLAUDE.md`, still without naming a model ID.
- **A3 — Local models stay tool-less:** local models have no filesystem access, so for edits they return exact replacement blocks (path, anchor lines before and after, new content) that the planner applies verbatim. Only hosted implementers with file tools write to disk.
- **A4 — Review is unchanged:** the planner still reviews every change (diff) and runs the acceptance checks, whoever wrote it.

## Stories

### US-01 — Code-generation instructions in every request

**Statement:** As the repository owner, I want every delegated code request to carry a fixed set of best practices for generating code, so that local and lightweight models produce complete, correct code on the first answer.

**Status:** complete. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | `.agents/code-generation-instructions.md` exists, is in English, and covers: understand before writing, match existing style and APIs, smallest change that meets the criteria, complete code (no placeholders, `TODO`, or elided sections), explicit error handling, no invented APIs or imports, and a self-check against the task's criteria before answering. It fits the system-message budget of `.agents/local-llm-guide.md` together with the rules file (budget raised from 500 to 900 tokens; see Log). | Readback; word count. |
| `US-01 / AC-02` | `AGENTS.md` (Workflow step 3 and the Prompt Template) and `.agents/local-llm-guide.md` (request structure) require pasting that file into the system message of every code request, local or hosted. | Readback. |
| `US-01 / AC-03` | `scripts/ask_local_llm.py` prepends the instructions file and then the rules file to the system message; existing options and behavior are unchanged. A missing instructions file fails with a clear error instead of sending a partial prompt. | Script test in a scratch directory with a stub HTTP server: inspect the sent payload; run with the file removed; compare existing options' output against the base commit. |

### US-02 — Lightweight hosted fallback at high effort

**Statement:** As the repository owner, I want the fallback implementer to be the lightest model available in the current agent running at high reasoning effort, so that code stays cheap when local models are down but quality does not drop.

**Status:** complete. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-02 / AC-01` | `AGENTS.md` fallback section says: select the lightest model the client offers, set reasoning effort to high through the client's supported mechanism, and report the selected model and effort, or the inability to set or verify them. No model IDs are named. | Readback; `grep` for model names. |
| `US-02 / AC-02` | `CLAUDE.md` states how Claude Code applies it: delegate through the Agent tool with the lightest available `model` value and `effort: "high"`. | Readback. |
| `US-02 / AC-03` | The existing rule is kept: if no lightweight model can be invoked, ask the user instead of silently using the planner. | Readback. |

### US-03 — Delegated edits to existing code

**Statement:** As the repository owner, I want the delegated implementer to write edits to existing code as well as new code, so that the expensive planner does not write code through edits.

**Status:** complete. **Dependencies:** `US-01`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-03 / AC-01` | "What Local Models Write" in `AGENTS.md` covers creating and editing source code, tests, and scripts, including mechanical code edits; mechanical edits are removed from the planner's list, except edits to docs and config. | Readback. |
| `US-03 / AC-02` | `AGENTS.md` and `.agents/local-llm-guide.md` define the edit request and answer format for local models: target path, verbatim anchor lines before and after, and the exact replacement block; the planner applies it verbatim and rejects blocks whose anchors do not match. | Readback. |

### US-04 — Hosted implementer writes files directly

**Statement:** As the repository owner, I want a hosted implementer that has file tools to create and edit files on disk itself, so that the planner only prepares context, reviews the diff, and runs checks.

**Status:** complete. **Dependencies:** `US-02`, `US-03`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-04 / AC-01` | `AGENTS.md` says a hosted implementer with file tools receives the same prompt plus an explicit list of allowed files, creates and edits only those files, and reports the changed paths. | Readback. |
| `US-04 / AC-02` | The planner reviews the resulting diff against the story and Library Context Brief, rejects changes outside the allowed files, and runs the acceptance checks (A4). | Readback. |

### US-05 — Keep copies and summaries in sync

**Statement:** As the repository owner, I want every copy and summary of the rules updated in the same commit, so that no agent reads stale delegation rules.

**Status:** complete. **Dependencies:** `US-01` to `US-04`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-05 / AC-01` | `.agents/rules/AGENTS.md` is byte-identical to `AGENTS.md`. | `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` prints nothing. |
| `US-05 / AC-02` | `README.md` (roles row and delegation diagram), `CLAUDE.md`, and the `pumba-projectsetup` skill mention the new instructions file, the high-effort fallback, and delegated edits. | Readback. |

## Verification mapping

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01` | Readback; `wc -w` | Passed: all listed topics present; instructions 230 words + rules 330 words (~750 tokens, within the 900-token budget). |
| `US-01 / AC-02` | Readback of `AGENTS.md` Workflow step 3, Prompt Template, and guide request structure | Passed. |
| `US-01 / AC-03` | Stub HTTP server driving `main()` in a scratch directory (`--system`, `--code-out`) | RED before change: `has_instructions False`. GREEN after: `starts_extra True has_instructions True has_rules True order_ok True`, `reasoning none`, code block saved, `rc 0`. Instructions file removed in a scratch copy: `SystemExit: Missing code generation instructions: <path>` before any request. |
| `US-02 / AC-01` to `AC-03` | Readback; `grep` for model names in `AGENTS.md`, `CLAUDE.md`, instructions | Passed: no model IDs added (pre-existing `"gpt-4o"` alias example untouched); user-decision rule kept. |
| `US-03 / AC-01`, `AC-02` | Readback of `AGENTS.md` and `.agents/local-llm-guide.md` | Passed. |
| `US-04 / AC-01`, `AC-02` | Readback of `AGENTS.md` fallback section | Passed. |
| `US-05 / AC-01` | `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` | Passed: no output. |
| `US-05 / AC-02` | Readback of `README.md`, `CLAUDE.md`, `pumba-projectsetup` skill | Passed. |

## Log

- 2026-11-20: Backlog drafted; scope "C" confirmed by the user.
- 2026-11-20: Approved, all stories. Pending work on `feature/global-skill-installer` committed and pushed first.
- 2026-11-20: `scripts/ask_local_llm.py` change generated by the local model in one request (17 s) and accepted unchanged after review.
- 2026-11-20: The guide's 500-token system-message budget was already exceeded by the rules file alone (330 words); raised it to 900 tokens and lowered the answer reserve to 15,600 instead of trimming either file.
- 2026-11-20: Installed global skills are not refreshed by this change; rerun `sh scripts/install_skills.sh` to update them.
