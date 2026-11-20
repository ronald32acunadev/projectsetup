#!/bin/sh
set -eu

fail() {
    printf 'Error: %s\n' "$*" >&2
    exit 1
}

MARKER='<!-- managed-by: projectsetup/scripts/install_skills.sh -->'
USAGE='Usage: sh scripts/install_skills.sh [--dry-run] [--uninstall]'
SKILLS='pumba-projectsetup pumba-update-readme'

MODE=install
DRY_RUN=0
CONFLICTS=0
RENDER_TMP=''

for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=1 ;;
        --uninstall) MODE=uninstall ;;
        -h | --help)
            printf '%s\n' "$USAGE"
            exit 0
            ;;
        *)
            printf 'Error: unknown option: %s\n' "$arg" >&2
            printf '%s\n' "$USAGE" >&2
            exit 2
            ;;
    esac
done

REPO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P) || fail "cannot resolve repository directory"

if [ -z "${HOME:-}" ] || [ ! -d "$HOME" ]; then
    fail "HOME is not a directory"
fi

for skill in $SKILLS; do
    template="$REPO_DIR/.agents/global-skills/$skill/SKILL.md"
    if [ ! -f "$template" ]; then
        fail "Missing template: $template"
    fi
done

trap 'rm -f "$RENDER_TMP"' EXIT
RENDER_TMP=$(mktemp)

report() {
    if [ "$DRY_RUN" -eq 1 ]; then
        printf '[dry-run] %-12s%s\n' "$1" "$2"
    else
        printf '%-12s%s\n' "$1" "$2"
    fi
}

note_conflict() {
    CONFLICTS=$((CONFLICTS + 1))
    report conflict "$1/$2: $3 exists and was not created by this installer" >&2
}

exists_path() {
    [ -e "$1" ] || [ -L "$1" ]
}

is_managed() {
    [ -d "$1" ] && [ ! -L "$1" ] && [ -f "$1/SKILL.md" ] && grep -qF -e "$MARKER" "$1/SKILL.md"
}

render_template() {
    REPO_DIR="$REPO_DIR" awk '
        BEGIN {
            token = "{{PROJECTSETUP_DIR}}"
            replacement = ENVIRON["REPO_DIR"]
            token_length = length(token)
        }
        {
            line = $0
            rendered = ""
            while ((position = index(line, token)) > 0) {
                rendered = rendered substr(line, 1, position - 1) replacement
                line = substr(line, position + token_length)
            }
            print rendered line
        }
    ' "$1" > "$RENDER_TMP"
}

install_skill() {
    agent=$1
    skill=$2
    target=$3
    template="$REPO_DIR/.agents/global-skills/$skill/SKILL.md"

    if exists_path "$target"; then
        if ! is_managed "$target"; then
            note_conflict "$agent" "$skill" "$target"
            return 0
        fi
        render_template "$template"
        if cmp -s "$RENDER_TMP" "$target/SKILL.md"; then
            report unchanged "$agent/$skill: $target"
            return 0
        fi
        report updated "$agent/$skill: $target"
    else
        render_template "$template"
        report installed "$agent/$skill: $target"
        if [ "$DRY_RUN" -eq 0 ]; then
            mkdir -p "$target"
        fi
    fi

    if [ "$DRY_RUN" -eq 0 ]; then
        cp "$RENDER_TMP" "$target/SKILL.md.tmp"
        mv "$target/SKILL.md.tmp" "$target/SKILL.md"
    fi
}

uninstall_skill() {
    agent=$1
    skill=$2
    target=$3

    if ! exists_path "$target"; then
        report absent "$agent/$skill: $target"
        return 0
    fi
    if ! is_managed "$target"; then
        note_conflict "$agent" "$skill" "$target"
        return 0
    fi
    if [ "$DRY_RUN" -eq 0 ]; then
        rm -f "$target/SKILL.md"
        if ! rmdir "$target" 2>/dev/null; then
            report warning "$agent/$skill: $target kept, it contains other files" >&2
        fi
    fi
    report removed "$agent/$skill: $target"
}

handle_agent() {
    agent=$1
    config_dir=$2
    skills_dir=$3

    if [ ! -d "$config_dir" ]; then
        report skipped "$agent: not installed"
        return 0
    fi
    for skill in $SKILLS; do
        target="$skills_dir/$skill"
        if [ "$MODE" = uninstall ]; then
            uninstall_skill "$agent" "$skill" "$target"
        else
            install_skill "$agent" "$skill" "$target"
        fi
    done
}

handle_agent claude "$HOME/.claude" "$HOME/.claude/skills"
handle_agent codex "$HOME/.codex" "$HOME/.codex/skills"
handle_agent opencode "$HOME/.config/opencode" "$HOME/.config/opencode/skills"
handle_agent antigravity "$HOME/.gemini/config" "$HOME/.gemini/config/skills"

printf 'Source: %s\n' "$REPO_DIR"

if [ "$CONFLICTS" -gt 0 ]; then
    exit 1
fi
exit 0
