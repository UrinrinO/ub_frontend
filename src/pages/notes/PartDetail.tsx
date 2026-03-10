import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notesApi, type NotesPart, type NotesSeries } from "../../lib/adminApi";
import Container from "../../components/layout/Container";

type FullPart = NotesPart & { series: NotesSeries };

export default function PartDetail() {
  const { slug, partSlug } = useParams<{ slug: string; partSlug: string }>();
  const [part, setPart] = useState<FullPart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !partSlug) return;
    notesApi.getPartBySlug(slug, partSlug, true).then(setPart).finally(() => setLoading(false));
  }, [slug, partSlug]);

  if (loading) {
    return (
      <div className="py-24">
        <Container>
          <div className="space-y-4 animate-pulse max-w-3xl">
            <div className="h-3 w-32 bg-black/8 rounded-full" />
            <div className="h-10 w-2/3 bg-black/10 rounded-xl" />
            <div className="h-4 w-full bg-black/8 rounded-full" />
            <div className="h-4 w-5/6 bg-black/8 rounded-full" />
          </div>
        </Container>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="py-24">
        <Container>
          <p className="text-foreground/40">Article not found.</p>
          <Link to="/engineering-notes" className="text-sm text-foreground/60 hover:text-foreground transition mt-2 inline-block">
            ← Engineering Notes
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-xs text-foreground/35 mb-10">
            <Link to="/engineering-notes" className="hover:text-foreground/60 transition">Engineering Notes</Link>
            <span>/</span>
            <Link to={`/engineering-notes/${part.series.slug}`} className="hover:text-foreground/60 transition truncate max-w-[200px]">
              {part.series.title}
            </Link>
            <span>/</span>
            <span className="text-foreground/50">Part {part.partNumber}</span>
          </div>

          {/* Header */}
          <header className="mb-12 pb-12 border-b border-black/8">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/35 mb-3">
              Part {String(part.partNumber).padStart(2, "0")}
            </p>
            <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-foreground/90 leading-tight mb-4">
              {part.title}
            </h1>
            <p className="text-sm text-foreground/40 font-mono">
              {new Date(part.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}
              {Math.ceil(part.content.split(/\s+/).length / 200)} min read
            </p>
          </header>

          {/* Content */}
          <div className="notes-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {part.content}
            </ReactMarkdown>
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-black/8 flex items-center justify-between">
            <Link
              to={`/engineering-notes/${part.series.slug}`}
              className="font-mono text-xs text-foreground/40 hover:text-foreground/70 transition"
            >
              ← Back to series
            </Link>
            <Link
              to="/engineering-notes"
              className="font-mono text-xs text-foreground/40 hover:text-foreground/70 transition"
            >
              All series →
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
