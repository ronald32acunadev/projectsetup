---
name: pumba-update-readme
description: "Use when the user invokes /pumba-update-readme or asks to create, audit, or update README.md or translated README files in the current project."
license: MIT
metadata:
  author: ronald32acunadev
  version: "1.0"
---

<!-- managed-by: projectsetup/scripts/install_skills.sh -->

## Activation Contract

Load this skill when the user invokes `/pumba-update-readme` or asks to create, audit, modernize, or synchronize `README.md` or `README.<lang>.md` files. The full skill lives in the central folder:

`{{PROJECTSETUP_DIR}}/.agents/skills/update-readme/`

## Execution Steps

1. Read `{{PROJECTSETUP_DIR}}/.agents/skills/update-readme/SKILL.md` and follow it exactly. If it does not exist, stop and tell the user the central folder moved and the installer must be rerun.
2. Resolve its `references/...` links inside `{{PROJECTSETUP_DIR}}/.agents/skills/update-readme/`.
3. Audit and edit the README files of the **current project**, never the central folder.
