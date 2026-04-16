import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resourcesApi } from "../resources/resources.api";
import type { ResourceType, ResourceCategory, ResourceTask, ResourceNote } from "../resources/resources.types";
import { TYPE_LABELS, detectType } from "../resources/resources.types";
import { useToast } from "../../components/ui/Toast";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { RiAddLine, RiCheckLine, RiDeleteBinLine } from "@remixicon/react";

interface Props {
  inlineId?: string;
  onInlineBack?: () => void;
}

export default function ResourceEditor({ inlineId, onInlineBack }: Props = {}) {
  const params = useParams();
  const id = inlineId || params.id;
  const navigate = useNavigate();
  const toast = useToast();

  const isEditing = Boolean(id && id !== "new");

  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<ResourceType>("OTHER");
  const [completed, setCompleted] = useState(false);
  const [tags, setTags] = useState(""); // comma separated string for ease
  const [notes, setNotes] = useState<ResourceNote[]>([]);
  const [tasks, setTasks] = useState<ResourceTask[]>([]);
  
  const [saving, setSaving] = useState(false);

  // New task inline form
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [savingTask, setSavingTask] = useState(false);

  // New note inline form
  const [addingNote, setAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Deletion modals state
  const [deleteTaskCandidate, setDeleteTaskCandidate] = useState<string | null>(null);
  const [deleteNoteCandidate, setDeleteNoteCandidate] = useState<string | null>(null);

  useEffect(() => {
    resourcesApi.listCategories().then((cats) => {
      setCategories(cats);
      if (!isEditing && cats.length > 0) {
        setCategory(cats[0].key);
      }
    });

    if (isEditing && id) {
      resourcesApi.list().then((all) => {
        const r = all.find((x) => x.id === id);
        if (r) {
          setTitle(r.title);
          setUrl(r.url || "");
          setDescription(r.description || "");
          setCategory(r.category);
          setType(r.type);
          setCompleted(r.completed);
          setTags(r.tags.join(", "));
          setNotes(r.notes || []);
          setTasks(r.tasks || []);
        } else {
          toast.error("Resource not found");
          navigate("/admin/resources");
        }
      });
    }
  }, [id, isEditing, navigate, toast]);

  function handleUrlChange(newUrl: string) {
    setUrl(newUrl);
    if (!isEditing || type === "OTHER") {
       setType(detectType(newUrl));
    }
  }

  async function handleSave() {
    if (!title.trim() || !category) {
      toast.error("Title and Category are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        category,
        type,
        completed,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (isEditing && id) {
        await resourcesApi.update(id, payload);
        toast.success("Resource updated");
      } else {
        const newRes = await resourcesApi.create(payload);
        toast.success("Resource added. You can now add tasks.");
        if (!inlineId) {
          navigate(`/admin/resources/${newRes.id}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save resource");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateTask() {
    if (!newTaskTitle.trim() || !id) return;
    setSavingTask(true);
    try {
      const created = await resourcesApi.createTask(id, {
        title: newTaskTitle.trim(),
        notes: newTaskNotes.trim()
      });
      setTasks(prev => [...prev, created]);
      setAddingTask(false);
      setNewTaskTitle("");
      setNewTaskNotes("");
      toast.success("Task added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add task");
    } finally {
      setSavingTask(false);
    }
  }

  async function handleToggleTask(task: ResourceTask) {
    try {
      const updated = await resourcesApi.updateTask(task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
    }
  }

  async function confirmDeleteTask() {
    if (!deleteTaskCandidate) return;
    try {
      await resourcesApi.removeTask(deleteTaskCandidate);
      setTasks(prev => prev.filter(t => t.id !== deleteTaskCandidate));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    } finally {
      setDeleteTaskCandidate(null);
    }
  }

  async function handleCreateNote() {
    if (!newNoteContent.trim() || !id) return;
    setSavingNote(true);
    try {
      const created = await resourcesApi.createNote(id, { content: newNoteContent.trim() });
      setNotes((prev) => [...prev, created]);
      setAddingNote(false);
      setNewNoteContent("");
      toast.success("Note added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  }

  async function confirmDeleteNote() {
    if (!deleteNoteCandidate) return;
    try {
      await resourcesApi.removeNote(deleteNoteCandidate);
      setNotes((prev) => prev.filter((n) => n.id !== deleteNoteCandidate));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete note");
    } finally {
      setDeleteNoteCandidate(null);
    }
  }

  return (
    <div className={inlineId ? "w-full" : "p-8 w-full max-w-6xl mx-auto"}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => onInlineBack ? onInlineBack() : navigate("/admin/resources")}
            className="text-xs uppercase tracking-widest font-mono text-black/40 hover:text-black/70 transition mb-4 inline-block"
          >
            ← Back to Resources
          </button>
          <h1 className="font-display text-4xl leading-none">{isEditing ? "Edit Resource" : "New Resource"}</h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 text-sm font-mono cursor-pointer select-none text-black/60 hover:text-black transition">
            <input 
              type="checkbox" 
              className="w-4 h-4 border-black/20 text-black focus:ring-black accent-black"
              checked={completed}
              onChange={e => setCompleted(e.target.checked)}
            />
            Mark Completed
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-[3fr_1.4fr] gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-black/10 p-10 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                  URL <span className="normal-case tracking-normal text-black/30">(optional)</span>
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Resource title"
                  className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary..."
                  rows={2}
                  className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-black/5">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
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
                  {(Object.keys(TYPE_LABELS) as ResourceType[]).map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5">
              <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-1.5">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. React, hooks, tutorial (comma separated)"
                className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
              />
            </div>

            {/* Notes Section */}
            <div className="pt-4 border-t border-black/5">
              <label className="block font-mono text-xs uppercase tracking-widest text-black/40 mb-3">
                Resource Level Notes / Summary
              </label>
              
              <div className="space-y-3 mb-4">
                {notes.length === 0 && !addingNote && (
                  <p className="text-sm font-mono text-black/40">No notes yet.</p>
                )}
                {notes.map(note => (
                  <div key={note.id} className="p-4 border border-black/10 bg-[#f6f5f2] group relative">
                    <p className="text-sm font-mono text-black/90 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    <button 
                      type="button"
                      onClick={() => setDeleteNoteCandidate(note.id)}
                      className="absolute top-4 right-4 text-black/20 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <RiDeleteBinLine size={14} />
                    </button>
                    <p className="text-[10px] uppercase tracking-widest font-mono text-black/30 mt-3 pt-2 border-t border-black/5">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {addingNote ? (
                 <div className="space-y-3">
                    <textarea 
                      placeholder="High-level notes..." 
                      value={newNoteContent}
                      onChange={e => setNewNoteContent(e.target.value)}
                      className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black/40 resize-none h-32 placeholder:text-black/30"
                      autoFocus
                    />
                    <div className="flex gap-3 justify-end pt-1">
                      <button 
                        onClick={() => setAddingNote(false)}
                        className="px-4 py-2 border border-transparent text-black/50 font-mono text-xs uppercase tracking-widest hover:border-black/20 hover:text-black transition"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleCreateNote}
                        disabled={savingNote || !newNoteContent.trim()}
                        className="px-4 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {savingNote ? "Saving…" : "Save Note"}
                      </button>
                    </div>
                  </div>
              ) : isEditing ? (
                  <button 
                    onClick={() => setAddingNote(true)}
                    className="py-3 px-4 w-full flex items-center justify-center gap-2 border border-black/20 text-black/50 hover:text-black hover:border-black/40 transition text-xs font-mono uppercase tracking-widest"
                  >
                    <RiAddLine size={16} /> Add Note
                  </button>
              ) : (
                <div className="p-4 border border-dashed border-black/20 bg-black/5 text-center">
                  <p className="text-xs text-black/40 font-mono">You can add notes after creating the resource.</p>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-black text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Resource"}
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Sidebar/Section */}
        <div className="space-y-6">
          {isEditing ? (
            <div className="bg-white border border-black/10 overflow-hidden sticky top-8">
              <div className="p-6 border-b border-black/10 flex items-center justify-between">
                <h3 className="font-mono text-sm uppercase tracking-widest text-black/60">Tasks & Breakdown</h3>
                <span className="text-xs font-mono text-black/40 bg-black/5 px-2 py-1">
                  {tasks.filter(t => t.completed).length} / {tasks.length}
                </span>
              </div>
              <div className="divide-y divide-black/10 max-h-[500px] overflow-y-auto">
                {tasks.length === 0 && !addingTask && (
                  <p className="p-8 text-center text-xs text-black/40 font-mono">
                    No tasks yet.<br/>Break down this resource into actionable steps.
                  </p>
                )}
                {tasks.map(task => (
                  <div key={task.id} className={`p-5 transition ${task.completed ? "bg-black/5 opacity-50" : "bg-white"}`}>
                    <div className="flex gap-4 items-start">
                      <button 
                        onClick={() => handleToggleTask(task)}
                        className={`mt-0.5 w-5 h-5 border flex items-center justify-center transition-colors flex-shrink-0 ${task.completed ? "bg-black border-black text-white" : "border-black/20 hover:border-black text-transparent"}`}
                      >
                        <RiCheckLine size={12} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-mono ${task.completed ? "line-through text-black/50" : "text-black/90"}`}>
                          {task.title}
                        </p>
                        {task.notes && (
                          <div className="mt-3 text-xs font-mono text-black/60 whitespace-pre-wrap bg-[#f6f5f2] border border-black/5 p-3">
                            {task.notes}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => setDeleteTaskCandidate(task.id)}
                        className="text-black/25 hover:text-red-500 transition ml-2 py-1"
                      >
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-white border-t border-black/10">
                {addingTask ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Task title..." 
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2 text-sm font-mono focus:outline-none focus:border-black/40 placeholder:text-black/30"
                      autoFocus
                    />
                    <textarea 
                      placeholder="Notes / Lessons..." 
                      value={newTaskNotes}
                      onChange={e => setNewTaskNotes(e.target.value)}
                      className="w-full border border-black/15 bg-[#f6f5f2] px-4 py-2 text-xs font-mono focus:outline-none focus:border-black/40 resize-none h-24 placeholder:text-black/30"
                    />
                    <div className="flex gap-3 justify-end pt-1">
                      <button 
                        onClick={() => setAddingTask(false)}
                        className="px-4 py-2 border border-transparent text-black/50 font-mono text-xs uppercase tracking-widest hover:border-black/20 hover:text-black transition"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleCreateTask}
                        disabled={savingTask || !newTaskTitle.trim()}
                        className="px-4 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {savingTask ? "Saving" : "Save Task"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingTask(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-black/20 text-black/50 hover:text-black hover:border-black/40 transition text-xs font-mono uppercase tracking-widest"
                  >
                    <RiAddLine size={16} /> Add Task
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-10 border border-black/10 bg-white text-center">
              <p className="text-sm text-black/50 font-mono mb-6">
                You can add sub-tasks after creating the resource.
              </p>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-black text-white font-mono text-xs uppercase tracking-widest hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Create Resource First
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={Boolean(deleteTaskCandidate)}
        title="Delete Task"
        message="Are you sure you want to permanently remove this task? This action cannot be undone."
        confirmLabel="Delete"
        destructive={true}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteTaskCandidate(null)}
      />

      <ConfirmationModal
        isOpen={Boolean(deleteNoteCandidate)}
        title="Delete Note"
        message="Are you sure you want to permanently remove this note? This action cannot be undone."
        confirmLabel="Delete"
        destructive={true}
        onConfirm={confirmDeleteNote}
        onCancel={() => setDeleteNoteCandidate(null)}
      />
    </div>
  );
}
