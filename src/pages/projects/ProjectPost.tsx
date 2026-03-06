import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import { projectsApi, type Project } from "../../lib/adminApi";
import { RiCloseLine, RiArrowLeftLine } from "@remixicon/react";

interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function processHTML(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;

  div.querySelectorAll("img.blog-diagram").forEach((img) => {
    const caption = img.getAttribute("data-caption") || "";
    const figure = document.createElement("figure");
    figure.className = "blog-diagram";
    const cloned = img.cloneNode(true) as HTMLImageElement;
    cloned.removeAttribute("class");
    cloned.removeAttribute("data-caption");
    cloned.removeAttribute("data-fig");
    figure.appendChild(cloned);
    if (caption) {
      const figcap = document.createElement("figcaption");
      figcap.textContent = caption;
      figure.appendChild(figcap);
    }
    img.replaceWith(figure);
  });

  div.querySelectorAll("h2, h3").forEach((h) => {
    if (!h.id) {
      h.id = (h.textContent || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
  });

  return div.innerHTML;
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function CircularProgress({ progress }: { progress: number }) {
  const r = 22;
  const cx = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);
  if (progress <= 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-40 drop-shadow-lg">
      <svg width="56" height="56" className="rotate-[-90deg]">
        <circle cx={cx} cy={cx} r={r} fill="white" stroke="#e5e7eb" strokeWidth="3" />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold text-foreground/70">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

function useTOC(contentReady: boolean) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!contentReady || !contentRef.current) return;

    const headings = Array.from(
      contentRef.current.querySelectorAll("h2[id], h3[id]")
    );
    setItems(
      headings.map((h) => ({
        id: h.id,
        text: h.textContent || "",
        level: (h.tagName === "H2" ? 2 : 3) as 2 | 3,
      }))
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [contentReady]);

  return { contentRef, items, activeId };
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition"
        onClick={onClose}
      >
        <RiCloseLine size={28} />
      </button>
      <img
        src={src}
        alt="Diagram enlarged"
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function TableOfContents({ items, activeId }: { items: TOCItem[]; activeId: string }) {
  if (items.length === 0) return null;
  return (
    <nav className="blog-toc">
      <p className="font-mono text-xs uppercase tracking-widest text-black/40 mb-3 px-3">
        Contents
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                activeId === item.id ? "active" : "",
                item.level === 3 ? "level-3" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function ProjectPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [processedContent, setProcessedContent] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const progress = useReadingProgress();
  const { contentRef, items: tocItems, activeId } = useTOC(!!processedContent);

  useEffect(() => {
    if (!slug) return;
    projectsApi
      .list(true, slug)
      .then((projects) => {
        if (projects.length === 0) setNotFound(true);
        else setProject(projects[0]);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!project?.content) return;
    setProcessedContent(processHTML(project.content));
  }, [project]);

  useEffect(() => {
    if (!processedContent || !contentRef.current) return;
    const images = contentRef.current.querySelectorAll("figure.blog-diagram img");
    const handlers: Array<[Element, EventListener]> = [];
    images.forEach((img) => {
      const handler = () => setLightboxSrc((img as HTMLImageElement).src);
      img.addEventListener("click", handler);
      handlers.push([img, handler]);
    });
    return () => { handlers.forEach(([img, h]) => img.removeEventListener("click", h)); };
  }, [processedContent]);

  if (notFound) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-foreground/40 font-mono">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-block text-sm text-foreground/60 underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-32 pb-20">
        <Container>
          <div className="space-y-4 animate-pulse max-w-3xl">
            <div className="h-4 w-24 bg-black/8 rounded-full" />
            <div className="h-10 w-3/4 bg-black/10 rounded-xl" />
            <div className="h-4 w-full bg-black/8 rounded-full" />
            <div className="h-4 w-5/6 bg-black/8 rounded-full" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <CircularProgress progress={progress} />

      {/* Post header */}
      <section className="pt-28 pb-12 border-b border-black/8">
        <Container>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/70 transition mb-8"
          >
            <RiArrowLeftLine size={16} />
            Back to Projects
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-black/5 font-mono text-xs uppercase tracking-wide text-foreground/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground/90 mb-4">
              {project.title}
            </h1>

            {project.excerpt && (
              <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl">
                {project.excerpt}
              </p>
            )}

            <p className="mt-4 font-mono text-xs text-foreground/30 uppercase tracking-wide">
              {new Date(project.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </Container>
      </section>

      {/* Cover image / video */}
      {project.img && (
        <div className="w-full max-h-[480px] overflow-hidden">
          {project.img.endsWith(".mp4") ? (
            <video
              src={project.img}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img src={project.img} alt={project.title} className="w-full h-full object-contain" />
          )}
        </div>
      )}

      {/* Content + TOC */}
      <section className="py-16">
        <Container>
          <div className={tocItems.length > 0 ? "grid lg:grid-cols-[260px_1fr] gap-16 items-start" : ""}>
            {tocItems.length > 0 && (
              <aside className="hidden lg:block sticky top-28">
                <TableOfContents items={tocItems} activeId={activeId} />
              </aside>
            )}
            <article
              ref={contentRef}
              className="blog-content max-w-3xl"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
        </Container>
      </section>

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
