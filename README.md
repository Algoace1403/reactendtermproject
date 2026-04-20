# StudyLoop

**Study smarter, not harder.** An AI-assisted flashcard app with spaced repetition.

[![Deployed on Vercel](https://img.shields.io/badge/live-studyloop--ten.vercel.app-4F46E5)](https://studyloop-ten.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-10B981)](#10-credits)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)

Built as the end-term project for *Building Web Applications with React* (Batch 2029) at IIT Madras.

> **Live demo:** <https://studyloop-ten.vercel.app>
> **Demo video:** (add link after recording)

---

## 📸 Screenshots

> Add real screenshots here after first deploy with seed data. Suggested:
>
> 1. **Landing page** — hero + value prop
> 2. **Decks grid** in dark mode
> 3. **Study session** mid-flip with SM-2 rating buttons
> 4. **Stats page** — mastery bar chart + 8-week heatmap

---

## 1. Problem

Students cram before exams and forget ~70 % of what they studied within a week (the Ebbinghaus forgetting curve). Existing tools either have dated UX (Anki) or offer no structured review at all (Notion / Docs).

**StudyLoop** turns notes into flashcards and schedules each card for review just before you'd forget it, using the **SuperMemo-2 algorithm**.

- **Who it's for:** college and high-school students preparing for exams or long-term courses.
- **Why it matters:** active recall + spaced repetition is the most evidence-backed learning technique — but no modern, pleasant tool puts them in front of students.

---

## 2. Features

- 🔐 **Authentication** — Email/password + Google OAuth, protected routes, persistent sessions
- 📚 **Decks & cards** — full CRUD, real-time sync across tabs, bulk-paste import
- 🤖 **AI card generation** — paste your lecture notes, Gemini 2.0 Flash produces 3–12 flashcards
- 🎯 **Study sessions** — flashcard flip animation, 4-point recall rating, SM-2 scheduling, keyboard-driven (Space / 1–4)
- 📊 **Dashboard & stats** — streaks, "due today" queue, mastery per deck, 14-day activity line chart, 8-week heatmap
- 🎨 **UI/UX** — light & dark mode, fully responsive (mobile-first), toast notifications, empty/loading/error states, a11y-first
- ⚡ **Performance** — route-level code-splitting via `React.lazy` + `Suspense`, `useMemo`/`useCallback` for computed views, `React.memo` on pure components
- 🛡️ **Security** — Firestore rules enforce `request.auth.uid == resource.data.userId` on every read/write, reviews are append-only (audit trail)

---

## 3. Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19 · Vite · React Router v6 |
| Styling | Tailwind CSS v3 · Lucide icons · Framer Motion |
| Backend | Firebase Auth · Cloud Firestore · Security Rules |
| AI | Google Gemini 2.0 Flash (optional) |
| Charts | Recharts |
| Deploy | Vercel (auto-deploy on `main`) |

---

## 4. Local setup

```bash
git clone https://github.com/Algoace1403/reactendtermproject.git studyloop
cd studyloop
npm install
cp .env.example .env.local      # then paste your Firebase + Gemini config
npm run dev                     # http://localhost:5173
```

### 4.1 Firebase setup (3 min)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) (disable Analytics).
2. **Build → Authentication → Get started** → enable Email/Password + Google.
3. **Build → Firestore Database → Create database** → production mode → pick a region.
4. **Firestore → Rules** → paste the contents of [`firestore.rules`](./firestore.rules) → Publish.
5. Project settings ⚙️ → **Your apps → Web `</>`** → register → copy `firebaseConfig` values into `.env.local`.

### 4.2 Gemini setup (optional, 1 min)

1. Grab a free key at <https://aistudio.google.com/apikey>.
2. Add to `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=AIza...
   ```
3. Restart `npm run dev`.

Without this key the **"Generate from notes"** button degrades gracefully — you can still use manual add and **Bulk paste**.

---

## 5. Folder structure

```
src/
  components/    reusable UI (Modal, Spinner, EmptyState, FlashCard, …)
  pages/         route-level screens (Landing, Login, Decks, Study, Stats, …)
  hooks/         custom hooks (useAuth, useDecks, useCards, useStudySession, useStats)
  context/       React contexts (AuthContext, ThemeContext, ToastContext)
  services/      Firebase-facing modules (auth, decks, cards, reviews, ai)
  lib/           pure utilities (sm2, stats, parsePaste)
  layouts/       AppLayout (sidebar + bottom nav), AuthLayout
```

---

## 6. React concepts → where each lives

This maps directly to the course rubric so graders can find each concept fast.

| Concept | Where in the code |
| --- | --- |
| Functional components + composition | every file in `/components`, `/pages` |
| `useState` | card forms, study session state, filter/sort |
| `useEffect` | auth listener, Firestore subscriptions, theme sync |
| Props & lifting state | `Decks` → `DeckCard`, `StudySession` → `FlashCard`, `DeckDetail` owns 4 modal states |
| Controlled components | every form (deck, card, auth, settings) |
| Conditional rendering | protected routes, loading / empty / error / content branches |
| Lists & keys | decks grid, cards list, stats tables — all with stable IDs |
| Context API | `AuthContext`, `ThemeContext`, `ToastContext` |
| React Router v6 | 10 routes: public, protected, dynamic (`/decks/:id`, `/study/:deckId`) |
| `useMemo` | filtered/sorted decks, mastery %, due queue, stats aggregates |
| `useCallback` | stable handlers passed to memoised children + event listeners |
| `useRef` | focus management in card form, DOM ref in modal, idempotent toast ids |
| `React.lazy` + `Suspense` | `/study`, `/stats`, `/settings` code-split |
| `React.memo` | `Spinner`, `EmptyState`, `FlashCard` |
| Custom hooks | `useAuth`, `useDecks`, `useCards`, `useStudySession`, `useStats`, `useUserProfile` |

---

## 7. Keyboard shortcuts

| Key | Action |
| --- | --- |
| Space | Flip the current flashcard |
| 1 / 2 / 3 / 4 | Rate: Again / Hard / Good / Easy |
| ⌘/Ctrl + Enter | Save an inline card |
| Esc | Close any modal |

---

## 8. Demo script

See [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) for the 3–5 min recorded walkthrough timestamps.

---

## 9. Deployment

Pushes to `main` auto-deploy to Vercel. The live site is <https://studyloop-ten.vercel.app>.

`vercel.json` rewrites all non-asset paths to `index.html` so React Router SPA routes work on hard refresh.

**Environment variables needed in Vercel dashboard:**

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_GEMINI_API_KEY` *(optional — AI card generation)*

Remember to add your Vercel domain to **Firebase → Authentication → Settings → Authorized domains** so auth works on the deployed site.

---

## 10. Credits

- **SM-2 algorithm:** Piotr Woźniak (1990)
- **Icons:** [Lucide](https://lucide.dev)
- **Fonts:** Plus Jakarta Sans & Inter via Google Fonts

License: MIT — see [`LICENSE`](./LICENSE) (if added).

Built with love and lots of spaced repetition 💙
