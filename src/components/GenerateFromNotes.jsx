import { useState } from "react";
import { Wand2 } from "lucide-react";
import Modal from "@/components/Modal.jsx";
import Spinner from "@/components/Spinner.jsx";
import { aiConfigured, generateCards } from "@/services/ai.js";

export default function GenerateFromNotes({ open, onClose, onImport }) {
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");

  const configured = aiConfigured();

  async function handleGenerate() {
    setError("");
    setCards([]);
    if (notes.trim().length < 30) {
      setError("Paste at least a few sentences of notes.");
      return;
    }
    setGenerating(true);
    try {
      const result = await generateCards(notes);
      if (result.length === 0) throw new Error("The model returned no cards. Try more detailed notes.");
      setCards(result);
    } catch (e) {
      setError(e.message ?? "Could not generate cards.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleImport() {
    if (cards.length === 0) return;
    setImporting(true);
    try {
      await onImport(cards);
      setCards([]);
      setNotes("");
      onClose();
    } finally {
      setImporting(false);
    }
  }

  function handleClose() {
    setCards([]);
    setNotes("");
    setError("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Generate cards from notes"
      size="xl"
      footer={
        <>
          <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
          {cards.length > 0 ? (
            <button type="button" onClick={handleImport} disabled={importing} className="btn-primary">
              {importing ? "Importing…" : `Import ${cards.length} cards`}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!configured || generating || notes.trim().length < 30}
              className="btn-primary"
            >
              {generating ? <Spinner size="sm" label="Generating…" /> : (<><Wand2 className="h-4 w-4" /> Generate</>)}
            </button>
          )}
        </>
      }
    >
      {!configured && (
        <div className="mb-4 rounded-xl bg-streak-100 p-4 text-sm text-streak-600 dark:bg-streak-500/15">
          <p className="font-semibold">AI is not configured.</p>
          <p className="mt-1">
            Add <code>VITE_GEMINI_API_KEY</code> to <code>.env.local</code> to enable one-click card generation. For now, use "Bulk paste" instead.
          </p>
        </div>
      )}

      <label htmlFor="ai-notes" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Your notes
      </label>
      <textarea
        id="ai-notes"
        className="input min-h-[200px]"
        placeholder="Paste lecture notes, textbook paragraphs, or raw study material…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {error && <p role="alert" className="mt-3 text-sm text-danger-600">{error}</p>}

      {cards.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Preview ({cards.length} cards)
          </p>
          <div className="max-h-[220px] space-y-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
            {cards.map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950">
                <p className="font-semibold text-slate-900 dark:text-white">Q. {c.question}</p>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300">A. {c.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
