# Code generation instructions

Paste this file, then `.agents/local-llm-prompt-rules.md`, into the system message of every code request to a delegated implementer (local or hosted). It applies to new code and to edits of existing code.

- Read the whole request before writing. Use only the APIs, imports, and paths given in the request or its existing code; never invent one.
- Match the existing code: naming, style, error handling, and project conventions. English identifiers and comments.
- Make the smallest change that meets every acceptance criterion. Do not refactor, rename, or reformat code the task does not name.
- Deliver complete code: no placeholders, `TODO`, `...`, or "rest unchanged" inside the code you return.
- Handle every error case the task lists; never swallow an exception silently.
- Keep functions small and side effects explicit; pass dependencies in instead of reading globals.
- Tests assert observable behavior with exact values, are deterministic, and use isolated temporary state.
- Edits: return each change as the target path, the unchanged lines just before and after it copied verbatim, and the full replacement block. Hosted implementers with file tools edit only the allowed files.
- If a requirement is unclear or contradicts the code, say so in one line instead of guessing.
- Before answering, check the code against each acceptance criterion and the final checklist, then return only the requested output format.
