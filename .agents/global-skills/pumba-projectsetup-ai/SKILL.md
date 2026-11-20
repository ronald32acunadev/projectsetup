---
name: pumba-projectsetup-ai
description: "Use when the user invokes /pumba-projectsetup-ai or asks to apply Pumba's project setup rules with hosted models only: the selected model plans, reviews, and writes tests, and the lightest hosted model at high reasoning effort creates and edits source code and scripts, with no local models."
license: MIT
metadata:
  author: ronald32acunadev
  version: "1.0"
---

<!-- managed-by: projectsetup/scripts/install_skills.sh -->

## Activation Contract

Load this skill when the user invokes `/pumba-projectsetup-ai` or asks to work under Pumba's project setup rules without local models. It selects the hosted-only flow for the whole session; `/pumba-projectsetup` is the local-first flow. The rules live in one central folder, so this project needs no copied rule files:

`{{PROJECTSETUP_DIR}}`

## Hard Rules

- **Read the central rules first**: before any other action in this session, read `{{PROJECTSETUP_DIR}}/AGENTS.md` in full and follow it for the rest of the session, with the hosted-only override below.
- **Hosted-only override**: this replaces only the Delegation Hierarchy of `AGENTS.md`, and its rule that the delegated implementer writes tests, for this session.
  - Never call `pumbastudio`, `pumbalama`, or `scripts/ask_local_llm.py`, even when they are available.
  - **Planner and reviewer**: the model the user selected in the agent. It explores, writes the backlog, prepares each request, reviews every diff, and runs the checks. It does not write source code or scripts.
  - **Tests**: the selected model writes and edits tests itself, deriving them from the approved acceptance criteria and following `.agents/code-generation-instructions.md` and the QA contract of `AGENTS.md`. Never delegate tests to the implementer.
  - **Implementer**: for every creation or edit of source code and scripts (mechanical code edits included), delegate to the lightest model the current agent offers, chosen at request time through its supported model-selection or delegation mechanism, with reasoning effort set to high. Never assume or hardcode a model name. Report the selected model and effort, or that they could not be set or verified.
  - Send the implementer the same prompt `AGENTS.md` defines for code requests: `.agents/code-generation-instructions.md`, then `.agents/local-llm-prompt-rules.md` as its system message, plus the Library Context Brief, the task, the verification contract, and the explicit list of allowed files. It creates and edits only those files and reports the changed paths; reject any change outside them.
  - If the agent cannot select a lighter model or set high effort, say so and ask the user to select one or explicitly authorize the current model before any code is written.
- **Central tooling paths**: these paths in the rules resolve to the central folder, not to the current project:
  - `.agents/code-generation-instructions.md` → `{{PROJECTSETUP_DIR}}/.agents/code-generation-instructions.md`
  - `.agents/local-llm-prompt-rules.md` → `{{PROJECTSETUP_DIR}}/.agents/local-llm-prompt-rules.md`
- **Full rule set**: apply the rest of `AGENTS.md`, not a summary: backlog approval and execution modes, backlog branches, story readiness, QA evidence with committed tests for code stories, planning and implementation roles, and the Library Context Brief.
- **Self-learning**: when a review rejects part of an implementer's answer, append one short reusable rule to `{{PROJECTSETUP_DIR}}/.agents/local-llm-prompt-rules.md`, so every project sends the improved rules on its next request. Save findings that only apply to the current project in Engram, not in the central file. Never write secrets to either.
- **Project-local work**: backlogs (`docs/userstories/<feature-name>/README.md`), backlog branches, `.context/` caches, code, and commits belong to the current project.
- **Precedence**: when the current project has its own `AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`, its rules win on conflicts; the central rules fill in what it does not cover. Report any conflict that changes behavior.
- **No installation**: this skill never copies template files into the current project. Changes to the rules are made in `{{PROJECTSETUP_DIR}}`, not here.

## Execution Steps

1. Read `{{PROJECTSETUP_DIR}}/AGENTS.md`. If it does not exist, stop and tell the user the central folder moved and the installer must be rerun (`sh <new folder>/scripts/install_skills.sh`).
2. Read the current project's own agent rules, if any, and note conflicts.
3. Continue the user's request under the combined rules and the hosted-only override.
