import { useRef, useState } from "react";
import { Plus } from "lucide-react";

// Inline add-card form. Kept small on purpose so DeckDetail stays readable.
// Cmd/Ctrl+Enter to save is the fastest way to add lots of cards quickly —
// I ended up using this a lot while seeding my own decks for testing.
export default function AddCardInline({ onAdd }) {
  const questionRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({ question, answer });
      setQuestion("");
      setAnswer("");
      questionRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  function handleKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]">
      <div>
        <label htmlFor="q-input" className="sr-only">Question</label>
        <textarea
          id="q-input"
          ref={questionRef}
          className="input min-h-[60px]"
          placeholder="Question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      <div>
        <label htmlFor="a-input" className="sr-only">Answer</label>
        <textarea
          id="a-input"
          className="input min-h-[60px]"
          placeholder="Answer…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !question.trim() || !answer.trim()}
        className="btn-primary sm:self-stretch"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add
      </button>
      <p className="text-xs text-slate-500 sm:col-span-3">
        Tip: press <kbd className="rounded border border-slate-300 px-1 text-[10px] dark:border-slate-700">⌘/Ctrl</kbd>{" "}
        + <kbd className="rounded border border-slate-300 px-1 text-[10px] dark:border-slate-700">Enter</kbd> to save.
      </p>
    </form>
  );
}
