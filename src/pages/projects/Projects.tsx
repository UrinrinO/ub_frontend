import { useState } from "react";
import Container from "../../components/layout/Container";

const projectTags = [
  "All",
  "Case Studies",
  "System Design",
  "Engineering",
  "Open Source",
];

const featuredProject = {
  tag: "Case Study",
  title: "Real-Time Risk Scoring Platform",
  excerpt:
    "A production ML platform built to score financial transactions in under 50ms. Covers streaming ingestion via Event Hubs, online feature serving, model deployment pipelines, and drift monitoring on Azure.",
  img: "https://picsum.photos/seed/projfeat/1000/600",
};

const moreProjects = [
  {
    tag: "System Design",
    title: "Feature Store: Online vs Offline",
    excerpt:
      "Designing for consistency, latency, and leakage prevention across online and offline serving paths.",
    img: "https://picsum.photos/seed/proj1/600/400",
  },
  {
    tag: "Engineering",
    title: "ML Observability Dashboard",
    excerpt:
      "End-to-end monitoring for drift, latency, and feature health across all deployed models.",
    img: "https://picsum.photos/seed/proj2/600/400",
  },
  {
    tag: "Engineering",
    title: "Streaming Data Pipeline",
    excerpt:
      "High-throughput Kafka-based pipeline for real-time feature computation with backpressure handling.",
    img: "https://picsum.photos/seed/proj3/600/400",
  },
  {
    tag: "Case Studies",
    title: "AutoML Experiment Tracker",
    excerpt:
      "Custom experiment tracking built on top of MLflow with automatic hyperparameter logging and comparison views.",
    img: "https://picsum.photos/seed/proj4/600/400",
  },
  {
    tag: "System Design",
    title: "Model Deployment Framework",
    excerpt:
      "A blue-green deployment framework for ML models with canary rollout, rollback triggers, and shadow mode.",
    img: "https://picsum.photos/seed/proj5/600/400",
  },
  {
    tag: "Open Source",
    title: "Drift Detection Toolkit",
    excerpt:
      "Lightweight Python library for detecting concept, data, and prediction drift across production ML models.",
    img: "https://picsum.photos/seed/proj6/600/400",
  },
];

export default function Projects() {
  const [activeTag, setActiveTag] = useState("All");

  return (
    <section className="py-24">
      <Container>
        {/* Header */}
        <div className="space-y-6 mb-10">
          <h1 className="font-display text-5xl text-foreground/90">
            Selected Work
          </h1>
          <div className="flex flex-wrap gap-2">
            {projectTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  activeTag === tag
                    ? "bg-foreground text-background border-foreground"
                    : "border-black/20 text-foreground/70 hover:border-black/40"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Project */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-center mb-24">
          <div className="overflow-hidden rounded-2xl aspect-[3/2]">
            <img
              src={featuredProject.img}
              alt={featuredProject.title}
              className="w-full h-full object-cover"
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

        {/* More Projects */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-xs font-mono uppercase text-foreground/50 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 inline-block" />
            Projects
          </p>
          <h2 className="font-display text-4xl text-foreground/90">
            More work
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {moreProjects.map((project, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/10 bg-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60">
                  {project.tag}
                </span>
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
  );
}
