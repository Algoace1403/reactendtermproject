import { useEffect, useState } from "react";
import Modal from "@/components/Modal.jsx";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4", "#8B5CF6"];

export default function DeckForm({ open, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setColor(initial?.color ?? COLORS[0]);
      setError("");
    }
  }, [open, initial]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your deck a title.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title, description, color });
      onClose();
    } catch (err) {
      setError(err.message || "Could not save deck.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit deck" : "New deck"}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" form="deck-form" disabled={submitting} className="btn-primary">
            {submitting ? "Saving…" : initial ? "Save changes" : "Create deck"}
          </button>
        </>
      }
    >
      <form id="deck-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="deck-title" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Title
          </label>
          <input
            id="deck-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Organic Chemistry — unit 3"
            autoFocus
            maxLength={80}
            required
          />
        </div>
        <div>
          <label htmlFor="deck-desc" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Description <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="deck-desc"
            className="input min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short note to help future-you remember what's inside."
            maxLength={200}
          />
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Colour
          </span>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Colour ${c}`}
                aria-pressed={color === c}
                className={`h-8 w-8 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-brand-600 dark:ring-offset-slate-900" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}
      </form>
    </Modal>
  );
}
