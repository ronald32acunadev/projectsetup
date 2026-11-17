# Update README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for approved inline documentation execution. This file is the canonical backlog and execution record; do not create a competing plan or tracker.

**Goal:** Rebuild and modernize `README.md` following Project Archetype D (Bootstrap Template / Agent Rules Repository) based strictly on codebase facts, incorporating the Story and QA Quality Contract, local-first model delegation, cache-aside documentation, and skill integration.

**Architecture:** Archetype D Bootstrap Template documentation conforming to `AGENTS.md`, `CLAUDE.md`, `.agents/skills/update-readme/SKILL.md`, and `references/archetypes-and-checklists.md`.

**Tech Stack:** Markdown documentation; zero external runtime dependencies.

## Approval and execution

- Backlog: Approved 2026-11-17.
- Execution mode: All stories.
- Implementation: Complete.

## Global constraints

- All documentation in English (`AGENTS.md` language rule).
- Cognitive load principles: recognition over recall, concise tables for configuration/flags, copy-paste ready commands.
- Zero hallucination: all scripts, paths, command line flags, and MCP servers must be proven by files in this repository.
- Verification via structural readback and command checks; no invented RED/GREEN test runs.

## File responsibilities and allowed implementation surfaces

| File | Responsibility | Stories |
| --- | --- | --- |
| `README.md` | Primary project documentation, quick start, architecture pillars, delegation rules, and reference | `US-01` |
| `docs/userstories/update-readme/README.md` | This backlog, criteria, QA mapping, and verification evidence | `US-01` |

## Stories

### US-01 — Rebuild repository README from codebase facts and Archetype D

**Statement:** As a developer or agent adopting this template, I want a comprehensive and fully verified `README.md` based strictly on codebase facts, so that I can understand, bootstrap, configure, and maintain this setup template without encountering outdated or hallucinated instructions.

**Status:** complete. **Dependencies:** none. **Route:** inline documentation.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | **Archetype D Structure**: `README.md` contains, in this order: Title and Overview; Quick Start (copying the template into a project, sync check); Included Assets and Directory Structure; Skills and Commands; Core Rules and Workflow (Backlog Approval, execution modes, Story Readiness and QA Evidence contracts); Local-Model Code Delegation (MCP providers, prompt rules, fallback script); Library Docs Cache (`.context/`) and Engram; Sync Invariant and Verification; Troubleshooting (only failure cases proven by script messages or rules); Contributing. No badges or License section, because the repository has no manifest or `LICENSE` file. | Structural readback against the Archetype D blueprint (`.agents/skills/update-readme/references/archetypes-and-checklists.md`). |
| `US-01 / AC-02` | **Zero Hallucinated Commands**: Documented scripts (`scripts/ask_local_llm.py`, `scripts/configure_ollama_models.sh`), flags, paths (`.agents/rules/AGENTS.md`, `.opencode/commands/update-readme.md`), and MCP configurations (`pumbastudio` on 1234, `pumbalama` on 11434) match actual repository files. | Automated verification checking that every referenced file path exists on disk. |
| `US-01 / AC-03` | **Accurate Workflow & Quality Contract**: Reflects the mandatory Backlog Approval workflow, file-first user story backlog path (`docs/userstories/{featurename}/README.md`), Story Readiness Contract, and QA Evidence/Traceability Contract established in `AGENTS.md`. | Semantic review against canonical `AGENTS.md`. |
| `US-01 / AC-04` | **Format and Link Integrity**: Every fenced code block has a language tag, and every relative link points to an existing file. `scripts/configure_ollama_models.sh` is described as owner-specific because it hardcodes `/run/media/pumba/DataBases/Models/Ollama`. | Shell check that lists fenced blocks without a language tag and relative links whose target is missing; expected output is empty. The repository has no Markdown linter. |

**Implementation steps:**
- [x] Inspect HEAD `README.md` and codebase ground truth (`AGENTS.md`, `CLAUDE.md`, `scripts/`, `.agents/`, `.opencode/`).
- [x] Draft modernized `README.md` incorporating the latest Story & QA Quality Contract, file-first backlogs, and dynamic local LLM hierarchy.
- [x] Verify all file links, scripts, flags, and paths against disk.
- [x] Run structural verification checks and record evidence in this document.

## QA evidence and traceability mapping

| Story / criterion or change-related regression risk | Test file and test name, or reproducible manual procedure | Observed result and evidence |
| --- | --- | --- |
| `US-01 / AC-01` | Structural review against Archetype D blueprint in `references/archetypes-and-checklists.md` | Passed: all AC-01 sections are present in the listed order; no badges or License section. |
| `US-01 / AC-02` | Verification script/checks confirming all referenced files and flags exist | Passed: all 7 documented flags are in `ask_local_llm.py`, all 5 troubleshooting messages are in the scripts, all referenced paths exist, and the MCP config matches `AGENTS.md`. |
| `US-01 / AC-03` | Cross-check of Backlog Approval & QA Contract sections against `AGENTS.md` | Passed: the backlog path, execution modes, story readiness, QA evidence, and role rules summarize `AGENTS.md` without adding rules. |
| `US-01 / AC-04` | Shell check for untagged fenced blocks and missing relative link targets | Passed: no untagged fences and no missing link targets. All 9 anchors resolve. The check flagged `local-model-code-delegation`, but that was its own error: GitHub keeps the hyphen in `Local-model`. |

## Known discrepancies (out of scope)

- `AGENTS.md` says `.context/` is ignored in `.gitignore`, but `.gitignore` has no `.context/` entry.
- `scripts/__pycache__/ask_local_llm.cpython-314.pyc` is tracked by Git.

The README will not claim `.context/` is gitignored. Fixing either item needs its own approved change.

## Log

- 2026-11-07: Initial backlog created in response to `/update-readme`.
- 2026-11-17: Backlog reviewed against the repository on `/update-readme`. Removed unproven items ("6 Architectural Pillars", badges, a Markdown lint step with no linter in the repo), and recorded the known discrepancies. Still pending approval.
- 2026-11-17: Approved with all stories. Wrote `README.md` and recorded the verification results above.
