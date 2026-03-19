import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../components/ui/Toast";
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
import type { Category, SessionNote } from "./tracker.types";
import { remindersApi, type Reminder } from "../../lib/reminders.api";
import ClockOutForm from "./ClockOutForm";
import { usePiP } from "./usePiP";

/* ---------- CONSTANTS ---------- */

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
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);

  // Reminders
  const [urgentReminders, setUrgentReminders] = useState<Reminder[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Session notes
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>([]);
  const [noteContent, setNoteContent] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingMinutes, setEditingMinutes] = useState<string>("");
  const [editingCurrentMinutes, setEditingCurrentMinutes] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [lastEdit, setLastEdit] = useState<{
    sessionId: string;
    previousMinutes: number;
    newMinutes: number;
  } | null>(null);

  const { openPiP, isPiPOpen } = usePiP();
  const toast = useToast();

  useEffect(() => {
    if (!lastEdit) return;
    const id = window.setTimeout(() => setLastEdit(null), 20000);
    return () => window.clearTimeout(id);
  }, [lastEdit]);

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
        setSessionId(session.id);
        setSessionNotes(session.notes ?? []);
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

  /* Load reminders, flag any due within 24h */
  useEffect(() => {
    remindersApi
      .list()
      .then((all) => {
        const now = Date.now();
        const in24h = 24 * 60 * 60 * 1000;
        setUrgentReminders(
          all.filter((r) => !r.completed && new Date(r.deadline).getTime() - now <= in24h),
        );
      })
      .catch(console.error);
  }, []);

  /* Load week report */
  useEffect(() => {
    trackerApi
      .getWeek(getMondayYYYYMMDD())
      .then((w) => dispatch(weekLoaded(w)))
      .catch(console.error);
  }, [dispatch]);

  /* Load categories */
  useEffect(() => {
    trackerApi
      .getCategories()
      .then((cats) => setCategories(cats.map((c) => ({ key: c.key, label: c.label }))))
      .catch(console.error);
  }, []);

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
      const session = await trackerApi.clockIn(selectedCategory);
      setSessionId(session.id);
      setSessionNotes([]);
      dispatch(clockedIn(selectedCategory));
    } catch (e) {
      console.error(e);
      toast.error(String(e));
    }
  }

  async function handleAddNote() {
    if (!sessionId || !noteContent.trim()) return;
    setSavingNote(true);
    try {
      const note = await trackerApi.addSessionNote(sessionId, {
        content: noteContent.trim(),
        url: noteUrl.trim() || undefined,
      });
      setSessionNotes((prev) => [...prev, note]);
      setNoteContent("");
      setNoteUrl("");
      noteInputRef.current?.focus();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSavingNote(false);
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      await trackerApi.deleteSessionNote(id);
      setSessionNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      toast.error(String(e));
    }
  }

  async function refreshWeek() {
    try {
      const w = await trackerApi.getWeek(getMondayYYYYMMDD());
      dispatch(weekLoaded(w));
    } catch (e) {
      console.error(e);
    }
  }

  function openEditSession(sessionId: string, currentMinutes: number) {
    setEditingSessionId(sessionId);
    setEditingMinutes(String(currentMinutes));
    setEditingCurrentMinutes(currentMinutes);
  }

  function closeEditSession() {
    setEditingSessionId(null);
    setEditingMinutes("");
    setEditingCurrentMinutes(null);
  }

  async function handleSaveEditedDuration() {
    if (!editingSessionId || editingCurrentMinutes === null) return;
    const minutes = Number(editingMinutes);
    if (!Number.isInteger(minutes) || minutes < 0) {
      toast.error("Enter a valid number of minutes.");
      return;
    }

    const delta = minutes - editingCurrentMinutes;
    const maxDelta = 60;
    if (Math.abs(delta) > maxDelta) {
      toast.error(`Adjustment must be within ±${maxDelta} minutes.`);
      return;
    }

    const minAllowed = Math.max(1, editingCurrentMinutes - maxDelta);
    if (minutes < minAllowed) {
      toast.error(`Minimum allowed is ${minAllowed} minutes.`);
      return;
    }

    setSavingEdit(true);
    try {
      await trackerApi.adjustSessionDuration(editingSessionId, minutes);
      setLastEdit({
        sessionId: editingSessionId,
        previousMinutes: editingCurrentMinutes,
        newMinutes: minutes,
      });
      toast.info("Session duration updated.");
      await refreshWeek();
      closeEditSession();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleUndoLastEdit() {
    if (!lastEdit) return;
    setSavingEdit(true);
    try {
      await trackerApi.adjustSessionDuration(lastEdit.sessionId, lastEdit.previousMinutes);
      toast.info("Undo successful.");
      await refreshWeek();
      setLastEdit(null);
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSavingEdit(false);
    }
  }

  async function handlePause() {
    try {
      await trackerApi.pause();
      dispatch(paused());
    } catch (e) {
      console.error(e);
      toast.error(String(e));
    }
  }

  async function handleResume() {
    try {
      await trackerApi.resume();
      dispatch(resumed());
    } catch (e) {
      console.error(e);
      toast.error(String(e));
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
      toast.error(String(e));
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

  const lastSessionId = week?.sessions?.[week.sessions.length - 1]?.id ?? null;
  const editingSession = editingSessionId
    ? week?.sessions.find((s) => s.id === editingSessionId)
    : null;

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
      {/* REMINDER TOASTS — chat-bubble style, fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {urgentReminders
          .filter((r) => !dismissedAlerts.has(r.id))
          .map((r) => {
            const overdue = new Date(r.deadline).getTime() < Date.now();
            return (
              <div
                key={r.id}
                className="pointer-events-auto relative w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-4"
                style={{ borderBottomRightRadius: "4px" }}
              >
                {/* Colour accent bar */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-0.75 rounded-full ${
                    overdue ? "bg-red-400" : "bg-amber-400"
                  }`}
                />

                <div className="pl-3 pr-6">
                  {/* Label line */}
                  <p className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-1.5 ${
                    overdue ? "text-red-400" : "text-amber-500"
                  }`}>
                    {overdue ? "Overdue" : "Due within 24h"}
                  </p>

                  {/* Title */}
                  <p className="text-sm font-semibold text-black/85 leading-snug mb-1">
                    {r.title}
                  </p>

                  {/* Deadline */}
                  <p className="text-xs text-black/35">
                    {new Date(r.deadline).toLocaleString()}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setDismissedAlerts((s) => new Set(s).add(r.id))}
                  className="absolute top-3 right-3 text-black/25 hover:text-black/60 transition"
                  aria-label="Dismiss"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            );
          })}
      </div>

      <Container>
        {lastEdit && (
          <div className="mb-6 rounded-xl border border-black/10 bg-white px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-black/80">
              Updated last session: {lastEdit.previousMinutes}m → {lastEdit.newMinutes}m
            </div>
            <button
              onClick={handleUndoLastEdit}
              disabled={savingEdit}
              className="px-4 py-2 border border-black/15 text-sm font-mono text-black/60 hover:border-black/40 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Undo
            </button>
          </div>
        )}

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
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-4 py-2 border text-sm font-mono transition ${
                        selectedCategory === cat.key
                          ? "bg-black text-white border-black"
                          : "border-black/15 text-black/60 hover:border-black/40"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Session notes — visible when a session is in progress */}
            {status !== "IDLE" && !showClockOutForm && (
              <div className="pt-6 border-t border-black/10 space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-black/50">
                  Session Notes
                </p>

                {/* Existing notes */}
                {sessionNotes.length > 0 && (
                  <ul className="space-y-2">
                    {sessionNotes.map((n) => (
                      <li
                        key={n.id}
                        className="flex items-start gap-3 text-sm border border-black/8 bg-[#f6f5f2] px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-black/80 break-words">{n.content}</p>
                          {n.url && (
                            <a
                              href={n.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-blue-600 hover:underline break-all"
                            >
                              {n.url}
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="shrink-0 text-black/25 hover:text-red-500 transition font-mono text-sm"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add note form */}
                <div className="space-y-2">
                  <textarea
                    ref={noteInputRef}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Note or job application detail..."
                    rows={2}
                    className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-3 text-sm font-mono resize-none focus:outline-none focus:border-black/40 placeholder:text-black/30"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
                    }}
                  />
                  <input
                    type="url"
                    value={noteUrl}
                    onChange={(e) => setNoteUrl(e.target.value)}
                    placeholder="Link (optional)"
                    className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteContent.trim() || savingNote}
                    className="px-5 py-2 bg-black text-white font-mono text-xs hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {savingNote ? "Saving..." : "+ Add Note"}
                  </button>
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
                  isEditable={s.id === lastSessionId}
                  onEdit={() => openEditSession(s.id, s.minutes)}
                />
              ))}
            </tbody>
          </table>
        </section>

        {editingSessionId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={closeEditSession}
          >
            <div
              className="bg-white border border-black/10 p-8 max-w-sm w-full mx-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-widest text-black/50">
                  Edit duration
                </p>
                <h2 className="font-display text-2xl leading-tight">
                  Adjust last session
                </h2>
                <p className="text-black/60 text-sm">
                  Update the total minutes for your most recent completed session.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-mono text-black/70">Minutes</label>
                <input
                  type="number"
                  value={editingMinutes}
                  onChange={(e) => setEditingMinutes(e.target.value)}
                  min={1}
                  className="w-full border border-black/15 px-3 py-2 text-sm font-mono focus:outline-none focus:border-black/40"
                />
                <p className="text-xs text-black/40">
                  Adjust within ±60 minutes from current value.
                </p>
              </div>

              {editingSession?.durationEdits?.length ? (
                <div className="space-y-2 border-t border-black/10 pt-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-black/50">
                    Edit history
                  </p>
                  <ul className="text-sm text-black/80 space-y-1">
                    {editingSession.durationEdits.map((edit) => (
                      <li key={edit.createdAt} className="flex justify-between">
                        <span>
                          {new Date(edit.createdAt).toLocaleString()} — {edit.previousMinutes}m → {edit.newMinutes}m
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditSession}
                  className="px-6 py-2.5 border border-black/20 font-mono text-sm text-black/60 hover:border-black/50 hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedDuration}
                  disabled={savingEdit}
                  className="px-6 py-2.5 bg-black text-white font-mono text-sm hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
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
  isEditable,
  onEdit,
}: {
  date: string;
  category: string;
  duration: string;
  focus: string;
  output: string;
  isEditable?: boolean;
  onEdit?: () => void;
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
      <td className="text-black/40">
        {isEditable ? (
          <button
            onClick={onEdit}
            className="text-black/40 hover:text-black transition font-mono text-sm"
          >
            Edit
          </button>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
}
