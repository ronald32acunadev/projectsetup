# Project Setup Template

Template repository containing starter configurations and agent rules for new projects.

## Included Customizations

- **`AGENTS.md`** / **`.agents/rules/AGENTS.md`**: Enforces local code generation delegation.
  - Prioritizes local LLMs via MCP (`pumbastudio` on port 1234, `pumbalama` on port 11434).
  - Automatically falls back to the host model (Gemini, Claude, etc.) if local servers are offline.

## Usage in New Projects

To apply these rules to a new project, copy either:

1. **Option A (Standalone Rule File)**:
   ```bash
   cp AGENTS.md /path/to/your-new-project/
   ```

2. **Option B (Standard Customization Folder)**:
   ```bash
   cp -r .agents /path/to/your-new-project/
   ```

Once copied, Antigravity and compatible agents will automatically discover and enforce the rules within the project scope.
