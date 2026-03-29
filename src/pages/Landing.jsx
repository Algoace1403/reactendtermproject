import { Link } from "react-router-dom";
import { Sparkles, Brain, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
            SL
          </div>
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
            StudyLoop
          </span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/login" className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Sign in
          </Link>
          <Link to="/signup" className="btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          AI-assisted spaced repetition
        </span>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
          Study smarter,
          <br />
          <span className="text-brand-600 dark:text-brand-400">not harder.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Turn your notes into flashcards, review them on a proven schedule, and actually remember what you study.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup" className="btn-primary">
            Create your first deck
          </Link>
          <Link to="/login" className="btn-secondary">
            I have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-4 px-6 pb-20 sm:grid-cols-3">
        <FeatureCard
          icon={<Brain className="h-5 w-5" aria-hidden="true" />}
          title="Decks & cards"
          body="Organise by subject, add cards manually or paste notes."
        />
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
          title="Smart review"
          body="The SM-2 algorithm schedules each card when you're about to forget it."
        />
        <FeatureCard
          icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
          title="Progress you feel"
          body="Streaks, mastery charts, and weekly activity — see your loop."
        />
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        StudyLoop · End-term project · React Batch 2029
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, body }) {
  return (
    <div className="card p-6">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {body}
      </p>
    </div>
  );
}
