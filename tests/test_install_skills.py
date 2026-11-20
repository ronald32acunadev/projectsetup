import os
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCRIPT = REPO / "scripts" / "install_skills.sh"


def run_installer(home: Path, *args: str) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env["HOME"] = str(home)
    return subprocess.run(
        ["sh", str(SCRIPT), *args],
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def test_install_writes_ai_skill_rendered(tmp_path: Path) -> None:
    (tmp_path / ".claude").mkdir()

    result = run_installer(tmp_path)

    assert result.returncode == 0
    installed = (tmp_path / ".claude/skills/pumba-projectsetup-ai/SKILL.md").read_text(
        encoding="utf-8"
    )
    expected = (
        (REPO / ".agents/global-skills/pumba-projectsetup-ai/SKILL.md")
        .read_text(encoding="utf-8")
        .replace("{{PROJECTSETUP_DIR}}", str(REPO))
    )
    assert installed == expected
    assert "{{PROJECTSETUP_DIR}}" not in installed


def test_install_keeps_existing_skills(tmp_path: Path) -> None:
    (tmp_path / ".claude").mkdir()

    result = run_installer(tmp_path)

    assert result.returncode == 0
    assert (tmp_path / ".claude/skills/pumba-projectsetup/SKILL.md").exists()
    assert (tmp_path / ".claude/skills/pumba-update-readme/SKILL.md").exists()


def test_uninstall_removes_ai_skill(tmp_path: Path) -> None:
    (tmp_path / ".claude").mkdir()
    run_installer(tmp_path)

    result = run_installer(tmp_path, "--uninstall")

    assert result.returncode == 0
    assert not (tmp_path / ".claude/skills/pumba-projectsetup-ai").exists()


def test_unmanaged_ai_skill_is_conflict(tmp_path: Path) -> None:
    skill_dir = tmp_path / ".claude/skills/pumba-projectsetup-ai"
    skill_dir.mkdir(parents=True)
    (skill_dir / "SKILL.md").write_text("user content\n", encoding="utf-8")

    result = run_installer(tmp_path)

    assert result.returncode == 1
    assert "conflict" in result.stderr
    assert (skill_dir / "SKILL.md").read_text(encoding="utf-8") == "user content\n"
