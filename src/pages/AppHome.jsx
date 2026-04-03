import { Link } from "react-router-dom";
import { Flame, Layers, BookOpen, Plus, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useDecks } from "@/hooks/useDecks.js";
import { useStats } from "@/hooks/useStats.js";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import EmptyState from "@/components/EmptyState.jsx";
import Spinner from "@/components/Spinner.jsx";

export default function AppHome() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { decks, loading: decksLoading } = useDecks();
  const { dueCount, todayReviews, loading: statsLoading } = useStats();

  const name = profile?.displayName || user?.displayName || "there";
  const streak = profile?.streak ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
            Welcome back
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Hi, {name}.
          </h1>
        </div>
        <Link to="/decks" className="btn-secondary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New deck
        </Link>
      </div>

      {/* KPI row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Flame className="h-5 w-5" />}
          label="Current streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          tint="streak"
        />
        <KpiCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Due today"
          value={statsLoading ? "…" : String(dueCount)}
          tint="brand"
        />
        <KpiCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Reviews today"
          value={statsLoading ? "…" : String(todayReviews)}
          tint="success"
        />
      </div>

      {/* Due-today hero */}
      <section className="mt-6">
        {dueCount > 0 ? (
          <Link
            to="/study"
            className="group block overflow-hidden rounded-xl bg-brand-600 p-6 text-white shadow-elevated transition hover:bg-brand-700"
          >
            <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Ready?</p>
            <div className="mt-1 flex items-end justify-between">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                {dueCount} card{dueCount === 1 ? "" : "s"} due today.
              </h2>
              <span className="rounded-xl bg-white/15 px-4 py-2 font-semibold transition group-hover:bg-white/25">
                Start studying →
              </span>
            </div>
          </Link>
        ) : (
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-success-100 text-success-600 dark:bg-success-500/10">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Nothing due today — nice.
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Add new cards, or come back tomorrow for your next review.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recent decks */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Your decks
          </h2>
          <Link to="/decks" className="text-sm font-semibold text-brand-600 hover:underline">
            See all
          </Link>
        </div>

        <div className="mt-4">
          {decksLoading ? (
            <div className="card p-8 text-center"><Spinner /></div>
          ) : decks.length === 0 ? (
            <EmptyState
              icon={<Layers className="h-5 w-5" />}
              title="No decks yet"
              description="Start by creating your first deck. Add cards manually or paste notes to generate them."
              action={
                <Link to="/decks" className="btn-primary">
                  <Plus className="h-4 w-4" /> Create deck
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {decks.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <Link to={`/decks/${d.id}`} className="card block p-5 transition hover:border-brand-300 hover:shadow-elevated">
                    <div className="h-1.5 w-10 rounded-full" style={{ background: d.color || "#4F46E5" }} />
                    <h3 className="mt-3 line-clamp-1 font-display text-base font-bold text-slate-900 dark:text-white">
                      {d.title}
                    </h3>
                    {d.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                        {d.description}
                      </p>
                    )}
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {d.cardCount ?? 0} cards
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, tint }) {
  const tints = {
    streak:  "bg-streak-100 text-streak-600 dark:bg-streak-500/15 dark:text-streak-500",
    brand:   "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
    success: "bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${tints[tint]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
