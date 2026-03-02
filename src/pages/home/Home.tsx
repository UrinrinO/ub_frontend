import Container from "../../components/layout/Container";
import Button from "../../components/ui/Button";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, fade } from "../../lib/motion";

// Images
import portrait from "../../assets/images/portrait.png";
import { RiBlazeLine, RiStackLine, RiAddLine } from "@remixicon/react";

const rightPoints = [
  {
    icon: RiAddLine,
    title: "Infrastructure-first ML systems",
    body: "I design production ML platforms with deployment, monitoring, and safety controls—built for iteration, not demos.",
  },
  {
    icon: RiStackLine,
    title: "Systems thinking + applied ML",
    body: "My work blends backend architecture and applied ML to deliver reliable, observable systems in real environments.",
  },
  {
    icon: RiAddLine,
    title: "Software Engineering",
    body: "I design production ML platforms with deployment, monitoring, and safety controls—built for iteration, not demos.",
  },
] as const;

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
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  const [activeWork, setActiveWork] = useState(0);

  return (
    <>
      {/* HERO */}
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

      {/* ABOUT */}
      <motion.section
        className="py-24 bg-black/10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionReveal}
      >
        <Container>
          <motion.div
            variants={sectionReveal}
            className="grid lg:grid-cols-[5fr_3fr_3fr] gap-12 items-start"
          >
            <motion.div variants={fadeUp} className="space-y-6 max-w-xl">
              <p className="font-mono text-xs tracking-wide uppercase text-foreground/50">
                About
              </p>

              <h2 className="font-display text-4xl md:text-5xl text-foreground/90 leading-[1.05]">
                About Me
              </h2>

              <div className="space-y-4">
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  I build reliable machine learning systems with a focus on
                  infrastructure, observability, and long-term maintainability.
                </p>

                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  My work blends backend engineering with applied ML to ship
                  scalable, production-safe platforms.
                </p>
              </div>

              {/* decorative arrow */}
              <svg
                className="w-40 text-foreground/20 mt-2"
                viewBox="0 0 160 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 75 C 35 25, 115 85, 148 40"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M133 26 L150 40 L136 53"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 border border-black/5 space-y-6 max-w-md mx-auto"
            >
              <div className="w-[72px] h-[72px] rounded-full bg-black/5 flex items-center justify-center">
                <RiBlazeLine size={48} className="text-foreground/80" />
              </div>
              <p className="font-display text-7xl leading-none tracking-tight text-foreground/90">120%</p>

              <p className="text-sm text-foreground/60">
                Average increase in system efficiency after deployment
                improvements.
              </p>

              <img
                src="https://picsum.photos/seed/portrait-card/400/300"
                alt="Profile"
                className="w-full rounded-xl object-cover"
              />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-8">
              {/* portrait thumbnail */}
              <div className="relative w-24 h-24">
                <img
                  src="https://picsum.photos/seed/portrait-thumb/200/200"
                  alt="Uri"
                  className="w-full h-full rounded-2xl object-cover object-center"
                />
                <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                  ↗
                </span>
              </div>

              {rightPoints.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-foreground/80" />
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-foreground/90">{title}</p>
                    <p className="text-sm leading-relaxed text-foreground/70">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </motion.section>

      {/* SELECTED WORKS */}
      <motion.section
        className="py-16 bg-black/5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionReveal}
      >
        <Container>
          <motion.div
            variants={fadeUp}
            className="flex items-end justify-between gap-6 mb-10"
          >
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                Portfolio
              </p>
              <h3 className="font-display text-4xl text-foreground/90">
                Selected Works
              </h3>
            </div>
            <a
              href="/projects"
              className="text-sm text-foreground/70 hover:text-foreground transition"
            >
              View All →
            </a>
          </motion.div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden space-y-4">
            {homeWorks.map((work, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl h-52">
                <img
                  src={work.img}
                  alt={work.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-white/60">
                    {work.tag}
                  </p>
                  <h4 className="font-display text-xl mt-1 leading-tight">
                    {work.title}
                  </h4>
                  <p className="text-sm mt-1.5 text-white/70 leading-relaxed">
                    {work.desc}
                  </p>
                  <p className="font-mono text-xs mt-2 text-white/40">
                    {work.stack}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: accordion flex */}
          <motion.div variants={fadeUp} className="hidden md:flex gap-3 h-[460px]">
            {homeWorks.map((work, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  flex: activeWork === i ? 3 : 1,
                  transition: "flex 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={() => setActiveWork(i)}
              >
                <img
                  src={work.img}
                  alt={work.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-white/60">
                    {work.tag}
                  </p>
                  <h4
                    className="font-display text-2xl mt-1 leading-tight"
                    style={{
                      opacity: activeWork === i ? 1 : 0,
                      transform: activeWork === i ? "none" : "translateY(6px)",
                      transition: "opacity 0.35s ease, transform 0.35s ease",
                    }}
                  >
                    {work.title}
                  </h4>
                  <p
                    className="text-sm mt-2 text-white/70 leading-relaxed"
                    style={{
                      opacity: activeWork === i ? 1 : 0,
                      transition: "opacity 0.3s ease 0.05s",
                    }}
                  >
                    {work.desc}
                  </p>
                  <p
                    className="font-mono text-xs mt-3 text-white/40"
                    style={{
                      opacity: activeWork === i ? 1 : 0,
                      transition: "opacity 0.3s ease 0.1s",
                    }}
                  >
                    {work.stack}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </Container>
      </motion.section>
    </>
  );
}
