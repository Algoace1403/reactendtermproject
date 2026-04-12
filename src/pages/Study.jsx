import { Link } from "react-router-dom";
import { BookOpen, Layers } from "lucide-react";
import { useDecks } from "@/hooks/useDecks.js";
import EmptyState from "@/components/EmptyState.jsx";
import Spinner from "@/components/Spinner.jsx";

export default function Study() {
  const { decks, loading } = useDecks();

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <div>
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Pick a deck</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Study
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
          Start a session from one of your decks. Only due cards appear first — empty queues fall back to a fresh review.
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="card p-10 text-center"><Spinner /></div>
        ) : decks.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-5 w-5" />}
            title="No decks to study"
            description="Create a deck and add cards to begin a study session."
            action={<Link to="/decks" className="btn-primary">Create a deck</Link>}
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/study/${d.id}`}
                  className={`card block p-5 transition hover:border-brand-300 hover:shadow-elevated ${(d.cardCount ?? 0) === 0 ? "pointer-events-none opacity-50" : ""}`}
                  aria-disabled={(d.cardCount ?? 0) === 0}
                >
                  <div className="h-1.5 w-10 rounded-full" style={{ background: d.color || "#4F46E5" }} />
                  <h3 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-white">
                    {d.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {d.cardCount ?? 0} cards
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400">
                      <BookOpen className="h-3 w-3" /> Study →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
