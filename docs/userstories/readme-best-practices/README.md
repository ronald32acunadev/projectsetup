# README Best Practices

**Goal:** The `update-readme` skill checks every README against a documented set of README best practices, taken from primary sources, before it finishes.

**Surfaces:** `.agents/skills/update-readme/SKILL.md`, a new `.agents/skills/update-readme/references/best-practices.md`. Passive documentation; no code.

## Approval and execution

- Backlog: Approved 2026-11-17.
- Execution mode: All stories.
- Implementation: In progress.

## Assumptions (confirm or revise at approval)

- **A1 — Sources:** practices come only from primary sources read during implementation: GitHub Docs "About READMEs" and "Basic writing and formatting syntax", the Standard Readme specification, and the Make a README guide. Each rule in the reference cites its source URL. Any rule a source does not support is dropped.
- **A2 — Scope:** the checklist complements, and does not replace, the archetype blueprints and the visual format. Where they conflict, the repository's own conventions win and the conflict is noted.

## Stories

### US-01 — Best-practices checklist in the update-readme skill

**Statement:** As the repository owner, I want `update-readme` to follow README best practices, so that every README it writes answers what the project does, why it is useful, how to start, where to get help, and who maintains it.

**Status:** pending. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | `references/best-practices.md` lists each practice as a checkable item with its source URL (A1). It covers at least: the questions a README must answer, heading hierarchy (one H1), relative links, image alt text, size limits that affect rendering, and links to license, contributing, and support files when they exist. | Readback; every URL is from the sources in A1 and was opened during implementation. |
| `US-01 / AC-02` | Every practice states what to do when the repository lacks the fact (for example, no `LICENSE` file means no License section), consistent with the skill's "zero hallucinated sections" rule. | Readback. |
| `US-01 / AC-03` | `SKILL.md` links the reference, and its Verify step runs the checklist; the Output Contract reports which items passed and which do not apply. | Readback; link check. |
| `US-01 / AC-04` | Running the checklist on this repository's `README.md` produces a pass or a recorded, justified exception for each item; any gap found is fixed in the same story. | Checklist results recorded below. |

## QA evidence and traceability mapping

Passive documentation: no runnable RED test.

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01`, `AC-02` | Readback of `best-practices.md`; source URLs opened | Pending |
| `US-01 / AC-03` | Readback of `SKILL.md`; link check | Pending |
| `US-01 / AC-04` | Checklist applied to `README.md`; per-item result | Pending |

## Log

- L1 (2026-11-17, verbatim): "Tambien me gustaria que a la hora de crear el readme tambien siga las mejores practicas a la hora de crear el readme"
- 2026-11-17: Backlog drafted; pending approval.
- 2026-11-17: Approved with all stories (user: "Aprobar, todas"). Assumptions accepted as written.
