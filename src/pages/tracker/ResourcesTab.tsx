import { useEffect, useRef, useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { resourcesApi } from "../resources/resources.api";
import ResourceEditor from "../admin/ResourceEditor";
import {
  TYPE_ICONS,
  TYPE_LABELS,
  detectType,
} from "../resources/resources.types";
import type { Resource, ResourceType, ResourceCategory } from "../resources/resources.types";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

/* ─── helpers ──────────────────────────────────────────── */

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

const ALL = "__ALL__";

/* ─── quick-add form ───────────────────────────────────── */

function QuickAdd({ onSaved, categories }: { onSaved: (r: Resource) => void; categories: ResourceCategory[] }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<ResourceType>("OTHER");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].key);
    }
  }, [categories, category]);

  useEffect(() => {
    if (url.trim()) setType(detectType(url.trim()));
  }, [url]);

  useEffect(() => {
    if (open) setTimeout(() => urlRef.current?.focus(), 40);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const resource = await resourcesApi.create({
        title: title.trim(),
        url: url.trim() || undefined,
        description: description.trim() || undefined,
        category,
        type,
      });
      onSaved(resource);
      setUrl("");
      setTitle("");
      setDescription("");
      setType("OTHER");
      setOpen(false);
      toast.success("Resource saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 bg-black text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition"
        >
          + Add Resource
        </button>
      ) : (
        <div className="border border-black/10 bg-white p-8 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-black/50">
              Add Resource
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-black/30 hover:text-black transition font-mono text-lg leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                URL <span className="normal-case tracking-normal text-black/30">(optional)</span>
              </label>
              <input
                ref={urlRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Optional: Paste URL…"
                className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
              />
              {url.trim() && (
                <p className="font-mono text-xs text-black/35 mt-1">
                  {TYPE_ICONS[type]} Detected: {TYPE_LABELS[type]}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short label for this resource"
                required
                className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
              />
            </div>

            {/* Category + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40"
                >
                  {categories.filter(c => c.active).map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                  className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40"
                >
                  {(["INSTAGRAM", "YOUTUBE", "ARTICLE", "LEETCODE", "OTHER"] as ResourceType[]).map(
                    (t) => (
                      <option key={t} value={t}>
                        {TYPE_ICONS[t]} {TYPE_LABELS[t]}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                Notes{" "}
                <span className="normal-case tracking-normal text-black/30">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why you saved this, what to focus on…"
                rows={2}
                className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono resize-none focus:outline-none focus:border-black/40 placeholder:text-black/30"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="px-6 py-2.5 bg-black text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 border border-black/20 text-black/50 font-mono text-xs uppercase tracking-widest hover:border-black/50 hover:text-black transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ─── resource card ────────────────────────────────────── */

function ResourceCard({
  resource,
  onCompletedChange,
  onDelete,
  onSelect,
}: {
  resource: Resource;
  onCompletedChange: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const toast = useToast();
  const [cycling, setCycling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleToggle() {
    if (cycling) return;
    setCycling(true);
    const next = !resource.completed;
    try {
      await resourcesApi.update(resource.id, { completed: next });
      onCompletedChange(resource.id, next);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setCycling(false);
    }
  }

  async function confirmDelete() {
    try {
      await resourcesApi.remove(resource.id);
      onDelete(resource.id);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setShowDeleteModal(false);
    }
  }

  return (
    <>
      <div
        className={`border border-black/10 bg-white p-6 group transition-opacity flex flex-col ${
          resource.completed ? "opacity-50" : ""
        }`}
      >
      {/* Type + title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-base flex-shrink-0 mt-0.5">{TYPE_ICONS[resource.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onSelect(resource.id)}
              className="font-mono text-sm text-black/85 hover:text-black transition leading-snug line-clamp-2 text-left"
            >
              {resource.title}
            </button>
            {resource.url && (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Open external link"
                className="text-black/30 hover:text-black/60 transition inline-block align-middle pb-0.5"
              >
                ↗
              </a>
            )}
          </div>
          {resource.url && (
            <p className="font-mono text-xs text-black/30 mt-0.5 truncate">{hostname(resource.url)}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-xs text-black/50 leading-relaxed mb-3 line-clamp-2">
          {resource.description}
        </p>
      )}

      {/* Status + delete */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/8">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            disabled={cycling}
            title="Click to toggle status"
            className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border transition hover:opacity-80 disabled:cursor-not-allowed ${
              resource.completed
                ? "border-emerald-300 text-emerald-600 bg-emerald-50/50"
                : "border-black/15 text-black/50 bg-black/5"
            }`}
          >
            {cycling ? "…" : resource.completed ? "DONE" : "PENDING"}
          </button>
          
          {resource.tasks && resource.tasks.length > 0 && (
            <span className="font-mono text-[9px] text-black/40">
              {resource.tasks.filter(t => t.completed).length}/{resource.tasks.length} tasks
            </span>
          )}
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="font-mono text-[10px] text-black/20 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
        >
          delete
        </button>
      </div>
    </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Resource"
        message={`Are you sure you want to permanently delete "${resource.title}"?`}
        confirmLabel="Delete"
        destructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

/* ─── main tab ─────────────────────────────────────────── */

export default function ResourcesTab() {
  const toast = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [statusFilter, setStatusFilter] = useState<boolean | "">("");
  const [search, setSearch] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      resourcesApi.list(),
      resourcesApi.listCategories()
    ])
      .then(([resData, catData]) => {
        setResources(resData);
        setCategories(catData);
      })
      .catch(() => toast.error("Failed to load resources"))
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(resource: Resource) {
    setResources((prev) => [resource, ...prev]);
  }

  function handleCompletedChange(id: string, completed: boolean) {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, completed } : r)));
  }

  function handleDelete(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }

  // Category tabs — only show categories that have resources, plus active generic ones
  const usedKeys = Array.from(new Set(resources.map((r) => r.category)));
  const tabs = [
    { key: ALL, label: "All" },
    ...categories.filter(
      (c) => c.active && (usedKeys.includes(c.key) || c.order < 3),
    ),
    ...usedKeys
      .filter((k) => !categories.find((c) => c.key === k))
      .map((k) => ({ key: k, label: k.replaceAll("_", " ") })),
  ];

  const filtered = resources.filter((r) => {
    if (activeCategory !== ALL && r.category !== activeCategory) return false;
    if (statusFilter !== "" && r.completed !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        (r.url && r.url.toLowerCase().includes(q)) ||
        (r.description ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });
  const ordered = [
    ...filtered.filter((r) => !r.completed),
    ...filtered.filter((r) => r.completed),
  ];

  function countFor(key: string) {
    if (key === ALL) return resources.length;
    return resources.filter((r) => r.category === key).length;
  }

  if (selectedResourceId) {
    return (
      <ResourceEditor
        inlineId={selectedResourceId}
        onInlineBack={() => {
          setSelectedResourceId(null);
          setLoading(true);
          resourcesApi.list().then(setResources).finally(() => setLoading(false));
        }}
      />
    );
  }

  return (
    <div>
      {/* Quick add */}
      <QuickAdd onSaved={handleSaved} categories={categories} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="border border-black/15 bg-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30 w-48"
        />

        <div className="flex gap-1">
          {([
            { value: "", label: "All" },
            { value: false, label: "Pending" },
            { value: true, label: "Done" },
          ] as const).map((s) => (
            <button
              key={String(s.value)}
              onClick={() => setStatusFilter(s.value)}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition ${
                statusFilter === s.value
                  ? "bg-black text-white border-black"
                  : "border-black/15 text-black/50 hover:border-black/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-8 border-b border-black/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeCategory === tab.key
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            {tab.label}
            <span
              className={`text-[9px] font-mono ${
                activeCategory === tab.key ? "text-black/60" : "text-black/25"
              }`}
            >
              {countFor(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="font-mono text-sm text-black/40">Loading…</p>
      ) : ordered.length === 0 ? (
        <div className="border border-black/10 bg-white p-12 text-center">
          <p className="font-mono text-sm text-black/40">
            {resources.length === 0
              ? "No resources yet — paste a link above to get started."
              : "No resources match these filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onCompletedChange={handleCompletedChange}
              onDelete={handleDelete}
              onSelect={(id) => setSelectedResourceId(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
