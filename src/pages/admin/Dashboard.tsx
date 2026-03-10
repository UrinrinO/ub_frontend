import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi, projectsApi, categoryApi, type BlogPost, type Project, type TrackerCategory } from "../../lib/adminApi";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";

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

  function refreshCategories() {
    categoryApi.list().then(setCategories).catch(() => {});
  }

  useEffect(() => {
    blogApi.list().then(setPosts).catch(() => {});
    projectsApi.list().then(setProjects).catch(() => {});
    trackerApi
      .getWeek(getMondayYYYYMMDD())
      .then((w) => setWeekHours(Math.round((w.totalMinutes / 60) * 10) / 10))
      .catch(() => {});
    refreshCategories();
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

  async function handleDelete(id: string) {
    await categoryApi.delete(id);
    refreshCategories();
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
    </div>
  );
}
