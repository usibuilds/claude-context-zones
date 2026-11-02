# Claude Context Zones — install into a project for Claude Code (Windows).
# Usage: .\install.ps1 C:\path\to\your-project
param([Parameter(Mandatory=$true)][string]$Target)
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
if (-not (Test-Path $Target -PathType Container)) { Write-Host "Folder not found: $Target" -ForegroundColor Red; exit 1 }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "Node.js not found (node -v). Install Node first." -ForegroundColor Red; exit 1 }
$Target = (Resolve-Path $Target).Path
$dotClaude = Join-Path $Target ".claude"
New-Item -ItemType Directory -Force -Path $dotClaude | Out-Null
$settings = Join-Path $dotClaude "settings.json"
if (Test-Path $settings) {
  Copy-Item $settings (Join-Path $dotClaude "settings.backup.json") -Force
  Write-Host "Existing settings.json backed up to .claude\settings.backup.json (merge by hand if needed)." -ForegroundColor Yellow
}
Copy-Item -Path (Join-Path $here "claude-code\.claude\*") -Destination $dotClaude -Recurse -Force

# Windows: write settings.json with absolute forward-slash paths so hooks work in any shell
$fwd = $Target.Replace('\','/')
$q = '\"'
$settingsJson = @"
{
  "statusLine": { "type": "command", "command": "node $q$fwd/.claude/hooks/statusline.js$q" },
  "hooks": {
    "UserPromptSubmit": [ { "hooks": [ { "type": "command", "command": "node $q$fwd/.claude/hooks/context-alert.js$q" } ] } ],
    "Stop": [ { "hooks": [ { "type": "command", "command": "node $q$fwd/.claude/hooks/feature-done.js$q" } ] } ]
  }
}
"@
[System.IO.File]::WriteAllText($settings, $settingsJson)

$docs = Join-Path $Target "docs"
New-Item -ItemType Directory -Force -Path $docs | Out-Null
foreach ($f in "PLAN.md","HANDOFF.md") {
  $dst = Join-Path $docs $f
  if (-not (Test-Path $dst)) { Copy-Item (Join-Path $here "claude-code\docs\$f") $dst }
}
$skills = Join-Path $HOME ".claude\skills"
New-Item -ItemType Directory -Force -Path $skills | Out-Null
Copy-Item (Join-Path $here "skills\context-guardian") $skills -Recurse -Force
Copy-Item (Join-Path $here "skills\feature-builder") $skills -Recurse -Force

Write-Host "`nInstalled. Status line test:" -ForegroundColor Green
'{"cwd":"' + $fwd + '","context_window":{"context_window_size":200000,"used_percentage":5}}' | node (Join-Path $dotClaude "hooks\statusline.js")
Write-Host "`n`nNext: edit docs\PLAN.md, then run 'claude' in $Target and type /resume" -ForegroundColor Green
