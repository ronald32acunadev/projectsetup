# README Visual Format

House style for every README written by [`update-readme`](../SKILL.md). It sits on top of the archetype blueprint in [`archetypes-and-checklists.md`](./archetypes-and-checklists.md): the blueprint decides which sections exist, this file decides how they look.

Everything here must render on GitHub. GitHub strips `<style>`, `style=""`, and classes, so never rely on CSS.

## 1. Layout (in order)

1. **Centered header** inside `<div align="center">`:
   - Logo (only if found, see §2), `width="120"` or less.
   - `# <Project name>` as the only H1.
   - One-line tagline in bold or italics.
   - Badges (only provable facts, see §4) on one line.
   - Language switcher when `README.<lang>.md` files exist: `[English](README.md) · [Español](README.es.md)`.
2. **Lead**: two or three sentences after the header: what it does, who it helps.
3. **Contents**: anchored list of the H2 sections.
4. **Sections** from the archetype blueprint, each with an H2 and an optional leading emoji only if the existing README already uses them.
5. **At least one Mermaid diagram** for the main workflow, architecture, or data flow. Prefer `flowchart LR` or `flowchart TD`; keep it under about 12 nodes.

## 2. Logo detection

A logo exists only when the repository tracks one. Check, in order, and use the first match:

```bash
git ls-files | grep -iE '(^|/)(logo|icon|brand)[^/]*\.(svg|png|webp)$'
```

Then the stack's standard icon locations: `public/favicon.svg`, `assets/icon.png`, `build/icon.png`, `src-tauri/icons/`, `android/app/src/main/res/mipmap-*/ic_launcher.png`, `ios/Runner/Assets.xcassets/AppIcon.appiconset/`.

- Prefer SVG, then the largest PNG.
- When separate light and dark logos exist, use `<picture>` with `prefers-color-scheme` sources.
- **Never** generate, download, or link an external logo. No logo found means no logo in the header.

## 3. Color detection

Project colors come only from tracked theme files:

| Stack | Where to read |
| :--- | :--- |
| CSS / web | `:root` custom properties (`--primary`, `--accent`, `--brand-*`) |
| Tailwind | `theme.extend.colors` in `tailwind.config.*`, or `@theme` in CSS (v4) |
| Flutter | `ColorScheme` / `ThemeData` seeds (`seedColor`, `primary`) |
| Design tokens | `tokens.json`, `*.tokens.json` |
| Electron / desktop | the app's main stylesheet or theme module |

Take at most three colors: primary, secondary/accent, and a text or background color. **Never** invent a palette. No colors found means the neutral defaults below.

## 4. Applying colors and badges

Colors reach the README only through GitHub-safe channels:

- **Mermaid**, with the project palette:

  ```mermaid
  %%{init: {"theme": "base", "themeVariables": {"primaryColor": "#<primary>", "primaryTextColor": "#ffffff", "primaryBorderColor": "#<primary>", "lineColor": "#<accent>"}}}%%
  flowchart LR
    A[Step] --> B[Step]
  ```

  Without project colors, omit the `init` line so GitHub uses its own light and dark themes.
- **Badges** (shields.io): `https://img.shields.io/badge/<label>-<message>-<hex without #>`. Use the primary color when it exists. Only for proven facts: license file, manifest version, runtime engine, CI workflow file.

## 5. Readability elements

| Element | Use for | Syntax |
| :--- | :--- | :--- |
| Alerts | One or two per README, never two in a row (GitHub Docs guidance) | `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` |
| Collapsible | Long references (full flag lists, config dumps) | `<details><summary>Title</summary>` … `</details>` |
| Tables | Flags, env vars, files, comparisons | GFM tables |
| Code blocks | Every command; always with a language tag | ` ```bash `, ` ```json `, ` ```mermaid ` |

Leave a blank line after `<summary>…</summary>` and before `</details>`, or GitHub will not render the Markdown inside.

## 6. Checks before finishing

- Every fenced block has a language tag.
- Every relative link and image path exists; every anchor matches a heading.
- The logo path and every color come from a tracked file, or are absent.
- Each Mermaid block parses (`npx -y @mermaid-js/mermaid-cli -i README.md -o <scratch>/out.md` when available; otherwise report it as manual-only).
