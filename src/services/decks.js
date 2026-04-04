import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/services/firebase.js";

const DEFAULT_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4", "#8B5CF6"];
export function pickColor(i = Math.floor(Math.random() * DEFAULT_COLORS.length)) {
  return DEFAULT_COLORS[Math.abs(i) % DEFAULT_COLORS.length];
}

export function subscribeDecks(userId, callback, onError) {
  const q = query(
    collection(db, "decks"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const decks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(decks);
  }, onError);
}

export async function createDeck(userId, { title, description = "", color }) {
  const payload = {
    userId,
    title: title.trim(),
    description: description.trim(),
    color: color || pickColor(),
    cardCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "decks"), payload);
  return { id: ref.id, ...payload };
}

export function updateDeck(deckId, patch) {
  return updateDoc(doc(db, "decks", deckId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDeck(userId, deckId) {
  // Deleting a deck has to cascade — otherwise the cards stay in Firestore
  // as orphans (user-owned but pointing at a deckId that no longer exists)
  // and they'll still show up in the /study queue. Found this out the hard
  // way when I deleted my first test deck.
  const cardsQuery = query(
    collection(db, "cards"),
    where("userId", "==", userId),
    where("deckId", "==", deckId)
  );
  const cardsSnap = await getDocs(cardsQuery);

  // Firestore batched writes max out at 500 operations. We chunk at 400 just
  // to leave room for the final `batch.delete(deck)` below and be safe.
  let batch = writeBatch(db);
  let count = 0;
  for (const c of cardsSnap.docs) {
    batch.delete(c.ref);
    count++;
    if (count % 400 === 0) {
      await batch.commit();
      batch = writeBatch(db);
    }
  }
  batch.delete(doc(db, "decks", deckId));
  await batch.commit();
}
