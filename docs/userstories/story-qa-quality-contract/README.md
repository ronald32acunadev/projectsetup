# Story and QA Quality Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for approved inline documentation execution. This file is the canonical backlog and execution record; do not create a competing plan or tracker.

**Goal:** Make story quality and change-related QA evidence explicitly reviewable and proportional to risk.

**Architecture:** Extend the canonical agent-neutral instructions and their byte-identical mirror, keeping the root README summary consistent. Carry the QA contract into the existing local-model handoff guide rather than introducing a new agent, framework, or validator.

**Tech Stack:** Markdown documentation and existing Git readback checks; no runtime or library changes.

**Spec:** [Approved design](../../superpowers/specs/2026-10-28-story-qa-quality-contract-design.md).

## Approval and execution

- Design: approved on 2026-10-28 ("Si por favor").
- Backlog: approved on 2026-10-28 ("Dale lo apruebo ejecuta todas por favor").
- Execution mode: all stories, in dependency order.
- Implementation: US-01 and US-02 complete by observed acceptance checks on `codex/story-qa-quality-contract`. Native review remains unavailable for the isolated feature candidate; no native approval is claimed.
- Preserve existing uncommitted edits. No commit, push, or active-rule edit is authorized by this plan alone.

## Global constraints

- English artifacts; concise user-facing explanations in the user's language.
- Preserve local-first source and test synthesis and the Library Context Brief requirements.
- Do not invent requirements, fixed test quotas, coverage targets, or a new framework.
- Do not relabel unrelated historical tests or duplicate story trackers.
- Keep small changes concise and expand analysis only for relevant behavior and risks.
- Passive documentation verification uses structural and scenario-based readback, not fabricated automated RED/GREEN evidence.

## File responsibilities and allowed implementation surfaces

| File | Responsibility | Stories |
| --- | --- | --- |
| `AGENTS.md` | Canonical story, QA, completion, and handoff contract | US-01, US-02 |
| `.agents/rules/AGENTS.md` | Byte-identical mirror of canonical rules | US-01, US-02 |
| `README.md` | Accurate scoped summary of rules and file-first backlog workflow | US-01, US-02 |
| `.agents/local-llm-guide.md` | Carry approved criteria, verification intent, and regression risks into code/test prompts | US-02 |
| `docs/userstories/story-qa-quality-contract/README.md` | This backlog, acceptance mapping, and observed execution evidence | US-01, US-02 |

No scripts, application code, provider configuration, prompt-rules file, or unrelated skill files are included. The design file is retained as approved context. Any additional necessary surface requires a scope revision before editing it.

## Stories

### US-01 — Define implementation-ready stories

**Statement:** As a developer using this setup, I want stories with explicit value, scope, and observable acceptance criteria so that implementation can proceed without silently inventing behavior.

**Status:** complete. **Dependencies:** approved design and backlog. **Route:** inline documentation.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| AC-01 | Instructions require stable story IDs, actor/goal/value, independently verifiable outcomes, relevant rules, scope, dependencies, and material unresolved assumptions. | V-01 structural readback of both rule files and README summary. |
| AC-02 | Criteria have story-scoped IDs and observable conditions, event/action, and expected result; Given/When/Then is optional. Failure/boundary behavior comes from requested or confirmed rules, not invention. | V-02 scenario readback: a small requested display correction needs one concise story, no invented performance or security target. |
| AC-03 | The existing backlog approval, file-first presentation, scope-revision policy, execution modes, and proportionate documentation remain intact. | V-03 inspect affected sections and remove the README's conflicting claim that small backlogs stay only in chat. |

**Implementation steps:**
- [x] Re-read approved design and current allowed files; preserve existing user edits and identify only contract-related changes.
- [x] Extend the backlog instructions in `AGENTS.md` with readiness and criterion rules, then synchronize `.agents/rules/AGENTS.md` exactly.
- [x] Update only the related README workflow summary, including the existing file-first backlog requirement; follow the project update-readme skill for scoped edits.
- [x] Perform V-01 through V-03 and `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` (expected exit 0 and no output).
- [x] Record observed evidence and status here. In one-at-a-time mode, stop before US-02.

### US-02 — Link QA evidence to criteria and change risks

**Statement:** As a developer using this setup, I want verification derived from approved criteria and change-related risks so that completion proves requested behavior instead of merely producing passing tests.

**Status:** complete. **Dependencies:** US-01. **Route:** inline documentation; shared rule files make parallel writers inappropriate.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| AC-01 | Instructions and local-model prompts carry story/criterion references, applicable inputs/preconditions, expected observable effects, and justified regression risks. New or changed tests map to criteria or explicit change-related risks. | V-04 read back canonical rules and local-model guide together; confirm source/test authorship and library-context rules remain unchanged. |
| AC-02 | QA selects relevant successful, negative, boundary, and regression scenarios and appropriate verification levels, with deterministic isolation and applicable test-first discipline; specialized checks are risk-driven, not mandatory quotas. | V-05 illustrative rule: rejected input leaves stored state unchanged when that is an approved rule. Check that the contract demands evidence for the rejection and unchanged state, without adding a new business rule. |
| AC-03 | The existing story file maps every criterion to named automated checks or reproducible manual procedures and observed results. Missing, failed, skipped, or blocked proof cannot be reported as completed acceptance. | V-06 scenario readback: a criterion without a check is a gap; a mapped but unexecuted test stays pending, not passed. |
| AC-04 | Relevant regression checks may map to a change risk rather than a new criterion; unrelated new tests need justification, while historical tests and supporting helpers need no retroactive labeling. | V-07 scenario readback: preserve existing sibling behavior through a justified regression check; flag an unrelated feature test as outside scope. |
| AC-05 | Scope changes revise affected criteria and verification while retaining still-valid completed evidence. README and both instruction copies describe the same contract without a separate tracker. | V-08 readback using an illustrative changed criterion; confirm unaffected mappings remain valid and revised scope still requires approval. |

**Implementation steps:**
- [x] Add the QA, traceability, and completion contract and compact mapping format to `AGENTS.md`; extend its existing handoff template, then synchronize the mirror.
- [x] Update `.agents/local-llm-guide.md` to carry verification intent and references into both implementation and test-generation requests. Do not require preexisting test code before requesting tests.
- [x] Summarize the QA contract in the scoped README sections without duplicating the full rules.
- [x] Run V-04 through V-08 as documented scenario-based readback and record actual conclusions, not expected results as if executed.
- [x] Run the mirror comparison and `git diff --check` (expected exit 0). Review the scoped diff for preserved approval, provider hierarchy, and library-context rules. Distinguish preexisting problems from newly introduced ones.
- [x] Update this file's story states and evidence; report any failed, unavailable, skipped, or pending check.

## Review focus

| Failure mode | Owning verification |
| --- | --- |
| Simple changes acquire unnecessary paperwork or invented targets | V-02 |
| A test passes while required error/state effects remain unchecked | V-05 |
| A criterion or execution result is missing but completion is claimed | V-06 |
| Traceability excludes valid regressions or expands unrelated test scope | V-07 |
| A scope revision erases still-valid evidence or bypasses approval | V-08 |

## Verification evidence

| Check | Observed result |
| --- | --- |
| Planning coverage review | Both stories cover the approved story, QA, traceability, completion, proportionality, and preservation constraints. Dependencies are sequential; no new executable tooling is planned. |
| Existing instruction inspection | `CLAUDE.md` requires canonical and mirror byte identity and a same-change README summary. README currently says small backlogs stay in conversation, conflicting with the canonical file-first rule; US-01 covers this directly related inconsistency. |
| V-01 | Passed: canonical readiness contract and README define stable IDs, value, scope, rules, dependencies, and behavior-changing assumptions; mirror comparison returned exit 0. |
| V-02 | Passed by scenario readback: a display correction can use one concise story with one observable criterion; the contract explicitly prohibits invented targets and fixed quotas. |
| V-03 | Passed: original approval and both execution modes remain; README now points small backlogs to the same story file instead of chat-only storage. |
| V-04 | Passed: both prompt templates carry criterion references, preconditions, effects, regression risks, and runner context; the local guide distinguishes implementation from test generation. |
| V-05 | Passed by independent scenario readback: approved rejection behavior requires both rejection evidence and unchanged state, not only mock calls; specialized checks remain risk-driven. |
| V-06 | Passed by independent scenario readback: a missing check is a gap and an unexecuted mapped check stays pending. |
| V-07 | Passed by independent scenario readback: a sibling-behavior check may reference a shared-code regression risk; unrelated additions are outside scope, historical tests/helpers need no relabeling. |
| V-08 | Passed by independent scenario readback: revised criteria reopen invalidated work without erasing valid evidence; approval still applies. |
| Final structural checks | `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` and `git diff --check`: exit 0, no diagnostics. |
| Independent verification | `quality_contract_verify`: PASS for all eight acceptance criteria, no change-caused blockers. Compared all four instruction/document files against pre-edit copies, preserving approval modes, provider hierarchy, and library-context requirements. |
| Automated application tests | Not applicable: no source, runtime, dependencies, or executable tests changed; approved structural and scenario-based verification used instead of invented RED/GREEN. |
| Native assessment/review | Mode on. Assessment returned high/unassessable because the new backlog needs explicit inventory selection. Preflight succeeded after sandbox escalation but returned a selection step and a workspace candidate including unrelated preexisting edits. START was not invoked; no native approval or receipt exists. Kept this limitation separate from passed acceptance checks. |
| Engram mirror | Unavailable: save rejected with `unknown_project` / project not backed by known context. Local backlog is the durable record. |

## Log

- 2026-10-28: User selected "Definir un contrato de calidad verificable" and approved preparing the backlog after reviewing the design. Neither story execution nor execution mode has been approved.
- Existing worktree has unrelated and overlapping user edits. Preserve them; do not blanket-stage or commit them.
- The design resides in an ignored `docs/superpowers/specs/` directory. Do not alter ignore policy or force-stage it without authorization; it remains available locally and linked here.
- Engram previously rejected writes because the detected project lacked backed session context. Local documents are the recovery source until persistence is confirmed.
- 2026-10-28: User approved all stories: "Dale lo apruebo ejecuta todas por favor". US-01 implemented and V-01–V-03 read back. No runnable RED is meaningful for these instruction-only changes; structural and scenario checks apply as approved.
- 2026-10-28: Created local feature branch after sandbox approval; protected `.agents/` synchronization required an escalated copy. No commits or remote operations performed.

- 2026-10-28: US-02 implemented; independent verifier passed every criterion and V-01–V-08. Final mirror and whitespace checks passed. No commits, push, or remote actions performed.
- Risk: item 3 (reusable mirrored agent instruction contracts). Independent verification passed; native review remains pending because the offered candidate mixes preexisting user changes. No review receipt was fabricated and no user-owned review switch was changed.
