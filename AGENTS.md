# Local Code Generation Delegation

## Scope & Applicability
This rule applies whenever the agent generates, writes, or refactors source code files across this project.

## Core Rule
Before creating or modifying source code files (`write_to_file`, `replace_file_content`), the agent MUST delegate code synthesis to local LLM providers if available in the session.

## Provider Hierarchy & Execution Protocol

### 1. Primary: PumbaStudio (`pumbastudio`)
- **Tool**: `pumbastudio` -> `openai_chat`
- **Condition**: Use when `pumbastudio` MCP server is active and responsive.
- **Invocation**:
  - `ServerName`: `"pumbastudio"`
  - `ToolName`: `"openai_chat"`
  - `Arguments`:
    - `model`: `"gpt-4o"`
    - `messages`: System prompt detailing architecture requirements and code generation request with necessary file context.

### 2. Secondary: PumbaLama (`pumbalama`)
- **Tool**: `pumbalama` -> `chat_completion`
- **Condition**: Use when `pumbastudio` is unreachable or fails, and `pumbalama` is available.
- **Invocation**:
  - `ServerName`: `"pumbalama"`
  - `ToolName`: `"chat_completion"`
  - `Arguments`:
    - `model`: `"qwen2.5-coder:32b"` (or installed coder model such as `"qwen3-coder:30b"`, `"qwen2.5-coder:14b"`)
    - `messages`: System and user messages specifying code requirements and context.

### 3. Fallback (Active Host Model: Gemini, Claude, etc.)
- **Condition**: Neither `pumbastudio` nor `pumbalama` is reachable, active, or responding.
- **Behavior**: The active host model driving Antigravity (Gemini, Claude, or any currently selected model) MUST take over directly and generate the required code.
- **Seamless Execution**: Do not block, halt, or fail the workflow. The host model generates the implementation directly and applies it using standard file tools, noting briefly that local models were unavailable.

## File Application
1. Review the output from the local model for syntax and architectural soundness.
2. Persist the code to disk using `write_to_file` or `replace_file_content`.
