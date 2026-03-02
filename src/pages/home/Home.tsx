import Container from "../../components/layout/Container";
import Button from "../../components/ui/Button";

import { motion } from "framer-motion";
import { fadeUp, fade } from "../../lib/motion";

import portrait from "../../assets/images/portrait.png";

const homeWorks = [
  {
    tag: "Case Study",
    title: "Real-Time Risk Scoring Platform",
    desc: "Streaming ingestion, online features, low-latency serving, drift monitoring.",
    stack: "Azure • Event Hubs • CI/CD",
    img: "https://picsum.photos/seed/mlrisk/800/600",
  },
  {
    tag: "System Design",
    title: "Feature Store: Online vs Offline",
    desc: "Designing for consistency, latency, and leakage prevention.",
    stack: "Stores • Schema • Governance",
    img: "https://picsum.photos/seed/featurestore/800/600",
  },
  {
    tag: "Engineering",
    title: "ML Observability Dashboard",
    desc: "End-to-end monitoring for drift, latency, and feature health.",
    stack: "Grafana • Prometheus • Python",
    img: "https://picsum.photos/seed/mlops/800/600",
  },
];

const sectionReveal = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Home() {
  return (
    <>
      {/* HERO — cream background (default) */}
      <section className="overflow-hidden">
        <Container>
          {/* Mobile: stacked portrait → text */}
          <div className="md:hidden flex flex-col items-center gap-8 py-16 text-center">
            <motion.div initial="hidden" animate="show" variants={fade} custom={1}>
              <img
                src={portrait}
                alt="Portrait of Uri"
                className="w-48 h-auto object-contain mx-auto"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="space-y-8"
            >
              <h1 className="font-display font-[600] text-[clamp(2rem,8vw,3.5rem)] leading-[1.0] tracking-tight">
                Building at the{" "}
                <span className="text-black/40">intersection</span> of systems &
                intelligence.
              </h1>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button>View ML Platform Architecture →</Button>
                <Button variant="secondary">Read Engineering Notes →</Button>
              </div>
            </motion.div>
          </div>

          {/* Desktop: overlapping absolute layout */}
          <div className="hidden md:block relative h-[calc(100vh-80px)]">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fade}
              custom={1}
              className="absolute right-0 bottom-0 w-[44%] z-10"
            >
              <img
                src={portrait}
                alt="Portrait of Uri"
                className="w-full h-auto object-contain"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="relative z-20 w-[68%] h-full flex flex-col justify-end pb-24 space-y-10"
            >
              <h1 className="font-display font-[600] text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.98] tracking-tight">
                Building at the{" "}
                <span className="text-black/40">intersection</span> of systems &
                intelligence.
              </h1>

              <div className="flex flex-wrap gap-4">
                <Button>View ML Platform Architecture →</Button>
                <Button variant="secondary">Read Engineering Notes →</Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ABOUT — warm intermediate between hero and selected works */}
      <section className="py-24 bg-[#eeede9] border-t border-black/5">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: image — above text on mobile, left on desktop; grayscale until hover */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fade}
              custom={1}
              className="rounded-3xl overflow-hidden aspect-[3/4] group order-last md:order-first"
            >
              <img
                src="https://picsum.photos/seed/about-portrait/600/800"
                alt="About Uri"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>

            {/* Right: text — above image on mobile, right on desktop */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="space-y-6 order-first md:order-last"
            >
              <p className="font-mono text-xs tracking-widest uppercase text-accent">
                About me
              </p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] tracking-tight text-foreground/90">
                Engineer.
                <br />
                Builder.
                <br />
                <span className="text-foreground/30">Systems thinker.</span>
              </h2>
              <div className="space-y-4 max-w-md">
                <p className="text-base text-foreground/70 leading-relaxed">
                  I build reliable machine learning systems with a focus on
                  infrastructure, observability, and long-term maintainability.
                </p>
                <p className="text-base text-foreground/60 leading-relaxed">
                  My work blends backend engineering with applied ML to ship
                  scalable, production-safe platforms.
                </p>
              </div>
              <a
                href="/about"
                className="inline-block px-6 py-3 rounded-full bg-foreground text-background text-sm hover:bg-foreground/80 transition"
              >
                Read more →
              </a>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* SELECTED WORKS — light gray background */}
      <section className="py-16 bg-black/5 border-t border-black/5">
        <Container>
          {/* Header: title left, description right, baseline-aligned */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="grid md:grid-cols-2 gap-10 items-end">
              {/* Left: eyebrow + heading */}
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  Intentional. Observable. Built to Last.
                </p>
                <h3 className="font-display text-4xl md:text-5xl text-foreground/90">
                  Selected Work
                </h3>
              </div>
              {/* Right: description, baseline-aligned with heading */}
              <p className="text-base text-foreground/60 leading-relaxed max-w-sm">
                Production systems at the intersection of engineering rigour
                and applied ML — built to be observable, scalable, and safe to
                evolve.
              </p>
            </div>
          </motion.div>

          {/* Bento grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionReveal}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            {/* Top-left: wide image card */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-3 relative rounded-2xl overflow-hidden h-64 md:h-[360px] group"
            >
              <img
                src={homeWorks[0].img}
                alt={homeWorks[0].title}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-mono text-xs uppercase tracking-wider text-white/50">
                  {homeWorks[0].tag}
                </p>
                <div className="w-8 h-px bg-white/50 my-2.5" />
                <h4 className="font-display text-2xl leading-tight">
                  {homeWorks[0].title}
                </h4>
                <p className="text-sm mt-1.5 text-white/70 leading-relaxed">
                  {homeWorks[0].desc}
                </p>
              </div>
            </motion.div>

            {/* Top-right: tint card (page cream against section gray) */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 rounded-2xl bg-background p-8 flex flex-col justify-end h-64 md:h-[360px]"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/40">
                {homeWorks[1].tag}
              </p>
              <div className="w-8 h-px bg-foreground/20 my-2.5" />
              <h4 className="font-display text-2xl leading-tight text-foreground/90">
                {homeWorks[1].title}
              </h4>
              <p className="text-sm mt-2 text-foreground/60 leading-relaxed">
                {homeWorks[1].desc}
              </p>
            </motion.div>

            {/* Bottom-left: shade card (warm dark brown) */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 rounded-2xl bg-stone-600 p-8 flex flex-col justify-end h-64 md:h-[360px]"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-white/50">
                {homeWorks[2].tag}
              </p>
              <div className="w-8 h-px bg-white/30 my-2.5" />
              <h4 className="font-display text-2xl leading-tight text-white">
                {homeWorks[2].title}
              </h4>
              <p className="text-sm mt-2 text-white/65 leading-relaxed">
                {homeWorks[2].desc}
              </p>
            </motion.div>

            {/* Bottom-right: wide image CTA card */}
            <motion.div
              variants={fadeUp}
              className="md:col-span-3 relative rounded-2xl overflow-hidden h-64 md:h-[360px] cursor-pointer group"
            >
              <img
                src="https://picsum.photos/seed/workcta/800/600"
                alt="View all projects"
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-8 h-px bg-white/50 mb-2.5" />
                <h4 className="font-display text-2xl leading-tight">
                  View All Projects
                </h4>
                <p className="text-sm mt-1.5 text-white/70">
                  Explore the full portfolio →
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile: "View All" link */}
          <div className="mt-6 flex md:hidden">
            <a
              href="/projects"
              className="text-sm text-foreground/70 hover:text-foreground transition"
            >
              View All →
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
