import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useCards } from "@/hooks/useCards.js";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import { isDue, toMillis } from "@/lib/sm2.js";
import { bumpStreak, reviewCard } from "@/services/reviews.js";

export function useStudySession(deckId) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { cards, loading, error } = useCards(deckId);

  const [queue, setQueue] = useState([]);      // array of card ids in study order
  const [cursor, setCursor] = useState(0);     // index into queue
  const [flipped, setFlipped] = useState(false);
  const [started, setStarted] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [ratings, setRatings] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });

  // Build the queue the first time cards arrive
  useEffect(() => {
    if (loading || started) return;
    const due = cards.filter((c) => isDue(c));
    const ordered = due.length > 0
      ? [...due].sort((a, b) => (toMillis(a.dueAt) ?? 0) - (toMillis(b.dueAt) ?? 0))
      : [...cards]; // empty due queue → review all (new deck experience)
    setQueue(ordered.map((c) => c.id));
    setCursor(0);
    setFlipped(false);
    setStarted(true);
  }, [loading, cards, started]);

  const byId = useMemo(() => {
    const m = new Map();
    for (const c of cards) m.set(c.id, c);
    return m;
  }, [cards]);

  const currentCard = queue[cursor] ? byId.get(queue[cursor]) : null;
  const total = queue.length;
  const done = cursor >= total;

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const rate = useCallback(
    async (rating) => {
      if (!currentCard || !user) return;
      try {
        await reviewCard(user.uid, currentCard, rating);
        setReviewed((n) => n + 1);
        setRatings((r) => ({ ...r, [rating]: (r[rating] || 0) + 1 }));
      } catch {
        // non-fatal — still advance so user isn't stuck
      }
      setFlipped(false);
      setCursor((c) => c + 1);
    },
    [currentCard, user]
  );

  // When the session ends, bump streak once
  useEffect(() => {
    if (done && reviewed > 0 && user && profile !== undefined) {
      bumpStreak(user.uid, profile).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return {
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
  };
}
