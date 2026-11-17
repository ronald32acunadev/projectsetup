# README Visual Format

**Goal:** Give the `update-readme` skill a house visual format (centered header with the project's logo and colors when they exist, Mermaid diagrams, callouts) and apply it to this repository's `README.md`.

**Surfaces:** `.agents/skills/update-readme/SKILL.md`, a new `.agents/skills/update-readme/references/visual-format.md`, `README.md`. Passive documentation; no code.

## Approval and execution

- Backlog: Approved 2026-11-17.
- Execution mode: All stories.
- Implementation: In progress.

## Confirmed facts

- This repository has no logo, image, or theme file (`git ls-files` finds no `.svg`, `.png`, `.ico`, `.css`, `logo`, `icon`, `theme`, or `tailwind` file). Its README therefore uses no logo and GitHub's neutral Mermaid theme.
- GitHub renders Mermaid code blocks, `> [!NOTE]`-style alerts, `<details>`, and `<p align="center">`. It strips inline CSS, so project colors can only appear through Mermaid `themeVariables`, badge colors, or image files.

## Assumptions (confirm or revise at approval)

- **A1 — Logo sources:** a logo exists when the repository tracks a file named like `logo*` or `icon*` (`.svg`, `.png`, `.webp`), or an app icon/favicon in the stack's standard location. The skill never generates or downloads a logo.
- **A2 — Color sources:** project colors come from tracked theme files (CSS custom properties, Tailwind config, Flutter `ThemeData`, design tokens). The skill never invents a palette.
- **A3 — Badges:** badges appear only for facts the repository proves (license file, manifest version, runtime). This repository has none, so its README has no badges.

## Stories

### US-01 — House visual format in the update-readme skill

**Statement:** As the repository owner, I want the `update-readme` skill to follow my own visual format, so that every README it writes is pleasant to read and carries the project's logo and colors when they exist.

**Status:** pending. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | `references/visual-format.md` defines the layout in order: centered header (logo if found, name, one-line tagline, provable badges, language switcher), short lead, contents, sections from the archetype blueprint, and at least one Mermaid diagram for the main workflow or architecture. | Readback against this criterion. |
| `US-01 / AC-02` | The format states how to find a logo (A1) and colors (A2), and what to do when none exist: no logo, neutral Mermaid theme, no invented colors. | Readback. |
| `US-01 / AC-03` | When colors exist, the format applies them only through GitHub-safe means: Mermaid `%%{init: {"theme": "base", "themeVariables": {...}}}%%` and badge colors. No inline CSS. | Readback. |
| `US-01 / AC-04` | `SKILL.md` links the new reference and its execution steps include the logo/color detection and the visual format. | Readback; link check. |

### US-02 — Apply the visual format to this repository's README

**Statement:** As a developer adopting this template, I want the README to show the workflow and delegation as diagrams, so that I understand how the template works at a glance.

**Status:** pending. **Dependencies:** `US-01`; the workflow diagram includes the branch step only if `backlog-branches` is approved.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-02 / AC-01` | `README.md` follows the visual format: centered header without logo or badges (none exist), a Mermaid flowchart of the backlog workflow (request → backlog → approval → branch → implement → verify), and a Mermaid diagram of the code delegation fallback (LM Studio → Ollama → hosted model). | Readback; Mermaid syntax check. |
| `US-02 / AC-02` | All facts from the current README are kept: every command, flag, path, and troubleshooting row still matches the repository. | Re-run the flag, message, and path checks used for `update-readme` US-01. |
| `US-02 / AC-03` | Every fenced block has a language tag (`mermaid` included), and every relative link and anchor resolves. | Shell check from `update-readme` US-01 / AC-04. |

## QA evidence and traceability mapping

Passive documentation: no runnable RED test. Mermaid blocks are checked with the Mermaid CLI if available (`npx -y @mermaid-js/mermaid-cli`); otherwise the check is marked manual-only.

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01`–`AC-04` | Readback of `visual-format.md` and `SKILL.md`; link check | Pending |
| `US-02 / AC-01` | Readback; Mermaid render check | Pending |
| `US-02 / AC-02` | Flag, message, and path checks | Pending |
| `US-02 / AC-03` | Fence and link shell check | Pending |

## Log

- L1 (2026-11-17, verbatim): "por cierto en el readme quiero añadir una especie de diagrama , por cierto quiero actualizar como se ve el readme por un formato mas apetecible a la vista , incluyendo diagramas si es posible me gustaria tener mi propio formato de readme o que en el se incluya el logo de la app o proyecto si existe como tambien los colores que tiene alusion actualmente  el proyecto"
- 2026-11-17: Backlog drafted; pending approval.
- 2026-11-17: Approved with all stories (user: "Aprobar, todas"). Assumptions accepted as written.
