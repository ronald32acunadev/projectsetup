---
name: pumba-projectsetup
description: "Use when the user invokes /pumba-projectsetup or asks to apply Pumba's project setup rules (backlog approval, backlog branches, story and QA contracts, local-model code delegation) in the current project."
license: MIT
metadata:
  author: ronald32acunadev
  version: "1.0"
---

<!-- managed-by: projectsetup/scripts/install_skills.sh -->

## Activation Contract

Load this skill when the user invokes `/pumba-projectsetup` or asks to work under Pumba's project setup rules. The rules live in one central folder, so this project needs no copied rule files:

`{{PROJECTSETUP_DIR}}`

## Hard Rules

- **Read the central rules first**: before any other action in this session, read `{{PROJECTSETUP_DIR}}/AGENTS.md` in full and follow it for the rest of the session.
- **Central tooling paths**: these paths in the rules resolve to the central folder, not to the current project:
  - `.agents/local-llm-prompt-rules.md` → `{{PROJECTSETUP_DIR}}/.agents/local-llm-prompt-rules.md`
  - `.agents/local-llm-guide.md` → `{{PROJECTSETUP_DIR}}/.agents/local-llm-guide.md`
  - `scripts/ask_local_llm.py` → `python3 {{PROJECTSETUP_DIR}}/scripts/ask_local_llm.py`
- **Full rule set**: apply all of `AGENTS.md`, not a summary: backlog approval and execution modes, backlog branches, story readiness, QA evidence, planning and implementation roles, local-first code delegation, and the Library Context Brief.
- **Self-learning for local models**: when a review rejects part of a local model's answer, append one short reusable rule to `{{PROJECTSETUP_DIR}}/.agents/local-llm-prompt-rules.md`, so every project that uses this skill sends the improved rules on its next request. Save findings that only apply to the current project in Engram, not in the central file. Never write secrets to either.
- **Project-local work**: backlogs (`docs/userstories/<feature-name>/README.md`), backlog branches, `.context/` caches, code, and commits belong to the current project.
- **Precedence**: when the current project has its own `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`, its rules win on conflicts; the central rules fill in what it does not cover. Report any conflict that changes behavior.
- **No installation**: this skill never copies template files into the current project. Changes to the rules are made in `{{PROJECTSETUP_DIR}}`, not here.

## Execution Steps

1. Read `{{PROJECTSETUP_DIR}}/AGENTS.md`. If it does not exist, stop and tell the user the central folder moved and the installer must be rerun (`sh <new folder>/scripts/install_skills.sh`).
2. Read the current project's own agent rules, if any, and note conflicts.
3. Continue the user's request under the combined rules.
