# Update README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for approved inline documentation execution. This file is the canonical backlog and execution record; do not create a competing plan or tracker.

**Goal:** Rebuild and modernize `README.md` following Project Archetype D (Bootstrap Template / Agent Rules Repository) based strictly on codebase facts, incorporating the Story and QA Quality Contract, local-first model delegation, cache-aside documentation, and skill integration.

**Architecture:** Archetype D Bootstrap Template documentation conforming to `AGENTS.md`, `CLAUDE.md`, `.agents/skills/update-readme/SKILL.md`, and `references/archetypes-and-checklists.md`.

**Tech Stack:** Markdown documentation; zero external runtime dependencies.

## Approval and execution

- Backlog: Pending user approval.
- Execution mode: Pending selection (`all stories` or `one at a time`).
- Implementation: Pending.

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

**Status:** pending. **Dependencies:** none. **Route:** inline documentation.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | **Archetype D Structure**: `README.md` includes Title & Badges, Overview with 6 Architectural Pillars, Quick Start (Bootstrap, Sync Verification), Included Assets & Directory Structure, Built-In Skills & Commands, Core Rules & Workflow Standards (including Backlog Approval, Execution Modes, and Story/QA Contract), Local LLM Code Delegation, Documentation Cache (`.context/`) & Engram Memory Protocol, Sync Invariant, Troubleshooting, and Contributing. | Structural readback against Archetype D Blueprint (`.agents/skills/update-readme/references/archetypes-and-checklists.md`). |
| `US-01 / AC-02` | **Zero Hallucinated Commands**: Documented scripts (`scripts/ask_local_llm.py`, `scripts/configure_ollama_models.sh`), flags, paths (`.agents/rules/AGENTS.md`, `.opencode/commands/update-readme.md`), and MCP configurations (`pumbastudio` on 1234, `pumbalama` on 11434) match actual repository files. | Automated verification checking that every referenced file path exists on disk. |
| `US-01 / AC-03` | **Accurate Workflow & Quality Contract**: Reflects the mandatory Backlog Approval workflow, file-first user story backlog path (`docs/userstories/{featurename}/README.md`), Story Readiness Contract, and QA Evidence/Traceability Contract established in `AGENTS.md`. | Semantic review against canonical `AGENTS.md`. |
| `US-01 / AC-04` | **Format and Link Integrity**: Clean GFM markdown, copy-pasteable code blocks with language tags, and relative file links pointing to existing files. | Markdown lint check and file link verification. |

**Implementation steps:**
- [ ] Inspect HEAD `README.md` and codebase ground truth (`AGENTS.md`, `CLAUDE.md`, `scripts/`, `.agents/`, `.opencode/`).
- [ ] Draft modernized `README.md` incorporating the latest Story & QA Quality Contract, file-first backlogs, and dynamic local LLM hierarchy.
- [ ] Verify all file links, scripts, flags, and paths against disk.
- [ ] Run structural verification checks and record evidence in this document.

## QA evidence and traceability mapping

| Story / criterion or change-related regression risk | Test file and test name, or reproducible manual procedure | Observed result and evidence |
| --- | --- | --- |
| `US-01 / AC-01` | Structural review against Archetype D blueprint in `references/archetypes-and-checklists.md` | Pending until execution |
| `US-01 / AC-02` | Verification script/checks confirming all referenced files and flags exist | Pending until execution |
| `US-01 / AC-03` | Cross-check of Backlog Approval & QA Contract sections against `AGENTS.md` | Pending until execution |
| `US-01 / AC-04` | Markdown link audit testing each `[text](./path)` link targets an existing file | Pending until execution |

## Log

- 2026-11-07: Initial backlog created in response to `/update-readme`.
