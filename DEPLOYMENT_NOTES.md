# Peptide Scheduler — Deployment Notes

## ⚠️ CRITICAL: Service Worker Cache Rule

**Every single deployment that changes `index.html` MUST also bump `CACHE_NAME` in `sw.js` in the same commit.**

### Why this matters

The service worker caches `index.html` aggressively. If `sw.js` doesn't change, the SW has no
signal to invalidate its cache and re-fetch the new `index.html`. Result: changes are live on
GitHub Pages but the old version keeps serving on the user's device indefinitely.

This has caused multiple "the update didn't push through" incidents. The fix is always the same:
bump the cache version.

---

## Deployment checklist — do these every time, no exceptions

```
[ ] 1. Bump CACHE_NAME in sw.js by +1
       e.g.  peptide-scheduler-v12  →  peptide-scheduler-v13

[ ] 2. Bump the app version in index.html
       e.g.  v1.6.3  →  v1.6.4

[ ] 3. Update the version comment in sw.js to match
       e.g.  // Version 1.6.3  →  // Version 1.6.4

[ ] 4. git add index.html sw.js [any other changed files]
       sw.js MUST be in git add whenever index.html is included

[ ] 5. git commit + git push origin main

[ ] 6. Wait ~1-2 minutes for GitHub Pages to deploy

[ ] 7. On the device:
         Open app → More tab → "Check for Updates"
         If no update button: force-close app completely, reopen
         May need to reopen a second time for the new SW to fully activate
```

---

## Current cache state

| Push | CACHE_NAME                  | Version | Notes                                      |
|------|-----------------------------|---------|--------------------------------------------|
| 5    | peptide-scheduler-v10       | 1.6.3   | First attempt (rejected — remote ahead)    |
| 6    | peptide-scheduler-v11       | 1.6.3   | After merge; forced SW update              |
| 7    | peptide-scheduler-v11       | 1.6.3   | ⚠️ Forgot to bump — theme didn't show     |
| 8    | peptide-scheduler-v12       | 1.6.3   | Fixed — cowprint theme now reachable       |

**Next push should use: `peptide-scheduler-v13`**

---

## .bat file template

Always write a new numbered .bat file (push9.bat, push10.bat, etc.) so there's a history of pushes.

```batch
@echo off
cd /d "C:\Users\cvinc\AppData\Roaming\Claude\local-agent-mode-sessions\3df0ffe5-a00f-483c-b588-d8ea0550fbbe\a34485c9-1002-42f5-a324-9584930e1d57\local_b797faf5-f05a-4225-8dd9-eb6d105e6f82\outputs\peptide-scheduler"
if exist .git\HEAD.lock del /f .git\HEAD.lock
git add index.html sw.js
git commit -m "v1.X.X brief description of what changed"
git push origin main
echo DONE
```

---

## How the SW update flow works on device

1. New SW installs in the background but **waits** — it doesn't auto-activate
2. The old SW keeps running until the user triggers a skip-waiting signal
3. "Check for Updates" in the More tab sends a `SKIP_WAITING` message → new SW activates
4. If the button isn't visible, fully closing and reopening the app forces a SW lifecycle check
5. A second reopen is sometimes needed for the new SW to fully claim all clients
