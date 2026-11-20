# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this repository is

A reusable project setup template: AI coding agent rules, workflow standards, local-model delegation tooling, and skills. It has no application runtime, build, or lint. Its only tests cover `scripts/`: run `python3 -m pytest tests/ -q -p no:cacheprovider`. Projects that reuse the template add their own commands.

## Rule files and the sync invariant

- `AGENTS.md` is canonical and agent-neutral (Antigravity, Claude Code, Codex, Cursor, OpenCode). Claude-specific guidance belongs in this file.
- `.agents/rules/AGENTS.md` is a byte-identical copy, and `README.md` (when present) summarizes the rules. Any rule change touches all of them in the same commit. Verify the copy with:

```bash
git diff --no-index AGENTS.md .agents/rules/AGENTS.md
```

No output means they are in sync.

- Do not hardcode model names in the rules: the dynamic model policy is deliberate.

## Local-model delegation tooling

AGENTS.md requires creating and editing source code, tests, and scripts to be delegated to a local model; docs, config, and commit messages are written by the agent. A story that changes executable code is complete only with committed, passing tests for its criteria; docs- and config-only stories use structural or manual checks. In Claude Code the MCP tools are `mcp__pumbastudio__openai_chat` (LM Studio, primary) and `mcp__pumbalama__chat_completion` (Ollama, secondary).

- `.agents/local-llm-prompt-rules.md` is the system message pasted into every code request. Append a short rule whenever a review rejects part of a local-model answer.
- `.agents/code-generation-instructions.md` holds stable best practices for creating and editing code; it goes into the system message before the rules file, for local and hosted implementers.
- Hosted fallback in Claude Code: delegate through the Agent tool with the lightest `model` value it offers and `effort: "high"`, and pass the allowed files; the subagent edits only those files and the planner reviews the diff. If the Agent tool cannot be used, ask the user before writing code with the planner.
- `.agents/local-llm-guide.md` is the project-independent guide for prompting a 32k-context local model (token budget, one unit per request, request structure).
- `scripts/ask_local_llm.py` is the fallback when the MCP tool times out or cannot disable reasoning. It is stdlib-only Python, prepends the instructions file and then the rules file to the system message (failing if the instructions file is missing), and sends `reasoning_effort: "none"` unless `--think` is passed:

```bash
python3 scripts/ask_local_llm.py --user request.md --out answer.md --code-out file.py
```

  Options: `--provider lmstudio|ollama` (default `lmstudio`), `--system <file>`, `--think`, `--timeout <seconds>` (default 1800).
- `scripts/install_skills.sh` renders `.agents/global-skills/pumba-*/SKILL.md` (replacing `{{PROJECTSETUP_DIR}}` with this folder's path) into the global skills folder of Claude Code, Codex, OpenCode, and Antigravity. Flags: `--dry-run`, `--uninstall`. It only touches folders whose `SKILL.md` carries its `managed-by` marker. Templates: `pumba-projectsetup` (local-first flow), `pumba-projectsetup-ai` (hosted-only flow: the selected model plans and writes tests, the lightest hosted model at high effort writes source code and scripts), and `pumba-update-readme`. Its tests live in `tests/test_install_skills.py`.
- `scripts/configure_ollama_models.sh` installs a systemd drop-in pointing the system Ollama service at the owner's model directory. It must run as root (`sudo sh scripts/configure_ollama_models.sh`) and refuses to overwrite a different existing override.

## Skills and commands

- `.agents/skills/update-readme/` is the README audit/update skill; `.opencode/commands/update-readme.md` exposes it to OpenCode as `/update-readme`. Its core rule: every command, flag, and path in a README must be proven by repository files.

## Repository hygiene

- `.atl/` and `.codegraph/` are local tooling state, and `.superpowers/` is gitignored. `.claude/` is tracked: it holds the Claude Code `/update-readme` command, project skills, and `launch.json`. Stage files explicitly, never with a blanket `git add`.
- User-story backlogs live in `docs/userstories/<feature-name>/README.md` (see AGENTS.md).
