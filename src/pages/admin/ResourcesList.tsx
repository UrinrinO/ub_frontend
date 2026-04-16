import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resourcesApi } from "../resources/resources.api";
import type { Resource, ResourceCategory } from "../resources/resources.types";
import { TYPE_LABELS, TYPE_ICONS } from "../resources/resources.types";
import { RiAddLine, RiEditLine, RiDeleteBinLine } from "@remixicon/react";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

export default function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  
  // Category Form State
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatKey, setNewCatKey] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    refreshResources();
    refreshCategories();
  }, []);

  function refreshResources() {
    resourcesApi.list().then(setResources);
  }

  function refreshCategories() {
    resourcesApi.listCategories().then(setCategories);
  }

  /* ─── Categories ───────────────────────────────────────────────────────── */
  
  async function handleAddCategory() {
    if (!newCatLabel.trim()) return;
    const key = newCatKey.trim() || newCatLabel.trim().toUpperCase().replace(/\s+/g, "_");
    await resourcesApi.createCategory({ key, label: newCatLabel.trim() });
    setNewCatKey("");
    setNewCatLabel("");
    setAddingCategory(false);
    refreshCategories();
  }

  async function handleToggleCategoryActive(cat: ResourceCategory) {
    await resourcesApi.updateCategory(cat.id, { active: !cat.active });
    refreshCategories();
  }

  function handleDeleteCategory(id: string) {
    setConfirmModal({
      title: "Delete category?",
      message: "This will permanently remove the category. Resources using this category will still retain the string value, but it won't appear in dropdowns.",
      onConfirm: async () => {
        await resourcesApi.removeCategory(id);
        setConfirmModal(null);
        refreshCategories();
      },
    });
  }

  /* ─── Resources ────────────────────────────────────────────────────────── */

  function deleteResource(id: string) {
    setConfirmModal({
      title: "Delete resource?",
      message: "This will permanently remove the resource. This cannot be undone.",
      onConfirm: async () => {
        await resourcesApi.remove(id);
        setResources((prev) => prev.filter((r) => r.id !== id));
        setConfirmModal(null);
      },
    });
  }

  return (
    <div className="p-8 max-w-6xl w-full mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Library
          </p>
          <h1 className="font-display text-3xl text-foreground/90">Resources</h1>
        </div>
      </div>

      {/* Categories Manager */}
      <div className="bg-white rounded-2xl border border-black/8 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground/80">Categories</h2>
          <button
            onClick={() => setAddingCategory((v) => !v)}
            className="text-xs font-mono text-foreground/50 hover:text-foreground/80 transition"
          >
            {addingCategory ? "Cancel" : "+ Add"}
          </button>
        </div>

        {addingCategory && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-black/3 rounded-xl">
            <input
              placeholder="Label"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 w-48"
            />
            <input
              placeholder="Key (auto)"
              value={newCatKey}
              onChange={(e) => setNewCatKey(e.target.value)}
              className="border border-black/10 px-3 py-1.5 font-mono text-sm bg-white rounded focus:outline-none focus:border-black/30 w-48"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-1.5 bg-black text-white font-mono text-sm rounded hover:opacity-80 transition"
            >
              Add →
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div key={cat.id} className={`flex items-center gap-2 p-2 rounded-xl border ${cat.active ? "border-black/8 bg-white" : "border-black/5 opacity-50 bg-black/5"}`}>
              <span className="font-mono text-xs uppercase tracking-widest text-black/60 pl-1">{cat.label}</span>
              <div className="w-px h-3 bg-black/10 mx-1" />
              <button
                onClick={() => handleToggleCategoryActive(cat)}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition ${cat.active ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500" : "bg-black/10 text-black/40 hover:bg-green-50 hover:text-green-600"}`}
              >
                {cat.active ? "active" : "inactive"}
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-xs font-mono text-black/30 hover:text-red-500 transition px-1"
              >
                ×
              </button>
            </div>
          ))}
          {categories.length === 0 && !addingCategory && (
            <p className="text-sm text-foreground/40 font-mono">No categories yet.</p>
          )}
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-black/8">
          <h2 className="font-semibold text-foreground/80">All Resources</h2>
          <Link
            to="/admin/resources/new"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
          >
            <RiAddLine size={16} />
            New
          </Link>
        </div>

        {resources.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground/40 mb-4">No resources yet.</p>
            <Link to="/admin/resources/new" className="text-sm text-foreground/60 hover:text-foreground transition">
              Add first resource →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-black/8 bg-black/[0.02]">
              <tr>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Title</th>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Category</th>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Type</th>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-black/[0.02] transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground/80 max-w-[300px] truncate">{resource.title}</p>
                    <a href={resource.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline max-w-[300px] truncate block font-mono mt-0.5">
                      {resource.url}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-black/5 text-foreground/60 rounded">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-foreground/60">
                      {TYPE_ICONS[resource.type]} {TYPE_LABELS[resource.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block max-w-fit font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${resource.completed ? 'bg-green-100 text-green-700' : 'bg-black/5 text-foreground/50'}`}>
                        {resource.completed ? "Done" : "Pending"}
                      </span>
                      {resource.tasks && resource.tasks.length > 0 && (
                        <span className="font-mono text-[9px] text-foreground/40">
                          {resource.tasks.filter(t => t.completed).length} / {resource.tasks.length} sub-tasks
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/admin/resources/${resource.id}`)}
                        className="p-1.5 rounded-lg hover:bg-black/5 text-foreground/40 hover:text-foreground/70 transition"
                      >
                        <RiEditLine size={15} />
                      </button>
                      <button
                        onClick={() => deleteResource(resource.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-foreground/40 hover:text-red-500 transition"
                      >
                        <RiDeleteBinLine size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
