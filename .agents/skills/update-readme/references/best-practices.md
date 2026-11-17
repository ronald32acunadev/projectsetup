# README Best Practices Checklist

Run this checklist in the Verify step of [`update-readme`](../SKILL.md). Each item cites its source. When the repository lacks the fact an item needs, follow its "If missing" rule. Never invent content to pass an item.

Sources:

- **[GH-README]** GitHub Docs, About READMEs: <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes>
- **[GH-SYNTAX]** GitHub Docs, Basic writing and formatting syntax: <https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax>
- **[STD]** Standard Readme specification: <https://github.com/RichardLitt/standard-readme/blob/main/spec.md>
- **[MAR]** Make a README: <https://www.makeareadme.com/>

## 1. Content: the five questions

| # | Check | If missing | Source |
| :--- | :--- | :--- | :--- |
| C1 | States **what the project does** near the top. | Required; derive it from code and manifests. | GH-README, MAR |
| C2 | States **why it is useful** (the problem it solves). | Required. | GH-README |
| C3 | Explains **how to get started**: install steps with a code block, and a requirements note when versions, OS, or manual dependencies matter. | Documentation-only repositories may skip install. | GH-README, STD, MAR |
| C4 | Says **where to get help** (issue tracker, chat, email). | Point to the repository's issues only if the remote is a public host; otherwise omit. | GH-README, MAR |
| C5 | Says **who maintains and contributes**, and whether contributions or pull requests are accepted and under which requirements. | Name the maintainer from the remote owner or manifest `author`; never invent contributors. | GH-README, STD, MAR |
| C6 | Shows **usage** with a code block; CLI tools show the CLI command. | Skip for documentation-only repositories. | STD, MAR |
| C7 | Says so at the top if development has slowed or stopped. | Only when the repository or user states it. | MAR |

## 2. Structure

| # | Check | If missing | Source |
| :--- | :--- | :--- | :--- |
| S1 | One H1 title that matches the repository, folder, and package name, or explains the difference. | n/a | STD |
| S2 | A short description under 120 characters, on its own line, right after the title (and badges). | n/a | STD |
| S3 | A table of contents linking every H2 when the README is 100 lines or longer. | Optional under 100 lines; GitHub also generates an Outline from headings. | STD, GH-SYNTAX |
| S4 | License section last, with an SPDX identifier and the owner, linking the `LICENSE` file. | No `LICENSE` file means no License section; report it as a gap, do not guess a license. | STD, MAR |
| S5 | Longer documentation lives in `docs/` or a wiki and is linked, not inlined. | n/a | GH-README |

## 3. Links, images, and rendering

| # | Check | If missing | Source |
| :--- | :--- | :--- | :--- |
| L1 | Links to files in the repository are **relative**; absolute links may break in clones. | n/a | GH-README, GH-SYNTAX |
| L2 | No broken links; every anchor matches a heading (duplicate headings get `-1`, `-2`). | n/a | STD, GH-SYNTAX |
| L3 | Link text stays on one line; a link whose text wraps does not work. | n/a | GH-README |
| L4 | Every image has alt text describing what it shows. | n/a | GH-SYNTAX |
| L5 | One or two alerts per README at most, never two in a row, never nested. | n/a | GH-SYNTAX |
| L6 | The file stays under 500 KiB; GitHub truncates content beyond it. | n/a | GH-README |
| L7 | Translations use a BCP 47 tag (`README.es.md`); `README.md` stays English and section titles are translated. | Only when translations exist. | STD |

## 4. Reporting

Report each item as `pass`, `n/a` (with the reason), or `gap` (what is missing and why it could not be filled from repository facts). A `gap` never blocks delivery, but it is listed in the Output Contract.

Where this checklist conflicts with the repository's own conventions, the repository wins and the conflict is reported.
