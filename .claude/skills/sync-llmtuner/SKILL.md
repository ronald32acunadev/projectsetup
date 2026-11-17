---
name: sync-llmtuner
description: "Trigger: llm-tuner changed, sync/update/refresh site content, version pill, or screenshots. Brings the site in line with the llm-tuner CLI and desktop app."
license: MIT
metadata:
  author: Ronald Daniel Acuña Arias
  version: "2.0.0"
---

## Activation Contract

Load this skill when the user says llm-tuner changed, asks to sync, update, or refresh the site content, the version pill, or the showcase screenshots, or reports that the site is missing something llm-tuner has. The source repository is `../../Desktop/llmtuner` (the `llm-tuner` npm package).

## Hard Rules

- Run every step without asking for approval; stop only when a step fails or a Decision Gate says to ask.
- Take every fact from llm-tuner sources (`references/content-map.md`); never infer behavior. Quote desktop labels verbatim from `src/i18n/en.js` and `es.js`.
- Do not treat llm-tuner's own `--help` as complete; confirm commands and flags in `src/cli/router.js` and `src/cli/commands/*.js`.
- Update English and Spanish together; flags, commands, and identifiers stay in English.
- Code examples are full commands taken from the README or code, never a lone flag.
- Content edits go in the `Get*Sections()` data methods. New components, pages, or logic follow `AGENTS.md`: backlog approval first, code through the local model.
- Never stop or restart a dev server you did not start; stop your own preview when verification ends.
- Do not commit or deploy unless the user asks.

## Decision Gates

| Situation | Action |
| --- | --- |
| `../../Desktop/llmtuner` is missing | Find it with `find ../.. -maxdepth 3 -type d -name llmtuner`, use that path, and update the paths in this skill |
| llm-tuner `package.json` version is not on npm (`npm view llm-tuner versions`) | Ask before syncing an unreleased version |
| llm-tuner has uncommitted README changes | Use them only after confirming each claim in its source code |
| Versions match and no commits follow the release commit | Run the coverage audit (step 3); stop only if it finds no gaps |
| A manual-capture screen changed | Keep the image, say in its caption what it no longer shows, and tell the user |
| Port 5299 is taken | It is the user's server: preview with `site-alt` (port 5310) and tell the user to restart theirs, because a rebuild makes a running dev server return 404 for `_framework` files |

## Execution Steps

1. Compare the version pill in `Layout/MainLayout.razor` with llm-tuner `package.json`; find the `bump version` or `prepare version` commit for the site's version.
2. List changes after it: `git log`, `git diff --stat -- src electron`, `git diff -- README.md`. Skip internal-only changes.
3. Coverage audit: map every README section and `src/i18n` key group to its site location in `references/content-map.md`; list gaps.
4. Update the site content for every change and gap.
5. Refresh screenshots per `references/screenshots.md` and inspect each regenerated image.
6. Verify per `references/verification.md`.

## Output Contract

Report in the user's language:
- llm-tuner version range synced, or that the site was already current.
- Site files changed and gaps fixed.
- Screenshots regenerated and screens that need a manual capture.
- Verification results, including anything not verified.
- Upstream issues noticed in llm-tuner (for example incomplete `--help`).
- That nothing was committed or deployed, unless the user asked.

## References

- `references/content-map.md` — llm-tuner sources and the site location for each kind of change.
- `references/screenshots.md` — capture script, regenerated files, manual captures.
- `references/verification.md` — build, preview, and browser checks, with known pitfalls.
- `scripts/capture.mjs` — screenshot capture script.
