# 💉 Peptide Scheduler

A fully offline-capable Progressive Web App (PWA) for tracking peptide protocols — doses, cycles, breaks, and daily reminders. Installable on iPhone and Android directly from Safari/Chrome.

## Features

- **Today's Dashboard** — See all doses due, mark taken/skipped, track streak
- **Protocol Manager** — Add peptides from a database of 44+, configure dose, timing, days, cycle/break length
- **Calendar View** — Visual month calendar showing dose days, cycle starts, and break periods; export to .ics for Apple/Google Calendar
- **Peptide Library** — Reference database with dosing ranges, storage info, reconstitution guide, and source links to peptidedosages.com
- **Daily Reminders** — Push notifications for morning and evening doses (works on iPhone via PWA)
- **Fully Offline** — Service worker caches everything; works without internet after first load

## Peptide Database (44 peptides)

Categories covered:
- 🩹 Healing & Recovery (BPC-157, TB-500, GHK-Cu, etc.)
- 💪 Growth Hormone (CJC-1295, Ipamorelin, GHRP-6, MK-677, etc.)
- 🔥 Metabolic / Weight Loss (Semaglutide, Tirzepatide, AOD-9604, etc.)
- 🧠 Cognitive & Nootropic (Semax, Selank, Dihexa, etc.)
- ⏳ Longevity & Anti-Aging (Epithalon, Thymalin, LL-37, etc.)
- 🛡️ Immune Support (BPC-157, TB4-Frag, Thymosin Alpha-1, etc.)
- ❤️ Sexual Health (PT-141, Kisspeptin-10, etc.)
- ⚡ Energy & Mitochondrial (SS-31, MOTS-c, Humanin, etc.)
- ✨ Skin & Cosmetic (GHK-Cu, Melanotan II, etc.)

Data sourced from [peptidedosages.com](https://peptidedosages.com).

## Install on iPhone

1. Open the app URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — the app icon appears on your home screen

## Install on Android

1. Open the app URL in **Chrome**
2. Tap the **⋮ menu** → **"Add to Home Screen"** or **"Install App"**

## Running Locally

```bash
# Serve with any static file server, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Deploying

This is a static site — deploy anywhere:
- **GitHub Pages** (free, recommended)
- Netlify
- Vercel
- Any static host

## GitHub Pages Setup

After pushing to GitHub:
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch** → `main` → `/ (root)`
3. Click **Save**
4. Your app will be live at `https://YOUR-USERNAME.github.io/peptide-scheduler/`

## Disclaimer

> For educational and tracking purposes only. Not medical advice. Always consult a qualified healthcare professional before starting any peptide protocol.

## License

MIT
