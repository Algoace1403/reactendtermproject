# StudyLoop

**Study smarter, not harder.** An AI-assisted flashcard app with spaced repetition. Built as the end-term project for *Building Web Applications with React* (Batch 2029).

---

## 1. Problem

Students cram before exams and forget ~70% of what they studied within a week (the Ebbinghaus forgetting curve). Existing tools either have dated UX (Anki) or offer no structured review (Notion / Docs). **StudyLoop** turns notes into flashcards and schedules each card for review just before you'd forget it, using the SuperMemo-2 algorithm.

**Who it's for:** college and high-school students preparing for exams or long-term courses.
**Why it matters:** active recall + spaced repetition is the most evidence-backed learning technique — but no modern, pleasant tool puts them in front of students.

---

## 2. Features

- 🔐 **Authentication** — Email/password + Google OAuth, protected routes, persistent sessions
- 📚 **Decks & cards** — full CRUD, real-time sync across tabs, bulk-paste import, optional AI card generation from notes
- 🎯 **Study sessions** — flashcard flip animation, 4-point recall rating, SM-2 scheduling, keyboard-driven (Space / 1–4)
- 📊 **Dashboard & stats** — streaks, "due today" queue, mastery per deck, 14-day activity line chart, 8-week heatmap
- 🎨 **UI/UX** — Light & dark mode, fully responsive (mobile-first), toast notifications, empty/loading/error states, a11y-first
- ⚡ **Performance** — route-level code-splitting via `React.lazy` + `Suspense`, `useMemo`/`useCallback` for computed views

---

## 3. Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19 · Vite · React Router v6 |
| Styling | Tailwind CSS · Lucide icons · Framer Motion |
| Backend | Firebase Auth · Cloud Firestore · Security Rules |
| Charts | Recharts |
| Deploy | Vercel |

---

## 4. Local setup

```bash
git clone <your-repo> studyloop
cd studyloop
npm install
cp .env.example .env.local      # then paste your Firebase config values
npm run dev                     # http://localhost:5173
```

### Firebase setup (3 min)
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) (disable Analytics).
2. **Build → Authentication → Get started** → enable Email/Password + Google.
3. **Build → Firestore Database → Create database** → production mode → pick a region.
4. **Firestore → Rules** → paste the contents of `firestore.rules` → Publish.
5. Project settings ⚙️ → **Your apps → Web `</>`** → register → copy the `firebaseConfig` values into `.env.local`.
6. *(Optional)* Add `VITE_GEMINI_API_KEY` to `.env.local` for AI card generation.

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

| Concept | Where |
| --- | --- |
| Functional components + composition | every file in `/components`, `/pages` |
| `useState` | card forms, study session state, filter/sort |
| `useEffect` | auth listener, Firestore subscriptions, theme sync |
| Props & lifting state | `Decks` → `DeckCard`, `StudySession` → `FlashCard` |
| Controlled components | every form (deck, card, auth, settings) |
| Conditional rendering | protected routes, empty / loading / error states |
| Lists & keys | decks grid, cards list, stats tables |
| Context API | `AuthContext`, `ThemeContext`, `ToastContext` |
| React Router v6 | 9 routes, protected + dynamic (`/decks/:id`, `/study/:deckId`) |
| `useMemo` | filtered/sorted decks, mastery %, due queue, stats aggregates |
| `useCallback` | stable handlers passed to memoised children + event listeners |
| `useRef` | focus management in card form, idempotent toast ids |
| `React.lazy` + `Suspense` | `/study`, `/stats`, `/settings` code-split |
| Custom hooks | `useAuth`, `useDecks`, `useCards`, `useStudySession`, `useStats` |

---

## 7. Keyboard shortcuts

| Key | Action |
| --- | --- |
| Space | Flip the current flashcard |
| 1 / 2 / 3 / 4 | Rate: Again / Hard / Good / Easy |
| ⌘/Ctrl + Enter | Save an inline card |
| Esc | Close any modal |

---

## 8. Demo script (3–5 min video)

See [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

---

## 9. Deployment

Push to GitHub, then import the repo in [Vercel](https://vercel.com/new). Add the `VITE_FIREBASE_*` env vars in the Vercel dashboard, deploy, and add the Vercel domain to **Firebase Auth → Authorized domains**.

`vercel.json` rewrites all non-asset paths to `index.html` so SPA routes work.

---

## 10. Credits

- SuperMemo-2 algorithm: Piotr Woźniak (1990)
- Icons: [Lucide](https://lucide.dev)
- Fonts: Plus Jakarta Sans & Inter via Google Fonts
