import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notesApi, type NotesSeries } from "../../lib/adminApi";
import Container from "../../components/layout/Container";

export default function SeriesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<NotesSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    notesApi.getSeriesBySlug(slug, true).then((s) => {
      if (s.parts.length === 1) {
        navigate(`/engineering-notes/${slug}/${s.parts[0].slug}`, { replace: true });
      } else {
        setSeries(s);
      }
    }).finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-24">
        <Container>
          <div className="space-y-4 animate-pulse max-w-2xl">
            <div className="h-3 w-24 bg-black/8 rounded-full" />
            <div className="h-10 w-3/4 bg-black/10 rounded-xl" />
            <div className="h-4 w-full bg-black/8 rounded-full" />
          </div>
        </Container>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="py-24">
        <Container>
          <p className="text-foreground/40">Series not found.</p>
          <Link to="/engineering-notes" className="text-sm text-foreground/60 hover:text-foreground transition mt-2 inline-block">
            ← Back to Engineering Notes
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="py-20 border-b border-black/8">
        <Container>
          <Link to="/engineering-notes" className="font-mono text-xs text-foreground/40 hover:text-foreground/70 transition mb-6 inline-block">
            ← Engineering Notes
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {series.tags.map((t) => (
              <span key={t} className="font-mono text-xs px-2.5 py-1 border border-black/10 text-foreground/40 tracking-wide">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] text-foreground/90 leading-tight max-w-3xl">
            {series.title}
          </h1>
          <p className="mt-5 text-base text-foreground/60 leading-relaxed max-w-2xl">
            {series.tagline}
          </p>
          {series.description && (
            <p className="mt-3 text-sm text-foreground/50 leading-relaxed max-w-2xl">
              {series.description}
            </p>
          )}
        </Container>
      </section>

      {/* Parts list */}
      <section className="py-16">
        <Container>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-8">
            {series.parts.length} {series.parts.length === 1 ? "Part" : "Parts"}
          </p>
          <div className="space-y-0 max-w-3xl">
            {series.parts.map((part, i) => (
              <Link
                key={part.id}
                to={`/engineering-notes/${series.slug}/${part.slug}`}
                className={`group flex items-start gap-6 py-8 border-t border-black/10 ${i === series.parts.length - 1 ? "border-b" : ""}`}
              >
                <span className="font-display text-4xl leading-none text-foreground/10 select-none w-12 shrink-0 pt-1">
                  {String(part.partNumber).padStart(2, "0")}
                </span>
                <div className="flex-1 space-y-1.5">
                  <h2 className="font-display text-xl md:text-2xl text-foreground/85 leading-snug group-hover:text-foreground transition">
                    {part.title}
                  </h2>
                  <p className="font-mono text-xs text-foreground/35 uppercase tracking-widest">
                    {new Date(part.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className="font-mono text-xs text-foreground/30 group-hover:text-foreground/60 transition shrink-0 pt-2">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
