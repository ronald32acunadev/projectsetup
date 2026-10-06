# Project Setup Template

Template repository containing starter configurations and agent rules for new projects, modeled after [`llmtuner`](/run/media/pumba/Proyects/Proyects/llmtuner).

## Included Rules & Standards

1. **Language & Documentation Rule (Mandatory)**:
   - All code, identifiers, function and variable names, comments, documentation (`docs/`, READMEs), and commit messages are written in **English**.
   - Translations (`README.es.md`, i18n catalogs) are the only exceptions.
2. **Local Code Authorship & Delegation**:
   - Primary: `pumbastudio` (LM Studio port 1234, tool `openai_chat`).
   - Secondary: `pumbalama` (Ollama port 11434, tool `chat_completion`).
   - Fallback: Host model (Gemini, Claude, etc.) seamlessly synthesizes code if local providers are unavailable or offline.
3. **Outdated Knowledge Safeguard**:
   - The agent verifies current dependencies and documentation, feeding explicit signatures and versions to local models.

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
