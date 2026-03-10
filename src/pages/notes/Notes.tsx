import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notesApi, type NotesSeries } from "../../lib/adminApi";
import Container from "../../components/layout/Container";

export default function Notes() {
  const [series, setSeries] = useState<NotesSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notesApi.listSeries(true).then(setSeries).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="py-24 border-b border-black/8">
        <Container>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-3">
            Engineering Notes
          </p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-foreground/90 leading-tight max-w-2xl">
            Build logs from the production floor.
          </h1>
          <p className="mt-6 text-base text-foreground/60 leading-relaxed max-w-lg">
            Long-form series documenting real systems as they're built — architecture decisions, implementation detail, and the thinking behind each step.
          </p>
        </Container>
      </section>

      {/* Series list */}
      <section className="py-20">
        <Container>
          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse h-40 bg-black/5 rounded-2xl" />
              ))}
            </div>
          ) : series.length === 0 ? (
            <p className="text-foreground/40 text-sm">No series published yet.</p>
          ) : (
            <div className="space-y-0">
              {series.map((s, i) => (
                <Link
                  key={s.id}
                  to={s.parts[0] ? `/engineering-notes/${s.slug}/${s.parts[0].slug}` : `/engineering-notes/${s.slug}`}
                  className={`group block py-10 border-t border-black/10 ${i === series.length - 1 ? "border-b" : ""}`}
                >
                  <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {s.tags.slice(0, 3).map((t) => (
                          <span key={t} className="font-mono text-xs px-2.5 py-1 border border-black/10 text-foreground/40 tracking-wide">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl text-foreground/90 leading-snug group-hover:text-foreground transition">
                        {s.title}
                      </h2>
                      <p className="text-sm text-foreground/50 leading-relaxed max-w-2xl">
                        {s.tagline}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-xs text-foreground/30 uppercase tracking-widest mb-1">
                        {s.parts.length} {s.parts.length === 1 ? "part" : "parts"}
                      </p>
                      <span className="font-mono text-xs text-foreground/40 group-hover:text-foreground/70 transition">
                        Read series →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
