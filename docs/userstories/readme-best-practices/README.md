# README Best Practices

**Goal:** The `update-readme` skill checks every README against a documented set of README best practices, taken from primary sources, before it finishes.

**Surfaces:** `.agents/skills/update-readme/SKILL.md`, a new `.agents/skills/update-readme/references/best-practices.md`. Passive documentation; no code.

## Approval and execution

- Backlog: Approved 2026-11-17.
- Execution mode: All stories.
- Implementation: Complete.

## Assumptions (confirm or revise at approval)

- **A1 — Sources:** practices come only from primary sources read during implementation: GitHub Docs "About READMEs" and "Basic writing and formatting syntax", the Standard Readme specification, and the Make a README guide. Each rule in the reference cites its source URL. Any rule a source does not support is dropped.
- **A2 — Scope:** the checklist complements, and does not replace, the archetype blueprints and the visual format. Where they conflict, the repository's own conventions win and the conflict is noted.

## Stories

### US-01 — Best-practices checklist in the update-readme skill

**Statement:** As the repository owner, I want `update-readme` to follow README best practices, so that every README it writes answers what the project does, why it is useful, how to start, where to get help, and who maintains it.

**Status:** complete. **Dependencies:** none.

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
| `US-01 / AC-01`, `AC-02` | Readback of `best-practices.md`; source URLs opened | Passed: 19 items (C1–C7, S1–S5, L1–L7), each with a source tag and an "If missing" rule. All four sources were fetched on 2026-11-17. Conflict found and fixed: `visual-format.md` allowed one alert per section; GitHub Docs says one or two per article, so the visual format now follows that. |
| `US-01 / AC-03` | Readback of `SKILL.md`; link check | Passed: Verify step 6 runs the checklist; Output Contract has a Best Practices line; References links the file. No broken links. |
| `US-01 / AC-04` | Checklist applied to `README.md`; per-item result | Passed with one gap. pass: C1, C2 (added a "why" sentence), C3, C4 (added issues link; page returns HTTP 200), C5 (added maintainer and PR line), C6, S1 (`projectsetup`), S2 (tagline under 120 characters), S3 (233 lines; table of contents covers all 9 other H2s), S5, L1, L2, L3, L5 (reduced 3 alerts to 2, not consecutive), L6 (11,828 bytes). n/a: C7 (active project), L4 (no images), L7 (no translations). gap: S4, no `LICENSE` file, so no License section; choosing a license is the owner's decision. |

## Log

- L1 (2026-11-17, verbatim): "Tambien me gustaria que a la hora de crear el readme tambien siga las mejores practicas a la hora de crear el readme"
- 2026-11-17: Backlog drafted; pending approval.
- 2026-11-17: Approved with all stories (user: "Aprobar, todas"). Assumptions accepted as written.
- 2026-11-17: Added `references/best-practices.md`, wired it into `SKILL.md`, and applied it to `README.md`. One gap: no `LICENSE` file.
