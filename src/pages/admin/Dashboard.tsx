import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogApi, projectsApi, type BlogPost, type Project } from "../../lib/adminApi";
import { trackerApi } from "../tracker/tracker.api";
import { getMondayYYYYMMDD } from "../tracker/tracker.utils";

export default function Dashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [weekHours, setWeekHours] = useState<number | null>(null);

  useEffect(() => {
    blogApi.list().then(setPosts).catch(() => {});
    projectsApi.list().then(setProjects).catch(() => {});
    trackerApi
      .getWeek(getMondayYYYYMMDD())
      .then((w) => setWeekHours(Math.round((w.totalMinutes / 60) * 10) / 10))
      .catch(() => {});
  }, []);

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
