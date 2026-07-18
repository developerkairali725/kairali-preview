#!/usr/bin/env bash
# =============================================================================
# GO Science Skill — Setup Script for Mac / Linux
# Run once to install the skill into Claude Code
# Usage: bash setup.sh
#        OR: chmod +x setup.sh && ./setup.sh
# =============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  GO Science Skill — Installer (Mac/Linux)${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# --- Step 1: Locate Claude config folder ---
CLAUDE_DIR="$HOME/.claude"
if [ ! -d "$CLAUDE_DIR" ]; then
    echo -e "${RED}ERROR: Claude config folder not found at: $CLAUDE_DIR${NC}"
    echo -e "${YELLOW}Make sure Claude Code is installed and has been run at least once.${NC}"
    exit 1
fi
echo -e "${GREEN}Claude config folder found: $CLAUDE_DIR${NC}"

# --- Step 2: Locate script's own directory ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Step 3: Define destination paths ---
MARKETPLACE_DIR="$CLAUDE_DIR/plugins/marketplaces/go-science"
KNOWLEDGE_DIR="$MARKETPLACE_DIR/knowledge"
SKILL_DIR="$MARKETPLACE_DIR/skills/go-science"
PLUGIN_META_DIR="$MARKETPLACE_DIR/.claude-plugin"
KNOWLEDGE_FILE="$KNOWLEDGE_DIR/ay-science-knowledge.md"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

# --- Step 4: Create directories ---
echo ""
echo -e "${WHITE}Creating skill directories...${NC}"
mkdir -p "$MARKETPLACE_DIR"
mkdir -p "$KNOWLEDGE_DIR"
mkdir -p "$SKILL_DIR"
mkdir -p "$PLUGIN_META_DIR"
echo -e "${GREEN}  Directories ready.${NC}"

# --- Step 5: Copy marketplace.json ---
echo -e "${WHITE}Copying marketplace definition...${NC}"
cp "$SCRIPT_DIR/marketplace/.claude-plugin/marketplace.json" "$PLUGIN_META_DIR/marketplace.json"
echo -e "${GREEN}  marketplace.json copied.${NC}"

# --- Step 6: Copy knowledge base ---
echo -e "${WHITE}Copying knowledge base...${NC}"
cp "$SCRIPT_DIR/knowledge/ay-science-knowledge.md" "$KNOWLEDGE_FILE"
echo -e "${GREEN}  Knowledge base copied to: $KNOWLEDGE_FILE${NC}"

# --- Step 7: Copy SKILL.md and replace path placeholder ---
echo -e "${WHITE}Installing skill file...${NC}"
sed "s|{{KNOWLEDGE_BASE_PATH}}|$KNOWLEDGE_FILE|g" \
    "$SCRIPT_DIR/marketplace/skills/go-science/SKILL.md" \
    > "$SKILL_DIR/SKILL.md"
echo -e "${GREEN}  SKILL.md installed with correct knowledge base path.${NC}"

# --- Step 8: Update settings.json using Python (available on Mac/Linux) ---
echo -e "${WHITE}Updating Claude settings.json...${NC}"

python3 - "$SETTINGS_FILE" "$MARKETPLACE_DIR" <<'PYEOF'
import json, sys, os

settings_path = sys.argv[1]
marketplace_dir = sys.argv[2]

# Load existing or start fresh
if os.path.exists(settings_path):
    with open(settings_path, 'r', encoding='utf-8') as f:
        try:
            settings = json.load(f)
        except json.JSONDecodeError:
            # Backup and start fresh
            import shutil
            shutil.copy(settings_path, settings_path + '.backup')
            settings = {}
else:
    settings = {}

# Add/update pluginMarketplaces
if 'pluginMarketplaces' not in settings:
    settings['pluginMarketplaces'] = {}

settings['pluginMarketplaces']['go-science'] = {
    'source': {
        'source': 'directory',
        'path': marketplace_dir
    }
}

# Add/update enabledPlugins
if 'enabledPlugins' not in settings:
    settings['enabledPlugins'] = {}

settings['enabledPlugins']['go-science@go-science'] = True

# Write back
with open(settings_path, 'w', encoding='utf-8') as f:
    json.dump(settings, f, indent=2, ensure_ascii=False)

print('  settings.json updated successfully.')
PYEOF

echo -e "${GREEN}  settings.json updated.${NC}"

# --- Done ---
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Installation complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${WHITE}Next steps:${NC}"
echo "  1. Restart Claude Code (close and reopen)"
echo "  2. Open any project"
echo -e "  3. Type: ${CYAN}/go-science${NC}"
echo -e "  4. Try: ${CYAN}/go-science explain MCB${NC}"
echo ""
echo -e "${WHITE}Available commands:${NC}"
echo -e "  ${CYAN}/go-science validate [your message]${NC}    - Check if content follows AY science"
echo -e "  ${CYAN}/go-science generate MCB${NC}               - Create a Mass Control Bed message"
echo -e "  ${CYAN}/go-science analyze [message]${NC}          - See which emotions a message triggers"
echo -e "  ${CYAN}/go-science audit [business details]${NC}   - Full 13-step GO audit"
echo -e "  ${CYAN}/go-science explain [concept]${NC}          - Explain any GO term or framework"
echo -e "  ${CYAN}/go-science research [business+ask]${NC}    - Apply GO to your specific industry"
echo ""
