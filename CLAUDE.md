# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this repository is

A reusable project setup template: AI coding agent rules, workflow standards, local-model delegation tooling, and skills. It has no application runtime, build, lint, or test suite. Projects that reuse the template add their own commands.

## Rule files and the sync invariant

- `AGENTS.md` is canonical and agent-neutral (Antigravity, Claude Code, Codex, Cursor, OpenCode). Claude-specific guidance belongs in this file.
- `.agents/rules/AGENTS.md` is a byte-identical copy, and `README.md` (when present) summarizes the rules. Any rule change touches all of them in the same commit. Verify the copy with:

```bash
git diff --no-index AGENTS.md .agents/rules/AGENTS.md
```

No output means they are in sync.

- Do not hardcode model names in the rules: the dynamic model policy is deliberate.

## Local-model delegation tooling

AGENTS.md requires source code, tests, and scripts to be synthesized by a local model; docs, config, and commit messages are written by the agent. In Claude Code the MCP tools are `mcp__pumbastudio__openai_chat` (LM Studio, primary) and `mcp__pumbalama__chat_completion` (Ollama, secondary).

- `.agents/local-llm-prompt-rules.md` is the system message pasted into every code request. Append a short rule whenever a review rejects part of a local-model answer.
- `.agents/local-llm-guide.md` is the project-independent guide for prompting a 32k-context local model (token budget, one unit per request, request structure).
- `scripts/ask_local_llm.py` is the fallback when the MCP tool times out or cannot disable reasoning. It is stdlib-only Python, prepends the rules file to the system message, and sends `reasoning_effort: "none"` unless `--think` is passed:

```bash
python3 scripts/ask_local_llm.py --user request.md --out answer.md --code-out file.py
```

  Options: `--provider lmstudio|ollama` (default `lmstudio`), `--system <file>`, `--think`, `--timeout <seconds>` (default 1800).
- `scripts/configure_ollama_models.sh` installs a systemd drop-in pointing the system Ollama service at the owner's model directory. It must run as root (`sudo sh scripts/configure_ollama_models.sh`) and refuses to overwrite a different existing override.

## Skills and commands

- `.agents/skills/update-readme/` is the README audit/update skill; `.opencode/commands/update-readme.md` exposes it to OpenCode as `/update-readme`. Its core rule: every command, flag, and path in a README must be proven by repository files.

## Repository hygiene

- `.atl/` and `.codegraph/` are local tooling state; `.claude/` and `.superpowers/` are gitignored. Stage files explicitly, never with a blanket `git add`.
- User-story backlogs live in `docs/userstories/<feature-name>/README.md` (see AGENTS.md).
