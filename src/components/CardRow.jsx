import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { useToast } from "@/context/ToastContext.jsx";
import { deleteCard, updateCard } from "@/services/cards.js";
import ConfirmDialog from "@/components/ConfirmDialog.jsx";

// Single row for a card — shows Q/A side-by-side, with inline edit and delete.
// The edit affordance only shows on hover on desktop; on touch it's always
// visible (the opacity classes target sm: and up).
export default function CardRow({ card }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(card.question);
  const [a, setA] = useState(card.answer);
  const [confirm, setConfirm] = useState(false);

  async function save() {
    if (!q.trim() || !a.trim()) return;
    await updateCard(card.id, { question: q, answer: a });
    toast.success("Card updated.");
    setEditing(false);
  }

  async function remove() {
    await deleteCard(card.id);
    toast.success("Card deleted.");
  }

  function cancelEdit() {
    setEditing(false);
    setQ(card.question);
    setA(card.answer);
  }

  if (editing) {
    return (
      <div className="card grid gap-2 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <textarea className="input min-h-[60px]" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
        <textarea className="input min-h-[60px]" value={a} onChange={(e) => setA(e.target.value)} />
        <div className="flex gap-2 sm:flex-col sm:self-stretch">
          <button className="btn-primary flex-1" onClick={save}>Save</button>
          <button className="btn-secondary flex-1" onClick={cancelEdit}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card group flex items-start gap-4 p-4">
      <div className="grid flex-1 gap-1 sm:grid-cols-2 sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Q</p>
          <p className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">{card.question}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">A</p>
          <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">{card.answer}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          onClick={() => setEditing(true)}
          aria-label="Edit card"
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-danger-100 hover:text-danger-600 dark:hover:bg-danger-500/15"
          onClick={() => setConfirm(true)}
          aria-label="Delete card"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={remove}
        title="Delete this card?"
        description="This can't be undone."
        confirmText="Delete"
      />
    </div>
  );
}
