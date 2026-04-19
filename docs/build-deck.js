// StudyLoop — End-Term Project Plan Deck
// 16:9, ~22 slides, Focused Minimal (indigo + emerald + slate)

const PptxGenJS = require("pptxgenjs");

const pres = new PptxGenJS();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "StudyLoop — End-Term Project Plan";
pres.author = "StudyLoop Team";
pres.company = "React Batch 2029";

// ---------- Design tokens ----------
const C = {
  indigo:   "4F46E5",
  indigoD:  "3730A3",
  indigoL:  "EEF2FF",
  slate900: "0F172A",
  slate800: "1E293B",
  slate700: "334155",
  slate500: "64748B",
  slate300: "CBD5E1",
  slate200: "E2E8F0",
  slate100: "F1F5F9",
  slate50:  "F8FAFC",
  white:    "FFFFFF",
  emerald:  "10B981",
  emeraldL: "D1FAE5",
  amber:    "F59E0B",
  amberL:   "FEF3C7",
  rose:     "F43F5E",
  roseL:    "FFE4E6",
};
const F = { h: "Calibri", b: "Calibri" };

// ---------- Reusable slide builders ----------
function addDarkBackground(s) {
  s.background = { color: C.slate900 };
}
function addLightBackground(s) {
  s.background = { color: C.slate50 };
}

function addHeader(s, eyebrow, title) {
  // Thin indigo accent bar on left
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: C.indigo }, line: { type: "none" },
  });
  // Eyebrow
  s.addText(eyebrow, {
    x: 0.6, y: 0.45, w: 12, h: 0.3,
    fontFace: F.h, fontSize: 12, bold: true, color: C.indigo, charSpacing: 4,
  });
  // Title
  s.addText(title, {
    x: 0.6, y: 0.75, w: 12, h: 0.9,
    fontFace: F.h, fontSize: 34, bold: true, color: C.slate900,
  });
}

function addFooter(s, pageLabel) {
  s.addText("StudyLoop · React Batch 2029", {
    x: 0.6, y: 7.08, w: 6, h: 0.3,
    fontFace: F.b, fontSize: 10, color: C.slate500,
  });
  s.addText(pageLabel, {
    x: 10.7, y: 7.08, w: 2, h: 0.3,
    fontFace: F.b, fontSize: 10, color: C.slate500, align: "right",
  });
}

function addCard(s, { x, y, w, h, fill = C.white, border = C.slate200 }) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: fill },
    line: { color: border, width: 1 },
    rectRadius: 0.12,
  });
}

function addNumberBadge(s, { x, y, num, color = C.indigo, bg = C.indigoL }) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: 0.55, h: 0.55,
    fill: { color: bg }, line: { type: "none" },
  });
  s.addText(String(num), {
    x, y, w: 0.55, h: 0.55,
    fontFace: F.h, fontSize: 16, bold: true, color,
    align: "center", valign: "middle",
  });
}

// =========================================================
// SLIDE 1 — COVER
// =========================================================
{
  const s = pres.addSlide();
  addDarkBackground(s);
  // Indigo glow block
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 0.6, w: 0.8, h: 0.4, fill: { color: C.indigo }, line: { type: "none" }, rectRadius: 0.08,
  });
  s.addText("SL", {
    x: 0.6, y: 0.6, w: 0.8, h: 0.4,
    fontFace: F.h, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle",
  });
  s.addText("StudyLoop", {
    x: 1.55, y: 0.55, w: 5, h: 0.5,
    fontFace: F.h, fontSize: 18, bold: true, color: C.white,
  });

  // Main title
  s.addText("Study smarter,\nnot harder.", {
    x: 0.6, y: 2.3, w: 10, h: 2.0,
    fontFace: F.h, fontSize: 64, bold: true, color: C.white,
    lineSpacingMultiple: 1.0,
  });
  s.addText("An AI-assisted flashcard app with spaced repetition —\nend-term project proposal & build plan.", {
    x: 0.6, y: 4.4, w: 10, h: 0.9,
    fontFace: F.b, fontSize: 18, color: C.slate300, lineSpacingMultiple: 1.2,
  });

  // Meta row
  s.addShape(pres.ShapeType.rect, {
    x: 0.6, y: 6.3, w: 12.1, h: 0.03, fill: { color: C.slate700 }, line: { type: "none" },
  });
  s.addText("COURSE", { x: 0.6, y: 6.45, w: 3, h: 0.25, fontFace: F.h, fontSize: 10, bold: true, color: C.slate500, charSpacing: 3 });
  s.addText("Building Web Applications with React", { x: 0.6, y: 6.72, w: 5, h: 0.35, fontFace: F.b, fontSize: 14, color: C.white });

  s.addText("BATCH", { x: 5.8, y: 6.45, w: 3, h: 0.25, fontFace: F.h, fontSize: 10, bold: true, color: C.slate500, charSpacing: 3 });
  s.addText("2029", { x: 5.8, y: 6.72, w: 3, h: 0.35, fontFace: F.b, fontSize: 14, color: C.white });

  s.addText("STACK", { x: 8.2, y: 6.45, w: 4.5, h: 0.25, fontFace: F.h, fontSize: 10, bold: true, color: C.slate500, charSpacing: 3 });
  s.addText("React · Firebase · Tailwind · Vercel", { x: 8.2, y: 6.72, w: 4.5, h: 0.35, fontFace: F.b, fontSize: 14, color: C.white });
}

// =========================================================
// SLIDE 2 — EXECUTIVE SUMMARY
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "OVERVIEW", "Executive Summary");

  const items = [
    { t: "THE PROBLEM", b: "Students cram before exams and forget 70% within a week. No tool turns their own notes into a spaced-repetition system.", color: C.rose, bg: C.roseL },
    { t: "THE PRODUCT", b: "StudyLoop — create decks, review flashcards daily, and get smart schedules via the SM-2 algorithm.", color: C.indigo, bg: C.indigoL },
    { t: "THE USERS", b: "College & high-school students preparing for exams, certifications, and long-term courses.", color: C.emerald, bg: C.emeraldL },
    { t: "THE DELIVERABLE", b: "Production-grade React app with Firebase Auth + Firestore, deployed live on Vercel.", color: C.amber, bg: C.amberL },
  ];

  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15;
    const y = 2.0 + row * 2.3;
    addCard(s, { x, y, w: 5.95, h: 2.05 });
    s.addShape(pres.ShapeType.rect, {
      x, y, w: 0.08, h: 2.05, fill: { color: it.color }, line: { type: "none" },
    });
    s.addText(it.t, {
      x: x + 0.3, y: y + 0.25, w: 5.5, h: 0.35,
      fontFace: F.h, fontSize: 11, bold: true, color: it.color, charSpacing: 3,
    });
    s.addText(it.b, {
      x: x + 0.3, y: y + 0.7, w: 5.5, h: 1.3,
      fontFace: F.b, fontSize: 15, color: C.slate700, lineSpacingMultiple: 1.3,
    });
  });

  addFooter(s, "02 / 22");
}

// =========================================================
// SLIDE 3 — THE PROBLEM
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "01 · PROBLEM", "Why students forget what they study");

  // Big stat on left
  addCard(s, { x: 0.6, y: 2.0, w: 5.8, h: 4.5, fill: C.slate900, border: C.slate900 });
  s.addText("70%", {
    x: 0.6, y: 2.3, w: 5.8, h: 1.8,
    fontFace: F.h, fontSize: 120, bold: true, color: C.amber, align: "center",
  });
  s.addText("forgotten within a week without review.", {
    x: 1.0, y: 4.4, w: 5.0, h: 0.9,
    fontFace: F.b, fontSize: 16, color: C.slate300, align: "center", lineSpacingMultiple: 1.3,
  });
  s.addText("— Ebbinghaus forgetting curve", {
    x: 1.0, y: 5.7, w: 5.0, h: 0.4,
    fontFace: F.b, fontSize: 11, italic: true, color: C.slate300, align: "center",
  });

  // Right: pain points
  const pains = [
    { t: "Scattered material", b: "Notes in 3 notebooks, slides in Drive, PDFs in 6 tabs." },
    { t: "Passive re-reading", b: "Feels productive but builds no long-term memory." },
    { t: "Cramming", b: "Last-minute push → short-term recall, forgotten after exam." },
    { t: "Existing tools (Anki)", b: "Powerful but a 1998 UI and no AI card generation." },
  ];
  pains.forEach((p, i) => {
    const y = 2.0 + i * 1.12;
    addCard(s, { x: 6.7, y, w: 6.0, h: 1.0 });
    s.addShape(pres.ShapeType.ellipse, {
      x: 6.9, y: y + 0.25, w: 0.5, h: 0.5, fill: { color: C.roseL }, line: { type: "none" },
    });
    s.addText("!", {
      x: 6.9, y: y + 0.25, w: 0.5, h: 0.5,
      fontFace: F.h, fontSize: 18, bold: true, color: C.rose, align: "center", valign: "middle",
    });
    s.addText(p.t, {
      x: 7.55, y: y + 0.15, w: 5.0, h: 0.35,
      fontFace: F.h, fontSize: 14, bold: true, color: C.slate900,
    });
    s.addText(p.b, {
      x: 7.55, y: y + 0.5, w: 5.0, h: 0.5,
      fontFace: F.b, fontSize: 12, color: C.slate700,
    });
  });

  addFooter(s, "03 / 22");
}

// =========================================================
// SLIDE 4 — THE SOLUTION
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "02 · SOLUTION", "StudyLoop — three connected features");

  const feats = [
    {
      num: "1",
      title: "Decks & Cards",
      sub: "Organise your study",
      bullets: ["Create decks by subject or topic", "Add Q/A cards manually", "Optional: paste notes → AI generates cards", "Edit, delete, search, filter"],
    },
    {
      num: "2",
      title: "Study Session",
      sub: "Spaced repetition (SM-2)",
      bullets: ["Daily 'Due today' queue", "Flip cards, rate recall 1–4", "Algorithm schedules next review", "Keyboard-driven for speed"],
    },
    {
      num: "3",
      title: "Dashboard & Stats",
      sub: "See your progress",
      bullets: ["Current + longest streak", "Mastery % per deck (chart)", "14-day activity trend", "8-week heatmap grid"],
    },
  ];

  feats.forEach((f, i) => {
    const x = 0.6 + i * 4.23;
    const w = 4.0;
    addCard(s, { x, y: 2.0, w, h: 4.7 });
    // top bar
    s.addShape(pres.ShapeType.rect, {
      x, y: 2.0, w, h: 0.12, fill: { color: C.indigo }, line: { type: "none" },
    });
    addNumberBadge(s, { x: x + 0.35, y: 2.35, num: f.num });
    s.addText(f.title, {
      x: x + 0.35, y: 3.05, w: w - 0.6, h: 0.45,
      fontFace: F.h, fontSize: 20, bold: true, color: C.slate900,
    });
    s.addText(f.sub, {
      x: x + 0.35, y: 3.5, w: w - 0.6, h: 0.35,
      fontFace: F.b, fontSize: 12, italic: true, color: C.indigo,
    });
    s.addText(f.bullets.map(b => ({ text: b, options: { bullet: { code: "25CF" }, color: C.slate700 } })), {
      x: x + 0.35, y: 3.95, w: w - 0.6, h: 2.5,
      fontFace: F.b, fontSize: 12, color: C.slate700,
      paraSpaceAfter: 6,
    });
  });

  addFooter(s, "04 / 22");
}

// =========================================================
// SLIDE 5 — USER & WHY IT MATTERS
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "03 · USER", "Who we're building for");

  // Persona card
  addCard(s, { x: 0.6, y: 2.0, w: 5.8, h: 4.5, fill: C.white });
  s.addShape(pres.ShapeType.ellipse, {
    x: 1.0, y: 2.4, w: 1.3, h: 1.3, fill: { color: C.indigoL }, line: { type: "none" },
  });
  s.addText("R", {
    x: 1.0, y: 2.4, w: 1.3, h: 1.3,
    fontFace: F.h, fontSize: 40, bold: true, color: C.indigo, align: "center", valign: "middle",
  });
  s.addText("Riya, 19", {
    x: 2.5, y: 2.5, w: 3.5, h: 0.5,
    fontFace: F.h, fontSize: 24, bold: true, color: C.slate900,
  });
  s.addText("2nd-year engineering student", {
    x: 2.5, y: 3.0, w: 3.5, h: 0.35,
    fontFace: F.b, fontSize: 13, color: C.slate500,
  });

  const goals = [
    { t: "Juggles", v: "6 subjects · 3 exams/sem" },
    { t: "Studies on", v: "laptop + phone (commute)" },
    { t: "Needs", v: "structure, not more content" },
    { t: "Avoids", v: "setup-heavy tools" },
  ];
  goals.forEach((g, i) => {
    const y = 4.0 + i * 0.55;
    s.addText(g.t, { x: 1.0, y, w: 1.5, h: 0.35, fontFace: F.b, fontSize: 11, color: C.slate500, bold: true, charSpacing: 2 });
    s.addText(g.v, { x: 2.5, y, w: 3.5, h: 0.35, fontFace: F.b, fontSize: 13, color: C.slate800 });
  });

  // Right: why it matters
  s.addText("Why this matters", {
    x: 6.9, y: 2.0, w: 5.8, h: 0.5,
    fontFace: F.h, fontSize: 20, bold: true, color: C.slate900,
  });
  s.addText([
    { text: "Active recall + spaced repetition is the most evidence-backed learning technique in cognitive science.\n\n", options: { fontSize: 15, color: C.slate700 } },
    { text: "Yet 9 out of 10 students still rely on re-reading and highlighting — methods shown to be the weakest.\n\n", options: { fontSize: 15, color: C.slate700 } },
    { text: "StudyLoop packages proven science into a simple daily routine: ", options: { fontSize: 15, color: C.slate700 } },
    { text: "open the app → clear today's queue → close.", options: { fontSize: 15, bold: true, color: C.indigo } },
  ], {
    x: 6.9, y: 2.55, w: 5.8, h: 3.8, fontFace: F.b, lineSpacingMultiple: 1.4, valign: "top",
  });

  addFooter(s, "05 / 22");
}

// =========================================================
// SLIDE 6 — TECH STACK
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "04 · STACK", "Chosen tools & why");

  const stack = [
    { cat: "FRONTEND", items: [["React 18", "Core library — functional components + hooks"], ["Vite", "Fast dev server, HMR, modern ESM build"], ["React Router v6", "Client-side routing + protected routes"]] },
    { cat: "BACKEND", items: [["Firebase Auth", "Email/password + Google OAuth out of the box"], ["Cloud Firestore", "Real-time NoSQL DB with onSnapshot listeners"], ["Security Rules", "Per-document access control (user-scoped)"]] },
    { cat: "UI & UX", items: [["Tailwind CSS", "Utility-first, dark mode, design tokens"], ["Framer Motion", "Spring physics for card flip animation"], ["Recharts", "Responsive SVG charts for stats dashboard"]] },
    { cat: "TOOLING", items: [["Lucide Icons", "Consistent SVG icon set (no emoji)"], ["Vercel", "Zero-config deploy, preview URLs per branch"], ["Git + GitHub", "Conventional commits, clean history"]] },
  ];

  stack.forEach((col, i) => {
    const x = 0.6 + i * 3.15;
    const w = 3.0;
    addCard(s, { x, y: 2.0, w, h: 4.7 });
    // category header
    s.addShape(pres.ShapeType.rect, {
      x, y: 2.0, w, h: 0.55, fill: { color: C.indigo }, line: { type: "none" },
    });
    s.addText(col.cat, {
      x, y: 2.0, w, h: 0.55,
      fontFace: F.h, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", charSpacing: 4,
    });
    col.items.forEach((it, j) => {
      const y = 2.75 + j * 1.3;
      s.addText(it[0], {
        x: x + 0.25, y, w: w - 0.5, h: 0.35,
        fontFace: F.h, fontSize: 13, bold: true, color: C.slate900,
      });
      s.addText(it[1], {
        x: x + 0.25, y: y + 0.4, w: w - 0.5, h: 0.85,
        fontFace: F.b, fontSize: 11, color: C.slate700, lineSpacingMultiple: 1.3,
      });
    });
  });

  addFooter(s, "06 / 22");
}

// =========================================================
// SLIDE 7 — DESIGN SYSTEM
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "05 · DESIGN", "Focused-Minimal visual system");

  // Colors
  s.addText("COLOUR TOKENS", { x: 0.6, y: 2.0, w: 6, h: 0.3, fontFace: F.h, fontSize: 11, bold: true, color: C.slate500, charSpacing: 3 });
  const swatches = [
    { c: C.indigo, n: "Primary", h: "#4F46E5" },
    { c: C.emerald, n: "Success", h: "#10B981" },
    { c: C.amber, n: "Streak", h: "#F59E0B" },
    { c: C.rose, n: "Danger", h: "#F43F5E" },
    { c: C.slate900, n: "Text", h: "#0F172A" },
    { c: C.slate200, n: "Border", h: "#E2E8F0" },
  ];
  swatches.forEach((sw, i) => {
    const x = 0.6 + i * 1.05;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 2.4, w: 0.9, h: 0.9, fill: { color: sw.c }, line: { color: C.slate500, width: 1.5 }, rectRadius: 0.1,
    });
    s.addText(sw.n, { x: x - 0.05, y: 3.35, w: 1.0, h: 0.25, fontFace: F.h, fontSize: 10, bold: true, color: C.slate900 });
    s.addText(sw.h, { x: x - 0.05, y: 3.6, w: 1.0, h: 0.25, fontFace: F.b, fontSize: 9, color: C.slate500 });
  });

  // Typography
  s.addText("TYPOGRAPHY", { x: 7.1, y: 2.0, w: 6, h: 0.3, fontFace: F.h, fontSize: 11, bold: true, color: C.slate500, charSpacing: 3 });
  addCard(s, { x: 7.1, y: 2.4, w: 5.6, h: 1.7 });
  s.addText("Plus Jakarta Sans", {
    x: 7.3, y: 2.55, w: 5.2, h: 0.55, fontFace: F.h, fontSize: 24, bold: true, color: C.slate900,
  });
  s.addText("Headings · Bold · Tracks tight", { x: 7.3, y: 3.1, w: 5.2, h: 0.3, fontFace: F.b, fontSize: 11, color: C.slate500 });
  s.addText("Inter — crisp, neutral, readable", { x: 7.3, y: 3.45, w: 5.2, h: 0.35, fontFace: F.b, fontSize: 15, color: C.slate700 });
  s.addText("Body · 15–16pt · 1.5 line-height", { x: 7.3, y: 3.8, w: 5.2, h: 0.3, fontFace: F.b, fontSize: 11, color: C.slate500 });

  // Principles
  s.addText("DESIGN PRINCIPLES", { x: 0.6, y: 4.3, w: 6, h: 0.3, fontFace: F.h, fontSize: 11, bold: true, color: C.slate500, charSpacing: 3 });
  const prin = [
    { t: "Light + dark mode", b: "Both themes from day one — study happens at night." },
    { t: "Motion with meaning", b: "150–250ms ease-out; spring only on card flip." },
    { t: "Keyboard-first", b: "Every action reachable without a mouse." },
    { t: "One CTA per screen", b: "Primary indigo button; secondary outlined." },
  ];
  prin.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15;
    const y = 4.7 + row * 1.1;
    addCard(s, { x, y, w: 5.95, h: 0.95 });
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.2, y: y + 0.25, w: 0.45, h: 0.45, fill: { color: C.indigoL }, line: { type: "none" },
    });
    s.addText("✓", { x: x + 0.2, y: y + 0.25, w: 0.45, h: 0.45, fontFace: F.h, fontSize: 14, bold: true, color: C.indigo, align: "center", valign: "middle" });
    s.addText(p.t, { x: x + 0.8, y: y + 0.1, w: 5.0, h: 0.35, fontFace: F.h, fontSize: 13, bold: true, color: C.slate900 });
    s.addText(p.b, { x: x + 0.8, y: y + 0.45, w: 5.0, h: 0.45, fontFace: F.b, fontSize: 11, color: C.slate700 });
  });

  addFooter(s, "07 / 22");
}

// =========================================================
// SLIDE 8 — DATA MODEL
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "06 · DATA", "Firestore collections & relationships");

  const cols = [
    { name: "users", key: "uid", fields: ["email", "displayName", "streak", "lastStudiedAt", "theme"] },
    { name: "decks", key: "deckId", fields: ["userId", "title", "description", "color", "createdAt"] },
    { name: "cards", key: "cardId", fields: ["deckId", "userId", "question", "answer", "ease", "interval", "dueAt", "reps", "lapses"] },
    { name: "reviews", key: "reviewId", fields: ["userId", "cardId", "rating", "reviewedAt"] },
  ];

  cols.forEach((c, i) => {
    const x = 0.6 + i * 3.15;
    const w = 3.0;
    addCard(s, { x, y: 2.0, w, h: 3.85 });
    // header
    s.addShape(pres.ShapeType.rect, {
      x, y: 2.0, w, h: 0.55, fill: { color: C.slate900 }, line: { type: "none" },
    });
    s.addText(c.name + "/", { x: x + 0.2, y: 2.0, w: w - 0.4, h: 0.55, fontFace: F.h, fontSize: 15, bold: true, color: C.white, valign: "middle" });
    s.addText(c.key, { x: x + 0.2, y: 2.65, w: w - 0.4, h: 0.3, fontFace: F.b, fontSize: 10, italic: true, color: C.indigo });
    c.fields.forEach((f, j) => {
      const y = 2.98 + j * 0.28;
      s.addText("·  " + f, {
        x: x + 0.2, y, w: w - 0.4, h: 0.28,
        fontFace: F.b, fontSize: 10.5, color: C.slate700,
      });
    });
  });

  // Security note
  addCard(s, { x: 0.6, y: 6.0, w: 12.1, h: 0.85, fill: C.indigoL, border: C.indigo });
  s.addText("SECURITY", { x: 0.85, y: 6.12, w: 1.5, h: 0.3, fontFace: F.h, fontSize: 10, bold: true, color: C.indigo, charSpacing: 3 });
  s.addText("Firestore Security Rules enforce request.auth.uid == resource.data.userId on every read and write — no user can ever see another user's decks, cards, or reviews.", {
    x: 0.85, y: 6.38, w: 11.7, h: 0.5, fontFace: F.b, fontSize: 12, color: C.slate800,
  });

  addFooter(s, "08 / 22");
}

// =========================================================
// SLIDE 9 — REACT CONCEPTS COVERAGE (rubric gold)
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "07 · CONCEPTS", "React concepts → where each lives");

  const rows = [
    ["Functional components", "Every file in /components and /pages"],
    ["useState", "Card form, auth forms, study session queue"],
    ["useEffect", "Data fetch, auth listener, theme sync"],
    ["Props & composition", "Deck → DeckCard, Session → FlashCard"],
    ["Conditional rendering", "Auth gate, empty states, loading, errors"],
    ["Lists & keys", "Decks grid, cards list, review history"],
    ["Lifting state up", "Study session owns rating, cards emit events"],
    ["Controlled components", "All forms (deck, card, auth, settings)"],
    ["Context API", "AuthContext · ThemeContext · ToastContext"],
    ["React Router", "8 routes, protected + dynamic /decks/:id"],
    ["useMemo", "Filtered decks, mastery % calc, due queue"],
    ["useCallback", "Handlers passed to memoised children"],
    ["useRef", "Focus card form on open, session timer"],
    ["React.lazy + Suspense", "/study, /stats, /settings lazy-loaded"],
    ["Custom hooks", "useAuth, useDecks, useCards, useStudySession"],
  ];

  const tableData = [
    [
      { text: "CONCEPT", options: { bold: true, color: C.white, fill: { color: C.slate900 }, fontSize: 11, charSpacing: 3, align: "left" } },
      { text: "WHERE USED", options: { bold: true, color: C.white, fill: { color: C.slate900 }, fontSize: 11, charSpacing: 3, align: "left" } },
    ],
    ...rows.map((r, i) => [
      { text: r[0], options: { bold: true, color: C.slate900, fill: { color: i % 2 ? C.slate100 : C.white }, fontSize: 11 } },
      { text: r[1], options: { color: C.slate700, fill: { color: i % 2 ? C.slate100 : C.white }, fontSize: 11 } },
    ]),
  ];

  s.addTable(tableData, {
    x: 0.6, y: 2.0, w: 12.1, colW: [3.6, 8.5],
    fontFace: F.b,
    border: { type: "solid", pt: 0.5, color: C.slate200 },
    rowH: 0.3,
  });

  addFooter(s, "09 / 22");
}

// =========================================================
// SLIDE 10 — 10-PART PLAN OVERVIEW (timeline)
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "08 · PLAN", "Ten parts, ~2.5 hours focused build");

  const parts = [
    ["Scaffold", "10m"],
    ["Firebase wiring", "5m"],
    ["Auth", "15m"],
    ["Layout + Theme", "15m"],
    ["Decks CRUD", "15m"],
    ["Cards CRUD", "10m"],
    ["Study session", "20m"],
    ["Dashboard + Stats", "15m"],
    ["Polish + A11y", "20m"],
    ["Docs + Deploy", "15m"],
  ];

  // Two rows of five
  parts.forEach((p, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 0.6 + col * 2.44;
    const y = 2.2 + row * 2.2;
    const highlight = i === 6; // study session
    addCard(s, {
      x, y, w: 2.24, h: 1.9,
      fill: highlight ? C.slate900 : C.white,
      border: highlight ? C.slate900 : C.slate200,
    });
    addNumberBadge(s, {
      x: x + 0.18, y: y + 0.2, num: i + 1,
      color: highlight ? C.slate900 : C.indigo,
      bg: highlight ? C.amber : C.indigoL,
    });
    s.addText(p[0], {
      x: x + 0.18, y: y + 0.9, w: 1.95, h: 0.5,
      fontFace: F.h, fontSize: 14, bold: true,
      color: highlight ? C.white : C.slate900,
    });
    s.addText(p[1], {
      x: x + 0.18, y: y + 1.4, w: 1.95, h: 0.3,
      fontFace: F.b, fontSize: 11,
      color: highlight ? C.amber : C.slate500,
    });
  });

  s.addText("★  Part 7 (Study Session) is the centrepiece and will be demoed live.", {
    x: 0.6, y: 6.6, w: 12, h: 0.35,
    fontFace: F.b, fontSize: 12, italic: true, color: C.slate700,
  });

  addFooter(s, "10 / 22");
}

// =========================================================
// Helper: PART DETAIL slide
// =========================================================
function partDetailSlide({ num, title, eyebrow, objective, files, deliverable, demo, concepts, pageNum }) {
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, `PART ${String(num).padStart(2, "0")} · ${eyebrow}`, title);

  // Left column: objective + deliverable
  addCard(s, { x: 0.6, y: 2.0, w: 5.8, h: 4.7 });
  s.addText("OBJECTIVE", { x: 0.85, y: 2.2, w: 5.3, h: 0.3, fontFace: F.h, fontSize: 10, bold: true, color: C.indigo, charSpacing: 3 });
  s.addText(objective, { x: 0.85, y: 2.55, w: 5.3, h: 1.6, fontFace: F.b, fontSize: 13, color: C.slate800, lineSpacingMultiple: 1.4 });

  s.addText("DELIVERABLE", { x: 0.85, y: 4.2, w: 5.3, h: 0.3, fontFace: F.h, fontSize: 10, bold: true, color: C.emerald, charSpacing: 3 });
  s.addText(deliverable, { x: 0.85, y: 4.55, w: 5.3, h: 1.3, fontFace: F.b, fontSize: 13, color: C.slate800, lineSpacingMultiple: 1.4 });

  s.addText("YOU CAN DEMO", { x: 0.85, y: 5.95, w: 5.3, h: 0.3, fontFace: F.h, fontSize: 10, bold: true, color: C.amber, charSpacing: 3 });
  s.addText(demo, { x: 0.85, y: 6.25, w: 5.3, h: 0.4, fontFace: F.b, fontSize: 12, italic: true, color: C.slate700 });

  // Right column: files + concepts
  addCard(s, { x: 6.7, y: 2.0, w: 6.0, h: 4.7 });
  s.addText("KEY FILES", { x: 6.95, y: 2.2, w: 5.5, h: 0.3, fontFace: F.h, fontSize: 10, bold: true, color: C.slate500, charSpacing: 3 });
  s.addText(files.map(f => ({ text: f, options: { bullet: { code: "25B8" }, color: C.slate800 } })), {
    x: 6.95, y: 2.55, w: 5.5, h: 2.6,
    fontFace: F.b, fontSize: 12, color: C.slate800, paraSpaceAfter: 4,
  });

  s.addText("REACT CONCEPTS", { x: 6.95, y: 5.2, w: 5.5, h: 0.3, fontFace: F.h, fontSize: 10, bold: true, color: C.slate500, charSpacing: 3 });
  // concept chips — fixed grid, 3 per row, uniform width
  const chipW = 1.8, chipH = 0.34, gap = 0.1;
  concepts.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 6.95 + col * (chipW + gap);
    const cy = 5.55 + row * (chipH + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w: chipW, h: chipH, fill: { color: C.indigoL }, line: { color: C.indigo, width: 0.75 }, rectRadius: 0.06,
    });
    s.addText(c, {
      x: cx, y: cy, w: chipW, h: chipH, fontFace: F.h, fontSize: 9.5, bold: true, color: C.indigoD,
      align: "center", valign: "middle",
    });
  });

  addFooter(s, `${String(pageNum).padStart(2, "0")} / 22`);
}

// =========================================================
// SLIDES 11-20 — Part details
// =========================================================
partDetailSlide({
  num: 1, title: "Scaffold & design tokens", eyebrow: "SETUP", pageNum: 11,
  objective: "Stand up the Vite + React project with Tailwind, routing, folder structure, and design tokens. Landing header renders with correct fonts and colours.",
  files: [
    "package.json, vite.config.js (path alias @/)",
    "tailwind.config.js (indigo, emerald, amber, slate tokens)",
    "index.css (base layer, typography, focus ring)",
    "src/{components, pages, hooks, context, services, lib, layouts}",
    "App.jsx, routes.jsx, main.jsx",
  ],
  deliverable: "Project boots with npm run dev and shows a styled landing header. Folder structure matches the rubric's /components, /pages, /hooks, /context, /services requirement.",
  demo: "Boot screen with StudyLoop brand and fonts.",
  concepts: ["Functional components", "Composition"],
});

partDetailSlide({
  num: 2, title: "Firebase wiring", eyebrow: "BACKEND", pageNum: 12,
  objective: "Connect Firebase Auth + Firestore. Write security rules, seed script, and environment variable template. All services ready for feature work.",
  files: [
    ".env.example, .env.local",
    "services/firebase.js (initialiseApp, auth, db)",
    "firestore.rules (owner-only per document)",
    "firestore.indexes.json (dueAt composite)",
    "scripts/seed.js (2 demo decks, 20 cards)",
  ],
  deliverable: "Importing { db, auth } from services/firebase works throughout the app. Rules file is ready to paste into Firebase Console, and the seed script creates demo data on a single command.",
  demo: "Firestore console shows empty collections with rules active.",
  concepts: ["Service layer", "Config"],
});

partDetailSlide({
  num: 3, title: "Authentication", eyebrow: "AUTH", pageNum: 13,
  objective: "Implement Email/Password + Google OAuth with session persistence. Every app route gated by a ProtectedRoute wrapper. First-time signup creates user doc.",
  files: [
    "pages/Login.jsx, pages/Signup.jsx",
    "context/AuthContext.jsx (user, loading, signIn, signOut)",
    "components/ProtectedRoute.jsx, PublicOnlyRoute.jsx",
    "services/auth.js (all Firebase auth calls)",
    "hooks/useAuth.js",
  ],
  deliverable: "User can sign up, log out, log back in, refresh the page, and remain signed in. Google OAuth works. Unauthenticated users are redirected to /login.",
  demo: "Complete signup → redirect → logout → re-login loop.",
  concepts: ["Context API", "useEffect", "Controlled forms", "Conditional rendering", "useState"],
});

partDetailSlide({
  num: 4, title: "App layout & theming", eyebrow: "SHELL", pageNum: 14,
  objective: "Build the persistent app shell: sidebar (desktop) / bottom nav (mobile), top bar with streak + theme toggle, global toast system, and light/dark mode.",
  files: [
    "layouts/AppLayout.jsx (sidebar + top bar)",
    "context/ThemeContext.jsx (light | dark, localStorage + Firestore)",
    "components/{Spinner, EmptyState, ErrorBoundary, Toast}",
    "pages/NotFound.jsx",
  ],
  deliverable: "Fully responsive shell that works on 375px → 1440px. Theme toggle persists across reloads. Active route is highlighted in the nav.",
  demo: "Toggle theme, resize window, navigate between placeholder pages.",
  concepts: ["Context API", "useEffect", "Conditional rendering", "Lists & keys"],
});

partDetailSlide({
  num: 5, title: "Decks CRUD", eyebrow: "FEATURE 1", pageNum: 15,
  objective: "Users create, read, update, and delete decks in real time. Grid view with search, sort, and colour-coded cards. Deck detail page.",
  files: [
    "pages/Decks.jsx, pages/DeckDetail.jsx",
    "components/DeckCard.jsx, DeckForm.jsx, ConfirmDialog.jsx",
    "hooks/useDecks.js (onSnapshot listener)",
    "services/decks.js (createDeck, updateDeck, deleteDeck, listDecks)",
  ],
  deliverable: "Create, rename, re-colour, and delete decks. Changes propagate across tabs in real time via onSnapshot. Search + sort respond instantly.",
  demo: "Create 3 decks → rename one → delete another → confirm real-time update in a second tab.",
  concepts: ["useState", "useEffect", "useMemo", "Lists & keys", "Controlled forms", "Props"],
});

partDetailSlide({
  num: 6, title: "Cards CRUD", eyebrow: "FEATURE 1 cont.", pageNum: 16,
  objective: "Inside a deck, add / edit / delete flashcards. Inline editing, keyboard shortcuts, and a bulk-paste helper that splits multi-line text into cards.",
  files: [
    "components/CardRow.jsx, CardForm.jsx, BulkPaste.jsx",
    "hooks/useCards.js (deck-scoped onSnapshot)",
    "services/cards.js (CRUD + batch write for bulk)",
    "lib/parsePaste.js (heuristic splitter)",
  ],
  deliverable: "Add 10+ cards to a deck in under a minute. Cmd/Ctrl+Enter saves; bulk paste accepts 'Q: …\\nA: …' blocks.",
  demo: "Bulk paste 5 cards → edit one inline → delete one.",
  concepts: ["useRef", "useState", "Controlled forms", "Lists & keys", "useCallback"],
});

partDetailSlide({
  num: 7, title: "Study session · SM-2 algorithm", eyebrow: "FEATURE 2 (CORE)", pageNum: 17,
  objective: "The centrepiece feature. Pull due cards, flip with a spring animation, rate recall, and let the SuperMemo-2 algorithm schedule the next review.",
  files: [
    "pages/Study.jsx (/study/:deckId)",
    "components/FlashCard.jsx (Framer Motion flip)",
    "hooks/useStudySession.js (queue state machine)",
    "lib/sm2.js (pure algorithm, unit-testable)",
    "services/reviews.js (write review + update card)",
  ],
  deliverable: "Full study flow: due queue → flip → rate 1/2/3/4 → next card → completion summary with streak update. All keyboard-navigable.",
  demo: "Complete a full session with keyboard only.",
  concepts: ["useState", "useEffect", "useCallback", "useRef", "Lifting state", "Custom hooks"],
});

partDetailSlide({
  num: 8, title: "Dashboard & stats", eyebrow: "FEATURE 3", pageNum: 18,
  objective: "Home screen with streak, due-today CTA, and recent decks. Stats page with mastery bar chart, 14-day activity line, and 8-week heatmap grid.",
  files: [
    "pages/Home.jsx, pages/Stats.jsx",
    "components/StreakBadge, DueTodayCard, MasteryChart, ActivityHeatmap",
    "hooks/useStats.js (aggregates reviews)",
    "lib/stats.js (streak + mastery calculations)",
  ],
  deliverable: "Visually rich dashboard with Recharts. Streak and mastery update live as the user studies. Empty states for new users.",
  demo: "Dashboard after a study session — streak +1, charts update.",
  concepts: ["useMemo", "useEffect", "Lists & keys", "Conditional rendering"],
});

partDetailSlide({
  num: 9, title: "Polish · AI · Settings · A11y", eyebrow: "QUALITY", pageNum: 19,
  objective: "Add the optional AI card generator, build the Settings page, lazy-load heavy routes, and complete a full accessibility sweep.",
  files: [
    "services/ai.js (Gemini call, graceful fallback)",
    "pages/Settings.jsx (profile, theme, export, delete)",
    "components/GenerateFromNotes.jsx",
    "App.jsx — React.lazy + Suspense for /study, /stats, /settings",
  ],
  deliverable: "AI generation works when an API key is set, degrades gracefully otherwise. Settings supports export + account deletion. All routes keyboard-accessible; contrast ≥ 4.5:1; prefers-reduced-motion respected.",
  demo: "Paste notes → generate cards → review with screen-reader friendly nav.",
  concepts: ["React.lazy", "Suspense", "useMemo", "useCallback", "Custom hooks"],
});

partDetailSlide({
  num: 10, title: "Docs & deploy", eyebrow: "SHIP", pageNum: 20,
  objective: "Write the README, clean up commits, deploy to Vercel, and prepare the 3–5 minute demo video.",
  files: [
    "README.md (problem, features, stack, setup, deploy)",
    "docs/SCREENSHOTS/*, docs/DEMO_SCRIPT.md",
    ".github/workflows/ci.yml (optional lint + build)",
    "vercel.json (env vars + SPA rewrite)",
  ],
  deliverable: "Live URL on Vercel. Clean git history with conventional commits. README explains the problem, concepts used, and setup in under 2 minutes.",
  demo: "Live URL loaded on phone + desktop.",
  concepts: ["Documentation", "Build output"],
});

// =========================================================
// SLIDE 21 — RUBRIC MAPPING
// =========================================================
{
  const s = pres.addSlide();
  addLightBackground(s);
  addHeader(s, "09 · GRADING", "How each mark is earned");

  const rubric = [
    ["Problem Statement & Idea", "15", "Original AI + SM-2 combo, clear student user, non-trivial"],
    ["React Fundamentals", "20", "Every core + intermediate concept demonstrated (slide 9)"],
    ["Advanced React Usage", "15", "useMemo, useCallback, useRef, lazy/Suspense, custom hooks"],
    ["Backend Integration", "15", "Firebase Auth + Firestore + RLS + full CRUD across 3 collections"],
    ["UI / UX", "10", "Design tokens, dark mode, responsive, keyboard nav, empty/loading/error"],
    ["Code Quality", "10", "/components /pages /hooks /context /services · small files · clean commits"],
    ["Functionality", "10", "3 core features work end-to-end, handled edge cases"],
    ["Demo & Explanation", "5", "Scripted 4-minute walkthrough hitting problem → stack → code"],
  ];

  const data = [
    [
      { text: "CRITERIA", options: { bold: true, color: C.white, fill: { color: C.slate900 }, fontSize: 11, charSpacing: 3 } },
      { text: "MARKS", options: { bold: true, color: C.white, fill: { color: C.slate900 }, fontSize: 11, charSpacing: 3, align: "center" } },
      { text: "HOW WE EARN IT", options: { bold: true, color: C.white, fill: { color: C.slate900 }, fontSize: 11, charSpacing: 3 } },
    ],
    ...rubric.map((r, i) => [
      { text: r[0], options: { bold: true, color: C.slate900, fill: { color: i % 2 ? C.slate100 : C.white }, fontSize: 12 } },
      { text: r[1], options: { bold: true, color: C.indigo, fill: { color: i % 2 ? C.slate100 : C.white }, fontSize: 14, align: "center" } },
      { text: r[2], options: { color: C.slate700, fill: { color: i % 2 ? C.slate100 : C.white }, fontSize: 11 } },
    ]),
    [
      { text: "TARGET", options: { bold: true, color: C.white, fill: { color: C.indigo }, fontSize: 13 } },
      { text: "100", options: { bold: true, color: C.white, fill: { color: C.indigo }, fontSize: 16, align: "center" } },
      { text: "All criteria covered by the 10-part plan", options: { bold: true, color: C.white, fill: { color: C.indigo }, fontSize: 12, italic: true } },
    ],
  ];

  s.addTable(data, {
    x: 0.6, y: 2.0, w: 12.1, colW: [3.8, 1.4, 6.9],
    fontFace: F.b,
    border: { type: "solid", pt: 0.5, color: C.slate200 },
    rowH: 0.45,
  });

  addFooter(s, "21 / 22");
}

// =========================================================
// SLIDE 22 — CLOSING
// =========================================================
{
  const s = pres.addSlide();
  addDarkBackground(s);

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.22, h: 7.5, fill: { color: C.indigo }, line: { type: "none" },
  });

  // Top-left branding (matches cover)
  s.addShape(pres.ShapeType.roundRect, {
    x: 0.6, y: 0.6, w: 0.8, h: 0.4, fill: { color: C.indigo }, line: { type: "none" }, rectRadius: 0.08,
  });
  s.addText("SL", {
    x: 0.6, y: 0.6, w: 0.8, h: 0.4,
    fontFace: F.h, fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle",
  });
  s.addText("StudyLoop", {
    x: 1.55, y: 0.55, w: 5, h: 0.5,
    fontFace: F.h, fontSize: 18, bold: true, color: C.white,
  });

  s.addText("Let's build it.", {
    x: 0.6, y: 2.3, w: 12, h: 1.5,
    fontFace: F.h, fontSize: 72, bold: true, color: C.white,
  });
  s.addText("Ten parts. One focused build. A portfolio-ready React app.", {
    x: 0.6, y: 3.95, w: 12, h: 0.6,
    fontFace: F.b, fontSize: 20, color: C.slate300,
  });

  // Next-steps card row
  const steps = [
    { n: "→", t: "Create Firebase project", b: "Enable Email/Password, Google, Firestore" },
    { n: "→", t: "Paste firebaseConfig", b: "Into .env.local before Part 2" },
    { n: "→", t: "Say “go”", b: "I start Part 1 immediately" },
  ];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 4.15;
    const w = 3.9;
    addCard(s, { x, y: 5.3, w, h: 1.5, fill: C.slate800, border: C.slate700 });
    s.addText(st.n, { x: x + 0.3, y: 5.45, w: 0.6, h: 0.5, fontFace: F.h, fontSize: 22, bold: true, color: C.amber });
    s.addText(st.t, { x: x + 0.9, y: 5.45, w: w - 1.1, h: 0.4, fontFace: F.h, fontSize: 15, bold: true, color: C.white });
    s.addText(st.b, { x: x + 0.9, y: 5.85, w: w - 1.1, h: 0.85, fontFace: F.b, fontSize: 12, color: C.slate300, lineSpacingMultiple: 1.3 });
  });

  s.addText("StudyLoop · React Batch 2029", {
    x: 0.6, y: 7.08, w: 8, h: 0.3, fontFace: F.b, fontSize: 10, color: C.slate500,
  });
  s.addText("22 / 22", {
    x: 10.7, y: 7.08, w: 2, h: 0.3, fontFace: F.b, fontSize: 10, color: C.slate500, align: "right",
  });
}

// ---------- Write ----------
pres.writeFile({ fileName: "studyloop-plan.pptx" }).then(f => console.log("Wrote:", f));
