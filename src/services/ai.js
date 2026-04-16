// Optional Gemini integration for note → flashcard generation.
// Degrades gracefully when no key is configured.

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export function aiConfigured() {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY);
}

const SYSTEM_PROMPT = `You convert study notes into high-quality flashcards.
Rules:
- Prefer atomic questions; one concept per card.
- Keep answers concise (1–2 sentences).
- Never invent facts that aren't in the notes.
- Produce 3–12 cards depending on note length.
Return STRICT JSON only, no prose, of shape:
{"cards":[{"question":"...","answer":"..."}]}`;

export async function generateCards(notes) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("AI not configured");

  const body = {
    contents: [
      { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nNotes:\n${notes}` }] },
    ],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`AI request failed (${res.status}).`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON.");
  }
  const cards = Array.isArray(parsed?.cards) ? parsed.cards : [];
  return cards
    .filter((c) => c?.question && c?.answer)
    .map((c) => ({ question: String(c.question).trim(), answer: String(c.answer).trim() }))
    .slice(0, 20);
}
