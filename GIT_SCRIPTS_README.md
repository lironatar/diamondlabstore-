# Git Automation Scripts

This folder contains scripts to automate git operations (add, commit, push) for the DiamondLabStore project.

## Scripts Available

### 1. `git-push.bat` (Windows Batch File)
Simple batch file for basic git operations.

**Usage:**
```cmd
# With commit message as parameter
git-push.bat "Your commit message here"

# Will prompt for commit message
git-push.bat
```

### 2. `git-push.ps1` (PowerShell Script) - ⭐ RECOMMENDED
Advanced PowerShell script with colored output and better error handling.

**Usage:**
```powershell
# Basic usage - will prompt for commit message
.\git-push.ps1

# With commit message
.\git-push.ps1 "Your commit message here"

# With parameters
.\git-push.ps1 -CommitMessage "Your commit message" -Force

# Show help
.\git-push.ps1 -Help
```

**PowerShell Parameters:**
- `-CommitMessage`: Your commit message (optional)
- `-Force`: Skip confirmation prompts
- `-Help`: Show help information

## Quick Setup

1. **Make PowerShell script executable** (one-time setup):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Use the script**:
   ```powershell
   .\git-push.ps1 "Fixed toLocaleString errors"
   ```

## What These Scripts Do

1. ✅ Check if you're in a git repository
2. 🔍 Check git status for changes
3. 📦 Run `git add .` (add all changes)
4. 💾 Run `git commit -m "your message"`
5. 🚀 Run `git push origin main`
6. ✅ Show success confirmation with latest commit info

## Error Handling

- ❌ Stops if any git command fails
- 🔍 Shows detailed error messages
- 📋 Lists changed files before committing
- ⏹️ Allows cancellation before committing

## Examples

```powershell
# Quick commit and push
.\git-push.ps1 "Fixed hero image loading"

# Force push without confirmation
.\git-push.ps1 "Updated README" -Force

# Interactive mode (will prompt for message)
.\git-push.ps1
```

## Tips

- Use the PowerShell version (`git-push.ps1`) for better experience
- Keep commit messages descriptive and concise
- The scripts will show you what files are being committed
- Use `-Force` flag when you're confident about the changes

---

**No more manual git commands needed!** 🎉 