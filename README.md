# Project Setup Template

Reusable bootstrap template containing universal AI coding agent rules, local-first code delegation standards, offline documentation caching, and cross-platform skills for initializing software projects.

![Status](https://img.shields.io/badge/status-active-success)
![Format](https://img.shields.io/badge/format-AGENTS.md-blue)
![MCP](https://img.shields.io/badge/MCP-LM%20Studio%20%7C%20Ollama-orange)
![Cache](https://img.shields.io/badge/docs%20cache-.context%2F-purple)
![Skills](https://img.shields.io/badge/skills-update--readme-green)

---

## Overview

**Project Setup Template** standardizes how AI coding assistants (Antigravity, Claude Code, Codex, Cursor, OpenCode, and compatible tools) operate across software repositories. Instead of recreating operational rules and tooling hooks in every repository, this template provides a single, canonical rule file (`AGENTS.md`), its synchronized mirror (`.agents/rules/AGENTS.md`), environment adapters (`CLAUDE.md`), and reusable agent skills with native slash-command integrations.

It enforces six architectural pillars in AI-assisted engineering:

- **English-First Hygiene & Clean Commits**: Enforces English for all source code, identifiers, comments, documentation, and Conventional Commits without AI attribution or co-author trailers.
- **Approved Backlog Before Implementation**: A reasoning-capable planner reviews small user stories and waits for the user to approve the backlog and choose all-stories or one-at-a-time execution.
- **Local-First Code Delegation**: Offloads code, test, and script synthesis to the active local model (`pumbastudio`, then `pumbalama`), with an available lightweight hosted implementer as fallback, keeping planning and review separate.
- **Zero Hallucination with Library Context Briefs**: Requires orchestrators to assemble verified API surfaces, versions, and usage constraints from lockfiles and documentation before prompting code synthesizers.
- **Cache-Aside Documentation Architecture**: Keeps raw third-party documentation on disk in `.context/<library>@<version>.md` (Git-ignored) via Context7, separating API reference caches from architectural memory (Engram).
- **Cross-Platform Skills & Commands**: Ships modular skills (such as `update-readme`) wired directly to native agent command interfaces (`.claude/commands/` and `.opencode/commands/`).

Application-specific runtimes, package manifests, builds, linters, and test suites are intentionally omitted; configure them in projects initialized from this template.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Included Assets & Directory Structure](#included-assets--directory-structure)
- [Built-In Skills & Commands](#built-in-skills--commands)
- [Core Rules & Standards](#core-rules--standards)
- [Local LLM Code Delegation](#local-llm-code-delegation)
- [Documentation Cache & Memory Protocol](#documentation-cache--memory-protocol)
- [Sync Invariant](#sync-invariant)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Quick Start

### Bootstrap a New Project

Copy the rule payloads, skills, and agent adapters into your target repository root:

```bash
# 1. Copy the canonical rules and mirror
cp AGENTS.md /path/to/your-project/
cp -r .agents /path/to/your-project/

# 2. Copy Claude Code and OpenCode command adapters
cp CLAUDE.md /path/to/your-project/
cp -r .claude /path/to/your-project/
cp -r .opencode /path/to/your-project/

# 3. Add documentation cache and agent artifacts to target .gitignore
cat << 'EOF' >> /path/to/your-project/.gitignore

# AI Documentation Cache & Tooling State
.context/
.atl/
.codegraph/
EOF
```

### Verify Rule Synchronization

Whenever modifying rules in this template repository, verify that the canonical file and mirror remain identical:

```bash
git diff --no-index AGENTS.md .agents/rules/AGENTS.md
```

An empty output confirms both files match byte-for-byte.

---

## Prerequisites

- **Git** (`2.x+`) for version control and running synchronization checks (`git diff --no-index`).
- **Node.js & `npx`** (`18+` recommended) to run local MCP stdio servers (`@mzxrai/mcp-openai` and `ollama-mcp-server`).
- **Local LLM Engine** (at least one recommended for local code synthesis):
  - [LM Studio](https://lmstudio.ai/) running its local server on `http://127.0.0.1:1234/v1` with an active model loaded.
  - [Ollama](https://ollama.com/) running on `http://127.0.0.1:11434` with an active model pulled.
- **Documentation Provider**: Context7 MCP server for retrieving current library APIs and saving to `.context/`.
- **Supported AI Agents**: Antigravity, Claude Code, OpenCode, Cursor, Codex, or any tool supporting `AGENTS.md` and MCP servers.

---

## Included Assets & Directory Structure

```
projectsetup/
├── .agents/
│   ├── local-llm-guide.md                     # Prompting a 32k-context local model
│   ├── local-llm-prompt-rules.md              # Rules pasted into every local-model code request
│   ├── rules/
│   │   └── AGENTS.md                          # Byte-identical mirror of AGENTS.md
│   └── skills/
│       └── update-readme/
│           ├── SKILL.md                       # Canonical update-readme skill instructions
│           └── references/
│               └── archetypes-and-checklists.md # Matrix, blueprints & verification checklists
├── .claude/
│   └── commands/
│       └── update-readme.md                   # /update-readme slash command for Claude Code
├── .opencode/
│   └── commands/
│       └── update-readme.md                   # /update-readme slash command for OpenCode
├── scripts/
│   └── ask_local_llm.py                       # Send a code request to LM Studio or Ollama directly
├── AGENTS.md                                  # Canonical cross-agent rules & delegation standards
├── CLAUDE.md                                  # Claude Code entrypoint and adapter
├── .gitignore                                 # Git ignore patterns including .context/ cache
└── README.md                                  # Repository documentation
```

### File Responsibilities

| File / Directory | Target Agents | Purpose |
| :--- | :--- | :--- |
| [`AGENTS.md`](./AGENTS.md) | Universal (Antigravity, Cursor, OpenCode, Codex, etc.) | Canonical source of truth for agent behavior, delegation, and workflow rules. |
| [`.agents/rules/AGENTS.md`](./.agents/rules/AGENTS.md) | Tools expecting nested `.agents/` hierarchy | Byte-identical mirror of `AGENTS.md` verified by CI or pre-commit checks. |
| [`.agents/local-llm-prompt-rules.md`](./.agents/local-llm-prompt-rules.md) | All agents delegating code | Short rules pasted into every local-model code request, grown from rejected answers. |
| [`.agents/local-llm-guide.md`](./.agents/local-llm-guide.md) | All agents delegating code | How to prompt a 32k-context local model and which models write usable code. |
| [`scripts/ask_local_llm.py`](./scripts/ask_local_llm.py) | All agents delegating code | Calls the local model directly when the MCP tool times out or cannot turn reasoning off. |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code | Root configuration pointing to `@AGENTS.md` and defining Claude-specific bridge tools. |
| [`.agents/skills/update-readme/`](./.agents/skills/update-readme/) | Universal Skill | Evaluates repository manifests and entrypoints to generate and audit ground-truth READMEs. |
| [`.claude/commands/update-readme.md`](./.claude/commands/update-readme.md) | Claude Code | Exposes the `/update-readme` slash command inside Claude Code sessions. |
| [`.opencode/commands/update-readme.md`](./.opencode/commands/update-readme.md) | OpenCode | Exposes the `/update-readme` slash command inside OpenCode sessions. |

---

## Built-In Skills & Commands

### `/update-readme`

Audits, generates, or updates `README.md` and companion language files (`README.<lang>.md`) based strictly on repository ground truth (manifests, entrypoints, and CLI routers) without hallucinating commands or flags.

- **Trigger**: Run `/update-readme` (or `$update-readme`) in Claude Code, OpenCode, or Antigravity.
- **Skill Definition**: [`.agents/skills/update-readme/SKILL.md`](./.agents/skills/update-readme/SKILL.md)
- **Blueprints & Matrix**: [`.agents/skills/update-readme/references/archetypes-and-checklists.md`](./.agents/skills/update-readme/references/archetypes-and-checklists.md)
- **Supported Archetypes**:
  - **A. CLI & Desktop Application** (entrypoint parsing, CLI option tables, profile modes)
  - **B. Library / SDK / Package** (exports, minimal usage snippets, API tables)
  - **C. Web Application / Backend API Service** (env vars, migration commands, API endpoints)
  - **D. Bootstrap Template / Agent Rules Repository** (bootstrap steps, rule mirrors, sync invariants)

---

## Core Rules & Standards

### 1. Language and Documentation (MANDATORY)

- **English by default**: All source code, identifiers, function and variable names, comments, documentation (`docs/`, READMEs), and commit messages must be in English.
- **Translations**: Dedicated translation files (e.g., `README.es.md` or i18n catalogs) are the only exception.
- **Commit hygiene**: Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) without `Co-Authored-By` or AI attribution trailers.

### 2. Code Authorship & Delegation Hierarchy

The reasoning-capable planner prepares the backlog and reviews results. Source code, tests, and scripts go to local providers first, then an available lightweight hosted implementer when local execution is unavailable or explicitly bypassed:

```mermaid
flowchart TD
    Task[Change Request] --> Plan[Plan and Review Complete Backlog]
    Plan --> Approval[Wait for Backlog Approval and Execution Mode]
    Approval --> Route{Use Local Models?}
    Route -- Yes --> CheckLM[Check LM Studio\npumbastudio / 1234]
    Route -- User Bypasses Local --> HostModel[Select Available Lightweight Hosted Implementer]
    CheckLM -- Available --> SynthLM[Synthesize with Active Model]
    CheckLM -- Unavailable / Error --> CheckOllama[Check Ollama\npumbalama / 11434]
    CheckOllama -- Available --> SynthOllama[Synthesize with Active Model]
    CheckOllama -- Unavailable / Error --> HostModel
    SynthLM --> Review[Orchestrator Code Review & Verification]
    SynthOllama --> Review
    HostModel -- Available --> Review
    HostModel -- Cannot Select or Invoke --> Decision[Stop for User Model Selection or Explicit Override]
    Review --> Apply[Apply to Disk & Run Tests]
    Apply --> Report[Report Story Results]
    Report --> Mode{Approved Execution Mode}
    Mode -- All Stories --> Next[Continue Approved Backlog Unless Blocked]
    Mode -- One at a Time --> Wait[Wait for Approval of Next Story]
```

#### What Local Models Write
- Source code (`src/`, `lib/`, etc.)
- Unit, integration, and end-to-end tests
- Scripts and executable routines

#### What the Orchestrating Agent Does Itself
- Codebase exploration, mapping, and planning
- Resolving library dependencies and assembling documentation briefs
- Applying synthesized code to disk and running test suites
- Architectural review for safety and correctness
- Writing documentation, configuration files, and commit messages

### 3. Backlog Approval and Execution Modes

Before implementation, save the complete reviewed backlog to `docs/userstories/{featurename}/README.md` in the active project. Share a short summary and link rather than pasting the full backlog. Each story has a stable ID (`US-01`), an actor/goal/value statement, relevant scope and business rules, dependencies, and observable criteria with story-scoped IDs (`US-01 / AC-01`) and verification methods. Resolve behavior-changing ambiguities without inventing requirements. Given/When/Then is optional; one small request may be one concise story.

Ask in the user's language: **"Do you approve this backlog, and should I implement all stories or proceed one at a time?"** Wait for explicit approval and an unambiguous mode; approving a design is not approving its backlog.

| Approved mode | Behavior |
| :--- | :--- |
| All stories | Implement in dependency order, verify and report each story, and continue without repeated approval unless blocked or scope changes. |
| One at a time | Implement and verify the next story, show changes and results, then stop until the user approves proceeding. |

Track stories as pending, in progress, blocked, or complete in that same story file, including for small backlogs. Scope revisions require approval before implementing affected stories. Link other required task documents instead of creating competing trackers. Read-only questions do not need a backlog.

### 4. Verifiable Story and QA Quality

The [canonical contracts](AGENTS.md#story-readiness-contract-mandatory) define story readiness and [QA evidence](AGENTS.md#qa-evidence-and-traceability-contract-mandatory). Each criterion maps to an actual named automated check or reproducible manual procedure and its observed result in the same story file. New or changed tests reference a criterion or an explicit change-related regression risk; unrelated historical tests and supporting helpers need no retroactive labels.

Choose relevant successful, negative, boundary, and regression scenarios and the least costly verification level that proves the behavior. Specialized checks depend on risk, not quotas. Verify observable outputs and applicable errors and state effects, not merely mock calls. Use applicable test-first discipline; document manual or structural exceptions honestly. Completion requires demonstrated criteria and passing applicable regression checks, not generated tests or coverage percentages alone. Missing, failed, skipped, or blocked required proof stays visible and prevents completion. Approved scope changes update affected checks while preserving still-valid evidence.

---

## Local LLM Code Delegation

### Dynamic Model Policy

Agents never hardcode specific model names. They dynamically target whichever model is active in memory:

1. **Primary Provider: `pumbastudio`**
   - Served by LM Studio (port `1234`), MCP tool `openai_chat`.
   - Uses the active loaded model identifier or local alias (e.g., `"gpt-4o"`).
2. **Secondary Provider: `pumbalama`**
   - Served by Ollama (port `11434`), MCP tool `chat_completion`.
   - Uses whichever model is currently active in memory.
3. **Fallback: Lightweight Hosted Implementer**
   - Used when both local engines are unavailable or fail, or when the user explicitly chooses not to use local models.
   - Select an available lightweight model through the current client's supported capabilities; do not hardcode model names or silently change global defaults.
   - If selection or invocation is unavailable, stop and ask the user to select a lightweight model or explicitly authorize the current model. Never silently use the planning model as the code writer.

These rules guide agents; they do not install an automatic model switcher. Report the actual execution route and any uncertainty about model identity. Lower reasoning effort alone is not a model change.

### Calling the Local Model

- **Prompt rules**: every code request carries [`.agents/local-llm-prompt-rules.md`](./.agents/local-llm-prompt-rules.md) in its system message; a review that rejects part of an answer adds one short rule there.
- **Without the MCP time limit**: `python3 scripts/ask_local_llm.py --user request.md --out answer.md --code-out file.py` (add `--provider ollama` for Ollama) sends the request straight to the local API with a 30-minute timeout and `reasoning_effort: "none"` unless `--think` is given, and adds the rules file itself.
- **Guide**: [`.agents/local-llm-guide.md`](./.agents/local-llm-guide.md) covers the token budget for a 32k context, one file per request, and measured results on which kind of model writes usable code.

### MCP Configuration Reference

Add these servers to your agent's MCP configuration file:

```json
{
  "mcpServers": {
    "pumbastudio": {
      "command": "npx",
      "args": ["-y", "@mzxrai/mcp-openai@latest"],
      "env": {
        "OPENAI_BASE_URL": "http://127.0.0.1:1234/v1",
        "OPENAI_API_KEY": "sk-lm-local"
      }
    },
    "pumbalama": {
      "command": "npx",
      "args": ["-y", "ollama-mcp-server@latest"],
      "env": {
        "OLLAMA_HOST": "http://127.0.0.1:11434"
      }
    }
  }
}
```

### Approved Code Change Workflow

```
Plan & Review Backlog -> Wait for Approval + Mode -> Resolve Library Facts -> Prompt Implementer -> Review -> Apply & Verify -> Report / Pause
```

1. **Explore and Plan**: Inspect the repository and review the complete backlog. Never delegate exploration to local models.
2. **Obtain Approval**: Wait for backlog approval and the all-stories or one-at-a-time choice before implementation.
3. **Resolve Library Facts (Cache-Aside Flow)**: Look up installed versions in lockfiles, check `.context/<lib>@<version>.md`, and assemble the **Library Context Brief**.
4. **Prepare Prompt**: Select the local-first or lightweight hosted implementer. Include project rules, approved story and acceptance criteria, allowed files, the brief, relevant code verbatim, and expected output format.
5. **Review and Learn**: Validate against the story, brief, and repository patterns. Send one focused correction request for rejected output; report a blocker if it still fails. Save reusable prompt corrections in `.agents/local-llm-prompt-rules.md` and project findings in Engram. This improves future context, not model weights.
6. **Apply, Test, and Report**: Save files, execute acceptance checks and applicable tests, and report results. Pause after each story in one-at-a-time mode; otherwise continue within the approved backlog unless blocked.

---

## Documentation Cache & Memory Protocol

To prevent context bloat and hallucination, projects separate raw documentation from architectural knowledge:

| Storage Location | Tool / Path | Contents & Responsibility |
| :--- | :--- | :--- |
| **Local Cache (Disk)** | `.context/<library>@<version>.md` | Raw API documentation, exported signatures, and official usage examples fetched from Context7. Ignored by Git. |
| **Persistent Memory** | **Engram** (`mem_save`) | Project decisions, bug root causes, architectural patterns, and non-obvious code discoveries. Never store raw doc dumps here. |

---

## Sync Invariant

The rules in `AGENTS.md` and `.agents/rules/AGENTS.md` **must remain byte-identical**.

Whenever you update agent rules:
1. Apply edits to `AGENTS.md`.
2. Copy `AGENTS.md` to `.agents/rules/AGENTS.md`.
3. Verify synchronization:
   ```bash
   git diff --no-index AGENTS.md .agents/rules/AGENTS.md
   ```
4. Update `README.md` in the same commit if commands or standards changed.

---

## Troubleshooting

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` returns differences | Edited only one of the rule files | Run `cp AGENTS.md .agents/rules/AGENTS.md` and verify with `git diff --no-index`. |
| `pumbastudio` fails to connect | LM Studio local server stopped or wrong port | Start LM Studio, verify local server is running on `127.0.0.1:1234`, and ensure a model is loaded. |
| `pumbalama` connection refused | Ollama daemon is not running | Run `ollama serve` or start Ollama service on `127.0.0.1:11434`. |
| Local model produces hallucinated or outdated APIs | Missing or incomplete Library Context Brief | Check lockfile for exact version, query Context7 into `.context/`, and pass explicit function signatures in the prompt. |
| `/update-readme` not recognized in Claude Code | Command file missing or in ignored directory | Ensure `.claude/commands/update-readme.md` exists and is readable by Claude Code. |

---

## Contributing

1. Edit [`AGENTS.md`](./AGENTS.md) and mirror every change to [`.agents/rules/AGENTS.md`](./.agents/rules/AGENTS.md).
2. If adding, renaming, or updating skills or commands, update [`.agents/skills/`](./.agents/skills/), `.claude/commands/`, `.opencode/commands/`, and this `README.md`.
3. Confirm byte-identical sync with `git diff --no-index AGENTS.md .agents/rules/AGENTS.md`.
4. Stage specific files explicitly (never run blanket `git add .` or stage `.context/`, `.atl/`, or `.codegraph/`).
5. Write commit messages following Conventional Commits in English without AI attribution.
