import { useState } from "react";
import Container from "../../components/layout/Container";

const blogTags = ["All", "AI Engineering", "Machine Learning", "Full-Stack", "DevOps", "Career"];

const featuredPost = {
  tag: "AI Engineering",
  title: "From Notebooks to Production: Building Enterprise LLM Systems",
  excerpt:
    "Large language models are powerful in isolation — but deploying them reliably at enterprise scale requires solid engineering. Here's how I think about LLM architecture, persona design, and model lifecycle management.",
  img: "https://picsum.photos/seed/blogfeat/1000/600",
};

const latestPosts = [
  {
    tags: ["Machine Learning", "Career"],
    title: "Pulse Waveforms and Disease Detection: An ML Journey",
    excerpt:
      "How I built a machine learning classifier for Peripheral Arterial Disease using synthetically generated pulse waveform data — and won a Best Industrial Project award for it.",
    img: "https://picsum.photos/seed/post1/600/400",
  },
  {
    tags: ["DevOps", "AI Engineering"],
    title: "Docker, Kubernetes, and the Case for Container-First CI/CD",
    excerpt:
      "Moving from manual deployment to container-orchestrated pipelines changed everything. Here's the architecture I rely on for production AI workloads.",
    img: "https://picsum.photos/seed/post2/600/400",
  },
  {
    tags: ["AI Engineering"],
    title: "Designing AI Personas: Voice, Emotion, and Real-Life Characteristics",
    excerpt:
      "Building LLM-backed systems that behave like real people requires more than a system prompt. A look at my approach to persona design and character grounding.",
    img: "https://picsum.photos/seed/post3/600/400",
  },
  {
    tags: ["Full-Stack", "AI Engineering"],
    title: "MERN vs Django: Choosing the Right Stack for AI-Backed Systems",
    excerpt:
      "After years of building both MERN and Django backends, here's how I decide which to reach for — especially when a Python ML service is part of the picture.",
    img: "https://picsum.photos/seed/post4/600/400",
  },
  {
    tags: ["AI Engineering", "Full-Stack"],
    title: "Generative AI Meets Power BI: Predictive Stock Management in Practice",
    excerpt:
      "Connecting Generative AI to live Power BI and SQL data streams to drive predictive inventory decisions — architecture, trade-offs, and lessons learned.",
    img: "https://picsum.photos/seed/post5/600/400",
  },
  {
    tags: ["Career", "AI Engineering"],
    title: "Why I Went Back to Study AI After 7 Years in Industry",
    excerpt:
      "Leaving a senior development role to do an MSc in Artificial Intelligence was a risk. Here's what I learned, what I built, and why it was worth it.",
    img: "https://picsum.photos/seed/post6/600/400",
  },
];

export default function Blog() {
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

  const filteredPosts =
    selectedTags.length === 0
      ? latestPosts
      : latestPosts.filter((p) => p.tags.some((t) => selectedTags.includes(t)));

  return (
    <>
      <section className="py-24">
        <Container>
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-foreground/90">
              Blog & articles
            </h1>
          </div>

          {/* Featured Post */}
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-center">
            <div className="overflow-hidden rounded-2xl aspect-[3/2] group">
              <img
                src={featuredPost.img}
                alt={featuredPost.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
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
        </Container>
      </section>

      {/* Latest Posts */}
      <section className="py-24 bg-foreground">
        <Container>
          <div className="mb-10">
            <p className="flex items-center gap-2 text-xs font-mono uppercase text-white/50 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block" />
              Blog and articles
            </p>
            <h2 className="font-display text-4xl text-white/90 mb-6">
              Latest insights and trends
            </h2>
            <div className="flex flex-wrap gap-2">
              {blogTags.map((tag) => (
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
            {filteredPosts.map((post, i) => (
              <article
                key={i}
                className="rounded-2xl border border-white/10 bg-white overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden group">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-mono uppercase tracking-wide text-foreground/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
    </>
  );
}
