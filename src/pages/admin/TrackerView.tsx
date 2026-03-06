import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";
import type { WeekReport } from "../tracker/tracker.types";

function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TrackerView() {
  const [week, setWeek] = useState<WeekReport | null>(null);

  useEffect(() => {
    trackerApi.getWeek(getMondayYYYYMMDD()).then(setWeek).catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Deep Work
          </p>
          <h1 className="font-display text-3xl text-foreground/90">Tracker — This Week</h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/tracker"
            className="px-4 py-2 rounded-full border border-black/15 text-sm text-foreground/60 hover:border-black/30 transition"
          >
            Open Tracker →
          </Link>
          <Link
            to="/report"
            className="px-4 py-2 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
          >
            Weekly Report →
          </Link>
        </div>
      </div>

      {!week ? (
        <p className="text-foreground/40">Loading…</p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-black/8 p-6">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/40 mb-2">Total</p>
              <p className="font-display text-3xl text-foreground/90">{fmt(week.totalMinutes)}</p>
              <p className="text-xs text-foreground/40 mt-1">{week.percent}% of 14h target</p>
            </div>
            <div className="bg-white rounded-2xl border border-black/8 p-6">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/40 mb-2">Sessions</p>
              <p className="font-display text-3xl text-foreground/90">{week.sessionsCompleted}</p>
            </div>
            <div className="bg-white rounded-2xl border border-black/8 p-6">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/40 mb-2">Longest</p>
              <p className="font-display text-3xl text-foreground/90">{fmt(week.longestSessionMinutes)}</p>
            </div>
          </div>

          {/* Per-category breakdown */}
          <div className="bg-white rounded-2xl border border-black/8 p-6 mb-8">
            <h2 className="font-semibold text-foreground/70 mb-4">By Category</h2>
            <div className="space-y-3">
              {Object.entries(week.perCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, mins]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                        {cat.replace(/_/g, " ")}
                      </span>
                      <span className="text-foreground/60">{fmt(mins)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/5">
                      <div
                        className="h-1.5 rounded-full bg-foreground/40"
                        style={{ width: `${Math.min(100, (mins / week.totalMinutes) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Session history */}
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/8">
              <h2 className="font-semibold text-foreground/70">Sessions</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-black/8">
                <tr>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Date</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Category</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Duration</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Focus</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {week.sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-black/[0.02]">
                    <td className="px-6 py-3 text-foreground/50 text-xs font-mono whitespace-nowrap">
                      {new Date(s.startedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs uppercase tracking-wide text-foreground/60">
                        {s.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-foreground/60">{fmt(s.minutes)}</td>
                    <td className="px-6 py-3 text-foreground/60">{s.focus}/5</td>
                    <td className="px-6 py-3 text-foreground/50 max-w-[200px] truncate text-xs">{s.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
