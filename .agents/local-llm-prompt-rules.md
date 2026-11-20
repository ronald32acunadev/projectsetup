# Local LLM prompt rules (pumbastudio, pumbalama)

Paste this list into the system message of every code request to a local model. When a review rejects part of an answer, add one short rule here (no history).

- Use only the injected runner, mapping, and paths: no `Path.exists()`, `os.environ`, or `Path.home()` in code that receives them.
- A parameter that defaults to `None` meaning "use the default" calls the default explicitly.
- Bind every name a `finally` block uses before the `try`.
- `subprocess.Popen`: call `wait()` before reading `returncode`.
- An `except` that maps some exception types re-raises all others.
- Timers and callbacks capture what they need in a local variable.
- Always repeat in the closing checklist: only real imports, `collections.abc` for `Mapping`/`Callable`, built-in generics, `X | None`; no `typing.Optional`, no `from __future__ import annotations`.
- No step-number comments, no comments that restate the code.
- Never assign attributes of a frozen dataclass; build it complete.
- Read files through the given root path, never a path relative to the current directory.
- Every command gets the full env the task lists; do not drop it on some commands.
- `glob()` returns a generator, always truthy: use `any(...)` or `next(..., None)`.
- Qt `Signal(...)` is declared at class level, never assigned in `__init__`; connect signals to bound methods, not lambdas that capture objects.
- Use enum members exactly as the brief spells them (case included).
- Qt `self.tr("...")` takes a string literal, never a variable; `blockSignals` is a plain call, not a context manager.
- Ask for one file per request and end the request with a 3-line checklist of the rules it most needs.
- Tests: pytest functions with `tmp_path`; never write to `/tmp`; never patch a whole module; import every name used.
- Tests: keep each requested test's name, inputs, and assertions exactly; assert exact values.

- Put every import at the top of the file; never inside a function or fixture.
- In a correction request, apply every numbered fix; return the file only when all are done.
- Always copy exact relative import paths with extensions verbatim from the prompt; never shorten them to bare module names.
- Never reset an idempotent `closePromise` back to `null` in `finally`; keep it latched so repeated `close()` calls stay no-ops.
- TypeScript with `noUncheckedIndexedAccess`: index arrays in tests as `arr[0]!`; never import names the file does not use.
- Vitest: `expect(fn).toThrow()` returns nothing; assert error fields with `toThrow(expect.objectContaining({ code, status }))`.
- Keep a limit and its running total in two separate fields; never compare a field with itself.
- Keep event-subscription disposables in their own array, never inside the listener arrays.
- A private backing field never shares its name with a public getter (`hasExited` behind `get exited()`).
- Anchored edits: BEFORE and AFTER are each ONE verbatim existing line; REPLACE holds only the new lines between them, never the whole file or the anchors.
- Never call methods the brief does not list (no invented helpers such as `getServer()`); check each returned value's type in the brief before using it (a function is not a `{ dispose() }` object).
- Search/replace answers: label every block `OLD:` and `NEW:`, each in its own fenced block; never return NEW fragments alone, and return every requested change (count them before answering).
