import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import { projectsApi, type Project } from "../../lib/adminApi";

const projectTags = ["All", "Case Studies", "Machine Learning", "Full-Stack", "DevOps"];

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-black/10" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 bg-black/10 rounded-full" />
        <div className="h-4 w-full bg-black/10 rounded-full" />
        <div className="h-3 w-5/6 bg-black/8 rounded-full mt-1" />
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    projectsApi
      .list(true)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  function toggleTag(tag: string) {
    if (tag === "All") { setSelectedTags([]); return; }
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const moreProjects = projects.filter((p) => p !== featured);

  const filteredProjects =
    selectedTags.length === 0
      ? moreProjects
      : moreProjects.filter((p) => p.tags.some((t) => selectedTags.includes(t)));

  return (
    <>
      <section className="py-24">
        <Container>
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-foreground/90">
              Selected Work
            </h1>
          </div>

          {/* Featured Project */}
          {featured && (
            <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-center">
              <div className="overflow-hidden rounded-2xl aspect-[3/2] group">
                {featured.img?.endsWith(".mp4") ? (
                  <video src={featured.img} autoPlay muted loop playsInline className="w-full h-full object-contain" />
                ) : featured.img ? (
                  <img
                    src={featured.img}
                    alt={featured.title}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-black/5" />
                )}
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {featured.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-3xl text-foreground/90 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {featured.excerpt || featured.description}
                </p>
                <Link
                  to={`/projects/${featured.slug}`}
                  className="inline-block mt-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
                >
                  View Project
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* More Projects */}
      <section className="py-24 bg-foreground">
        <Container>
          <div className="mb-10">
            <p className="flex items-center gap-2 text-xs font-mono uppercase text-white/50 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block" />
              Projects
            </p>
            <h2 className="font-display text-4xl text-white/90 mb-6">
              More work
            </h2>
            <div className="flex flex-wrap gap-2">
              {projectTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition ${
                    (tag === "All" && selectedTags.length === 0) ||
                    (tag !== "All" && selectedTags.includes(tag))
                      ? "bg-white text-foreground border-white"
                      : "border-white/20 text-white/70 hover:border-white/40"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filteredProjects.length === 0 ? (
            <p className="text-white/40 py-12 text-center">
              {moreProjects.length === 0 ? "No projects yet." : "No projects match the selected filters."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="rounded-2xl border border-white/10 bg-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300 block no-underline"
                >
                  {project.img ? (
                    <div className="aspect-[4/3] overflow-hidden group">
                      {project.img.endsWith(".mp4") ? (
                        <video
                          src={project.img}
                          autoPlay muted loop playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={project.img}
                          alt={project.title}
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-black/5" />
                  )}
                  <div className="p-6 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-foreground/90 leading-snug">{project.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{project.description}</p>
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
