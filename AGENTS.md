# AGENTS.md

Instructions for every AI coding agent working in this repository (Antigravity, Claude Code, Codex, Cursor, OpenCode, and any other). Read this file at the start of every new session.

## Language and Documentation Rule (MANDATORY)

- **English by default**: All source code, identifiers, function and variable names, comments, documentation (`docs/`, READMEs, architecture/planning docs), and commit messages MUST be written in English.
- **Translations**: Translations are the only exception (e.g., `README.es.md` or dedicated i18n localization catalogs). In multi-language applications, internal code, identifiers, and core error/status codes remain strictly in English, while user-facing localized strings go through dedicated i18n catalogs.

## Code Authorship & Delegation Rule

**New or modified source code in this repository is synthesized by local LLM providers first. The agent writes the code itself only when local providers are unavailable.**

Local models are the owner's dedicated code synthesizers, exposed to agents as MCP servers. The agent is the orchestrator: it understands the request, prepares the context, prompts the local model for code, reviews the answer, applies it to files, and verifies it.

### Delegation Hierarchy

1. **Primary Provider: `pumbastudio`**
   - Served by LM Studio (port `1234`), MCP tool `openai_chat`.
   - Default model parameter: `"gpt-4o"` (or active local model alias).
2. **Secondary Provider: `pumbalama`**
   - Served by Ollama (port `11434`), MCP tool `chat_completion`.
   - Used when `pumbastudio` is unreachable or fails.
   - Recommended models: `"qwen2.5-coder:32b"`, `"qwen3-coder:30b"`, or `"qwen2.5-coder:14b"`.
3. **Fallback: Host Model (Gemini, Claude, etc.)**
   - Used when neither `pumbastudio` nor `pumbalama` is reachable or both fail (e.g., connection errors, GPU OOM).
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
2. **Prepare Prompt**:
   - Call `pumbastudio` (or fallback to `pumbalama`) with a self-contained prompt.
   - **System message**: Include project rules that apply (language, architecture constraints, style).
   - **User message**: Include the exact task, target file paths, relevant existing code verbatim, and expected output format (full file or exact replacement block).
3. **Review**: Check the answer against the request, project rules, and language requirements. If incorrect or incomplete, send a follow-up with the specific defect.
4. **Apply and Test**: Apply the code to files using file tools and run applicable tests.

## Be Explicit: Local Models Have Outdated Knowledge

Local models have fixed knowledge cutoffs and no internet or repository access. They do not know latest library versions or newly introduced APIs:

- The agent, not the local model, resolves what is current (via Context7, official docs, or `node_modules`).
- State the exact library names and versions targeted.
- Provide exact function signatures, option names, import paths, and usage examples.
- Specify deprecated or removed features that must not be used.
- Detail the change step by step: functions, behavior, inputs/outputs, edge cases.

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
