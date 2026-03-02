import { useState } from "react";
import Container from "../../components/layout/Container";

const blogTags = ["All", "Systems", "ML Architecture", "Engineering", "Career"];

const featuredPost = {
  tag: "Systems",
  title: "Why I Stopped Using Feature Flags for ML Rollouts",
  excerpt:
    "Feature flags work well for software releases, but ML models have a different risk profile. Here's how I moved to graduated deployments, shadow mode, and champion-challenger patterns instead.",
  img: "https://picsum.photos/seed/blogfeat/1000/600",
};

const latestPosts = [
  {
    tag: "ML Architecture",
    title: "Building a Real-Time Feature Store at Scale",
    excerpt:
      "Designing for sub-10ms reads, schema governance, and online-offline consistency in high-throughput environments.",
    img: "https://picsum.photos/seed/post1/600/400",
  },
  {
    tag: "Engineering",
    title: "The Hidden Cost of Model Drift in Production",
    excerpt:
      "Drift isn't just about accuracy. How to detect, alert, and respond across input, concept, and prediction drift.",
    img: "https://picsum.photos/seed/post2/600/400",
  },
  {
    tag: "Systems",
    title: "Event-Driven Architecture for ML Pipelines",
    excerpt:
      "Moving from batch to streaming unlocks new latency targets — but changes everything about how you test and debug.",
    img: "https://picsum.photos/seed/post3/600/400",
  },
  {
    tag: "Engineering",
    title: "Designing for Latency: P99 vs Mean",
    excerpt:
      "Optimizing for average latency hides tail risk. Why P99 matters more in production ML and how to measure it.",
    img: "https://picsum.photos/seed/post4/600/400",
  },
  {
    tag: "ML Architecture",
    title: "MLOps Maturity: From Notebooks to Platforms",
    excerpt:
      "A practical framework for assessing ML infrastructure across reproducibility, monitoring, and deployment.",
    img: "https://picsum.photos/seed/post5/600/400",
  },
  {
    tag: "Systems",
    title: "Infrastructure as Code for ML Systems",
    excerpt:
      "Terraform, Pulumi, and the patterns that work (and fail) when your infra needs to understand model versioning.",
    img: "https://picsum.photos/seed/post6/600/400",
  },
];

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All");

  return (
    <section className="py-24">
      <Container>
        {/* Header */}
        <div className="space-y-6 mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-foreground/90">
            Blog & articles
          </h1>
          <div className="flex flex-wrap gap-2">
            {blogTags.map((tag) => (
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

        {/* Featured Post */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-center mb-24">
          <div className="overflow-hidden rounded-2xl aspect-[3/2]">
            <img
              src={featuredPost.img}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60">
              {featuredPost.tag}
            </span>
            <h2 className="font-display text-3xl text-foreground/90 leading-tight">
              {featuredPost.title}
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {featuredPost.excerpt}
            </p>
            <button className="mt-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition">
              Read more
            </button>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-xs font-mono uppercase text-foreground/50 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 inline-block" />
            Blog and articles
          </p>
          <h2 className="font-display text-4xl text-foreground/90">
            Latest insights and trends
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestPosts.map((post, i) => (
            <article
              key={i}
              className="rounded-2xl border border-black/10 bg-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60">
                  {post.tag}
                </span>
                <h3 className="font-semibold text-foreground/90 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
