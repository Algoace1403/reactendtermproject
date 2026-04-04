import { useEffect, useState } from "react";
import { subscribeDecks } from "@/services/decks.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeDecks(
      user.uid,
      (list) => {
        setDecks(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, [user]);

  return { decks, loading, error };
}
