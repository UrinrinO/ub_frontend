import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi, projectsApi, categoryApi, type BlogPost, type Project, type TrackerCategory } from "../../lib/adminApi";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";
import { remindersApi, type Reminder } from "../../lib/reminders.api";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

function fmtMins(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [weekHours, setWeekHours] = useState<number | null>(null);
  const [categories, setCategories] = useState<TrackerCategory[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newTarget, setNewTarget] = useState<number>(0);
  const [adding, setAdding] = useState(false);

  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [addingReminder, setAddingReminder] = useState(false);
  const [rTitle, setRTitle] = useState("");
  const [rNotes, setRNotes] = useState("");
  const [rDeadline, setRDeadline] = useState("");

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  // Exams
  const [addingExam, setAddingExam] = useState(false);
  const [eTitle, setETitle] = useState("");
  const [eNotes, setENotes] = useState("");
  const [eSubject, setESubject] = useState("");
  const [eUrl, setEUrl] = useState("");
  const [eDeadline, setEDeadline] = useState("");

  function refreshCategories() {
    categoryApi.list().then(setCategories).catch(() => {});
  }

  function refreshReminders() {
    remindersApi.list().then(setReminders).catch(() => {});
  }

  useEffect(() => {
    blogApi.list().then(setPosts).catch(() => {});
    projectsApi.list().then(setProjects).catch(() => {});
    trackerApi
      .getWeek(getMondayYYYYMMDD())
      .then((w) => setWeekHours(Math.round((w.totalMinutes / 60) * 10) / 10))
      .catch(() => {});
    refreshCategories();
    refreshReminders();
  }, []);

  async function handleAddCategory() {
    if (!newLabel.trim()) return;
    const key = newKey.trim() || newLabel.trim().toUpperCase().replace(/\s+/g, "_");
    await categoryApi.create({ key, label: newLabel.trim(), targetMinutes: newTarget });
    setNewKey(""); setNewLabel(""); setNewTarget(0); setAdding(false);
    refreshCategories();
  }

  async function handleToggleActive(cat: TrackerCategory) {
    await categoryApi.update(cat.id, { active: !cat.active });
    refreshCategories();
  }

  async function handleUpdateTarget(cat: TrackerCategory, targetMinutes: number) {
    await categoryApi.update(cat.id, { targetMinutes });
    refreshCategories();
  }

  function handleDelete(id: string) {
    setConfirmModal({
      title: "Delete category?",
      message: "This will permanently remove the category. This cannot be undone.",
      onConfirm: async () => {
        await categoryApi.delete(id);
        setConfirmModal(null);
        refreshCategories();
      },
    });
  }

  async function handleAddReminder() {
    if (!rTitle.trim() || !rDeadline) return;
    await remindersApi.create({ title: rTitle.trim(), notes: rNotes.trim() || undefined, deadline: rDeadline });
    setRTitle(""); setRNotes(""); setRDeadline(""); setAddingReminder(false);
    refreshReminders();
  }

  async function handleAddExam() {
    if (!eTitle.trim() || !eDeadline) return;
    await remindersApi.create({
      type: "EXAM",
      title: eTitle.trim(),
      notes: eNotes.trim() || undefined,
      subject: eSubject.trim() || undefined,
      url: eUrl.trim() || undefined,
      deadline: eDeadline,
    });
    setETitle(""); setENotes(""); setESubject(""); setEUrl(""); setEDeadline("");
    setAddingExam(false);
    refreshReminders();
  }

  async function handleCompleteReminder(r: Reminder) {
    await remindersApi.update(r.id, { completed: !r.completed });
    refreshReminders();
  }

  function handleDeleteReminder(id: string, label = "reminder") {
    setConfirmModal({
      title: `Delete ${label}?`,
      message: `This will permanently remove the ${label}. This cannot be undone.`,
      onConfirm: async () => {
        await remindersApi.delete(id);
        setConfirmModal(null);
        refreshReminders();
      },
    });
  }

  const published = posts.filter((p) => p.published).length;
  const featured = projects.filter((p) => p.featured).length;

  const stats = [
    { label: "Total Posts", value: posts.length, sub: `${published} published` },
    { label: "Total Projects", value: projects.length, sub: `${featured} featured` },
    { label: "Focus This Week", value: weekHours !== null ? `${weekHours}h` : "—", sub: "of 14h target" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">
          Overview
        </p>
        <h1 className="font-display text-3xl text-foreground/90">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-black/8 p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-foreground/40 mb-2">
              {s.label}
            </p>
            <p className="font-display text-4xl text-foreground/90">{s.value}</p>
            <p className="text-xs text-foreground/50 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground/80">Tracker Categories</h2>
          <button
            onClick={() => setAdding((v) => !v)}
            className="text-xs font-mono text-foreground/50 hover:text-foreground/80 transition"
          >
            {adding ? "Cancel" : "+ Add"}
          </button>
        </div>

        {adding && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-black/3 rounded-xl">
            <input
              placeholder="Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30"
            />
            <input
              placeholder="Key (auto)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 w-36"
            />
            <input
              type="number"
              placeholder="Target mins"
              value={newTarget || ""}
              onChange={(e) => setNewTarget(Number(e.target.value))}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 w-32"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-1.5 bg-black text-white font-mono text-sm rounded hover:opacity-80 transition"
            >
              Add →
            </button>
          </div>
        )}

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className={`flex items-center gap-3 p-3 rounded-xl border ${cat.active ? "border-black/8" : "border-black/5 opacity-50"}`}>
              <span className="font-mono text-xs uppercase tracking-widest text-black/50 w-40 truncate">{cat.label}</span>
              <span className="font-mono text-xs text-black/30 flex-1">{cat.key}</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={cat.targetMinutes || ""}
                  onChange={(e) => handleUpdateTarget(cat, Number(e.target.value))}
                  onBlur={(e) => handleUpdateTarget(cat, Number(e.target.value))}
                  placeholder="0"
                  className="w-20 border border-black/10 px-2 py-1 font-mono text-xs rounded focus:outline-none focus:border-black/30 text-right"
                />
                <span className="font-mono text-xs text-black/30">
                  {cat.targetMinutes > 0 ? fmtMins(cat.targetMinutes) : "no target"}
                </span>
              </div>
              <button
                onClick={() => handleToggleActive(cat)}
                className={`text-xs font-mono px-2 py-1 rounded transition ${cat.active ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500" : "bg-black/5 text-black/40 hover:bg-green-50 hover:text-green-600"}`}
              >
                {cat.active ? "active" : "inactive"}
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-xs font-mono text-black/30 hover:text-red-500 transition px-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground/80">Reminders</h2>
          <button
            onClick={() => setAddingReminder((v) => !v)}
            className="text-xs font-mono text-foreground/50 hover:text-foreground/80 transition"
          >
            {addingReminder ? "Cancel" : "+ Add"}
          </button>
        </div>

        {addingReminder && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-black/3 rounded-xl">
            <input
              placeholder="Title *"
              value={rTitle}
              onChange={(e) => setRTitle(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 flex-1 min-w-40"
            />
            <input
              placeholder="Notes (optional)"
              value={rNotes}
              onChange={(e) => setRNotes(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 flex-1 min-w-40"
            />
            <input
              type="datetime-local"
              value={rDeadline}
              onChange={(e) => setRDeadline(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30"
            />
            <button
              onClick={handleAddReminder}
              className="px-4 py-1.5 bg-black text-white font-mono text-sm rounded hover:opacity-80 transition"
            >
              Add →
            </button>
          </div>
        )}

        {reminders.length === 0 ? (
          <p className="text-sm text-foreground/40 py-2">No reminders set.</p>
        ) : (
          <div className="space-y-2">
            {reminders.map((r) => {
              const overdue = !r.completed && new Date(r.deadline).getTime() < Date.now();
              const urgent = !r.completed && !overdue && new Date(r.deadline).getTime() - Date.now() <= 24 * 60 * 60 * 1000;
              return (
                <div
                  key={r.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    r.completed
                      ? "border-black/5 opacity-40"
                      : overdue
                      ? "border-red-200 bg-red-50"
                      : urgent
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-black/8"
                  }`}
                >
                  <button
                    onClick={() => handleCompleteReminder(r)}
                    className={`mt-0.5 w-4 h-4 rounded border shrink-0 transition ${
                      r.completed ? "bg-black border-black" : "border-black/30 hover:border-black"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-mono ${r.completed ? "line-through" : "text-foreground/80"}`}>
                      {r.title}
                    </p>
                    {r.notes && (
                      <p className="text-xs text-foreground/50 mt-0.5">{r.notes}</p>
                    )}
                    <p className={`text-xs mt-0.5 font-mono ${overdue ? "text-red-500" : urgent ? "text-yellow-600" : "text-foreground/40"}`}>
                      {overdue ? "⚠ Overdue · " : urgent ? "⏰ Due soon · " : ""}
                      {new Date(r.deadline).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(r.id, "reminder")}
                    className="text-xs font-mono text-black/30 hover:text-red-500 transition px-1"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exams */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground/80">Exams</h2>
          <button
            onClick={() => setAddingExam((v) => !v)}
            className="text-xs font-mono text-foreground/50 hover:text-foreground/80 transition"
          >
            {addingExam ? "Cancel" : "+ Add"}
          </button>
        </div>

        {addingExam && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-black/3 rounded-xl">
            <input
              placeholder="Exam name *"
              value={eTitle}
              onChange={(e) => setETitle(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 flex-1 min-w-40"
            />
            <input
              placeholder="Subject (optional)"
              value={eSubject}
              onChange={(e) => setESubject(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 w-44"
            />
            <input
              placeholder="Description (optional)"
              value={eNotes}
              onChange={(e) => setENotes(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 flex-1 min-w-48"
            />
            <input
              placeholder="Resource link (optional)"
              value={eUrl}
              onChange={(e) => setEUrl(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 flex-1 min-w-48"
            />
            <input
              type="date"
              value={eDeadline}
              onChange={(e) => setEDeadline(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30"
            />
            <button
              onClick={handleAddExam}
              className="px-4 py-1.5 bg-black text-white font-mono text-sm rounded hover:opacity-80 transition"
            >
              Add →
            </button>
          </div>
        )}

        {reminders.filter((r) => r.type === "EXAM" && !r.completed).length === 0 ? (
          <p className="text-sm text-foreground/40 py-2">No exams scheduled.</p>
        ) : (
          <div className="space-y-2">
            {reminders
              .filter((r) => r.type === "EXAM" && !r.completed)
              .map((r) => {
                const days = Math.ceil((new Date(r.deadline).getTime() - Date.now()) / 86_400_000);
                const urgency = days > 14 ? "green" : days > 7 ? "amber" : "orange";
                const colors = {
                  green:  { border: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
                  amber:  { border: "border-amber-200 bg-amber-50",     badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-400"   },
                  orange: { border: "border-orange-200 bg-orange-50",   badge: "bg-orange-100 text-orange-700",   dot: "bg-orange-400"  },
                }[urgency];
                return (
                  <div key={r.id} className={`flex items-start gap-3 p-3 rounded-xl border ${colors.border}`}>
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-mono text-foreground/80">{r.title}</p>
                        {r.subject && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-black/5 text-foreground/50">
                            {r.subject}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${colors.badge}`}>
                          {days <= 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                        </span>
                      </div>
                      {r.notes && <p className="text-xs text-foreground/50 mt-0.5">{r.notes}</p>}
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs font-mono text-foreground/40">
                          {new Date(r.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {r.url && (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline font-mono">
                            Resources →
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { remindersApi.update(r.id, { completed: true }); refreshReminders(); }}
                      className="text-xs font-mono text-black/30 hover:text-emerald-500 transition px-1"
                      title="Mark done"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(r.id, "exam")}
                      className="text-xs font-mono text-black/30 hover:text-red-500 transition px-1"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <div className="bg-white rounded-2xl border border-black/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground/80">Recent Posts</h2>
            <Link to="/admin/blog" className="text-xs text-foreground/40 hover:text-foreground/70 transition">
              View all →
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-sm text-foreground/40 py-4">No posts yet.</p>
          ) : (
            <ul className="space-y-3">
              {posts.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground/80 truncate">{p.title}</span>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-mono ${
                    p.published ? "bg-green-50 text-green-600" : "bg-black/5 text-foreground/40"
                  }`}>
                    {p.published ? "live" : "draft"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/admin/blog/new"
            className="mt-4 inline-block text-xs font-mono text-foreground/50 hover:text-foreground/80 transition"
          >
            + New post
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border border-black/8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground/80">Recent Projects</h2>
            <Link to="/admin/projects" className="text-xs text-foreground/40 hover:text-foreground/70 transition">
              View all →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-foreground/40 py-4">No projects yet.</p>
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground/80 truncate">{p.title}</span>
                  {p.featured && (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-mono bg-amber-50 text-amber-600">
                      featured
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/admin/projects/new"
            className="mt-4 inline-block text-xs font-mono text-foreground/50 hover:text-foreground/80 transition"
          >
            + New project
          </Link>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!confirmModal}
        title={confirmModal?.title ?? ""}
        message={confirmModal?.message ?? ""}
        confirmLabel="Delete"
        destructive
        onConfirm={() => confirmModal?.onConfirm()}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  );
}
