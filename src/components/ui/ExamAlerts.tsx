import { useEffect, useState } from "react";
import { remindersApi, type Reminder } from "../../lib/reminders.api";

const STORAGE_KEY = "examAlertDismissed";

function getDismissed(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); }
  catch { return {}; }
}

function setDismissed(id: string) {
  const d = getDismissed();
  d[id] = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

function isSuppressed(exam: Reminder): boolean {
  const dismissed = getDismissed()[exam.id];
  if (!dismissed) return false;
  const daysLeft = (new Date(exam.deadline).getTime() - Date.now()) / 86_400_000;
  // Within 7 days: suppress for 24h. Beyond: suppress for 7 days.
  const suppressMs = daysLeft <= 7 ? 86_400_000 : 7 * 86_400_000;
  return Date.now() - dismissed < suppressMs;
}

function urgency(exam: Reminder): "green" | "amber" | "orange" {
  const days = (new Date(exam.deadline).getTime() - Date.now()) / 86_400_000;
  if (days > 14) return "green";
  if (days > 7) return "amber";
  return "orange";
}

const COLORS = {
  green:  { bar: "bg-emerald-400", label: "text-emerald-600", text: "Exam approaching" },
  amber:  { bar: "bg-amber-400",   label: "text-amber-500",   text: "Exam in 1–2 weeks" },
  orange: { bar: "bg-orange-400",  label: "text-orange-500",  text: "Exam this week!" },
};

function daysLabel(exam: Reminder) {
  const days = Math.ceil((new Date(exam.deadline).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
}

export default function ExamAlerts() {
  const [exams, setExams] = useState<Reminder[]>([]);
  const [dismissed, setDismissedState] = useState<Set<string>>(new Set());

  useEffect(() => {
    remindersApi.list().then((all) => {
      const now = Date.now();
      setExams(
        all.filter(
          (r) =>
            r.type === "EXAM" &&
            !r.completed &&
            new Date(r.deadline).getTime() > now,
        ),
      );
    }).catch(() => {});
  }, []);

  function dismiss(id: string) {
    setDismissed(id);
    setDismissedState((prev) => new Set(prev).add(id));
  }

  const visible = exams.filter((e) => !dismissed.has(e.id) && !isSuppressed(e));
  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 pointer-events-none">
      {visible.map((exam) => {
        const u = urgency(exam);
        const c = COLORS[u];
        return (
          <div
            key={exam.id}
            className="pointer-events-auto relative w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-4"
            style={{ borderBottomLeftRadius: "4px" }}
          >
            {/* Colour accent bar */}
            <div className={`absolute left-0 top-4 bottom-4 w-0.75 rounded-full ${c.bar}`} />

            <div className="pl-3 pr-6">
              <p className={`text-[10px] font-mono font-semibold uppercase tracking-widest mb-1.5 ${c.label}`}>
                {c.text}
              </p>
              <p className="text-sm font-semibold text-black/85 leading-snug mb-0.5">
                {exam.title}
              </p>
              {exam.subject && (
                <p className="text-xs text-black/40 mb-1">{exam.subject}</p>
              )}
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-black/35">
                  {new Date(exam.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <span className={`font-mono text-xs font-semibold ${c.label}`}>
                  {daysLabel(exam)}
                </span>
              </div>
              {exam.url && (
                <a
                  href={exam.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-500 hover:underline mt-1.5 block truncate"
                >
                  Resources →
                </a>
              )}
            </div>

            <button
              onClick={() => dismiss(exam.id)}
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
  );
}
