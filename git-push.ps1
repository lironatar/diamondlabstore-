param(
    [string]$CommitMessage = "",
    [switch]$Force = $false,
    [switch]$Help = $false
)

# Color functions
function Write-Success { param($Text) Write-Host $Text -ForegroundColor Green }
function Write-Error { param($Text) Write-Host $Text -ForegroundColor Red }
function Write-Info { param($Text) Write-Host $Text -ForegroundColor Cyan }
function Write-Warning { param($Text) Write-Host $Text -ForegroundColor Yellow }

# Help function
function Show-Help {
    Write-Host ""
    Write-Host "DiamondLabStore Git Push Script" -ForegroundColor Magenta
    Write-Host "=================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\git-push.ps1 'Your commit message'" -ForegroundColor White
    Write-Host "  .\git-push.ps1 -CommitMessage 'Your commit message'" -ForegroundColor White
    Write-Host "  .\git-push.ps1 -Force" -ForegroundColor White
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -CommitMessage   : Commit message (optional, will prompt if not provided)" -ForegroundColor White
    Write-Host "  -Force          : Skip confirmation prompts" -ForegroundColor White
    Write-Host "  -Help           : Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\git-push.ps1 'Fixed login bug'" -ForegroundColor White
    Write-Host "  .\git-push.ps1 -CommitMessage 'Added new features' -Force" -ForegroundColor White
    Write-Host ""
}

# Main script
try {
    if ($Help) {
        Show-Help
        exit 0
    }

    Write-Host ""
    Write-Host "===============================================" -ForegroundColor Magenta
    Write-Host "        DiamondLabStore Git Push Script        " -ForegroundColor Magenta
    Write-Host "===============================================" -ForegroundColor Magenta
    Write-Host ""

    # Check if we're in a git repository
    if (-not (Test-Path ".git")) {
        Write-Error "❌ Error: Not in a git repository!"
        exit 1
    }

    # Get commit message
    if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
        $CommitMessage = Read-Host "📝 Enter commit message"
        if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
            Write-Error "❌ Error: Commit message cannot be empty!"
            exit 1
        }
    }

    Write-Info "📝 Commit message: $CommitMessage"
    Write-Host ""

    # Check git status
    Write-Info "🔍 Checking git status..."
    $gitStatus = git status --porcelain
    
    if ($gitStatus.Count -eq 0) {
        Write-Success "✅ No changes to commit. Working tree clean."
        exit 0
    }

    Write-Warning "📋 Found $($gitStatus.Count) changed file(s):"
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    Write-Host ""

    # Confirmation (unless Force is used)
    if (-not $Force) {
        $confirm = Read-Host "🤔 Do you want to continue with git add, commit, and push? (y/N)"
        if ($confirm -notmatch '^[Yy]') {
            Write-Warning "⏹️  Operation cancelled by user."
            exit 0
        }
        Write-Host ""
    }

    # Git add
    Write-Info "📦 Adding all changes..."
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error: Failed to add files (exit code: $LASTEXITCODE)"
        exit 1
    }
    Write-Success "✅ Files added successfully"

    # Git commit
    Write-Info "💾 Committing changes..."
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error: Failed to commit changes (exit code: $LASTEXITCODE)"
        exit 1
    }
    Write-Success "✅ Changes committed successfully"

    # Git push
    Write-Info "🚀 Pushing to remote repository..."
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error: Failed to push to remote (exit code: $LASTEXITCODE)"
        exit 1
    }

    Write-Host ""
    Write-Success "✅ ================================"
    Write-Success "✅  Successfully pushed to GitHub!"
    Write-Success "✅ ================================"
    Write-Host ""

    # Show latest commit info
    Write-Info "📊 Latest commit:"
    git log -1 --oneline
    Write-Host ""

} catch {
    Write-Error "❌ Unexpected error occurred: $($_.Exception.Message)"
    exit 1
}

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")