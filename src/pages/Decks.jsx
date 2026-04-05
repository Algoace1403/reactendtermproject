import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Plus, Search } from "lucide-react";
import { useDecks } from "@/hooks/useDecks.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { createDeck } from "@/services/decks.js";
import DeckForm from "@/components/DeckForm.jsx";
import EmptyState from "@/components/EmptyState.jsx";
import Spinner from "@/components/Spinner.jsx";

export default function Decks() {
  const { user } = useAuth();
  const { decks, loading } = useDecks();
  const toast = useToast();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [showForm, setShowForm] = useState(false);

  // useMemo here because the search + sort combo runs on every keystroke —
  // without memoisation we'd re-sort the entire deck array each time the
  // search box changes, even though the sort key didn't actually change.
  // Cheap optimisation, but visible with 100+ decks.
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = needle
      ? decks.filter(
          (d) =>
            d.title.toLowerCase().includes(needle) ||
            (d.description || "").toLowerCase().includes(needle)
        )
      : decks;
    if (sort === "alpha") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "cards") {
      list = [...list].sort((a, b) => (b.cardCount || 0) - (a.cardCount || 0));
    }
    return list;
  }, [decks, q, sort]);

  async function handleCreate(values) {
    await createDeck(user.uid, values);
    toast.success("Deck created.");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Your library</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Decks
          </h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New deck
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400" aria-hidden="true" />
          <label htmlFor="deck-search" className="sr-only">Search decks</label>
          <input
            id="deck-search"
            className="input pl-9"
            placeholder="Search decks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="deck-sort" className="sr-only">Sort</label>
          <select
            id="deck-sort"
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Most recent</option>
            <option value="alpha">Alphabetical</option>
            <option value="cards">Most cards</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="card p-10 text-center"><Spinner /></div>
        ) : decks.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-5 w-5" />}
            title="No decks yet"
            description="Create your first deck to get started. Organise cards by subject, topic, or exam."
            action={
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus className="h-4 w-4" /> Create your first deck
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No matches"
            description={`No decks match "${q}". Try a different search.`}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/decks/${d.id}`}
                  className="card block p-5 transition hover:border-brand-300 hover:shadow-elevated"
                >
                  <div className="h-1.5 w-10 rounded-full" style={{ background: d.color || "#4F46E5" }} />
                  <h3 className="mt-3 line-clamp-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                    {d.title}
                  </h3>
                  {d.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                      {d.description}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm italic text-slate-400">No description</p>
                  )}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {d.cardCount ?? 0} card{d.cardCount === 1 ? "" : "s"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DeckForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} />
    </div>
  );
}
