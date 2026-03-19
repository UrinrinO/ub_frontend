import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";
import type { WeekReport } from "../tracker/tracker.types";
import { useToast } from "../../components/ui/Toast";

function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TrackerView() {
  const toast = useToast();
  const [week, setWeek] = useState<WeekReport | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    trackerApi.getWeek(getMondayYYYYMMDD()).then(setWeek).catch(() => {});
  }, []);

  function startEdit(sessionId: string, currentMinutes: number) {
    setEditingId(sessionId);
    setEditMinutes(String(currentMinutes));
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
                {week.sessions.map((s, i) => {
                  const isLast = i === week.sessions.length - 1;
                  const isEditing = editingId === s.id;
                  return (
                    <tr key={s.id} className="hover:bg-black/2">
                      <td className="px-6 py-3 text-foreground/50 text-xs font-mono whitespace-nowrap">
                        {new Date(s.startedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-mono text-xs uppercase tracking-wide text-foreground/60">
                          {s.category.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-foreground/60">
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
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
                                disabled={editSaving}
                                className="text-xs px-2 py-1 rounded border border-black/15 text-foreground/50 hover:border-black/30 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {fmt(s.minutes)}
                            {isLast && (
                              <button
                                onClick={() => startEdit(s.id, s.minutes)}
                                className="text-foreground/30 hover:text-foreground/60 transition text-xs"
                                title="Adjust duration"
                              >
                                ✎
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-foreground/60">{s.focus}/5</td>
                      <td className="px-6 py-3 text-foreground/50 max-w-50 truncate text-xs">{s.output}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
