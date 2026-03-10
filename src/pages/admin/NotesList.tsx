import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notesApi, type NotesSeries } from "../../lib/adminApi";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiArrowRightLine } from "@remixicon/react";

export default function NotesList() {
  const [series, setSeries] = useState<NotesSeries[]>([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    notesApi.listSeries().then(setSeries);
  }, []);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const s = await notesApi.createSeries({ title: newTitle.trim(), tagline: newTagline.trim() });
      setSeries((prev) => [s, ...prev]);
      setNewTitle(""); setNewTagline(""); setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(s: NotesSeries) {
    const updated = await notesApi.updateSeries(s.id, { published: !s.published });
    setSeries((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  }

  async function deleteSeries(id: string) {
    if (!confirm("Delete this series and all its parts? This cannot be undone.")) return;
    await notesApi.deleteSeries(id);
    setSeries((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">Content</p>
          <h1 className="font-display text-3xl text-foreground/90">Engineering Notes</h1>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
        >
          <RiAddLine size={16} />
          New Series
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl border border-black/8 p-6 mb-6 space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">New Series</p>
          <input
            placeholder="Series title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full border border-black/10 px-3 py-2 font-sans text-sm bg-white rounded-lg focus:outline-none focus:border-black/30"
          />
          <input
            placeholder="Tagline (optional)"
            value={newTagline}
            onChange={(e) => setNewTagline(e.target.value)}
            className="w-full border border-black/10 px-3 py-2 font-sans text-sm bg-white rounded-lg focus:outline-none focus:border-black/30"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={saving || !newTitle.trim()}
              className="px-4 py-2 bg-foreground text-white font-mono text-sm rounded-full hover:opacity-80 transition disabled:opacity-40"
            >
              {saving ? "Creating…" : "Create →"}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 font-mono text-sm text-foreground/50 hover:text-foreground/80 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {series.length === 0 && !adding && (
          <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
            <p className="text-foreground/40 mb-4">No series yet.</p>
            <button onClick={() => setAdding(true)} className="text-sm text-foreground/60 hover:text-foreground transition">
              Create your first series →
            </button>
          </div>
        )}

        {series.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-black/8 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground/85 leading-snug mb-1">{s.title}</h2>
                {s.tagline && <p className="text-sm text-foreground/50 leading-relaxed">{s.tagline}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublished(s)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition ${
                    s.published ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-black/5 text-foreground/40 hover:bg-black/10"
                  }`}
                >
                  {s.published ? "live" : "draft"}
                </button>
                <button
                  onClick={() => deleteSeries(s.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-foreground/40 hover:text-red-500 transition"
                >
                  <RiDeleteBinLine size={15} />
                </button>
              </div>
            </div>

            {/* Parts */}
            <div className="border-t border-black/6 pt-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-xs uppercase tracking-widest text-foreground/30">
                  {s.parts.length} {s.parts.length === 1 ? "Part" : "Parts"}
                </p>
                <Link
                  to={`/admin/notes/${s.id}/parts/new`}
                  className="flex items-center gap-1 text-xs font-mono text-foreground/40 hover:text-foreground/70 transition"
                >
                  <RiAddLine size={13} /> Add part
                </Link>
              </div>

              {s.parts.map((part) => (
                <div key={part.id} className="flex items-center gap-3 py-1.5">
                  <span className="font-mono text-xs text-foreground/25 w-6 shrink-0">
                    {String(part.partNumber).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm text-foreground/70 truncate">{part.title}</span>
                  <span className={`text-xs font-mono ${part.published ? "text-green-600" : "text-foreground/30"}`}>
                    {part.published ? "live" : "draft"}
                  </span>
                  <button
                    onClick={() => navigate(`/admin/notes/${s.id}/parts/${part.id}`)}
                    className="p-1 rounded hover:bg-black/5 text-foreground/35 hover:text-foreground/60 transition"
                  >
                    <RiEditLine size={14} />
                  </button>
                </div>
              ))}

              {s.parts.length === 0 && (
                <p className="text-xs text-foreground/30 py-1">No parts yet.</p>
              )}

              <Link
                to={`/engineering-notes/${s.slug}`}
                target="_blank"
                className="flex items-center gap-1 text-xs font-mono text-foreground/30 hover:text-foreground/60 transition mt-2"
              >
                <RiArrowRightLine size={13} /> View public page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
