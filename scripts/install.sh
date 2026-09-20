#!/usr/bin/env bash
set -e

echo "🚀 Installing HT_AI_SKILL via Shell Script..."

REPO_URL="https://github.com/Association-of-stupid-people/HT_AI_SKILL.git"
TEMP_DIR=$(mktemp -d)

git clone --depth 1 "$REPO_URL" "$TEMP_DIR"

if command -v node >/dev/null 2>&1; then
    node "$TEMP_DIR/bin/install.js"
else
    # Fallback to pure bash copy
    mkdir -p ~/.claude/skills ~/.omp/skills
    cp -r "$TEMP_DIR/skills/"* ~/.claude/skills/ 2>/dev/null || true
    cp -r "$TEMP_DIR/skills/"* ~/.omp/skills/ 2>/dev/null || true
    echo "✅ Copied skills to ~/.claude/skills and ~/.omp/skills"
fi

rm -rf "$TEMP_DIR"
echo "✨ Installation complete!"
