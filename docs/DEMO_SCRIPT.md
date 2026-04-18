# StudyLoop — 4-minute demo script

**Target:** record a 3–5 minute screen capture that walks through the problem, the solution, and the tech decisions. Practice once before recording.

---

## 00:00 – 00:30 · Hook & problem (30s)

> "Hi, this is StudyLoop. Every student knows this feeling: you study for six hours the night before an exam, ace the next morning, and forget 70% of it within a week."

- Open the landing page (`/`).
- Point at the tagline: *"Study smarter, not harder."*
- Highlight: "The problem isn't effort — it's *timing*. StudyLoop tells you which cards to review, exactly when you need to review them."

---

## 00:30 – 01:00 · Sign-up & auth (30s)

- Click **Get started** → on `/signup`.
- Show controlled form validation (empty submit, 6-char password).
- Click **Sign up with Google** → land on `/app`.

> "Auth is Firebase — email/password plus Google OAuth. Sessions persist across reloads. Every route below is gated by a `ProtectedRoute` wrapper."

---

## 01:00 – 01:45 · Decks & cards (45s)

- `/decks` → **New deck** → "Organic Chemistry — Unit 3" → pick a colour → create.
- Open the deck → add one card inline (show the ⌘+Enter shortcut).
- Click **Bulk paste** → paste a multi-line `Q:/A:` block → show live preview → import.
- *(Optional)* Click **Generate from notes** → paste a short paragraph → generate with Gemini → import.

> "Full CRUD, real-time sync (open two tabs — changes appear instantly), and three ways to add cards: manual, bulk paste, or AI from your own notes."

---

## 01:45 – 02:45 · Study session — the core (60s)

- Click **Study now**.
- Show progress bar "1 / N".
- Press **Space** → card flips with a spring animation.
- Press **3** (Good).
- Repeat for 2–3 more cards.
- Finish the session → summary screen with rating breakdown.

> "This is the heart of the app. Under the hood, every rating feeds SuperMemo-2 — it updates each card's ease factor and schedules the next review anywhere from ten minutes to months out. That's how we fight the forgetting curve."

---

## 02:45 – 03:15 · Dashboard & stats (30s)

- Back to `/app` → point at streak badge (now 1 day), due-today card, recent decks.
- Open `/stats` → show mastery bar chart, 14-day line, 8-week heatmap.

> "Recharts renders the analytics. The dashboard re-computes aggregates with `useMemo`, so nothing re-runs unless data actually changes."

---

## 03:15 – 03:45 · UI/UX & theming (30s)

- Toggle dark mode (top-right).
- Resize to mobile width → bottom nav appears, sidebar collapses.
- Open `/settings` → show profile edit, theme toggle, danger zone.

> "Every view was built mobile-first with Tailwind, works in light and dark from day one, and is fully keyboard-navigable. We respect `prefers-reduced-motion` so the flip animation disables on accessibility settings."

---

## 03:45 – 04:15 · Tech tour (30s)

- Show VS Code / Cursor with the folder tree.
- Point at `src/context/`, `src/hooks/`, `src/services/`, `src/lib/sm2.js`.

> "Clean separation: context for global state, custom hooks for derived/subscribed data, services for all Firebase calls, and pure utilities like the SM-2 algorithm — testable in isolation."

- Open `src/App.jsx` and point to `React.lazy` + `Suspense` wrapping `/study`, `/stats`, `/settings`.

> "Route-level code-splitting: the landing bundle stays under 70 KB gzipped; heavy routes like Stats (Recharts) only load when you navigate there."

---

## 04:15 – end · Close (15s)

> "StudyLoop: Firebase-powered, React-native, production-built. Thanks for watching."

- Quick shot of the GitHub repo + live Vercel URL in the browser address bar.

---

## Pre-record checklist

- [ ] `.env.local` has real Firebase values
- [ ] Dark mode tested in Chrome dev-tools `prefers-color-scheme`
- [ ] Seed a demo account with 2 decks × 6 cards each
- [ ] Quit Slack / messages / tab notifications
- [ ] Record at 1920×1080 with the mic at a consistent volume
- [ ] Export as MP4, keep under 100 MB for easy upload
