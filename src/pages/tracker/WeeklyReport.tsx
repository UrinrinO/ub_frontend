import { useState, useEffect } from "react";
import Container from "../../components/layout/Container";
import { trackerApi } from "./tracker.api";
import { getMondayYYYYMMDD } from "./tracker.utils";
import type { WeekReport } from "./tracker.types";

function addWeeks(yyyymmdd: string, n: number) {
  const d = new Date(`${yyyymmdd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n * 7);
  return d.toISOString().slice(0, 10);
}

function fmtMins(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `${m}m`;
}

const CATEGORY_LABELS: Record<string, string> = {
  JOB_APPLICATIONS: "Job Applications",
  ALGORITHMS: "Algorithms",
  ML_THEORY: "ML Theory",
  ML_PLATFORM: "ML Platform",
  SYSTEM_DESIGN: "System Design",
  READING: "Reading",
  MOCK_INTERVIEW: "Mock Interview",
};

const CATEGORY_TARGETS: Record<string, number> = {
  JOB_APPLICATIONS: 120,
  ALGORITHMS: 300,
  ML_THEORY: 180,
  ML_PLATFORM: 180,
  SYSTEM_DESIGN: 60,
};

function DotRating({ value, max = 5 }: { value?: number; max?: number }) {
  if (value === undefined) return null;
  return (
    <span className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < value ? "bg-black/70" : "bg-black/15"}`}
        />
      ))}
    </span>
  );
}

export default function WeeklyReport() {
  const [weekStart, setWeekStart] = useState(getMondayYYYYMMDD);
  const [week, setWeek] = useState<WeekReport | null>(null);

  useEffect(() => {
    setWeek(null);
    trackerApi.getWeek(weekStart).then(setWeek).catch(console.error);
  }, [weekStart]);

  const totalHours = week ? (week.totalMinutes / 60).toFixed(1) : "--";

  return (
    <div className="pt-24 pb-20 bg-[#f6f5f2] min-h-screen">
      <Container>

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-5xl md:text-6xl leading-none text-black">
              Weekly Tracker
            </h1>
            <p className="text-lg text-black/50 mt-2">
              One Year Personal Development Plan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekStart((w) => addWeeks(w, -1))}
              className="px-3 py-2 border border-black/15 font-mono text-xs hover:border-black/40 transition"
            >
              ←
            </button>
            <span className="font-mono text-xs text-black/50 px-2">
              Week of {weekStart}
            </span>
            <button
              onClick={() => setWeekStart((w) => addWeeks(w, 1))}
              className="px-3 py-2 border border-black/15 font-mono text-xs hover:border-black/40 transition"
            >
              →
            </button>
          </div>
        </div>

        {!week ? (
          <p className="font-mono text-sm text-black/40">Loading…</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="border border-black/10 bg-white p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">
                  Total Hours
                </p>
                <p className="font-display text-4xl leading-none">
                  {totalHours}
                  <span className="text-black/30 text-2xl"> / 14h</span>
                </p>
                <p className="font-mono text-xs text-black/40 mt-2">
                  {week.percent}% of target
                </p>
              </div>
              <div className="border border-black/10 bg-white p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">
                  Sessions
                </p>
                <p className="font-display text-4xl leading-none">
                  {week.sessionsCompleted}
                </p>
              </div>
              <div className="border border-black/10 bg-white p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">
                  Longest
                </p>
                <p className="font-display text-4xl leading-none">
                  {fmtMins(week.longestSessionMinutes)}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-[2px] bg-black/10 mb-8">
              <div
                className="h-full bg-black transition-all"
                style={{ width: `${week.percent}%` }}
              />
            </div>

            {/* Category breakdown */}
            <div className="border border-black/10 bg-white p-8 mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-6">
                By Category
              </p>
              <div className="space-y-4">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                  const mins = week.perCategory[key] ?? 0;
                  const target = CATEGORY_TARGETS[key] ?? 0;
                  if (!mins && !target) return null;
                  const pct =
                    target > 0
                      ? Math.min(100, Math.round((mins / target) * 100))
                      : 100;
                  return (
                    <div key={key}>
                      <div className="flex justify-between font-mono text-xs text-black/50 mb-1.5">
                        <span>{label}</span>
                        <span>
                          {fmtMins(mins)}
                          {target > 0 ? ` / ${fmtMins(target)}` : ""}
                        </span>
                      </div>
                      <div className="h-[2px] bg-black/10">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Session cards */}
            {week.sessions.length > 0 && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">
                  Sessions ({week.sessions.length})
                </p>
                <div className="space-y-4">
                  {week.sessions.map((s) => {
                    const date = new Date(s.startedAt);
                    const dayLabel = date.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    });
                    return (
                      <div
                        key={s.id}
                        className="border border-black/10 bg-white p-6"
                      >
                        {/* Top row: date + category + duration */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xs text-black/40">
                              {dayLabel}
                            </span>
                            <span className="px-2.5 py-0.5 bg-black/5 font-mono text-xs uppercase tracking-wide text-black/60">
                              {CATEGORY_LABELS[s.category] ??
                                s.category.replace(/_/g, " ")}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-semibold text-black/70 shrink-0">
                            {fmtMins(s.minutes)}
                          </span>
                        </div>

                        {/* Ratings */}
                        {(s.focus !== undefined || s.difficulty !== undefined) && (
                          <div className="flex gap-6 mb-4">
                            {s.focus !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-black/40 uppercase tracking-wide">
                                  Focus
                                </span>
                                <DotRating value={s.focus} />
                                <span className="font-mono text-xs text-black/40">
                                  {s.focus}/5
                                </span>
                              </div>
                            )}
                            {s.difficulty !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-black/40 uppercase tracking-wide">
                                  Difficulty
                                </span>
                                <DotRating value={s.difficulty} />
                                <span className="font-mono text-xs text-black/40">
                                  {s.difficulty}/5
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Worked on */}
                        {s.workedOn && (
                          <div className="mb-3">
                            <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                              Worked on
                            </p>
                            <p className="text-sm text-black/70 leading-relaxed">
                              {s.workedOn}
                            </p>
                          </div>
                        )}

                        {/* Output */}
                        {s.output && (
                          <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                              Output
                            </p>
                            <p className="text-sm text-black/60 leading-relaxed">
                              {s.output}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
