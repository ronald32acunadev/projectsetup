# Project Setup Template

Starter template repository containing universal AI coding agent rules, workflow standards, and subagent configurations for bootstrapping new projects. Application-specific architecture, dependencies, and commands belong in the projects that reuse this template.

## Overview

This repository provides standardized configurations and operational guidelines for AI coding assistants (including Antigravity, Claude Code, Cursor, OpenCode, and Codex). It establishes strict development conventions:
- Strict language boundaries (English for code and documentation).
- Dynamic local LLM code delegation (`pumbastudio` via LM Studio and `pumbalama` via Ollama).
- Reusable subagent prompts for specialized tasks (e.g., README generation).

## Table of Contents

- [Features & Standards](#features--standards)
- [Included Subagents](#included-subagents)
- [Repository Structure](#repository-structure)
- [Usage in New Projects](#usage-in-new-projects)
- [Sync Invariant](#sync-invariant)
- [MCP Server Configuration](#mcp-server-configuration)

## Features & Standards

1. **Language & Documentation Rule (Mandatory)**
   - All source code, identifiers, function/variable names, comments, documentation (`docs/`, READMEs), and commit messages must be written in **English**.
   - Translations (`README.es.md`, dedicated i18n catalogs) are the only exceptions.

2. **Local Code Authorship & Delegation (Dynamic Model Selection)**
   - New or modified source code, unit tests, and scripts are synthesized by local LLMs first.
   - **Primary Provider**: `pumbastudio` (LM Studio on port `1234`, MCP tool `openai_chat`), dynamically targeting whichever model is currently loaded in memory.
   - **Secondary Provider**: `pumbalama` (Ollama on port `11434`, MCP tool `chat_completion`), dynamically targeting the active model in Ollama.
   - **Fallback**: The host model (Gemini, Claude, etc.) synthesizes code directly if local providers are unavailable.

3. **Library Context Brief (Outdated Knowledge Safeguard)**
   - Local models have no internet access and outdated knowledge, so every code request must include a mandatory Library Context Brief.
   - The orchestrating agent resolves the exact installed versions from the lockfile and the current API from Context7, official docs, or installed type definitions.
   - The brief lists, per library: runtime and exact version, import paths and signatures, recent breaking changes ("use X, not Y"), forbidden deprecated APIs, a verified docs example, and an existing project call site.
   - Answers that use APIs outside the brief or the existing code are rejected and sent back with the specific defect.

## Included Subagents

### `Agents/readme-generator.md`
A specialized technical documentation subagent. It conducts comprehensive codebase analysis (project structure, tech stack, architectural patterns) and drafts production-grade README files following industry best practices.

## Repository Structure

```text
.
├── .agents/
│   └── rules/
│       └── AGENTS.md            # Synchronized copy of AGENTS.md (.agents standard)
├── Agents/
│   └── readme-generator.md      # Template subagent definition for README generation
├── AGENTS.md                    # Canonical agent rules across all AI coding tools
├── CLAUDE.md                    # Guidance and repository invariants for Claude Code
└── README.md                    # Project documentation
```

## Usage in New Projects

Choose the setup that fits your workflow when initializing a new project:

### 1. Standalone Rule File (Option A)
Copy `AGENTS.md` to the root of your target project:
```bash
cp AGENTS.md /path/to/your-new-project/
```

### 2. Standard Customization Directory (Option B)
Copy the `.agents` folder for tools expecting nested `.agents/rules/`:
```bash
cp -r .agents /path/to/your-new-project/
```

### 3. Subagents (Claude Code & Compatible Tools)
To install the `readme-generator` subagent into a project using Claude Code:
```bash
mkdir -p /path/to/your-new-project/.claude/agents
cp Agents/readme-generator.md /path/to/your-new-project/.claude/agents/
```

## Sync Invariant

The canonical rules in `AGENTS.md` and `.agents/rules/AGENTS.md` **must remain byte-identical**. Whenever rules are updated, verify synchronization with:

```bash
git diff --no-index AGENTS.md .agents/rules/AGENTS.md
```

An empty output confirms both copies are in sync.

## MCP Server Configuration

To enable local model delegation, ensure your agent has `pumbastudio` and `pumbalama` configured in its MCP settings:

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
