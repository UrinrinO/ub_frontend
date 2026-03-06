import { useEffect, useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { blogApi, type BlogPost } from "../../lib/adminApi";
import {
  RiBold, RiItalic, RiH1, RiH2, RiListUnordered, RiListOrdered,
  RiCodeLine, RiLink, RiArrowLeftLine, RiSaveLine, RiImageAddLine,
} from "@remixicon/react";

function ToolbarButton({
  onClick, active, children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-lg transition ${
        active ? "bg-foreground text-white" : "text-foreground/50 hover:bg-black/5 hover:text-foreground/80"
      }`}
    >
      {children}
    </button>
  );
}

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [img, setImg] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDiagramDialog, setShowDiagramDialog] = useState(false);
  const [diagUrl, setDiagUrl] = useState("");
  const [diagAlt, setDiagAlt] = useState("");
  const [diagCaption, setDiagCaption] = useState("");
  const [diagFig, setDiagFig] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(!isNew);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            "data-caption": {
              default: null,
              parseHTML: (el) => el.getAttribute("data-caption"),
              renderHTML: (attrs) => ({ "data-caption": attrs["data-caption"] }),
            },
            "data-fig": {
              default: null,
              parseHTML: (el) => el.getAttribute("data-fig"),
              renderHTML: (attrs) => ({ "data-fig": attrs["data-fig"] }),
            },
            class: {
              default: null,
              parseHTML: (el) => el.getAttribute("class"),
              renderHTML: (attrs) => ({ class: attrs.class }),
            },
          };
        },
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your post content here…" }),
    ],
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4" },
    },
  });

  useEffect(() => {
    if (!isNew && id) {
      blogApi.get(id).then((post: BlogPost) => {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt ?? "");
        setTagsInput(post.tags.join(", "));
        setImg(post.img ?? "");
        setPublished(post.published);
        editor?.commands.setContent(post.content);
        setLoading(false);
      });
    }
  }, [id, editor]);

  function autoSlug(value: string) {
    return value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (isNew) setSlug(autoSlug(value));
  }

  function handleInsertDiagram() {
    if (!diagUrl.trim() || !editor) return;
    editor.chain().focus().setImage({
      src: diagUrl,
      alt: diagAlt || "Diagram",
      class: "blog-diagram",
      "data-caption": diagCaption || undefined,
      "data-fig": diagFig || undefined,
    } as any).run();
    setDiagUrl(""); setDiagAlt(""); setDiagCaption(""); setDiagFig("");
    setShowDiagramDialog(false);
  }

  async function handleSave() {
    if (!title.trim()) return toast.warning("Title is required");
    setSaving(true);
    const data = {
      title,
      slug,
      excerpt,
      content: editor?.getHTML() ?? "",
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      img,
      published,
    };
    try {
      if (isNew) {
        await blogApi.create(data);
      } else {
        await blogApi.update(id!, data);
      }
      navigate("/admin/blog");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-foreground/40">Loading…</div>;
  }

  return (
    <>
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/blog")}
            className="p-2 rounded-xl hover:bg-black/5 text-foreground/40 hover:text-foreground/70 transition"
          >
            <RiArrowLeftLine size={18} />
          </button>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-0.5">
              {isNew ? "New Post" : "Edit Post"}
            </p>
            <h1 className="font-display text-2xl text-foreground/90">
              {isNew ? "Create Blog Post" : title || "Edit Blog Post"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Published
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition disabled:opacity-50"
          >
            <RiSaveLine size={15} />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Title</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/30 bg-white"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-black/30 bg-white"
          />
        </div>

        {/* Two-col: excerpt + img */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description shown in the blog grid…"
              rows={3}
              className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/30 resize-none bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Image URL</label>
            <input
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://…"
              className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/30 bg-white"
            />
            {img && (
              <img src={img} alt="" className="w-full h-28 object-cover rounded-lg mt-2" />
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">
            Tags <span className="normal-case text-foreground/30">(comma-separated)</span>
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="AI Engineering, Machine Learning, Career"
            className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black/30 bg-white"
          />
        </div>

        {/* Editor */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Content</label>
          <div className="border border-black/10 rounded-xl overflow-hidden bg-white">
            {/* Toolbar */}
            {editor && (
              <div className="flex items-center gap-0.5 px-3 py-2 border-b border-black/8 flex-wrap">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
                  <RiBold size={15} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
                  <RiItalic size={15} />
                </ToolbarButton>
                <span className="w-px h-4 bg-black/10 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
                  <RiH1 size={15} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
                  <RiH2 size={15} />
                </ToolbarButton>
                <span className="w-px h-4 bg-black/10 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
                  <RiListUnordered size={15} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
                  <RiListOrdered size={15} />
                </ToolbarButton>
                <span className="w-px h-4 bg-black/10 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
                  <RiCodeLine size={15} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => {
                    const url = prompt("Enter URL:");
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }}
                  active={editor.isActive("link")}
                >
                  <RiLink size={15} />
                </ToolbarButton>
                <span className="w-px h-4 bg-black/10 mx-1" />
                <ToolbarButton onClick={() => setShowDiagramDialog(true)}>
                  <RiImageAddLine size={15} />
                </ToolbarButton>
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>

      {/* Diagram insert dialog */}
      {showDiagramDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-semibold text-foreground/90">Insert Diagram</h3>
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Image URL *</label>
              <input value={diagUrl} onChange={(e) => setDiagUrl(e.target.value)}
                placeholder="/images/aihealth/architecture.png"
                className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black/30" />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Alt text</label>
              <input value={diagAlt} onChange={(e) => setDiagAlt(e.target.value)}
                placeholder="System architecture diagram"
                className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black/30" />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Caption</label>
              <input value={diagCaption} onChange={(e) => setDiagCaption(e.target.value)}
                placeholder="Figure 1: High-level overview..."
                className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black/30" />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-xs uppercase tracking-wide text-foreground/40">Figure label</label>
              <input value={diagFig} onChange={(e) => setDiagFig(e.target.value)}
                placeholder="Figure 1"
                className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black/30" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleInsertDiagram} disabled={!diagUrl.trim()}
                className="flex-1 px-4 py-2 rounded-full bg-foreground text-white text-sm hover:bg-foreground/80 transition disabled:opacity-40">
                Insert Diagram
              </button>
              <button onClick={() => setShowDiagramDialog(false)}
                className="px-4 py-2 rounded-full border border-black/15 text-sm hover:bg-black/5 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
