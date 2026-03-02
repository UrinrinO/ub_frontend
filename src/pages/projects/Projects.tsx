import { useState } from "react";
import Container from "../../components/layout/Container";

const projectTags = ["All", "Case Studies", "Machine Learning", "Full-Stack", "DevOps"];

const featuredProject = {
  tag: "Case Study",
  title: "AI-Powered Smart Inventory Management System",
  excerpt:
    "A Generative AI–integrated inventory platform built for the aviation sector. Consumes live data from Quantum, SQL Server, and Power BI for predictive stock management — built on a MERN stack with a Python AI backend deployed on Azure.",
  img: "https://picsum.photos/seed/projfeat/1000/600",
};

const moreProjects = [
  {
    tags: ["Machine Learning", "Case Studies"],
    title: "Peripheral Arterial Disease Detection API",
    excerpt:
      "A machine learning API for early detection of Peripheral Arterial Disease using synthetically generated pulse waveform signals. Awarded Best Industrial Project (MSc AI 2024).",
    img: "https://picsum.photos/seed/proj1/600/400",
  },
  {
    tags: ["Machine Learning", "Case Studies"],
    title: "Smart Car Parking System",
    excerpt:
      "Computer vision–based parking management system built during MSc research — detecting and tracking vehicle occupancy in real time using image recognition.",
    img: "https://picsum.photos/seed/proj2/600/400",
  },
  {
    tags: ["Full-Stack", "Case Studies"],
    title: "Compliance Management Portal",
    excerpt:
      "A secure MERN stack portal for stock trading compliance and staff tracking — with role-based access, audit logs, and real-time reporting dashboards.",
    img: "https://picsum.photos/seed/proj3/600/400",
  },
  {
    tags: ["DevOps", "Full-Stack"],
    title: "LLM Research Platform",
    excerpt:
      "CI/CD pipelines on GitHub with Docker and Kubernetes, Node.js and Python backends, and custom persona systems with voice and emotional characteristics.",
    img: "https://picsum.photos/seed/proj4/600/400",
  },
  {
    tags: ["Full-Stack"],
    title: "Employment & Recruitment Portal",
    excerpt:
      "A React.js employment portal used for recruitment across multiple organisations — with job listings, application tracking, and admin management workflows.",
    img: "https://picsum.photos/seed/proj5/600/400",
  },
  {
    tags: ["Full-Stack", "Case Studies"],
    title: "HR & Performance Management System",
    excerpt:
      "A Flask and PostgreSQL tenant-based platform for staff performance tracking, time monitoring, and KPI management — with a yearly subscription model.",
    img: "https://picsum.photos/seed/proj6/600/400",
  },
];

export default function Projects() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    if (tag === "All") {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const filteredProjects =
    selectedTags.length === 0
      ? moreProjects
      : moreProjects.filter((p) => p.tags.some((t) => selectedTags.includes(t)));

  return (
    <>
      <section className="py-24">
        <Container>
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-foreground/90">
              Selected Work
            </h1>
          </div>

          {/* Featured Project */}
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-center">
            <div className="overflow-hidden rounded-2xl aspect-[3/2] group">
              <img
                src={featuredProject.img}
                alt={featuredProject.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60">
                {featuredProject.tag}
              </span>
              <h2 className="font-display text-3xl text-foreground/90 leading-tight">
                {featuredProject.title}
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {featuredProject.excerpt}
              </p>
              <button className="mt-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition">
                View Project
              </button>
            </div>
          </div>
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

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProjects.map((project, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden group">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
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
                  <h3 className="font-semibold text-foreground/90 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {project.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
