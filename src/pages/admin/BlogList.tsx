import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { blogApi, type BlogPost } from "../../lib/adminApi";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiStarLine, RiStarFill } from "@remixicon/react";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    blogApi.list().then(setPosts);
  }, []);

  async function togglePublished(post: BlogPost) {
    const updated = await blogApi.update(post.id, { published: !post.published });
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function toggleFeatured(post: BlogPost) {
    // Unfeature all others first, then toggle this one
    const willFeature = !post.featured;
    if (willFeature) {
      await Promise.all(
        posts.filter((p) => p.featured && p.id !== post.id)
          .map((p) => blogApi.update(p.id, { featured: false }))
      );
    }
    const updated = await blogApi.update(post.id, { featured: willFeature });
    setPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : willFeature ? { ...p, featured: false } : p))
    );
  }

  function deletePost(id: string) {
    setConfirmModal({
      title: "Delete post?",
      message: "This will permanently remove the post. This cannot be undone.",
      onConfirm: async () => {
        await blogApi.delete(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setConfirmModal(null);
      },
    });
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-1">
            Content
          </p>
          <h1 className="font-display text-3xl text-foreground/90">Blog Posts</h1>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
        >
          <RiAddLine size={16} />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-foreground/40 mb-4">No posts yet.</p>
            <Link to="/admin/blog/new" className="text-sm text-foreground/60 hover:text-foreground transition">
              Create your first post →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-black/8">
              <tr>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Title</th>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Tags</th>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Status</th>
                <th className="px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Featured</th>
                <th className="text-left px-6 py-3 font-mono text-xs uppercase tracking-wide text-foreground/40">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-black/[0.02] transition">
                  <td className="px-6 py-4 font-medium text-foreground/80 max-w-[280px] truncate">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-black/5 text-xs text-foreground/50 font-mono">
                          {t}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-foreground/40">+{post.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition ${
                        post.published
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-black/5 text-foreground/40 hover:bg-black/10"
                      }`}
                    >
                      {post.published ? "live" : "draft"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleFeatured(post)}
                      title={post.featured ? "Unfeature" : "Set as featured"}
                      className="p-1.5 rounded-lg hover:bg-amber-50 transition"
                    >
                      {post.featured
                        ? <RiStarFill size={16} className="text-amber-400" />
                        : <RiStarLine size={16} className="text-foreground/25 hover:text-amber-400" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-foreground/40 text-xs font-mono whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/admin/blog/${post.id}`)}
                        className="p-1.5 rounded-lg hover:bg-black/5 text-foreground/40 hover:text-foreground/70 transition"
                      >
                        <RiEditLine size={15} />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
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
