import Container from "../../components/layout/Container";

const stats = [
  { value: "5+", label: "Years in production engineering" },
  { value: "20+", label: "Systems built and shipped" },
  { value: "3", label: "ML platforms in production" },
  { value: "40%", label: "Avg latency reduction achieved" },
];

const story = [
  {
    year: "Early",
    title: "Engineering Foundations",
    body: "Started with software engineering and backend systems — learning how reliable infrastructure actually works in production.",
  },
  {
    year: "Transition",
    title: "From Code to Systems Thinking",
    body: "Shifted focus toward architecture and scalability. Began designing systems rather than just features.",
  },
  {
    year: "ML Era",
    title: "Machine Learning Platforms",
    body: "Moved into production ML — real-time inference, feature pipelines, monitoring, and retraining workflows.",
  },
  {
    year: "Today",
    title: "Systems × Intelligence",
    body: "Building infrastructure-first AI systems that are observable, scalable, and safe to evolve over time.",
  },
];

const stack = [
  "Python",
  "Azure",
  "MLflow",
  "Apache Kafka",
  "Terraform",
  "FastAPI",
  "PostgreSQL",
  "Grafana",
  "Prometheus",
  "Docker",
  "Kubernetes",
  "Ray",
  "Pandas",
  "PyTorch",
  "Redis",
  "dbt",
  "Databricks",
  "Scikit-learn",
];

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="py-24">
        <Container>
          <div className="max-w-[80%]">
            <div className="space-y-8">
              <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.96] tracking-tight text-foreground/90">
                Engineer.
                <br />
                Builder.
                <br />
                <span className="text-foreground/30">Systems thinker.</span>
              </h1>
              <div className="space-y-4">
                <p className="text-lg text-foreground/70 leading-relaxed">
                  I build reliable machine learning systems with a focus on
                  infrastructure, observability, and long-term maintainability.
                  My work lives at the intersection of backend engineering and
                  applied ML.
                </p>
                <p className="text-base text-foreground/60 leading-relaxed">
                  I care deeply about systems that are safe to evolve —
                  platforms where you can ship confidently, monitor honestly,
                  and iterate without fear.
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <a
                  href="/contact"
                  className="px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/80 transition"
                >
                  Contact Me →
                </a>
                <a
                  href="/projects"
                  className="px-5 py-2.5 rounded-full border border-black/20 text-foreground/70 hover:border-black/40 transition"
                >
                  View Work →
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS */}
      <section className="py-16 bg-black/5">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.value} className="space-y-1">
                <p className="font-display text-5xl text-foreground/90">
                  {stat.value}
                </p>
                <p className="text-sm text-foreground/50 leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* STORY */}
      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-start">
            <div className="space-y-4 lg:sticky lg:top-28">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                Background
              </p>
              <h2 className="font-display text-4xl text-foreground/90 leading-tight">
                My Story
              </h2>
              <p className="text-base text-foreground/60 leading-relaxed">
                The transitions that shaped how I build systems today — from
                writing features to architecting platforms.
              </p>
            </div>

            <div className="space-y-0">
              {story.map((item, i) => (
                <div key={item.title} className="flex gap-6 pb-10 relative">
                  {/* timeline line */}
                  {i < story.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-0 w-px bg-black/10" />
                  )}
                  {/* dot */}
                  <div className="shrink-0 mt-1 w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-foreground/20 block" />
                  </div>
                  <div className="space-y-1 pt-2">
                    <p className="font-mono text-xs uppercase tracking-wide text-foreground/40">
                      {item.year}
                    </p>
                    <h3 className="text-xl font-semibold text-foreground/90">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* STACK */}
      <section className="py-16 bg-black/5">
        <Container>
          <div className="space-y-3 mb-10">
            <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
              Tools & Technologies
            </p>
            <h2 className="font-display text-4xl text-foreground/90">
              What I work with
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full border border-black/10 bg-white text-sm text-foreground/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24">
        <Container>
          <div className="max-w-2xl space-y-6">
            <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
              Let's talk
            </p>
            <h2 className="font-display text-5xl text-foreground/90 leading-tight">
              Ready to build something real?
            </h2>
            <p className="text-lg text-foreground/60 leading-relaxed">
              Whether it's an ML platform, a data pipeline, or a system that
              needs to actually work in production — I'm open to interesting
              problems.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
            >
              Get in touch →
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
