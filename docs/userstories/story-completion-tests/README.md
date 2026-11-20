# Story Completion Tests

**Goal:** A user story that changes executable code is complete only when committed automated tests cover each of its acceptance criteria, so verification survives the session instead of living in scratch checks.

**Surfaces:** `AGENTS.md`, `.agents/rules/AGENTS.md` (byte-identical copy), `.agents/local-llm-guide.md`, `README.md`, `CLAUDE.md`, `tests/test_ask_local_llm.py` (new, written by a delegated implementer per `AGENTS.md`).

## Approval and execution

- Backlog: Pending approval.
- Execution mode: Not selected.
- Implementation: Not started.

## Confirmed decisions

- 2026-11-20: **Stories with executable code** (source code, scripts, tests) are complete only with committed automated tests mapped to their `US-xx / AC-xx` criteria (user: "también se creen los test asociadas a ellas").
- 2026-11-20: **Exemption (A):** stories that only change documentation, rules, or configuration keep reproducible structural or manual checks, recorded in the story file (user answer: "A").

## Assumptions (confirm or revise at approval)

- **A1 — Who writes the tests:** tests are code, so the delegated implementer writes them under the existing local-first hierarchy; the planner reviews them and runs them.
- **A2 — Mixed stories:** a story that changes both docs and executable code needs tests for its executable criteria; its doc-only criteria may use structural checks.
- **A3 — Where tests live:** in the project's existing test location and runner; when the project has none, the story names the location and runner it adds.
- **A4 — No retroactive relabeling:** the rule applies to stories completed from now on. US-02 adds tests only for the script behavior changed by the previous feature (`local-model-delegation-prompting`, `US-01 / AC-03`), whose check stayed in a scratch directory.

## Stories

### US-01 — Committed tests required to complete a code story

**Statement:** As the repository owner, I want every completed story that changes executable code to leave committed automated tests for its acceptance criteria, so that any later change can rerun the proof.

**Status:** pending. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | The QA Evidence and Traceability Contract in `AGENTS.md` states: a story that changes executable code is complete only when committed automated tests cover each of its executable criteria and pass; scratch-only checks do not count. | Readback. |
| `US-01 / AC-02` | The same contract keeps the exemption: stories (or criteria, per A2) that only change documentation, rules, or configuration use reproducible structural or manual checks, recorded explicitly. | Readback. |
| `US-01 / AC-03` | The verification mapping row for each executable criterion names the committed test file and test name; "Track each story" in Backlog Approval and Execution says complete requires them. | Readback. |
| `US-01 / AC-04` | Tests are written by the delegated implementer (A1); `.agents/local-llm-guide.md` says each story's code request is followed by, or includes, a test request for its criteria. | Readback. |
| `US-01 / AC-05` | `.agents/rules/AGENTS.md` is byte-identical to `AGENTS.md`, and `README.md` / `CLAUDE.md` summaries mention the rule. | `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` prints nothing; readback. |

### US-02 — Tests for `ask_local_llm.py` system message

**Statement:** As the repository owner, I want committed tests for the system-message behavior of `scripts/ask_local_llm.py`, so that the previous feature's script change follows the new rule.

**Status:** pending. **Dependencies:** `US-01`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-02 / AC-01` | `tests/test_ask_local_llm.py` (pytest, stdlib stub HTTP server, `tmp_path`, no real network) asserts the sent system message is `--system` text, then the instructions file, then the rules file, and that `reasoning_effort` is `"none"` without `--think`. | `python3 -m pytest tests/` passes. |
| `US-02 / AC-02` | A test asserts that a missing instructions file raises `SystemExit` with `Missing code generation instructions:` and sends no request. | Same run. |
| `US-02 / AC-03` | A test asserts `--code-out` saves the first fenced code block. | Same run. |
| `US-02 / AC-04` | `CLAUDE.md` and `README.md` stop saying the repository has no test suite and give the test command. | Readback. |

## Verification mapping

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01` to `US-02 / AC-04` | As listed in each story | Pending |

## Log

- 2026-11-20: Backlog drafted; exemption "A" confirmed by the user.
