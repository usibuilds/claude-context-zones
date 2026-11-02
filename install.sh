#!/usr/bin/env bash
# Claude Context Zones — install into a project for Claude Code.
# Usage: ./install.sh /path/to/your-project
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-}"
if [ -z "$TARGET" ] || [ ! -d "$TARGET" ]; then
  echo "Usage: ./install.sh /path/to/your-project"; exit 1
fi
command -v node >/dev/null || { echo "Node.js not found (node -v). Install Node first."; exit 1; }
TARGET="$(cd "$TARGET" && pwd)"

mkdir -p "$TARGET/.claude"
if [ -f "$TARGET/.claude/settings.json" ]; then
  cp "$TARGET/.claude/settings.json" "$TARGET/.claude/settings.backup.json"
  echo "Existing settings.json backed up to .claude/settings.backup.json (merge by hand if needed)."
fi
cp -R "$HERE/claude-code/.claude/." "$TARGET/.claude/"

mkdir -p "$TARGET/docs"
for f in PLAN.md HANDOFF.md; do
  [ -f "$TARGET/docs/$f" ] || cp "$HERE/claude-code/docs/$f" "$TARGET/docs/$f"
done

mkdir -p "$HOME/.claude/skills"
cp -R "$HERE/skills/context-guardian" "$HERE/skills/feature-builder" "$HOME/.claude/skills/"

echo
echo "Installed. Status line test:"
echo "{\"cwd\":\"$TARGET\",\"context_window\":{\"context_window_size\":200000,\"used_percentage\":5}}" \
  | node "$TARGET/.claude/hooks/statusline.js"; echo
echo
echo "Next: edit docs/PLAN.md, then start 'claude' in $TARGET and type /resume"
