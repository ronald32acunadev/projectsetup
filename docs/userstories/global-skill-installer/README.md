# Global Skill Installer

**Goal:** One installer makes this template available in every agent (Claude Code, Codex, OpenCode, Antigravity) as a global `projectsetup` skill that reads the rules from this folder, so other projects need no copied files and rule changes here apply everywhere.

**Surfaces:** `.agents/global-skills/pumba-projectsetup/SKILL.md` and `.agents/global-skills/pumba-update-readme/SKILL.md` (new templates, kept outside `.agents/skills/` so agents do not load the unrendered placeholder in this repository), `scripts/install_skills.sh` (new, written by a local model per `AGENTS.md`), `README.md`, `CLAUDE.md`.

## Approval and execution

- Backlog: Approved 2026-11-17.
- Execution mode: All stories.
- Implementation: Complete (code by lightweight hosted implementer; see Log).

## Confirmed decisions

- 2026-11-17: **Naming:** installed skills are named `pumba-{name}`: `pumba-projectsetup` and `pumba-update-readme` (user: "la skill o skills deberian llamarse algo como  pumba-{nombre}").
- 2026-11-17: **Antigravity folder confirmed:** its own docs (`~/.gemini/antigravity/builtin/skills/agy-customizations/SKILL.md`) list `~/.gemini/config/` as the global customization root, and skills live in a `skills/` folder inside a root. Antigravity skills therefore go to `~/.gemini/config/skills/`. `~/.gemini/skills` is not documented for Antigravity.
- 2026-11-17: **Skill only.** `/projectsetup` writes nothing into the other project. The rules apply only in sessions where it is invoked (user answer: "Solo skill").

## Confirmed facts

- `voiceflip-engineering` has no installer: plain copies live in `~/.claude/skills`, `~/.codex/skills`, and `~/.gemini/skills`, and each update needs a manual re-copy.
- Existing global skill folders on this machine: `~/.claude/skills`, `~/.codex/skills`, `~/.agents/skills`, `~/.config/opencode/skills`, `~/.gemini/skills`.

## Assumptions (confirm or revise at approval)

- **A1 — Install method:** the installer writes a small generated `SKILL.md` per agent that contains the absolute path of this folder, instead of a symlink. Agents resolve a symlinked skill's relative links unreliably; an absolute path always works. Rerun the installer only if this folder moves.
- **A2 — Agent folders:** Claude Code `~/.claude/skills`, Codex `~/.codex/skills`, OpenCode `~/.config/opencode/skills`, Antigravity `~/.gemini/config/skills` (confirmed above). An agent counts as present when its config folder (`~/.claude`, `~/.codex`, `~/.config/opencode`, `~/.gemini/config`) exists.
- **A3 — Platforms:** Linux and macOS (POSIX `sh`). No Windows installer.
- **A4 — Precedence:** when the other project has its own `AGENTS.md`, its rules win on conflicts; `projectsetup` fills in what it does not cover.

## Stories

### US-01 — The `pumba-projectsetup` skill

**Statement:** As the repository owner, I want to invoke `/pumba-projectsetup` in any project, so that the agent follows this template's rules without copying files into that project.

**Status:** complete. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | `.agents/global-skills/pumba-projectsetup/SKILL.md` has valid frontmatter (`name: pumba-projectsetup` and `description`) and tells the agent to read `{{PROJECTSETUP_DIR}}/AGENTS.md` and apply it for the session. | Readback. |
| `US-01 / AC-02` | Paths the rules mention (`.agents/local-llm-prompt-rules.md`, `.agents/local-llm-guide.md`, `scripts/ask_local_llm.py`) resolve to the central folder, while backlogs (`docs/userstories/<feature>/README.md`) and branches stay in the current project. | Readback. |
| `US-01 / AC-04` | The skill applies the whole of `AGENTS.md`, including the self-learning loop: a rejected local-model answer adds one reusable rule to the **central** `.agents/local-llm-prompt-rules.md`, which `scripts/ask_local_llm.py` already reads from its own folder, so all projects share what was learned. Project-only findings go to Engram. | Readback; `ask_local_llm.py` resolves `RULES` relative to its own path. |
| `US-01 / AC-03` | The skill states precedence (A4) and writes no files into the current project by itself. | Readback. |

### US-02 — Installer for all agents

**Statement:** As the repository owner, I want one command that installs `pumba-projectsetup` and `pumba-update-readme` into every agent I have, so that I never copy skill files by hand again.

**Status:** complete. **Dependencies:** `US-01`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-02 / AC-01` | `sh scripts/install_skills.sh` installs into each agent whose config folder exists (A2), replacing `{{PROJECTSETUP_DIR}}` with this folder's absolute path, and prints one line per agent: installed, updated, or skipped (agent not found). | Scratch `HOME` with only some agent folders; check files and output. |
| `US-02 / AC-02` | Running it twice gives the same files and reports "updated" or "unchanged", never duplicates. | Scratch `HOME`, run twice, compare. |
| `US-02 / AC-03` | It never overwrites a skill folder it did not create (identified by a marker line in the generated `SKILL.md`); it reports the conflict and exits non-zero. | Scratch `HOME` with a pre-existing `pumba-projectsetup` folder. |
| `US-02 / AC-04` | `--uninstall` removes only folders it created; `--dry-run` prints actions and changes nothing. | Scratch `HOME`. |
| `US-02 / AC-05` | `pumba-update-readme` is installed the same way, so `/pumba-update-readme` works in any project; its references resolve to this folder. | Scratch `HOME`; readback of the generated file. |

### US-03 — Document the installer

**Statement:** As a developer adopting this template, I want the README to explain how to install and update the global skills, so that I can set up a new machine in one step.

**Status:** complete. **Dependencies:** `US-02`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-03 / AC-01` | `README.md` Quick start offers the global install (`sh scripts/install_skills.sh`) alongside copying files, with a flags table (`--dry-run`, `--uninstall`) and the agent folder table. | Readback; flags match the script. |
| `US-03 / AC-02` | `CLAUDE.md` lists the new script and skill. | Readback. |

## QA evidence and traceability mapping

The installer is tested against a throwaway `HOME` (`mktemp -d`), never the real one. There is no test runner in this repository, so checks are reproducible shell procedures.

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01`–`AC-04` | Readback of `SKILL.md` | Passed: frontmatter `name: pumba-projectsetup`; reads `{{PROJECTSETUP_DIR}}/AGENTS.md` first; maps the three central paths; states precedence and no installation; self-learning writes to the central rules file, which `ask_local_llm.py` reads via `Path(__file__).resolve().parents[1]`. |
| `US-02 / AC-01`, `AC-05` | Scratch `HOME` with `.claude` and `.codex` only | Passed: 4 `installed` lines, `skipped` for opencode and antigravity, exit 0; 0 placeholders left; the repository path is rendered. A source path containing `&`, `|`, and a space rendered literally. |
| `US-02 / AC-02` | Run twice; `diff -r` of results | Passed: second run prints `unchanged` 4 times; `diff -r` finds no difference. |
| `US-02 / AC-03` | Pre-existing foreign `pumba-projectsetup` folder; exit code and output | Passed: `conflict` line on stderr, exit 1, file content still `mine`. |
| `US-02 / AC-04` | `--dry-run` changes nothing; `--uninstall` removes only managed folders | Passed: dry-run lines prefixed `[dry-run]`, file listing identical before and after; uninstall removed 5 managed folders and kept the foreign one (exit 1 for its conflict). Unknown flag: exit 2 with usage. |
| `US-03 / AC-01`, `AC-02` | Readback; flags compared with the script's parser | Passed: README Option A with skills, agent folders, and flags tables; all flags exist in the parser; links and anchors resolve; `CLAUDE.md` lists the script. |

## Log

- L1 (2026-11-17, verbatim): "como puedo hacer para hacer un instalador para que haga el proyecto funcione en todos mis agentes tanto como codex, claude , google antigravity opencode como una skill para no estar actualizando los archivos siempre en mis otros proyectos si no algo que yo llame y ya y haga referencia a la carpeta donde esta  el proyecto algo como la skill /voic"
- 2026-11-17: User chose "Solo skill". Backlog drafted; pending approval.
- 2026-11-17: Approved with all stories (user: "Aprobar, todas"). Assumptions accepted as written.
- L2 (2026-11-17, verbatim): "Por cierto la skill o skills deberian llamarse algo como  pumba-{nombre}". Renamed the skills; resolved A2 from Antigravity docs; moved templates to `.agents/global-skills/`.
- L3 (2026-11-17, verbatim): "Lo que quiero que haga la skill es lo mismo que hace agents.md y todo lo de auto aprendizaje para los modelos locales si las respuestas no son las esperadas". Added `US-01 / AC-04` and the self-learning rule to the skill.
- 2026-11-17: LM Studio and Ollama had no model loaded (LM Studio: "No models loaded"), so per the delegation hierarchy the installer was written by a lightweight hosted implementer (Claude Haiku) from the same prompt, then reviewed and tested here. Not installed into the real `HOME`; that is the owner's call.
