# AGENTS.md

Instructions for every AI coding agent working in this repository (Antigravity, Claude Code, Codex, Cursor, OpenCode, and any other). Read this file at the start of every new session.

## Language and Documentation Rule (MANDATORY)

- **English by default**: All source code, identifiers, function and variable names, comments, documentation (`docs/`, READMEs, architecture/planning docs), and commit messages MUST be written in English.
- **Translations**: Translations are the only exception (e.g., `README.es.md` or dedicated i18n localization catalogs). In multi-language applications, internal code, identifiers, and core error/status codes remain strictly in English, while user-facing localized strings go through dedicated i18n catalogs.

## Code Authorship & Delegation Rule

**New or modified source code in this repository is synthesized by local LLM providers first. The agent writes the code itself only when local providers are unavailable.**

Local models are the owner's dedicated code synthesizers, exposed to agents as MCP servers. The agent is the orchestrator: it understands the request, prepares the context, prompts the local model for code, reviews the answer, applies it to files, and verifies it.

### Delegation Hierarchy & Dynamic Model Selection

**Dynamic Model Policy**: Do NOT restrict or hardcode specific model names. The agent must dynamically use whichever model is currently loaded in memory in LM Studio or Ollama.

1. **Primary Provider: `pumbastudio`**
   - Served by LM Studio (port `1234`), MCP tool `openai_chat`.
   - **Model**: Target the model currently loaded in LM Studio. Use the active model identifier or standard local alias (e.g., `"gpt-4o"` or active loaded model ID). LM Studio automatically serves completions using whichever model is active in memory.
2. **Secondary Provider: `pumbalama`**
   - Served by Ollama (port `11434`), MCP tool `chat_completion`.
   - Used when `pumbastudio` is unreachable or fails.
   - **Model**: Target whichever model is currently active/loaded in Ollama (e.g., checking active running models via `/api/ps` or using the active Ollama model). Do not restrict to any pre-defined model name.
3. **Fallback: Host Model (Gemini, Claude, etc.)**
   - Used when neither `pumbastudio` nor `pumbalama` is reachable or both fail (e.g., connection errors, GPU OOM, or no model loaded).
   - The host model takes over seamlessly without halting or blocking the task, noting briefly that local models were unavailable.

### What Local Models Write

- Source code (e.g., `src/`, `lib/`, `electron/`, etc.).
- Unit, integration, and end-to-end tests (e.g., `test/`, `tests/`).
- Scripts and executable routines.

### What the Agent Does Itself

- Exploration, codebase mapping, task tracking, and planning.
- Resolving library dependencies, reading up-to-date documentation.
- Applying synthesized code to disk and executing builds/tests.
- Reviewing code for correctness, safety, and architectural standards.
- Documentation (`docs/`, READMEs), configuration files, and commit messages.
- Mechanical edits with no logic: renames, imports adjustments, code formatting.

## Workflow

1. **Explore and Plan**: Explore the code and decide what needs to change. Do not ask local models to explore; they have no filesystem or repository access.
2. **Build the Library Context Brief**: Before every code request, resolve the current state of every library the task touches (see the next section). Never send a code request without it.
3. **Prepare Prompt**:
   - Call `pumbastudio` (or fallback to `pumbalama`) with a self-contained prompt that follows the Prompt Template below.
   - **System message**: Include project rules that apply (language, architecture constraints, style).
   - **User message**: Include the Library Context Brief, the exact task, target file paths, relevant existing code verbatim, and expected output format (full file or exact replacement block).
4. **Review**: Check the answer against the request, the Library Context Brief, project rules, and language requirements. Reject any API, import, or option that is not in the brief or in the existing code. If incorrect or incomplete, send a follow-up naming the specific defect and the correct API.
5. **Apply and Test**: Apply the code to files using file tools and run applicable tests.

## Library Context Brief (MANDATORY)

Local models have fixed knowledge cutoffs and no internet or repository access. They do not know the latest library versions, newly introduced APIs, or recent breaking changes, and they will confidently write code against an older API. The quality of their code depends on how specific the agent is.

The agent, not the local model, resolves what is current, using in this order: the project's lockfile and manifest (`package-lock.json`, `pnpm-lock.yaml`, `pyproject.toml`, `go.mod`, `Cargo.lock`, ...) for the installed version; Context7 or the official docs and changelog for that exact version; the installed package source or type definitions (`node_modules`, `site-packages`, ...) when docs are unclear.

Every code request includes a brief with, for each library the task touches:

1. **Runtime and version**: Language and runtime version (e.g., Node 22, Python 3.12) and the exact installed library version, taken from the lockfile, not guessed.
2. **Current API surface**: Exact import paths, function and class signatures, option names, and return types the task needs, copied from the docs or type definitions for that version.
3. **Recent changes**: Breaking changes, renamed or moved APIs, and new recommended patterns introduced in recent major or minor versions, stated as "use X, not Y".
4. **Forbidden APIs**: Deprecated or removed functions, options, and patterns that must not appear in the answer.
5. **Minimal working example**: One short, verified usage example from the official docs for that version.
6. **Project usage**: How the project already uses the library (an existing call site verbatim), so the answer matches local conventions.

Then detail the change itself step by step: functions to add or change, behavior, inputs and outputs, error handling, and edge cases. If a fact cannot be verified, say so in the prompt instead of letting the model guess.

### Prompt Template

```text
## Library Context Brief
- Runtime: <language + version>
- <library>@<exact version>
  - Imports: <exact import statements>
  - API: <signatures and options used by this task>
  - Changed in recent versions: use <new>, not <old>
  - Do NOT use: <deprecated/removed APIs>
  - Example (official docs): <short snippet>
  - Existing project usage: <verbatim call site>

## Task
<exact change, step by step, with inputs/outputs and edge cases>

## Target files
<paths + relevant existing code verbatim>

## Output format
<full file | exact replacement block>. Use only the APIs listed above.
```

## MCP Server Setup Reference

Each agent needs the servers registered in its MCP configuration:

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

## Project Context

- This repository is a reusable project setup template for AI coding agent rules, workflow standards, and subagent configurations.
- Add application-specific architecture, dependencies, and commands in the projects that reuse this template.
- `.atl/` and `.codegraph/` are local tooling state with their own `.gitignore`. Never stage with a blanket `git add`.
- Commits follow Conventional Commits, with no AI attribution lines.
