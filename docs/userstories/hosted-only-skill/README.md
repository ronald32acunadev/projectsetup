# Hosted-Only Skill

**Goal:** A second global skill, `pumba-projectsetup-ai`, applies the same project setup rules without local models: the agent's selected model plans and reviews, and the lightest hosted model the agent offers, at high reasoning effort, creates and edits code. Invoking `/pumba-projectsetup` or `/pumba-projectsetup-ai` at the start of a session chooses the flow.

**Surfaces:** `.agents/global-skills/pumba-projectsetup-ai/SKILL.md` (new template), `scripts/install_skills.sh` (changed by a delegated implementer per `AGENTS.md`), `tests/test_install_skills.py` (new, written by a delegated implementer), `README.md`, `CLAUDE.md`.

## Approval and execution

- Backlog: Approved 2026-11-20.
- Execution mode: All stories.
- Implementation: Complete (installer change and tests by the lightweight hosted implementer at high effort; see Log).

## Confirmed decisions

- 2026-11-20: **Keep the existing flow unchanged.** `/pumba-projectsetup` keeps the local-first delegation; the new behavior lives only in a separate skill chosen at session start (user: "mantener todo como está ... por medio de la skill que llame al inicio decide que flujo va a utilizar").
- 2026-11-20: **Planner:** the model the user selected in the agent. **Implementer:** a smaller hosted model at high reasoning effort for creating and editing code (user: "en la planeación ejecute el modelo seleccionado, pero cuando tenga que escribir código o editar código utilice un modelo más bajo").
- 2026-11-20: **Dynamic selection (B):** the skill names no model; it uses the lightest model the current agent offers, at high effort (user answer: "B").

## Assumptions (confirm or revise at approval)

- **A1 — `AGENTS.md` is not edited:** the new skill reads the same central `AGENTS.md` and overrides only the delegation hierarchy for its session. The rule files and their byte-identical copy stay as they are.
- **A2 — Same prompt and review:** the hosted implementer receives `.agents/code-generation-instructions.md`, `.agents/local-llm-prompt-rules.md`, the Library Context Brief, the task, the verification contract, and the allowed files, exactly like the existing hosted fallback; it writes the allowed files directly and the planner reviews the diff and runs the checks.
- **A3 — No silent planner fallback:** if the agent cannot select a lighter model or set high effort, the skill reports it and asks the user before the planner writes code, as `AGENTS.md` already requires.
- **A4 — Self-learning kept:** a rejected implementer answer still adds one reusable rule to the central `.agents/local-llm-prompt-rules.md`.

## Stories

### US-01 — Hosted-only skill template

**Statement:** As the repository owner, I want a `/pumba-projectsetup-ai` skill, so that I can run a session where my selected model plans and a lighter high-effort model writes and edits the code, with no local models.

**Status:** complete. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | `.agents/global-skills/pumba-projectsetup-ai/SKILL.md` has valid frontmatter (`name: pumba-projectsetup-ai`, a `description` that names the hosted-only flow), the installer's `managed-by` marker, and tells the agent to read `{{PROJECTSETUP_DIR}}/AGENTS.md` and apply all of it except the local-provider steps. | Readback. |
| `US-01 / AC-02` | It states: never call `pumbastudio`, `pumbalama`, or `scripts/ask_local_llm.py`; planning and review stay with the selected model; creating and editing code, tests, and scripts go to the lightest model the agent offers at high effort, chosen dynamically, with no model names (A2, A3). | Readback; `grep` finds no model IDs. |
| `US-01 / AC-03` | It keeps the central tooling paths for the instructions and rules files, self-learning (A4), project-local work, and precedence rules of `pumba-projectsetup`. | Readback against `pumba-projectsetup/SKILL.md`. |
| `US-01 / AC-04` | `.agents/global-skills/pumba-projectsetup/SKILL.md` is unchanged. | `git diff` on that file is empty. |

### US-02 — Installer installs the new skill

**Statement:** As the repository owner, I want `sh scripts/install_skills.sh` to install, update, and uninstall `pumba-projectsetup-ai` in every agent, so that both flows are available everywhere with one command.

**Status:** complete. **Dependencies:** `US-01`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-02 / AC-01` | With a scratch `HOME` holding `.claude`, the installer writes `.claude/skills/pumba-projectsetup-ai/SKILL.md` with `{{PROJECTSETUP_DIR}}` replaced by the repository's absolute path, and still installs `pumba-projectsetup` and `pumba-update-readme`. | `tests/test_install_skills.py` (pytest, `tmp_path` as `HOME`). |
| `US-02 / AC-02` | `--uninstall` removes `pumba-projectsetup-ai` along with the other managed skills. | Same test file. |
| `US-02 / AC-03` | Regression: an existing unmanaged `pumba-projectsetup-ai` folder is reported as a conflict and left untouched, with a non-zero exit, like the other skills. | Same test file. |

### US-03 — Document both flows

**Statement:** As the repository owner, I want the README and `CLAUDE.md` to explain which skill to invoke for each flow, so that I pick the right one at session start.

**Status:** complete. **Dependencies:** `US-01`, `US-02`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-03 / AC-01` | `README.md` lists `/pumba-projectsetup-ai` next to `/pumba-projectsetup`, says which flow each runs, and shows the new template in the file tree. | Readback. |
| `US-03 / AC-02` | `CLAUDE.md` mentions the new template and the test command for the installer tests. | Readback. |

## Verification mapping

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01` to `AC-03` | Readback of `.agents/global-skills/pumba-projectsetup-ai/SKILL.md` against `pumba-projectsetup/SKILL.md`; `grep -niE "haiku\|sonnet\|opus\|gpt-\|gemini-\|flash"` | Passed: frontmatter, marker, override, tooling paths, self-learning, and precedence present; no model names. |
| `US-01 / AC-04` | `git diff --stat .agents/global-skills/pumba-projectsetup/SKILL.md` | Passed: empty. |
| `US-02 / AC-01` | `tests/test_install_skills.py::test_install_writes_ai_skill_rendered`, `::test_install_keeps_existing_skills` | RED before the installer change (`FileNotFoundError` for the new skill); GREEN after (`9 passed`). |
| `US-02 / AC-02` | `tests/test_install_skills.py::test_uninstall_removes_ai_skill` | Passed after the change. It also passed before, trivially, because the skill was never installed; it proves removal only once install works. |
| `US-02 / AC-03` | `tests/test_install_skills.py::test_unmanaged_ai_skill_is_conflict` | RED before (exit 0, no conflict); GREEN after. |
| `US-03 / AC-01`, `AC-02` | Readback of `README.md` and `CLAUDE.md` | Passed. |

## Log

- 2026-11-20: Backlog drafted; separate skill and dynamic selection ("B") confirmed by the user.
- 2026-11-20: Approved, all stories. Pending prompt rules on `feature/story-completion-tests` committed and pushed first; branch `feature/hosted-only-skill` created from it.
- 2026-11-20: LM Studio refused connections and Ollama had no model loaded, so the lightweight hosted implementer (high effort, allowed files `tests/test_install_skills.py` and `scripts/install_skills.sh`) wrote the tests, observed RED, changed the `SKILLS` list, and observed GREEN. The planner reviewed the diff and reran the suite.
