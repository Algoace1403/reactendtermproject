import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { ArrowLeft, Edit3, Play, Plus, Trash2, Wand2 } from "lucide-react";
import { db } from "@/services/firebase.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useCards } from "@/hooks/useCards.js";
import { useToast } from "@/context/ToastContext.jsx";
import { createCard, createCardsBatch } from "@/services/cards.js";
import { deleteDeck, updateDeck } from "@/services/decks.js";
import DeckForm from "@/components/DeckForm.jsx";
import BulkPaste from "@/components/BulkPaste.jsx";
import ConfirmDialog from "@/components/ConfirmDialog.jsx";
import EmptyState from "@/components/EmptyState.jsx";
import Spinner from "@/components/Spinner.jsx";
import GenerateFromNotes from "@/components/GenerateFromNotes.jsx";
import AddCardInline from "@/components/AddCardInline.jsx";
import CardRow from "@/components/CardRow.jsx";

export default function DeckDetail() {
  const { id: deckId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { cards, loading: cardsLoading } = useCards(deckId);

  const [deck, setDeck] = useState(null);
  const [deckLoading, setDeckLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Subscribe to the single deck doc so renames/color changes show up live
  // even if another tab/device updates it.
  useEffect(() => {
    if (!deckId) return;
    setDeckLoading(true);
    const unsub = onSnapshot(
      doc(db, "decks", deckId),
      (snap) => {
        setDeck(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setDeckLoading(false);
      },
      () => setDeckLoading(false)
    );
    return unsub;
  }, [deckId]);

  async function handleUpdateDeck(values) {
    await updateDeck(deckId, values);
    toast.success("Deck updated.");
  }

  async function handleDeleteDeck() {
    try {
      await deleteDeck(user.uid, deckId);
      toast.success("Deck deleted.");
      navigate("/decks");
    } catch {
      toast.error("Could not delete deck.");
    }
  }

  async function handleAddCard({ question, answer }) {
    await createCard(user.uid, deckId, { question, answer });
    toast.success("Card added.");
  }

  async function handleBulkImport(entries) {
    const n = await createCardsBatch(user.uid, deckId, entries);
    toast.success(`Imported ${n} card${n === 1 ? "" : "s"}.`);
  }

  if (deckLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="card p-12 text-center"><Spinner /></div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-10">
        <EmptyState
          title="Deck not found"
          description="This deck may have been deleted."
          action={<Link to="/decks" className="btn-primary">Back to decks</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <Link to="/decks" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All decks
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="h-1.5 w-12 rounded-full" style={{ background: deck.color || "#4F46E5" }} />
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {deck.title}
          </h1>
          {deck.description && (
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              {deck.description}
            </p>
          )}
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {cards.length} card{cards.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-secondary" onClick={() => setEditOpen(true)}>
            <Edit3 className="h-4 w-4" aria-hidden="true" /> Edit
          </button>
          <button
            className="btn-secondary !text-danger-600"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
          </button>
          <Link
            to={`/study/${deckId}`}
            className={`btn-primary ${cards.length === 0 ? "pointer-events-none opacity-50" : ""}`}
            aria-disabled={cards.length === 0}
          >
            <Play className="h-4 w-4" aria-hidden="true" /> Study now
          </Link>
        </div>
      </header>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Cards</h2>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setAiOpen(true)}>
              <Wand2 className="h-4 w-4" /> Generate from notes
            </button>
            <button className="btn-secondary" onClick={() => setBulkOpen(true)}>
              <Plus className="h-4 w-4" /> Bulk paste
            </button>
          </div>
        </div>

        <div className="mt-4">
          <AddCardInline onAdd={handleAddCard} />
        </div>

        <div className="mt-4 space-y-2">
          {cardsLoading ? (
            <div className="card p-8 text-center"><Spinner /></div>
          ) : cards.length === 0 ? (
            <EmptyState
              title="No cards yet"
              description="Add cards one by one above, or paste notes to import many at once."
            />
          ) : (
            cards.map((c) => (
              <CardRow key={c.id} card={c} />
            ))
          )}
        </div>
      </section>

      <DeckForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdateDeck}
        initial={deck}
      />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteDeck}
        title="Delete this deck?"
        description={`"${deck.title}" and its ${cards.length} card${cards.length === 1 ? "" : "s"} will be permanently deleted.`}
        confirmText="Delete deck"
      />
      <BulkPaste
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImport={handleBulkImport}
      />
      <GenerateFromNotes
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
}
