import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  sessionLoaded,
  clockedIn,
  paused,
  clockOutOpened,
  resumed,
  tickSecond,
  weekLoaded,
} from "../../store/trackerSlice";
import Container from "../../components/layout/Container";
import { trackerApi } from "./tracker.api";
import { getMondayYYYYMMDD } from "./tracker.utils";
import type { Category } from "./tracker.types";
import ClockOutForm from "./ClockOutForm";
import { usePiP } from "./usePiP";

/* ---------- CONSTANTS ---------- */

const categories: Category[] = [
  "ALGORITHMS",
  "ML_THEORY",
  "ML_PLATFORM",
  "SYSTEM_DESIGN",
  "JOB_APPLICATIONS",
  "READING",
  "MOCK_INTERVIEW",
];

function labelCategory(cat: string) {
  return cat.replaceAll("_", " ");
}

function formatTimer(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

/* ---------- COMPONENT ---------- */

export default function Tracker() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, activeCategory, seconds, showClockOutForm, loading, week } =
    useSelector((s: RootState) => s.tracker);

  const [selectedCategory, setSelectedCategory] =
    useState<Category>("ALGORITHMS");

  const { openPiP, isPiPOpen } = usePiP();

  const running = status === "ACTIVE";

  /* Hydrate active session on mount */
  useEffect(() => {
    trackerApi
      .getSession()
      .then((session) => {
        if (!session) {
          dispatch(sessionLoaded(null));
          return;
        }
        const elapsed = session.segments.reduce((sum, seg) => {
          const start = new Date(seg.startTime).getTime();
          const end = seg.endTime
            ? new Date(seg.endTime).getTime()
            : Date.now();
          return sum + Math.max(0, Math.floor((end - start) / 1000));
        }, 0);
        dispatch(
          sessionLoaded({
            status: session.status === "PAUSED" ? "PAUSED" : "ACTIVE",
            category: session.category,
            seconds: elapsed,
          }),
        );
      })
      .catch(console.error);
  }, [dispatch]);

  /* Load week report */
  useEffect(() => {
    trackerApi
      .getWeek(getMondayYYYYMMDD())
      .then((w) => dispatch(weekLoaded(w)))
      .catch(console.error);
  }, [dispatch]);

  /* Timer tick */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => dispatch(tickSecond()), 1000);
    return () => clearInterval(id);
  }, [running, dispatch]);

  /* Tab title */
  useEffect(() => {
    if (status === "IDLE") {
      document.title = "Deep Work";
      return () => { document.title = "Deep Work"; };
    }
    const prefix = status === "PAUSED" ? "⏸ " : "";
    document.title = `${prefix}${formatTimer(seconds)} · Deep Work`;
    return () => { document.title = "Deep Work"; };
  }, [status, seconds]);

  const statusLine = useMemo(() => {
    if (status === "ACTIVE" && activeCategory) {
      return {
        dotClass: "bg-green-500",
        text: `CLOCKED IN — ${labelCategory(activeCategory)}`,
      };
    }
    if (status === "PAUSED" && activeCategory) {
      return {
        dotClass: "bg-yellow-500",
        text: `PAUSED — ${labelCategory(activeCategory)}`,
      };
    }
    return { dotClass: "bg-black/30", text: "NOT CLOCKED IN" };
  }, [status, activeCategory]);

  async function handleClockIn() {
    try {
      await trackerApi.clockIn(selectedCategory);
      dispatch(clockedIn(selectedCategory));
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  async function handlePause() {
    try {
      await trackerApi.pause();
      dispatch(paused());
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  async function handleResume() {
    try {
      await trackerApi.resume();
      dispatch(resumed());
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  async function handleClockOut() {
    try {
      if (status === "ACTIVE") {
        await trackerApi.pause();
      }
      dispatch(clockOutOpened());
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  /* Derived stats */
  const totalHours = week ? (week.totalMinutes / 60).toFixed(1) : "--";
  const progressPercent = week?.percent ?? 0;

  const todayDate = new Date().toDateString();
  const todayMins =
    week?.sessions
      .filter(
        (s) => new Date(s.startedAt).toDateString() === todayDate,
      )
      .reduce((sum, s) => sum + s.minutes, 0) ?? 0;

  /* Loading state */
  if (loading) {
    return (
      <div className="pt-24 pb-20 bg-[#f6f5f2] min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-widest text-black/30">
          Loading session...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#f6f5f2] min-h-screen">
      <Container>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <h1 className="font-display text-6xl leading-none text-black">
              Deep Work
            </h1>
            <p className="text-lg text-black/50">
              Structured focus sessions. No fake hours.
            </p>
          </div>

          {status !== "IDLE" && (
            <button
              onClick={openPiP}
              className="flex items-center gap-2 px-4 py-2 border border-black/15 font-mono text-xs uppercase tracking-widest text-black/50 hover:border-black/40 hover:text-black transition"
            >
              <span>{isPiPOpen ? "✕ Close Widget" : "⧉ Float Timer"}</span>
            </button>
          )}
        </div>

        {/* TOP GRID */}
        <div className="grid lg:grid-cols-[3fr_1.4fr] gap-8">
          {/* MAIN TIMER */}
          <div className="border border-black/10 bg-white p-10 space-y-8">
            {/* Status line */}
            <p className="font-mono text-sm uppercase tracking-widest text-black/50 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusLine.dotClass}`}
              />
              <span>{statusLine.text}</span>
            </p>

            <p className="font-display text-[90px] leading-none tracking-tight text-black">
              {formatTimer(seconds)}
            </p>

            {/* Category selection only when IDLE */}
            {status === "IDLE" && (
              <div className="space-y-4">
                <p className="font-mono text-sm uppercase tracking-widest text-black/50">
                  Select Category
                </p>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 border text-sm font-mono transition ${
                        selectedCategory === cat
                          ? "bg-black text-white border-black"
                          : "border-black/15 text-black/60 hover:border-black/40"
                      }`}
                    >
                      {labelCategory(cat)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clock-out form replaces buttons when requested */}
            {showClockOutForm ? (
              <ClockOutForm seconds={seconds} minMinutes={25} />
            ) : status === "IDLE" ? (
              <button
                onClick={handleClockIn}
                className="px-8 py-3 bg-black text-white font-mono text-lg hover:opacity-90 transition"
              >
                Clock In →
              </button>
            ) : (
              <div className="flex flex-wrap gap-4">
                {status === "ACTIVE" ? (
                  <button
                    onClick={handlePause}
                    className="px-8 py-3 border border-black/80 bg-white text-black font-mono text-lg hover:bg-black hover:text-white transition"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="px-8 py-3 bg-black text-white font-mono text-lg hover:opacity-90 transition"
                  >
                    Resume →
                  </button>
                )}
                <button
                  onClick={handleClockOut}
                  className="px-8 py-3 border border-black/20 text-black/50 font-mono text-lg hover:border-black/60 hover:text-black transition"
                >
                  Clock Out
                </button>
              </div>
            )}
          </div>

          {/* RIGHT STATS */}
          <div className="space-y-6">
            <StatCard
              title="Today"
              value={todayMins > 0 ? `${todayMins}m` : "0m"}
              subtitle="focused"
            />

            <div className="border border-black/10 bg-white p-8 space-y-4">
              <p className="font-mono text-sm uppercase tracking-widest text-black/50">
                This Week
              </p>
              <p className="font-display text-5xl leading-none">{totalHours}h</p>
              <p className="text-black/50">of 14h target</p>
              <div className="h-[2px] bg-black/10 mt-4">
                <div
                  className="h-full bg-black"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <StatCard
              title="Progress"
              value={`${progressPercent}%`}
              subtitle={`${week?.sessionsCompleted ?? 0} sessions`}
            />
          </div>
        </div>

        {/* WEEK SUMMARY */}
        <section className="mt-16 border border-black/10 bg-white p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="font-mono text-sm uppercase tracking-widest text-black/50">
                This Week
              </p>
              <p className="font-display text-6xl leading-none mt-2">
                {totalHours}h{" "}
                <span className="text-black/40 text-5xl">/ 14h</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-6xl leading-none">
                {progressPercent}%
              </p>
              <p className="text-black/50 font-mono text-sm">complete</p>
            </div>
          </div>

          <div className="h-[2px] bg-black/10 mb-8">
            <div
              className="h-full bg-black"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {week &&
            Object.entries(week.perCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, mins]) => {
                const pct =
                  week.totalMinutes > 0
                    ? Math.round((mins / week.totalMinutes) * 100)
                    : 0;
                return (
                  <ProgressRow
                    key={cat}
                    name={labelCategory(cat)}
                    width={`${pct}%`}
                    time={`${mins}m`}
                  />
                );
              })}
        </section>

        {/* SESSION HISTORY */}
        <section className="mt-16 border border-black/10 bg-white">
          <div className="p-8 border-b border-black/10 flex flex-wrap justify-between gap-6">
            <p className="font-mono text-sm uppercase tracking-widest text-black/50">
              Session History
            </p>
            <button className="px-4 py-2 border border-black/15 hover:border-black/40 transition font-mono text-sm">
              Export Report
            </button>
          </div>

          <table className="w-full text-left">
            <thead className="border-b border-black/10 text-xs uppercase tracking-widest text-black/50 font-mono">
              <tr>
                <th className="p-6">Date</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Focus</th>
                <th>Output</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {week?.sessions.map((s) => (
                <SessionRow
                  key={s.id}
                  date={new Date(s.startedAt).toLocaleString()}
                  category={labelCategory(s.category)}
                  duration={`${s.minutes}m`}
                  focus={`${s.focus ?? "-"} / 5`}
                  output={s.output ?? ""}
                />
              ))}
            </tbody>
          </table>
        </section>
      </Container>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="border border-black/10 bg-white p-8 space-y-3">
      <p className="font-mono text-sm uppercase tracking-widest text-black/50">
        {title}
      </p>
      <p className="font-display text-6xl leading-none">{value}</p>
      <p className="text-black/50">{subtitle}</p>
    </div>
  );
}

function ProgressRow({
  name,
  width,
  time,
}: {
  name: string;
  width: string;
  time: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm font-mono mb-2">
        <span>{name}</span>
        <span>{time}</span>
      </div>
      <div className="h-[2px] bg-black/10">
        <div className="h-full bg-black" style={{ width }} />
      </div>
    </div>
  );
}

function SessionRow({
  date,
  category,
  duration,
  focus,
  output,
}: {
  date: string;
  category: string;
  duration: string;
  focus: string;
  output: string;
}) {
  return (
    <tr className="border-b border-black/10 text-sm">
      <td className="p-6 text-black/60">{date}</td>
      <td>
        <span className="px-3 py-1 border border-black/15 font-mono text-xs">
          {category}
        </span>
      </td>
      <td>{duration}</td>
      <td className="text-black/60">{focus}</td>
      <td className="text-black/70">{output}</td>
      <td className="text-black/40">×</td>
    </tr>
  );
}
