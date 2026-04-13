import { addDoc, collection, doc, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/services/firebase.js";
import { schedule } from "@/lib/sm2.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function reviewCard(userId, card, rating) {
  const now = Date.now();
  const next = schedule(card, rating, now);
  const batch = writeBatch(db);

  batch.update(doc(db, "cards", card.id), {
    ...next,
    updatedAt: serverTimestamp(),
  });

  const reviewRef = doc(collection(db, "reviews"));
  batch.set(reviewRef, {
    userId,
    cardId: card.id,
    deckId: card.deckId,
    rating,
    reviewedAt: serverTimestamp(),
    // Numeric timestamp for cheap client-side aggregation:
    reviewedAtMs: now,
  });

  await batch.commit();
  return next;
}

export async function bumpStreak(userId, profile) {
  const ref = doc(db, "users", userId);
  const last = profile?.lastStudiedAt?.toMillis?.() ?? null;
  const today = startOfDay(Date.now());
  const lastDay = last != null ? startOfDay(last) : null;

  if (lastDay === today) return;

  let streak = profile?.streak ?? 0;
  if (lastDay != null && today - lastDay === MS_PER_DAY) {
    streak += 1;
  } else {
    streak = 1;
  }
  const longestStreak = Math.max(profile?.longestStreak ?? 0, streak);

  await updateDoc(ref, {
    streak,
    longestStreak,
    lastStudiedAt: serverTimestamp(),
  });
}

function startOfDay(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export async function addReviewOnly(userId, { cardId, deckId, rating }) {
  await addDoc(collection(db, "reviews"), {
    userId,
    cardId,
    deckId,
    rating,
    reviewedAt: serverTimestamp(),
    reviewedAtMs: Date.now(),
  });
}
