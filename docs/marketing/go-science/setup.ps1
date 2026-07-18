# =============================================================================
# GO Science Skill — Setup Script for Windows
# Run this once to install the skill into Claude Code
# Usage: Right-click setup.ps1 → "Run with PowerShell"
#        OR open PowerShell and run: .\setup.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  GO Science Skill — Installer (Windows)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Locate Claude config folder ---
$claudeDir = Join-Path $env:USERPROFILE ".claude"
if (-not (Test-Path $claudeDir)) {
    Write-Host "ERROR: Claude config folder not found at: $claudeDir" -ForegroundColor Red
    Write-Host "Make sure Claude Code is installed and has been run at least once." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Claude config folder found: $claudeDir" -ForegroundColor Green

# --- Step 2: Locate script's own directory ---
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- Step 3: Define destination paths ---
$marketplaceDir  = Join-Path $claudeDir "plugins\marketplaces\go-science"
$knowledgeDir    = Join-Path $marketplaceDir "knowledge"
$skillDir        = Join-Path $marketplaceDir "skills\go-science"
$pluginMetaDir   = Join-Path $marketplaceDir ".claude-plugin"
$knowledgeFile   = Join-Path $knowledgeDir "ay-science-knowledge.md"
$settingsFile    = Join-Path $claudeDir "settings.json"

# --- Step 4: Create directories ---
Write-Host ""
Write-Host "Creating skill directories..." -ForegroundColor White
New-Item -ItemType Directory -Force -Path $marketplaceDir  | Out-Null
New-Item -ItemType Directory -Force -Path $knowledgeDir    | Out-Null
New-Item -ItemType Directory -Force -Path $skillDir        | Out-Null
New-Item -ItemType Directory -Force -Path $pluginMetaDir   | Out-Null
Write-Host "  Directories ready." -ForegroundColor Green

# --- Step 5: Copy marketplace.json ---
Write-Host "Copying marketplace definition..." -ForegroundColor White
$srcMarketplace = Join-Path $scriptDir "marketplace\.claude-plugin\marketplace.json"
Copy-Item -Path $srcMarketplace -Destination (Join-Path $pluginMetaDir "marketplace.json") -Force
Write-Host "  marketplace.json copied." -ForegroundColor Green

# --- Step 6: Copy knowledge base ---
Write-Host "Copying knowledge base..." -ForegroundColor White
$srcKnowledge = Join-Path $scriptDir "knowledge\ay-science-knowledge.md"
Copy-Item -Path $srcKnowledge -Destination $knowledgeFile -Force
Write-Host "  Knowledge base copied to: $knowledgeFile" -ForegroundColor Green

# --- Step 7: Copy SKILL.md and replace path placeholder ---
Write-Host "Installing skill file..." -ForegroundColor White
$srcSkill = Join-Path $scriptDir "marketplace\skills\go-science\SKILL.md"
$skillContent = Get-Content -Path $srcSkill -Raw -Encoding UTF8
# Replace the placeholder with the actual knowledge base path (escaped for Windows)
$skillContent = $skillContent -replace '\{\{KNOWLEDGE_BASE_PATH\}\}', $knowledgeFile.Replace('\', '\\')
$destSkill = Join-Path $skillDir "SKILL.md"
Set-Content -Path $destSkill -Value $skillContent -Encoding UTF8 -NoNewline
Write-Host "  SKILL.md installed with correct knowledge base path." -ForegroundColor Green

# --- Step 8: Update settings.json ---
Write-Host "Updating Claude settings.json..." -ForegroundColor White

if (Test-Path $settingsFile) {
    $settingsRaw = Get-Content -Path $settingsFile -Raw -Encoding UTF8
    try {
        $settings = $settingsRaw | ConvertFrom-Json
    } catch {
        Write-Host "  WARNING: settings.json could not be parsed. Creating backup and writing fresh entries." -ForegroundColor Yellow
        Copy-Item $settingsFile "$settingsFile.backup" -Force
        $settings = New-Object PSObject
    }
} else {
    $settings = New-Object PSObject
}

# Ensure pluginMarketplaces exists
if (-not ($settings | Get-Member -Name "pluginMarketplaces" -MemberType NoteProperty)) {
    $settings | Add-Member -MemberType NoteProperty -Name "pluginMarketplaces" -Value (New-Object PSObject)
}

# Add go-science marketplace entry
$marketplaceEntry = [PSCustomObject]@{
    source = [PSCustomObject]@{
        source = "directory"
        path   = $marketplaceDir
    }
}

# Remove existing entry if present, then re-add
$pm = $settings.pluginMarketplaces
if ($pm | Get-Member -Name "go-science" -MemberType NoteProperty) {
    $pm.PSObject.Properties.Remove("go-science")
}
$pm | Add-Member -MemberType NoteProperty -Name "go-science" -Value $marketplaceEntry

# Ensure enabledPlugins exists
if (-not ($settings | Get-Member -Name "enabledPlugins" -MemberType NoteProperty)) {
    $settings | Add-Member -MemberType NoteProperty -Name "enabledPlugins" -Value (New-Object PSObject)
}

$ep = $settings.enabledPlugins
if ($ep | Get-Member -Name "go-science@go-science" -MemberType NoteProperty) {
    $ep.PSObject.Properties.Remove("go-science@go-science")
}
$ep | Add-Member -MemberType NoteProperty -Name "go-science@go-science" -Value $true

# Write back
$settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsFile -Encoding UTF8
Write-Host "  settings.json updated." -ForegroundColor Green

# --- Done ---
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Installation complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Restart Claude Code (close and reopen)" -ForegroundColor White
Write-Host "  2. Open any project" -ForegroundColor White
Write-Host "  3. Type: /go-science" -ForegroundColor Cyan
Write-Host "  4. Try: /go-science explain MCB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available commands:" -ForegroundColor White
Write-Host "  /go-science validate [your message]    - Check if content follows AY science" -ForegroundColor DarkCyan
Write-Host "  /go-science generate MCB               - Create a Mass Control Bed message" -ForegroundColor DarkCyan
Write-Host "  /go-science analyze [message]          - See which emotions a message triggers" -ForegroundColor DarkCyan
Write-Host "  /go-science audit [business details]   - Full 13-step GO audit" -ForegroundColor DarkCyan
Write-Host "  /go-science explain [concept]          - Explain any GO term or framework" -ForegroundColor DarkCyan
Write-Host "  /go-science research [business+ask]    - Apply GO to your specific industry" -ForegroundColor DarkCyan
Write-Host ""
Read-Host "Press Enter to close"
