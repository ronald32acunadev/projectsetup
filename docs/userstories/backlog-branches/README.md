# Backlog Branches

**Goal:** When the user approves a backlog, the agent saves any pending work on the current branch and starts the approved backlog on its own new branch, so every backlog lives in its own branch.

**Surfaces:** `AGENTS.md`, `.agents/rules/AGENTS.md` (byte-identical copy), `README.md` (rule summary). Passive documentation; no code.

## Approval and execution

- Backlog: Approved 2026-11-17.
- Execution mode: All stories.
- Implementation: In progress.

## Confirmed decisions

- 2026-11-17: "Subir los cambios pendientes a la rama anterior" means commit **and push** to the remote (user answer: "Commit y push").
- 2026-11-17: The new branch must contain those saved changes: it is created from the previous branch after the commit and push (user: "aplicar los cambios a la nueva rama").

## Assumptions (confirm or revise at approval)

- **A1 — Protected branches:** "main branches" are the remote's default branch (`origin/HEAD`) plus `main` and `master`.
- **A2 — Branch name:** the new branch is `feature/<featurename>`, where `<featurename>` is the backlog folder name in `docs/userstories/<featurename>/`.
- **A4 — Follow-ups:** a revision or follow-up prompt for an existing backlog reuses its branch instead of creating another.

## Stories

### US-01 — Create a branch when a backlog is approved

**Statement:** As the repository owner, I want the agent to create a new branch when I approve a backlog, so that each backlog's work is isolated and reviewable on its own branch.

**Status:** pending. **Dependencies:** none.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-01 / AC-01` | Given the user explicitly approves a backlog and chooses an execution mode, when the agent starts implementation, then before the first implementation edit it creates `feature/<featurename>` (A2) from the current branch, after any pending work is saved (US-02), and switches to it. Approval of the design alone, or an ambiguous answer, creates no branch. | Readback of the rule in `AGENTS.md`; scratch-repo walkthrough. |
| `US-01 / AC-02` | The new backlog file `docs/userstories/<featurename>/README.md` is committed as the first commit on the new branch, never on the previous branch. | Scratch-repo walkthrough: `git log` on both branches. |
| `US-01 / AC-03` | If `feature/<featurename>` already exists for the same backlog, the agent switches to it instead of creating a duplicate (A4). For an unrelated feature with a colliding name, the existing naming rule picks a distinct name. | Readback. |
| `US-01 / AC-04` | `AGENTS.md` and `.agents/rules/AGENTS.md` are byte-identical, and the README rule summary mentions the branch step, in the same commit. | `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` prints nothing. |

### US-02 — Save pending work on the previous non-protected branch

**Statement:** As the repository owner, I want pending changes on the current feature branch to be committed and pushed there before the new branch is created, so that unfinished work from the previous backlog is not mixed into the new one.

**Status:** pending. **Dependencies:** `US-01`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-02 / AC-01` | Given uncommitted changes on a branch that is not protected (A1), when a backlog is approved, then the agent stages those files explicitly (no blanket `git add`), excluding the new backlog file, commits them with a Conventional Commit message, and pushes that branch. The new branch is then created from it, so it contains those changes. | Scratch-repo walkthrough with a local bare remote: the saved commit is on the previous branch, on its remote, and in the new branch's history. |
| `US-02 / AC-02` | If the push fails (no remote, no upstream, rejected), the agent does not create the new branch, keeps the commit, and reports the exact error to the user. | Scratch-repo walkthrough with no remote configured. |
| `US-02 / AC-03` | With no pending changes, the agent creates the new branch without committing or pushing anything. | Readback. |

### US-03 — Never commit to protected branches

**Statement:** As the repository owner, I want the agent to leave protected branches untouched, so that `main` only receives work through my own merges.

**Status:** pending. **Dependencies:** `US-01`.

| Criterion | Acceptance condition | Verification |
| --- | --- | --- |
| `US-03 / AC-01` | Given uncommitted changes on a protected branch (A1), when a backlog is approved, then the agent does not commit or push to it, lists the pending files, and asks whether to move them to the new branch or leave them out of it. It waits for the answer before creating the branch. | Readback of the rule in `AGENTS.md`. |

## QA evidence and traceability mapping

Passive documentation: there is no runnable RED test. Verification is structural readback plus a manual walkthrough in a throwaway repository outside the worktree.

| Story / criterion | Check | Observed result |
| --- | --- | --- |
| `US-01 / AC-01`, `AC-03` | Readback of the new rule in `AGENTS.md` | Pending |
| `US-01 / AC-02`, `US-02 / AC-01` | Scratch repo with a local bare remote: run the rule's git steps; check `git log` on both branches and the remote | Pending |
| `US-01 / AC-04` | `git diff --no-index AGENTS.md .agents/rules/AGENTS.md` | Pending |
| `US-02 / AC-02` | Scratch repo with no remote: push fails, no new branch exists | Pending |
| `US-02 / AC-03`, `US-03 / AC-01` | Readback | Pending |

## Log

- L1 (2026-11-17, verbatim): "Quiero actualizar la definicion de agentes  para cuando me solicita verificar las historias y aprobar el backlog al aprobarlo se cree una nueva rama, y se habia cambios pendientes se suban a la rama anterior siempre que no sean ramas principales del repositorio , es decir quiero guardar en branches cada backlog"
- 2026-11-17: User confirmed "Commit y push" for pending changes. Backlog drafted; pending approval.
- L2 (2026-11-17, verbatim): "Subir los cambios a  la rama que se estaba trabajando y hacer push  y aplicar los cambios a la nueva rama". Replaced assumption A3 with the confirmed decision; updated US-01 / AC-01 and US-02 / AC-01.
- 2026-11-17: Approved with all stories (user: "Aprobar, todas"). Assumptions accepted as written.
