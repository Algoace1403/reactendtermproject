// Heuristic parser: turns pasted text into Q/A flashcard entries.
// Supports four formats:
//   1. Lines starting with "Q:" / "A:" pairs
//   2. Lines with a separator (?, -, :) between Q and A
//   3. Alternating lines: Q on odd, A on even (blank line between cards)
//   4. Tab / pipe separated: "question\tanswer"

export function parsePaste(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return [];

  // Format 1: Q: / A: pairs
  if (/^Q[:)]/im.test(trimmed)) {
    const entries = [];
    const blocks = trimmed.split(/\n(?=\s*Q[:)])/i);
    for (const block of blocks) {
      const qMatch = block.match(/^\s*Q[:)]\s*([\s\S]*?)(?=\n\s*A[:)])/i);
      const aMatch = block.match(/\n\s*A[:)]\s*([\s\S]*)$/i);
      if (qMatch && aMatch) {
        entries.push({ question: qMatch[1].trim(), answer: aMatch[1].trim() });
      }
    }
    return entries;
  }

  // Format 4: tab or pipe separated
  const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.every((l) => /\t|\s\|\s/.test(l))) {
    return lines
      .map((l) => l.split(/\t| \| /))
      .filter((parts) => parts.length >= 2)
      .map((parts) => ({ question: parts[0].trim(), answer: parts.slice(1).join(" ").trim() }));
  }

  // Format 2: "question? answer" on each line
  if (lines.every((l) => /\?\s+.+/.test(l))) {
    return lines.map((l) => {
      const idx = l.indexOf("?");
      return {
        question: l.slice(0, idx + 1).trim(),
        answer: l.slice(idx + 1).trim(),
      };
    });
  }

  // Format 3: alternating lines with blank separators
  if (/\n\s*\n/.test(trimmed)) {
    const blocks = trimmed.split(/\n\s*\n/);
    return blocks
      .map((b) => {
        const [q, ...rest] = b.split("\n");
        return { question: (q || "").trim(), answer: rest.join("\n").trim() };
      })
      .filter((e) => e.question && e.answer);
  }

  // Fallback: alternating lines
  const entries = [];
  for (let i = 0; i < lines.length - 1; i += 2) {
    entries.push({ question: lines[i], answer: lines[i + 1] });
  }
  return entries;
}
