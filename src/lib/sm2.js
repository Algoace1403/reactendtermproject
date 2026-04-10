// SuperMemo-2 spaced repetition algorithm (adapted for a 4-button rating).
//
// Original SM-2 by Piotr Woźniak uses a 0-5 quality scale. Most modern
// flashcard apps (Anki, Mochi, RemNote) reduce that to 4 buttons because
// people can't reliably tell apart "3" and "4" without training. So we
// expose: 1=Again, 2=Hard, 3=Good, 4=Easy and map internally.
//
// Core idea: each card has an "ease factor" (how easy the card is for me)
// and an "interval" (how many days until it's next due). A good rating
// grows the interval; a bad rating shrinks it and also lowers ease so
// future growth is slower. Over time, well-known cards drift far into
// the future and hard cards keep coming back.
//
// NOTE: this function is PURE — it does not mutate `card`. It returns the
// new schedule so the caller can persist it. Makes it trivially testable.

const MIN_EASE = 1.3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function schedule(card, rating, now = Date.now()) {
  // Default values for a brand-new card (never seen before).
  const prev = {
    ease: typeof card.ease === "number" ? card.ease : 2.5,
    interval: typeof card.interval === "number" ? card.interval : 0,
    reps: typeof card.reps === "number" ? card.reps : 0,
    lapses: typeof card.lapses === "number" ? card.lapses : 0,
  };

  let { ease, interval, reps, lapses } = prev;

  if (rating === 1) {
    // "Again" — I blanked. Reset the streak, count a lapse, nudge ease down.
    // The card comes back in ~10 minutes so I can attempt it again this
    // session. (Strict SM-2 resets interval to 1 day; the 10-min trick
    // comes from Anki and it feels way better in practice.)
    ease = Math.max(MIN_EASE, ease - 0.2);
    lapses += 1;
    reps = 0;
    interval = 0; // stored as 0 days; real due time is computed below
    return {
      ease,
      interval,
      reps,
      lapses,
      dueAt: now + 10 * 60 * 1000,
    };
  }

  // For Hard/Good/Easy we map to SM-2's quality score (q).
  // Quality 0-2 = "failed" in the paper — we handle that with rating=1 above.
  // 2 (Hard) -> q=3, 3 (Good) -> q=4, 4 (Easy) -> q=5.
  const q = rating === 2 ? 3 : rating === 3 ? 4 : 5;

  // SM-2 ease update rule (from the original paper, eq. 5):
  //   EF' = EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))
  // Clamped so ease never falls below 1.3, otherwise cards would spiral.
  ease = Math.max(MIN_EASE, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  // Interval progression. First two reviews have fixed steps (1, 6);
  // after that we multiply by ease (or a smaller factor for Hard).
  if (reps === 0) {
    interval = rating === 2 ? 1 : rating === 4 ? 4 : 1;
  } else if (reps === 1) {
    interval = rating === 2 ? 3 : rating === 4 ? 7 : 6;
  } else {
    const factor = rating === 2 ? 1.2 : rating === 4 ? ease * 1.3 : ease;
    interval = Math.max(1, Math.round(interval * factor));
  }

  reps += 1;

  return {
    ease: round(ease, 3),
    interval,
    reps,
    lapses,
    dueAt: now + interval * MS_PER_DAY,
  };
}

function round(n, digits) {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}

// A card is "due" if its dueAt is in the past (or missing — brand new cards).
export function isDue(card, now = Date.now()) {
  const due = toMillis(card.dueAt);
  return due == null || due <= now;
}

// Firestore Timestamp values arrive as { toMillis() } on the client but as
// { seconds, nanoseconds } in raw payloads. Also tolerate plain numbers and
// ISO strings so this works in unit tests too.
export function toMillis(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const parsed = Date.parse(v);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof v.toMillis === "function") return v.toMillis();
  if (typeof v.seconds === "number") return v.seconds * 1000;
  return null;
}
