import type { WeekReport, WorkSession } from "./tracker.types";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const trackerApi = {
  getSession() {
    return fetch("/api/tracker/session").then((res) =>
      json<WorkSession | null>(res),
    );
  },

  getWeek(start: string) {
    return fetch(`/api/tracker/week?start=${start}`).then((res) =>
      json<WeekReport>(res),
    );
  },

  clockIn(category: string) {
    return fetch("/api/tracker/clock-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    }).then((res) => json<WorkSession>(res));
  },

  pause() {
    return fetch("/api/tracker/pause", { method: "POST" }).then((res) =>
      json<WorkSession>(res),
    );
  },

  resume() {
    return fetch("/api/tracker/resume", { method: "POST" }).then((res) =>
      json<WorkSession>(res),
    );
  },

  clockOut(notes: {
    workedOn: string;
    output: string;
    difficulty: number;
    focus: number;
  }) {
    return fetch("/api/tracker/clock-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes),
    }).then((res) => json<WorkSession>(res));
  },

  abandonSession() {
    return fetch("/api/tracker/abandon", { method: "POST" }).then((res) =>
      json<{ ok: boolean }>(res),
    );
  },

  getWeeklyReport(week: string) {
    return fetch(`/api/tracker/weekly-report?week=${week}`).then((res) =>
      json<{ sessions: import("./tracker.types").WeekReport; report: import("./tracker.types").StoredWeeklyReport | null }>(res),
    );
  },

  saveWeeklyReport(week: string, weekNumber: number | undefined, notes: import("./tracker.types").ReportNotes) {
    return fetch(`/api/tracker/weekly-report?week=${week}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekNumber, notes }),
    }).then((res) => json<import("./tracker.types").StoredWeeklyReport>(res));
  },
};
