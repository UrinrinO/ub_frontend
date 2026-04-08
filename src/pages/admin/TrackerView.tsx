import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";
import type { WeekReport } from "../tracker/tracker.types";
import { useToast } from "../../components/ui/Toast";

type Session = WeekReport["sessions"][number];

function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function DotRating({ value, max = 5 }: { value?: number; max?: number }) {
  if (value === undefined) return <span className="text-foreground/30">—</span>;
  return (
    <span className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < value ? "bg-foreground/70" : "bg-black/10"}`} />
      ))}
      <span className="ml-1 text-foreground/40 text-xs">{value}/{max}</span>
    </span>
  );
}

function SessionDrawer({
  session,
  isLast,
  onClose,
  onEdit,
}: {
  session: Session;
  isLast: boolean;
  onClose: () => void;
  onEdit: (id: string, minutes: number) => void;
}) {
  const date = new Date(session.startedAt);
  const dateLabel = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const timeLabel = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-black/8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">{dateLabel} · {timeLabel}</p>
            <h2 className="font-display text-2xl text-foreground/90">{session.category.replace(/_/g, " ")}</h2>
          </div>
          <button onClick={onClose} className="text-foreground/30 hover:text-foreground/70 transition text-xl leading-none mt-1">✕</button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Duration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">Duration</p>
              <p className="font-display text-3xl text-foreground/90">{fmt(session.minutes)}</p>
            </div>
            {isLast && (
              <button
                onClick={() => onEdit(session.id, session.minutes)}
                className="px-3 py-1.5 border border-black/15 font-mono text-xs text-foreground/50 hover:border-black/30 hover:text-foreground/80 transition rounded"
              >
                Edit duration ✎
              </button>
            )}
          </div>

          {/* Ratings */}
          {(session.focus !== undefined || session.difficulty !== undefined) && (
            <div className="grid grid-cols-2 gap-4">
              {session.focus !== undefined && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-2">Focus</p>
                  <DotRating value={session.focus} />
                </div>
              )}
              {session.difficulty !== undefined && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-2">Difficulty</p>
                  <DotRating value={session.difficulty} />
                </div>
              )}
            </div>
          )}

          {/* Worked on */}
          {session.workedOn && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-2">Worked on</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{session.workedOn}</p>
            </div>
          )}

          {/* Output */}
          {session.output && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-2">Output</p>
              <p className="text-sm text-foreground/60 leading-relaxed">{session.output}</p>
            </div>
          )}

          {/* Session notes */}
          {session.notes && session.notes.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-3">
                Notes ({session.notes.length})
              </p>
              <ul className="space-y-2">
                {session.notes.map((n) => (
                  <li key={n.id} className="bg-black/3 px-4 py-3 text-sm text-foreground/70 leading-relaxed rounded">
                    <p>{n.content}</p>
                    {n.url && (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-blue-600 hover:underline break-all mt-1.5 block"
                      >
                        {n.url}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {session.notes?.length === 0 && !session.workedOn && !session.output && (
            <p className="text-sm text-foreground/30 italic">No details recorded for this session.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function TrackerView() {
  const toast = useToast();
  const [week, setWeek] = useState<WeekReport | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    trackerApi.getWeek(getMondayYYYYMMDD()).then(setWeek).catch(() => {});
  }, []);

  function openEdit(id: string, minutes: number) {
    setSelectedSession(null);
    setEditingId(id);
    setEditMinutes(String(minutes));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditMinutes("");
  }

  async function submitEdit(sessionId: string) {
    const mins = parseInt(editMinutes, 10);
    if (isNaN(mins) || mins < 0) {
      toast.error("Enter a valid number of minutes.");
      return;
    }
    setEditSaving(true);
    try {
      await trackerApi.adjustSessionDuration(sessionId, mins);
      const updated = await trackerApi.getWeek(getMondayYYYYMMDD());
      setWeek(updated);
      setEditingId(null);
      toast.success("Duration updated.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update.");
    } finally {
      setEditSaving(false);
    }
  }

  const lastSessionId = week?.sessions[week.sessions.length - 1]?.id ?? null;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">Deep Work</p>
          <h1 className="font-display text-3xl text-foreground/90">Tracker — This Week</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/tracker" className="px-4 py-2 rounded-full border border-black/15 text-sm text-foreground/60 hover:border-black/30 transition">
            Open Tracker →
          </Link>
          <Link to="/report" className="px-4 py-2 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition">
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
                      <span className="font-mono text-xs uppercase tracking-wide text-foreground/50">{cat.replace(/_/g, " ")}</span>
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

          {/* Session list */}
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/8">
              <h2 className="font-semibold text-foreground/70">Sessions</h2>
              <p className="font-mono text-xs text-foreground/30 mt-0.5">Click a row for full details</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-black/8">
                <tr>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Date</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Category</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Duration</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Focus</th>
                  <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {week.sessions.map((s, i) => {
                  const isLast = i === week.sessions.length - 1;
                  const isEditing = editingId === s.id;
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-black/2 cursor-pointer transition-colors"
                      onClick={() => !isEditing && setSelectedSession(s)}
                    >
                      <td className="px-6 py-3 text-foreground/50 text-xs font-mono whitespace-nowrap">
                        {new Date(s.startedAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-mono text-xs uppercase tracking-wide text-foreground/60">
                          {s.category.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-foreground/60" onClick={(e) => isEditing && e.stopPropagation()}>
                        {isEditing ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="number"
                              min={0}
                              value={editMinutes}
                              onChange={(e) => setEditMinutes(e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-black/20 rounded focus:outline-none focus:border-black/40"
                              disabled={editSaving}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") submitEdit(s.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                            />
                            <span className="text-foreground/40 text-xs">min</span>
                            <button
                              onClick={() => submitEdit(s.id)}
                              disabled={editSaving}
                              className="text-xs px-2 py-1 rounded bg-foreground text-background hover:bg-foreground/80 transition disabled:opacity-50"
                            >
                              {editSaving ? "…" : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs px-2 py-1 rounded border border-black/15 text-foreground/50 hover:border-black/30 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {fmt(s.minutes)}
                            {isLast && (
                              <button
                                onClick={(e) => { e.stopPropagation(); openEdit(s.id, s.minutes); }}
                                className="text-foreground/30 hover:text-foreground/60 transition text-xs"
                                title="Adjust duration"
                              >
                                ✎
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-foreground/60">
                        {s.focus !== undefined ? `${s.focus}/5` : <span className="text-foreground/25">—</span>}
                      </td>
                      <td className="px-6 py-3">
                        {s.notes?.length > 0 ? (
                          <span className="font-mono text-xs text-foreground/40 bg-black/5 px-2 py-0.5 rounded-full">
                            {s.notes.length}
                          </span>
                        ) : (
                          <span className="text-foreground/20">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Session detail drawer */}
      {selectedSession && (
        <SessionDrawer
          session={selectedSession}
          isLast={selectedSession.id === lastSessionId}
          onClose={() => setSelectedSession(null)}
          onEdit={openEdit}
        />
      )}
    </div>
  );
}
