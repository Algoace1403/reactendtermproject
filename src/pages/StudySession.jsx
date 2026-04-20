import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useStudySession } from "@/hooks/useStudySession.js";
import FlashCard from "@/components/FlashCard.jsx";
import Spinner from "@/components/Spinner.jsx";

const RATINGS = [
  { value: 1, label: "Again", sub: "Forgot",    key: "1", className: "border-danger-500 text-danger-600 hover:bg-danger-500 hover:text-white" },
  { value: 2, label: "Hard",  sub: "Barely",   key: "2", className: "border-streak-500 text-streak-600 hover:bg-streak-500 hover:text-white" },
  { value: 3, label: "Good",  sub: "Got it",   key: "3", className: "border-success-500 text-success-600 hover:bg-success-500 hover:text-white" },
  { value: 4, label: "Easy",  sub: "Too easy", key: "4", className: "border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white" },
];

export default function StudySession() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    error,
    total,
    cursor,
    done,
    reviewed,
    ratings,
    flipped,
    currentCard,
    flip,
    rate,
  } = useStudySession(deckId);

  // Keyboard shortcuts: Space = flip, 1/2/3/4 = rate (only when flipped)
  useEffect(() => {
    function onKey(e) {
      if (done) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        flip();
        return;
      }
      if (flipped && /^[1-4]$/.test(e.key)) {
        rate(Number(e.key));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, done, flip, rate]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-3xl place-items-center px-6 py-16">
        <Spinner label="Loading session…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="card border-danger-500/30 p-10">
          <h1 className="font-display text-2xl font-bold text-danger-600">
            Couldn't load this deck.
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Check your internet connection or try again in a moment. If the
            problem sticks around, sign out and back in.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Link to={`/decks/${deckId}`} className="btn-secondary inline-flex">
              <ArrowLeft className="h-4 w-4" /> Back to deck
            </Link>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="card p-10">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            No cards in this deck.
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Add a few cards first, then come back to study.
          </p>
          <Link to={`/decks/${deckId}`} className="btn-primary mt-6 inline-flex">
            <ArrowLeft className="h-4 w-4" /> Back to deck
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <div className="card p-10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-100 text-success-600 dark:bg-success-500/15">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
            Session complete.
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            You reviewed {reviewed} card{reviewed === 1 ? "" : "s"}.
          </p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <div key={r.value} className="rounded-xl border border-slate-200 p-3 text-center dark:border-slate-800">
                <p className="text-xs font-semibold uppercase text-slate-500">{r.label}</p>
                <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                  {ratings[r.value] ?? 0}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Link to={`/decks/${deckId}`} className="btn-secondary">Back to deck</Link>
            <button onClick={() => navigate(0)} className="btn-primary">Study again</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = total === 0 ? 0 : Math.round((cursor / total) * 100);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/decks/${deckId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          End session
        </Link>
        <p className="text-sm font-semibold text-slate-500">
          {cursor + 1} / {total}
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
      </div>

      {currentCard && (
        <>
          <div className="mt-8">
            <FlashCard card={currentCard} flipped={flipped} onFlip={flip} />
          </div>

          <div className="mt-8">
            {flipped ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => rate(r.value)}
                    className={`rounded-xl border-2 bg-white px-4 py-3 text-sm font-bold shadow-card transition dark:bg-slate-900 ${r.className}`}
                  >
                    <span className="block text-base">{r.label}</span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-slate-500 group-hover:text-white">
                      {r.sub} · <kbd className="font-mono">{r.key}</kbd>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <button onClick={flip} className="btn-primary">
                  Reveal answer
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Press <kbd className="rounded border border-slate-300 px-1 text-[10px] dark:border-slate-700">Space</kbd> to flip
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
