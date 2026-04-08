import { useState } from "react";
import Modal from "@/components/Modal.jsx";
import { parsePaste } from "@/lib/parsePaste.js";

export default function BulkPaste({ open, onClose, onImport }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const preview = parsePaste(text);

  async function handleImport() {
    if (preview.length === 0) return;
    setSubmitting(true);
    try {
      await onImport(preview);
      setText("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => { setText(""); onClose(); }}
      title="Paste notes → cards"
      size="xl"
      footer={
        <>
          <button className="btn-secondary" onClick={() => { setText(""); onClose(); }}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleImport}
            disabled={submitting || preview.length === 0}
          >
            {submitting ? "Importing…" : `Import ${preview.length} card${preview.length === 1 ? "" : "s"}`}
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bulk-text" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Paste text
          </label>
          <textarea
            id="bulk-text"
            className="input min-h-[280px] font-mono text-sm"
            placeholder={`Supports any of:\n\nQ: What is SM-2?\nA: A spaced-repetition algorithm.\n\nWhat is React? A JavaScript library for building UIs.\n\nterm\\tdefinition\n\nor line pairs with blank lines between them.`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <p className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Preview ({preview.length})
          </p>
          <div className="max-h-[280px] space-y-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
            {preview.length === 0 ? (
              <p className="py-12 text-center text-sm italic text-slate-500">
                Paste text to see parsed cards here.
              </p>
            ) : (
              preview.map((p, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950">
                  <p className="font-semibold text-slate-900 dark:text-white">Q. {p.question}</p>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">A. {p.answer}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
