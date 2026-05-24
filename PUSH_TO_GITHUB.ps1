# ============================================================
#  Peptide Scheduler — Auto GitHub Publisher
#  Username: cvincent253
# ============================================================
$ErrorActionPreference = "Stop"
$username = "cvincent253"
$repoName = "peptide-scheduler"
$remoteUrl = "https://github.com/$username/$repoName.git"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PEPTIDE SCHEDULER -> github.com/$username" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Open GitHub new-repo page (pre-filled) ---
Write-Host "[1/4] Opening GitHub in your browser..." -ForegroundColor Yellow
$ghUrl = "https://github.com/new?name=$repoName&description=Personal+peptide+protocol+tracker+%E2%80%94+PWA+for+iPhone+%26+Android&visibility=public"
Start-Process $ghUrl

Write-Host ""
Write-Host "  ACTION REQUIRED in the browser:" -ForegroundColor Green
Write-Host "   -> Repo name should already be: $repoName" -ForegroundColor White
Write-Host "   -> Leave visibility as: Public" -ForegroundColor White
Write-Host "   -> Do NOT check any 'Initialize' boxes" -ForegroundColor White
Write-Host "   -> Click [Create repository]" -ForegroundColor White
Write-Host ""

# Countdown
for ($i = 45; $i -ge 1; $i--) {
    Write-Host "`r  Waiting $i seconds for you to create the repo..." -NoNewline -ForegroundColor Gray
    Start-Sleep 1
}
Write-Host "`r  Done waiting. Proceeding with push...          " -ForegroundColor Green
Write-Host ""

# --- Step 2: Set up git ---
Write-Host "[2/4] Setting up git repository..." -ForegroundColor Yellow
Set-Location $scriptDir

if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git"
}

& git init -b main
& git config user.email "cvincent253@gmail.com"
& git config user.name "Chris Vincent"

# --- Step 3: Commit ---
Write-Host ""
Write-Host "[3/4] Committing files..." -ForegroundColor Yellow
& git add -A
& git commit -m "Initial release: Peptide Scheduler PWA

- 44-peptide database from peptidedosages.com
- Today dashboard with dose tracking and streak counter
- Protocol manager with per-peptide cycle and break config
- Calendar view with .ics export for Apple/Google Calendar
- Peptide library with full reference info and dosing ranges
- Push notifications for morning and evening reminders
- Full PWA: installable on iPhone and Android, offline capable"

# --- Step 4: Push ---
Write-Host ""
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  (A browser window may open to sign in to GitHub)" -ForegroundColor Gray
& git remote add origin $remoteUrl
& git push -u origin main

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Your repo: https://github.com/$username/$repoName" -ForegroundColor Cyan
Write-Host ""

# --- Enable GitHub Pages ---
Write-Host "Now enabling free hosting via GitHub Pages..." -ForegroundColor Yellow
Start-Sleep 2
Start-Process "https://github.com/$username/$repoName/settings/pages"

Write-Host ""
Write-Host "  In the Settings page that just opened:" -ForegroundColor Green
Write-Host "   1. Under 'Source': Deploy from a branch" -ForegroundColor White
Write-Host "   2. Branch: main   Folder: / (root)" -ForegroundColor White
Write-Host "   3. Click Save" -ForegroundColor White
Write-Host ""
Write-Host "  Your app will be live in ~60 seconds at:" -ForegroundColor White
Write-Host "  https://$username.github.io/$repoName/" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Install on iPhone: open that URL in Safari" -ForegroundColor White
Write-Host "  then Share -> Add to Home Screen" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to close"
