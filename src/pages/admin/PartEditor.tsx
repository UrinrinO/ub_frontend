import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notesApi, type NotesPart, type NotesSeries } from "../../lib/adminApi";

export default function PartEditor() {
  const { seriesId, partId } = useParams<{ seriesId: string; partId: string }>();
  const isNew = partId === "new";
  const navigate = useNavigate();

  const [series, setSeries] = useState<NotesSeries | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [partNumber, setPartNumber] = useState(1);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!seriesId) return;
    notesApi.getSeriesById(seriesId).then((s) => {
      setSeries(s);
      if (isNew) setPartNumber(s.parts.length + 1);
    });
  }, [seriesId, isNew]);

  useEffect(() => {
    if (isNew || !partId) return;
    notesApi.getPartById(partId).then((p) => {
      setTitle(p.title);
      setSlug(p.slug);
      setContent(p.content);
      setPartNumber(p.partNumber);
      setPublished(p.published);
    });
  }, [partId, isNew]);

  function autoSlug(t: string) {
    return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  async function handleSave() {
    if (!title.trim() || !seriesId) return;
    setSaving(true);
    try {
      const data: Partial<NotesPart> = {
        title: title.trim(),
        slug: slug.trim() || autoSlug(title),
        content,
        partNumber,
        published,
      };
      if (isNew) {
        await notesApi.createPart(seriesId, data);
      } else {
        await notesApi.updatePart(partId!, data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (isNew) navigate(`/admin/notes`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/notes")}
            className="text-xs font-mono text-foreground/40 hover:text-foreground/70 transition"
          >
            ← Notes
          </button>
          {series && (
            <>
              <span className="text-foreground/20">/</span>
              <span className="text-xs font-mono text-foreground/50 max-w-[200px] truncate">{series.title}</span>
            </>
          )}
          <span className="text-foreground/20">/</span>
          <span className="text-xs font-mono text-foreground/50">{isNew ? "New Part" : `Part ${partNumber}`}</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-foreground/50 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            Published
          </label>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="px-4 py-2 bg-foreground text-white font-mono text-sm rounded-full hover:opacity-80 transition disabled:opacity-40"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex gap-4 px-6 py-3 border-b border-black/6 bg-white/60 shrink-0">
        <input
          placeholder="Part title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (isNew) setSlug(autoSlug(e.target.value));
          }}
          className="flex-1 border border-black/10 px-3 py-1.5 font-sans text-sm bg-white rounded-lg focus:outline-none focus:border-black/30"
        />
        <input
          placeholder="slug (auto)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-52 border border-black/10 px-3 py-1.5 font-mono text-xs bg-white rounded-lg focus:outline-none focus:border-black/30"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-foreground/40">Part</span>
          <input
            type="number"
            min={1}
            value={partNumber}
            onChange={(e) => setPartNumber(Number(e.target.value))}
            className="w-14 border border-black/10 px-2 py-1.5 font-mono text-xs bg-white rounded-lg focus:outline-none focus:border-black/30 text-center"
          />
        </div>
      </div>

      {/* Markdown editor */}
      <div className="flex flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"# Title\n\nWrite your engineering notes in markdown...\n\n## Section\n\nContent here.\n\n```python\n# code block\n```"}
          className="flex-1 p-6 font-mono text-sm text-foreground/80 bg-[#fafaf8] resize-none focus:outline-none leading-relaxed border-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
