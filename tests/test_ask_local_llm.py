"""Tests for ask_local_llm.py."""

import importlib.util
import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import pytest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "ask_local_llm.py"


@pytest.fixture
def module():
    """Load the script by path, fresh per test."""
    spec = importlib.util.spec_from_file_location("ask_local_llm", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def stub(tmp_path: Path) -> tuple[str, list[dict]]:
    """Start an HTTPServer on a daemon thread that echoes POST requests with a fixed response."""
    requests: list[dict] = []

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_: object) -> None:
            pass

        def do_POST(self) -> None:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode("utf-8"))
            requests.append(data)
            response = {
                "model": "stub",
                "choices": [
                    {
                        "message": {
                            "content": "Here:\n```python\nx = 1\n```\n"
                        }
                    }
                ],
                "usage": {}
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode("utf-8"))

    server = HTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base_url = f"http://127.0.0.1:{server.server_port}"
    yield base_url, requests
    server.shutdown()
    server.server_close()


def test_system_message_order_extra_then_instructions_then_rules(
    module: object,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    stub: tuple[str, list[dict]],
) -> None:
    """US-02 / AC-01: system message order is extra, then instructions, then rules."""
    req = tmp_path / "req.md"
    req.write_text("do it", encoding="utf-8")
    extra = tmp_path / "extra.md"
    extra.write_text("EXTRA TEXT", encoding="utf-8")
    out = tmp_path / "out.md"

    monkeypatch.setitem(module.PROVIDERS, "lmstudio", stub[0])
    exit_code = module.main(["--user", str(req), "--system", str(extra), "--out", str(out)])
    assert exit_code == 0

    system = stub[1][0]["messages"][0]["content"]
    assert system.startswith("EXTRA TEXT")
    assert module.INSTRUCTIONS.read_text(encoding="utf-8") in system
    assert module.RULES.read_text(encoding="utf-8") in system
    assert system.index("EXTRA TEXT") < system.index("# Code generation instructions") < system.index("# Local LLM prompt rules")


def test_reasoning_off_without_think(
    module: object,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    stub: tuple[str, list[dict]],
) -> None:
    """US-02 / AC-01: reasoning_effort is 'none' without --think."""
    req = tmp_path / "req.md"
    req.write_text("do it", encoding="utf-8")
    out = tmp_path / "out.md"

    monkeypatch.setitem(module.PROVIDERS, "lmstudio", stub[0])
    exit_code = module.main(["--user", str(req), "--out", str(out)])
    assert exit_code == 0

    assert stub[1][0]["reasoning_effort"] == "none"


def test_think_keeps_reasoning_on(
    module: object,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    stub: tuple[str, list[dict]],
) -> None:
    """Regression: --think option does not add reasoning_effort."""
    req = tmp_path / "req.md"
    req.write_text("do it", encoding="utf-8")
    out = tmp_path / "out.md"

    monkeypatch.setitem(module.PROVIDERS, "lmstudio", stub[0])
    exit_code = module.main(["--user", str(req), "--out", str(out), "--think"])
    assert exit_code == 0

    assert "reasoning_effort" not in stub[1][0]


def test_missing_instructions_exits_without_request(
    module: object,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    stub: tuple[str, list[dict]],
) -> None:
    """US-02 / AC-02: missing instructions file exits and makes no request."""
    monkeypatch.setattr(module, "INSTRUCTIONS", tmp_path / "missing.md")
    req = tmp_path / "req.md"
    req.write_text("do it", encoding="utf-8")
    with pytest.raises(SystemExit, match="Missing code generation instructions:"):
        module.main(["--user", str(req), "--out", str(tmp_path / "out.md")])
    assert stub[1] == []


def test_code_out_saves_first_code_block(
    module: object,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    stub: tuple[str, list[dict]],
) -> None:
    """US-02 / AC-03: --code-out saves the first code block."""
    req = tmp_path / "req.md"
    req.write_text("do it", encoding="utf-8")
    out = tmp_path / "out.md"
    code_out = tmp_path / "code.py"

    monkeypatch.setitem(module.PROVIDERS, "lmstudio", stub[0])
    exit_code = module.main(["--user", str(req), "--out", str(out), "--code-out", str(code_out)])
    assert exit_code == 0
    assert (tmp_path / "code.py").read_text(encoding="utf-8") == "x = 1\n"
    assert (tmp_path / "out.md").read_text(encoding="utf-8") == "Here:\n```python\nx = 1\n```\n"
