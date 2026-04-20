import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/services/firebase.js";

export function subscribeCards(userId, deckId, callback, onError) {
  const q = query(
    collection(db, "cards"),
    where("userId", "==", userId),
    where("deckId", "==", deckId),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, onError);
}

function initialSchedule() {
  return {
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    dueAt: Date.now(), // due immediately
  };
}

export async function createCard(userId, deckId, { question, answer }) {
  const payload = {
    userId,
    deckId,
    question: question.trim(),
    answer: answer.trim(),
    ...initialSchedule(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "cards"), payload);
  await updateDoc(doc(db, "decks", deckId), {
    cardCount: increment(1),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id, ...payload };
}

export async function createCardsBatch(userId, deckId, entries) {
  if (entries.length === 0) return 0;
  const batch = writeBatch(db);
  const col = collection(db, "cards");
  for (const e of entries) {
    const ref = doc(col);
    batch.set(ref, {
      userId,
      deckId,
      question: e.question.trim(),
      answer: e.answer.trim(),
      ...initialSchedule(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  batch.update(doc(db, "decks", deckId), {
    cardCount: increment(entries.length),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
  return entries.length;
}

export function updateCard(cardId, patch) {
  return updateDoc(doc(db, "cards", cardId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCard(cardId) {
  const snap = await getDoc(doc(db, "cards", cardId));
  if (!snap.exists()) return;
  const { deckId } = snap.data();
  const batch = writeBatch(db);
  batch.delete(doc(db, "cards", cardId));
  batch.update(doc(db, "decks", deckId), {
    cardCount: increment(-1),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}
