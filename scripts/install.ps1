$ErrorActionPreference = "Stop"

Write-Host "🚀 Installing HT_AI_SKILL via PowerShell..." -ForegroundColor Cyan

$RepoUrl = "https://github.com/Association-of-stupid-people/HT_AI_SKILL.git"
$TempDir = Join-Path $env:TEMP ("ht_ai_skill_" + [Guid]::NewGuid().ToString())

git clone --depth 1 $RepoUrl $TempDir

if (Get-Command node -ErrorAction SilentlyContinue) {
    node "$TempDir/bin/install.js"
} else {
    $HomeDir = [Environment]::GetFolderPath("UserProfile")
    $ClaudeSkills = Join-Path $HomeDir ".claude\skills"
    $OmpSkills = Join-Path $HomeDir ".omp\skills"

    New-Item -ItemType Directory -Force -Path $ClaudeSkills | Out-Null
    New-Item -ItemType Directory -Force -Path $OmpSkills | Out-Null

    Copy-Item -Recurse -Force "$TempDir\skills\*" $ClaudeSkills
    Copy-Item -Recurse -Force "$TempDir\skills\*" $OmpSkills
    Write-Host "✅ Copied skills to ~/.claude/skills and ~/.omp/skills" -ForegroundColor Green
}

Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
Write-Host "✨ Installation complete!" -ForegroundColor Green
