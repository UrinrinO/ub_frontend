import { useState, useEffect } from "react";
import Container from "../../components/layout/Container";
import WeekFocusSticky from "../../components/ui/WeekFocusSticky";
import ExamAlerts from "../../components/ui/ExamAlerts";
import { trackerApi } from "./tracker.api";
import { remindersApi, type Reminder } from "../../lib/reminders.api";
import { getMondayYYYYMMDD } from "./tracker.utils";
import type { WeekReport, StoredWeeklyReport, ReportNotes, TrackerCategory } from "./tracker.types";

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

/* ─── summation helpers ──────────────────────────────────────────────────── */

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === "" || value === false) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-mono text-xs uppercase tracking-widest text-black/40">{label}</p>
      <p className="font-mono text-sm text-black/80 whitespace-pre-wrap">{value === true ? "Yes" : String(value)}</p>
    </div>
  );
}

function SummaryCheck({ label, value }: { label: string; value?: boolean }) {
  if (value === undefined) return null;
  return (
    <div className="flex items-center gap-2">
      <span className={`w-4 h-4 border flex items-center justify-center shrink-0 rounded ${value ? "border-black bg-black text-white" : "border-black/20"}`}>
        {value && <span className="text-[10px] leading-none">✓</span>}
      </span>
      <span className="font-mono text-sm text-black/70">{label}</span>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-black/10 bg-white p-8 mb-4">
      <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-6">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function WeeklySummation({ report }: { report: StoredWeeklyReport | null }) {
  if (!report) {
    return <p className="font-mono text-sm text-black/40">No report saved for this week.</p>;
  }
  const n: ReportNotes = report.notes ?? {};
  return (
    <div>
      {report.weekNumber !== null && report.weekNumber !== undefined && (
        <p className="font-mono text-xs text-black/40 mb-6">Week #{report.weekNumber}</p>
      )}

      <SummarySection title="Overview">
        <SummaryRow label="If < 12h — why" value={n.totalHoursNote} />
      </SummarySection>

      <SummarySection title="Job Applications">
        <div className="grid md:grid-cols-2 gap-4">
          <SummaryRow label="Applications submitted" value={n.applicationsSubmitted} />
          <SummaryRow label="Tailored CV updates" value={n.cvUpdates} />
          <SummaryRow label="Networking messages sent" value={n.networkingMessages} />
          <SummaryRow label="Interviews scheduled" value={n.interviewsScheduled} />
        </div>
      </SummarySection>

      <SummarySection title="Algorithms">
        <div className="grid md:grid-cols-2 gap-4">
          <SummaryRow label="Problems solved" value={n.algorithmsSolved} />
          <SummaryRow label="Hard problems attempted" value={n.hardProblems} />
          <SummaryRow label="Average solve time" value={n.avgSolveTime} />
          <SummaryRow label="Topics covered" value={n.topicsCovered} />
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          <SummaryCheck label="Timed mock completed" value={n.timedMockDone} />
          <SummaryCheck label="Can explain optimal solution clearly" value={n.canExplainSolution} />
        </div>
        <SummaryRow label="Most difficult concept" value={n.mostDifficultConcept} />
        <SummaryRow label="Notes & reflections" value={n.algorithmsNote} />
      </SummarySection>

      <SummarySection title="ML Theory">
        <div className="grid md:grid-cols-3 gap-4">
          <SummaryRow label="HOML chapters/sections" value={n.homlCovered} />
          <SummaryRow label="PRML chapters/sections" value={n.prmlCovered} />
          <SummaryRow label="DDIA chapters/sections" value={n.ddiaCovered} />
        </div>
        <SummaryRow label="Concepts mastered" value={n.conceptsMastered} />
        <SummaryRow label="Notes & reflections" value={n.mlTheoryNote} />
        <div className="pt-2">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-3">Can explain without notes</p>
          <div className="grid md:grid-cols-2 gap-2">
            <SummaryCheck label="Bias–variance tradeoff" value={n.biasVariance} />
            <SummaryCheck label="Cross-validation strategy" value={n.crossValidation} />
            <SummaryCheck label="Class imbalance handling" value={n.classImbalance} />
            <SummaryCheck label="Model selection reasoning" value={n.modelSelection} />
            <SummaryCheck label="Applied at least one concept to project" value={n.appliedToProject} />
          </div>
        </div>
      </SummarySection>

      <SummarySection title="ML Platform">
        {n.mlPlatformChecklist && n.mlPlatformChecklist.length > 0 && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-3">Work completed</p>
            <div className="grid md:grid-cols-2 gap-2">
              {n.mlPlatformChecklist.map((item) => (
                <SummaryCheck key={item} label={item} value={true} />
              ))}
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <SummaryRow label="Experiments run" value={n.experimentsRun} />
          <SummaryRow label="Best validation metric" value={n.bestMetric} />
          <SummaryRow label="Metric change vs last week" value={n.metricChange} />
          <SummaryRow label="Deployment errors" value={n.deploymentErrors} />
        </div>
        <SummaryRow label="What improved" value={n.whatImproved} />
        <SummaryRow label="What failed" value={n.whatFailed} />
        <div className="flex flex-wrap gap-6">
          <SummaryCheck label="API live" value={n.apiLive} />
          <SummaryCheck label="System stable" value={n.systemStable} />
        </div>
      </SummarySection>

      <SummarySection title="System Design">
        <SummaryRow label="Topic studied" value={n.systemDesignTopic} />
        <SummaryCheck label="Can explain trade-offs clearly" value={n.canExplainTradeoffs} />
      </SummarySection>

      <SummarySection title="Technical Growth Self-Check">
        <div className="grid md:grid-cols-2 gap-2">
          <SummaryCheck label="Time/space complexity of a DFS problem" value={n.dfsComplexity} />
          <SummaryCheck label="When to use LightGBM over Logistic Regression" value={n.lightgbmVsLogistic} />
          <SummaryCheck label="Precision vs Recall tradeoff" value={n.precisionRecall} />
          <SummaryCheck label="Why a model might be overfit" value={n.whyOverfit} />
        </div>
      </SummarySection>

      <SummarySection title="Metrics Snapshot">
        <div className="grid md:grid-cols-2 gap-4">
          <SummaryRow label="Total algorithms solved (cumulative)" value={n.algorithmsTotal} />
          <SummaryRow label="Total experiments run (cumulative)" value={n.experimentsTotal} />
          <SummaryRow label="Current best model metric" value={n.bestModelMetric} />
        </div>
        <SummaryRow label="Current deployment state" value={n.deploymentState} />
      </SummarySection>

      <SummarySection title="IELTS">
        <div className="grid md:grid-cols-2 gap-4">
          <SummaryRow label="Practice tests completed" value={n.ieltsTestsDone} />
          <SummaryRow label="Score (raw / band)" value={n.ieltsScore} />
          <SummaryRow label="Weakest section" value={n.ieltsWeakSection} />
          <SummaryRow label="Vocabulary added" value={n.ieltsVocabAdded} />
        </div>
        <SummaryRow label="Notes & reflections" value={n.ieltsNote} />
      </SummarySection>

      <SummarySection title="Discipline Score">
        <SummaryRow label="Score (1–10)" value={n.disciplineScore} />
        <SummaryRow label="Reasoning" value={n.disciplineReasoning} />
      </SummarySection>

      <SummarySection title="Next Week Focus">
        <SummaryRow label="Top priorities" value={n.nextWeekFocus} />
      </SummarySection>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */

export default function WeeklyReport() {
  const [weekStart, setWeekStart] = useState(getMondayYYYYMMDD);
  const [week, setWeek] = useState<WeekReport | null>(null);
  const [report, setReport] = useState<StoredWeeklyReport | null>(null);
  const [tab, setTab] = useState<"tracker" | "summation" | "exams" | "counts">("tracker");
  const [exams, setExams] = useState<Reminder[]>([]);
  const [categories, setCategories] = useState<TrackerCategory[]>([]);
  const [allTimeStats, setAllTimeStats] = useState<{totalMinutes: number; perCategory: Record<string, number>} | null>(null);
  const [activeSession, setActiveSession] = useState<import("./tracker.types").WorkSession | null | undefined>(undefined);
  const [lastEndedAt, setLastEndedAt] = useState<string | null>(null);
  const [prevWeekFocus, setPrevWeekFocus] = useState<string | null>(null);

  useEffect(() => {
    trackerApi.getCategories().then(setCategories).catch(console.error);
    remindersApi.list().then((all) => setExams(all.filter((r) => r.type === "EXAM" && !r.completed))).catch(console.error);
    trackerApi.getAllTimeStats().then(setAllTimeStats).catch(console.error);
  }, []);

  /* Load previous week's next-week focus for sticky */
  useEffect(() => {
    const prevMonday = (() => {
      const d = new Date(`${getMondayYYYYMMDD()}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() - 7);
      return d.toISOString().slice(0, 10);
    })();
    trackerApi
      .getWeeklyReport(prevMonday)
      .then(({ report }) => {
        const focus = (report?.notes as any)?.nextWeekFocus;
        if (focus?.trim()) setPrevWeekFocus(focus.trim());
      })
      .catch(console.error);
  }, []);

  /* Fetch live status once on mount */
  useEffect(() => {
    Promise.all([
      trackerApi.getSession(),
      trackerApi.getWeek(getMondayYYYYMMDD()),
    ]).then(([session, currentWeek]) => {
      setActiveSession(session);
      if (!session) {
        const sorted = [...currentWeek.sessions].sort(
          (a, b) => new Date(b.endedAt ?? 0).getTime() - new Date(a.endedAt ?? 0).getTime(),
        );
        setLastEndedAt(sorted[0]?.endedAt ?? null);
      }
    }).catch(() => setActiveSession(null));
  }, []);

  useEffect(() => {
    setWeek(null);
    setReport(null);
    trackerApi.getWeeklyReport(weekStart).then(({ sessions, report }) => {
      setWeek(sessions);
      setReport(report);
    }).catch(console.error);
  }, [weekStart]);

  const categoryLabel = (key: string) =>
    categories.find((c) => c.key === key)?.label ?? key.replaceAll("_", " ");

  const totalHours = week ? (week.totalMinutes / 60).toFixed(1) : "--";

  return (
    <div className="pt-24 pb-20 bg-[#f6f5f2] min-h-screen">
      {prevWeekFocus && <WeekFocusSticky text={prevWeekFocus} />}
      <ExamAlerts />
      <Container>

        {/* Header */}
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-5xl md:text-6xl leading-none text-black">
              {tab === "tracker" ? "Weekly Tracker" : "Weekly Summation"}
            </h1>
            <p className="text-lg text-black/50 mt-2">
              One Year Personal Development Plan
            </p>
            {/* Live / last session status */}
            {activeSession !== undefined && (
              <div className="mt-3 inline-flex items-center gap-2">
                {activeSession ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <span className="font-mono text-xs text-green-700 uppercase tracking-widest">
                      Live — {activeSession.category.replaceAll("_", " ")} · since{" "}
                      {new Date(activeSession.startedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-black/20" />
                    <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
                      {lastEndedAt
                        ? `Last session: ${new Date(lastEndedAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · ${new Date(lastEndedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
                        : "No sessions this week"}
                    </span>
                  </>
                )}
              </div>
            )}
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

        {/* Tab toggle */}
        <div className="flex gap-1 mb-8 border-b border-black/10">
          <button
            onClick={() => setTab("tracker")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition border-b-2 -mb-px ${
              tab === "tracker"
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            Weekly Tracker
          </button>
          <button
            onClick={() => setTab("summation")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition border-b-2 -mb-px ${
              tab === "summation"
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            Weekly Summation
          </button>
          <button
            onClick={() => setTab("exams")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition border-b-2 -mb-px flex items-center gap-2 ${
              tab === "exams"
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            Exams
            {exams.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-400 text-white text-[9px] flex items-center justify-center font-mono">
                {exams.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("counts")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition border-b-2 -mb-px ${
              tab === "counts"
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            Counts
          </button>
        </div>

        {tab === "exams" ? (
          <div className="space-y-4">
            {exams.length === 0 ? (
              <p className="font-mono text-sm text-black/40">No upcoming exams.</p>
            ) : (
              exams
                .slice()
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .map((exam) => {
                  const days = Math.ceil((new Date(exam.deadline).getTime() - Date.now()) / 86_400_000);
                  const urgency = days > 14 ? "green" : days > 7 ? "amber" : "orange";
                  const colors = {
                    green:  { border: "border-emerald-200 bg-emerald-50/60", dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
                    amber:  { border: "border-amber-200 bg-amber-50/60",     dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700"   },
                    orange: { border: "border-orange-200 bg-orange-50/60",   dot: "bg-orange-400",  badge: "bg-orange-100 text-orange-700" },
                  }[urgency];
                  return (
                    <div key={exam.id} className={`border p-6 ${colors.border}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot}`} />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-mono text-sm font-semibold text-black/85">{exam.title}</p>
                              {exam.subject && (
                                <span className="font-mono text-xs px-2 py-0.5 bg-black/8 text-black/50 rounded-full">
                                  {exam.subject}
                                </span>
                              )}
                            </div>
                            {exam.notes && (
                              <p className="text-sm text-black/60 mt-1 leading-relaxed">{exam.notes}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <p className="font-mono text-xs text-black/40">
                                {new Date(exam.deadline).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                              </p>
                              {exam.url && (
                                <a href={exam.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-blue-500 hover:underline">
                                  Resources →
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`shrink-0 font-mono text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
                          {days <= 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        ) : tab === "counts" ? (
          !allTimeStats ? (
            <p className="font-mono text-sm text-black/40">Loading…</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="border border-black/10 bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">
                    Total Time All Activities
                  </p>
                  <p className="font-display text-4xl leading-none">
                    {(allTimeStats.totalMinutes / 60).toFixed(1)} <span className="text-black/30 text-2xl">hours</span>
                  </p>
                </div>
              </div>
              <div className="border border-black/10 bg-white p-8 mb-8">
                <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-6">
                  By Category
                </p>
                <div className="space-y-4">
                  {Object.entries(allTimeStats.perCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, mins]) => {
                      const cat = categories.find((c) => c.key === key);
                      const label = cat?.label ?? key.replaceAll("_", " ");
                      if (!mins) return null;
                      const pct = Math.min(100, (mins / allTimeStats.totalMinutes) * 100);
                      return (
                        <div key={key}>
                          <div className="flex justify-between font-mono text-xs text-black/50 mb-1.5">
                            <span>{label}</span>
                            <span>{fmtMins(mins)} ({(mins / 60).toFixed(1)}h)</span>
                          </div>
                          <div className="h-0.5 bg-black/10">
                            <div className="h-full bg-black" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )
        ) : tab === "summation" ? (
          !week && !report ? (
            <p className="font-mono text-sm text-black/40">Loading…</p>
          ) : (
            <WeeklySummation report={report} />
          )
        ) : !week ? (
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
            <div className="h-0.5 bg-black/10 mb-8">
              <div
                className="h-full bg-black transition-all"
                style={{ width: `${Math.min(100, week.percent)}%` }}
              />
            </div>

            {/* Category breakdown */}
            <div className="border border-black/10 bg-white p-8 mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-6">
                By Category
              </p>
              <div className="space-y-4">
                {Object.entries(week.perCategory).map(([key, mins]) => {
                  const cat = categories.find((c) => c.key === key);
                  const label = cat?.label ?? key.replaceAll("_", " ");
                  const target = cat?.targetMinutes ?? 0;
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
                      <div className="h-0.5 bg-black/10">
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
                              {categoryLabel(s.category)}
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
                          <div className="mb-4">
                            <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                              Output
                            </p>
                            <p className="text-sm text-black/60 leading-relaxed">
                              {s.output}
                            </p>
                          </div>
                        )}

                        {/* Session notes */}
                        {s.notes && s.notes.length > 0 && (
                          <div className="border-t border-black/8 pt-4 mt-2">
                            <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-2">
                              Notes ({s.notes.length})
                            </p>
                            <ul className="space-y-2">
                              {s.notes.map((n) => (
                                <li key={n.id} className="bg-black/3 px-4 py-2.5 text-sm text-black/70 leading-relaxed">
                                  <p>{n.content}</p>
                                  {n.url && (
                                    <a
                                      href={n.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-mono text-xs text-blue-600 hover:underline break-all mt-1 block"
                                    >
                                      {n.url}
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
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
