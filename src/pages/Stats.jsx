import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookOpen, Flame, Sparkles, Target } from "lucide-react";
import { useStats } from "@/hooks/useStats.js";
import { useUserProfile } from "@/hooks/useUserProfile.js";
import Spinner from "@/components/Spinner.jsx";

export default function Stats() {
  const { profile } = useUserProfile();
  const { mastery, activity, heat, totalCards, totalReviews, todayReviews, loading } = useStats();

  const avgMastery = useMemo(() => {
    if (mastery.length === 0) return 0;
    return Math.round(mastery.reduce((s, m) => s + m.pct, 0) / mastery.length);
  }, [mastery]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="card p-12 text-center"><Spinner /></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Progress</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Stats
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Flame className="h-5 w-5" />} label="Streak"   value={`${profile?.streak ?? 0}d`}  tint="streak" />
        <Kpi icon={<Target className="h-5 w-5" />} label="Mastery"  value={`${avgMastery}%`}            tint="success" />
        <Kpi icon={<BookOpen className="h-5 w-5" />} label="Cards"   value={totalCards}                  tint="brand" />
        <Kpi icon={<Sparkles className="h-5 w-5" />} label="Reviews" value={totalReviews}                tint="brand" />
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Mastery by deck
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            A card is "mastered" at ≥21 days interval and 3+ successful reviews.
          </p>
          <div className="mt-4 h-56">
            {mastery.length === 0 ? (
              <p className="py-14 text-center text-sm italic text-slate-500">No cards yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mastery} margin={{ top: 5, right: 12, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{ fontSize: 10, fill: "#64748B" }} interval={0} />
                  <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748B" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
                    formatter={(v) => [`${v}%`, "mastered"]}
                  />
                  <Bar dataKey="pct" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Last 14 days
          </h2>
          <p className="mt-1 text-xs text-slate-500">Reviews per day · today: {todayReviews}</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activity} margin={{ top: 5, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748B" }} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Activity · last 8 weeks
        </h2>
        <p className="mt-1 text-xs text-slate-500">One square per day · darker = more reviews.</p>
        <Heatmap cells={heat} />
      </section>
    </div>
  );
}

function Kpi({ icon, label, value, tint }) {
  const tints = {
    streak:  "bg-streak-100 text-streak-600 dark:bg-streak-500/15 dark:text-streak-500",
    brand:   "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
    success: "bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${tints[tint]}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function Heatmap({ cells }) {
  const max = cells.reduce((m, c) => Math.max(m, c.count), 0);
  function tone(n) {
    if (n === 0) return "bg-slate-100 dark:bg-slate-800";
    const ratio = max === 0 ? 0 : n / max;
    if (ratio > 0.75) return "bg-brand-600";
    if (ratio > 0.5)  return "bg-brand-500";
    if (ratio > 0.25) return "bg-brand-400";
    return "bg-brand-200 dark:bg-brand-900/70";
  }
  // Lay out in 8 columns × 7 rows
  return (
    <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((c) => (
        <div
          key={c.day}
          title={`${new Date(c.day).toLocaleDateString()} — ${c.count} reviews`}
          className={`h-4 w-4 rounded-sm ${tone(c.count)}`}
        />
      ))}
    </div>
  );
}
