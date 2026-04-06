import { useEffect, useState } from "react";
import { subscribeCards } from "@/services/cards.js";
import { useAuth } from "@/context/AuthContext.jsx";

// Live-updating list of cards for a given deck. Uses Firestore onSnapshot
// under the hood (see services/cards.js) so if I add a card on my phone,
// the laptop tab updates instantly — no manual refresh.
export function useCards(deckId) {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Early return if we don't have enough info yet (e.g. user still loading
    // after a refresh, or the URL hasn't produced a deckId yet).
    if (!user || !deckId) {
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeCards(
      user.uid,
      deckId,
      (list) => {
        setCards(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    // IMPORTANT: return the unsubscribe so React runs it on unmount.
    // Missed this in an earlier draft and ended up with duplicate listeners
    // when navigating between decks. Memory leak + duplicated snapshots.
    return unsub;
  }, [user, deckId]);

  return { cards, loading, error };
}
