import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/services/firebase.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useDecks } from "@/hooks/useDecks.js";
import {
  activityByDay,
  dueCount,
  heatmap,
  masteryByDeck,
  todayReviewCount,
} from "@/lib/stats.js";

export function useStats() {
  const { user } = useAuth();
  const { decks } = useDecks();

  const [cards, setCards] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to all cards for the user (bounded by their own data)
  useEffect(() => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "cards"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  // Subscribe to recent reviews (last 90 days is plenty for stats)
  useEffect(() => {
    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", user.uid),
      orderBy("reviewedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  const mastery = useMemo(() => masteryByDeck(cards, decks), [cards, decks]);
  const activity = useMemo(() => activityByDay(reviews), [reviews]);
  const heat = useMemo(() => heatmap(reviews), [reviews]);
  const due = useMemo(() => dueCount(cards), [cards]);
  const today = useMemo(() => todayReviewCount(reviews), [reviews]);

  return {
    cards,
    reviews,
    mastery,
    activity,
    heat,
    dueCount: due,
    todayReviews: today,
    totalReviews: reviews.length,
    totalCards: cards.length,
    loading,
  };
}
