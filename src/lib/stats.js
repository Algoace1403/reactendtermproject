import { toMillis } from "@/lib/sm2.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dueCount(cards, now = Date.now()) {
  let n = 0;
  for (const c of cards) {
    const due = toMillis(c.dueAt);
    if (due == null || due <= now) n += 1;
  }
  return n;
}

export function masteryByDeck(cards, decks) {
  const byDeck = new Map();
  for (const d of decks) byDeck.set(d.id, { deck: d, mastered: 0, total: 0 });
  for (const c of cards) {
    const entry = byDeck.get(c.deckId);
    if (!entry) continue;
    entry.total += 1;
    // Consider "mastered" if interval >= 21 days and reps >= 3
    if ((c.interval ?? 0) >= 21 && (c.reps ?? 0) >= 3) entry.mastered += 1;
  }
  return Array.from(byDeck.values()).map((e) => ({
    deckId: e.deck.id,
    title: e.deck.title,
    color: e.deck.color,
    total: e.total,
    mastered: e.mastered,
    pct: e.total === 0 ? 0 : Math.round((e.mastered / e.total) * 100),
  }));
}

export function activityByDay(reviews, days = 14, now = Date.now()) {
  const today = startOfDay(now);
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    buckets.push({ day: today - i * MS_PER_DAY, count: 0 });
  }
  const indexByDay = new Map(buckets.map((b, i) => [b.day, i]));
  for (const r of reviews) {
    const ms = r.reviewedAtMs ?? toMillis(r.reviewedAt);
    if (ms == null) continue;
    const key = startOfDay(ms);
    const idx = indexByDay.get(key);
    if (idx != null) buckets[idx].count += 1;
  }
  return buckets.map((b) => ({
    date: new Date(b.day),
    label: new Date(b.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    count: b.count,
  }));
}

export function heatmap(reviews, weeks = 8, now = Date.now()) {
  const today = startOfDay(now);
  const totalDays = weeks * 7;
  const start = today - (totalDays - 1) * MS_PER_DAY;
  const counts = new Map();
  for (const r of reviews) {
    const ms = r.reviewedAtMs ?? toMillis(r.reviewedAt);
    if (ms == null) continue;
    const key = startOfDay(ms);
    if (key < start) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const cells = [];
  for (let i = 0; i < totalDays; i++) {
    const day = start + i * MS_PER_DAY;
    cells.push({ day, count: counts.get(day) ?? 0 });
  }
  return cells;
}

export function todayReviewCount(reviews, now = Date.now()) {
  const today = startOfDay(now);
  let n = 0;
  for (const r of reviews) {
    const ms = r.reviewedAtMs ?? toMillis(r.reviewedAt);
    if (ms == null) continue;
    if (startOfDay(ms) === today) n += 1;
  }
  return n;
}
