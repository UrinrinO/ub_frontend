import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, fade } from "../../lib/motion";
import Container from "../../components/layout/Container";
import {
  RiBrainLine,
  RiCodeLine,
  RiCloudLine,
  RiBarChartLine,
} from "@remixicon/react";

const story = [
  {
    num: "01",
    year: "2016",
    title: "Software Engineering Beginnings",
    body: "Built production systems from day one — MEAN and MERN stack applications, Django REST APIs, and payment gateway integrations serving live clients. Learned early that decisions made at the start determine how far a system can go.",
    tags: ["React", "Node.js", "Django", "MongoDB", "REST APIs"],
  },
  {
    num: "02",
    year: "2018 – 2023",
    title: "From Developer to Engineering Lead",
    body: "Grew into leadership — heading front-end teams, owning database architecture, and designing DevOps pipelines across complex multi-stakeholder projects. Shifted from writing code to shaping how teams build systems that last.",
    tags: ["Team Lead", "DevOps", "CI/CD", "SQL Server", "Architecture"],
  },
  {
    num: "03",
    year: "2024",
    title: "MSc in Artificial Intelligence",
    body: "Completed my master's at the University of South Wales, specialising in machine learning and computer vision. Delivered a CV-based car park management system and a pulse waveform disease classifier. Awarded Best Industrial Project.",
    tags: ["TensorFlow", "Computer Vision", "Scikit-Learn", "Research", "Award"],
  },
  {
    num: "04",
    year: "Now",
    title: "AI & LLM Engineering",
    body: "Building enterprise-grade AI systems — Generative AI backends with LangChain, end-to-end MLOps pipelines on Azure, and production LLM platforms designed to scale. The full arc from software to AI, applied to real problems.",
    tags: ["LangChain", "Azure", "MLflow", "LLMs", "MLOps"],
  },
];

function StoryRow({ item, isLast }: { item: typeof story[0]; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <div ref={ref} className={`border-t border-black/10 py-12${isLast ? " border-b" : ""}`}>
      {/* flex row: number | orange vertical line | content */}
      <div className="flex gap-6 md:gap-10">
        {/* Large number */}
        <motion.span
          className="font-display text-5xl md:text-7xl leading-none text-foreground/10 select-none w-14 md:w-20 shrink-0 pt-1"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {item.num}
        </motion.span>

        {/* Orange vertical line — stretches to full row height */}
        <div className="relative w-[2px] shrink-0 overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-black/6" />
          <motion.div
            className="absolute inset-0 bg-foreground"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ transformOrigin: "top" }}
          />
        </div>

        {/* Content */}
        <motion.div
          className="flex-1 space-y-4 pl-2 md:pl-4"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
            {item.year}
          </p>
          <h3 className="font-display text-2xl md:text-[1.75rem] text-foreground/90 leading-snug">
            {item.title}
          </h3>
          <p className="text-base text-foreground/60 leading-relaxed">{item.body}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2.5 py-1 border border-black/10 text-foreground/40 tracking-wide"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const expertise = [
  {
    abbr: "AI",
    icon: RiBrainLine,
    title: "AI & LLM Engineering",
    desc: "Building enterprise LLM solutions with LangChain and Generative AI — from intelligent backends and model lifecycle management to production-ready MLOps pipelines on Azure.",
  },
  {
    abbr: "FS",
    icon: RiCodeLine,
    title: "Full-Stack Development",
    desc: "MERN and MEAN stack applications, Django REST APIs, and React or Next.js frontends — architected for scale, maintainability, and long-term production use.",
  },
  {
    abbr: "CD",
    icon: RiCloudLine,
    title: "Cloud & DevOps",
    desc: "Azure infrastructure, Docker and Kubernetes orchestration, CI/CD pipelines via GitHub Actions, and YAML-based delivery workflows across development and production.",
  },
  {
    abbr: "ML",
    icon: RiBarChartLine,
    title: "ML & Data Engineering",
    desc: "TensorFlow, Scikit-Learn, and MLflow — from model training and DVC versioning to Power BI dashboards and predictive analytics integrations for live data systems.",
  },
];

function InteractiveCapabilities() {
  const [active, setActive] = useState(0);
  const ActiveIcon = expertise[active].icon;

  return (
    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left: two explicit flex columns — right col offset down so Real-time starts lower */}
      {/* On mobile: grid-cols-2 for clean 2×2; on md+: flex with stagger offset */}
      <div className="grid grid-cols-2 gap-3 md:flex md:gap-3">
        {/* Left column: indices 0, 2 */}
        <div className="flex flex-col gap-3 md:flex-1">
          {[0, 2].map((i) => {
            const item = expertise[i];
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => setActive(i)}
                className={`rounded-2xl p-6 text-left space-y-4 transition-colors duration-300 ${
                  active === i
                    ? "bg-white"
                    : "bg-white/10 border border-white/10 hover:bg-white/15"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active === i ? "bg-foreground/5" : "bg-white/15"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active === i ? "text-foreground/50" : "text-white/50"}
                  />
                </div>
                <div className="space-y-1.5">
                  <h3
                    className={`font-semibold leading-snug ${
                      active === i ? "text-foreground" : "text-white/90"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      active === i ? "text-foreground/60" : "text-white/60"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {/* Right column: indices 1, 3 — pushed down so Real-time starts lower */}
        <div className="flex flex-col gap-3 md:flex-1 md:mt-8">
          {[1, 3].map((i) => {
            const item = expertise[i];
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => setActive(i)}
                className={`rounded-2xl p-6 text-left space-y-4 transition-colors duration-300 ${
                  active === i
                    ? "bg-white"
                    : "bg-white/10 border border-white/10 hover:bg-white/15"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active === i ? "bg-foreground/5" : "bg-white/15"
                  }`}
                >
                  <Icon
                    size={18}
                    className={active === i ? "text-foreground/50" : "text-white/50"}
                  />
                </div>
                <div className="space-y-1.5">
                  <h3
                    className={`font-semibold leading-snug ${
                      active === i ? "text-foreground" : "text-white/90"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      active === i ? "text-foreground/60" : "text-white/60"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: icon + dynamic title + dynamic description + CTA */}
      <div className="space-y-6">
        <ActiveIcon size={36} className="text-white/50" />
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-white/90 leading-tight">
          {expertise[active].title}
        </h2>
        <p className="text-base text-white/60 leading-relaxed">
          {expertise[active].desc}
        </p>
        <a
          href="/contact"
          className="relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-white text-foreground text-sm group"
        >
          <span className="absolute inset-0 rounded-full bg-black/[0.06] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
          <span className="relative z-10">Get in touch →</span>
        </a>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="py-24">
        <Container>
          <div className="max-w-full md:max-w-[80%]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="space-y-8"
            >
              <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.96] tracking-tight text-foreground/90">
                Engineer.
                <br />
                Builder.
                <br />
                <span className="text-foreground/30">Systems thinker.</span>
              </h1>
              <div className="space-y-4">
                <p className="text-lg text-foreground/70 leading-relaxed">
                  I build intelligent, full-stack software systems — with 9
                  years of experience across AI engineering, backend
                  architecture, cloud DevOps, and applied machine learning.
                </p>
                <p className="text-base text-foreground/60 leading-relaxed">
                  From Generative AI and LLMs to scalable web platforms, I
                  care about systems that work reliably in production — built
                  with the right foundations from the start.
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <a
                  href="/contact"
                  className="relative overflow-hidden inline-flex items-center px-5 py-2.5 rounded-full bg-foreground text-background group"
                >
                  <span className="absolute inset-0 rounded-full bg-white/[0.12] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
                  <span className="relative z-10">Contact Me →</span>
                </a>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* INTERACTIVE CAPABILITIES */}
      <section className="py-24 bg-foreground">
        <Container>
          <InteractiveCapabilities />
        </Container>
      </section>

      {/* MY BACKGROUND / STORY */}
      <section className="py-24">
        <Container>
          <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-20">
            {/* Left: sticky heading */}
            <div className="mb-14 lg:mb-0">
              <div className="lg:sticky lg:top-28">
                <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-3">
                  Background
                </p>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-foreground/90 leading-tight">
                  My Story
                </h2>
                <p className="mt-5 text-sm text-foreground/50 leading-relaxed max-w-xs">
                  Not every engineer grows — some just accumulate years. Every chapter here was earned with intention, each skill compounded on the last in deliberate pursuit of craft and impact.
                </p>
              </div>
            </div>

            {/* Right: scrollable story items */}
            <div>
              {story.map((item, i) => (
                <StoryRow key={item.num} item={item} isLast={i === story.length - 1} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* KEY EXPERTISE OVERVIEW */}
      <section className="py-24 bg-black/5 border-t border-black/5">
        <Container>
          <div className="text-center mb-16 space-y-4">
            <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
              Depth
            </p>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-foreground/90 leading-tight">
              Key expertise overview
            </h2>
            <p className="text-base text-foreground/60 max-w-md mx-auto leading-relaxed">
              From AI engineering to cloud infrastructure — end-to-end
              ownership of intelligent, production-ready systems.
            </p>
          </div>

          {/* Row 1: image left, text right */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 md:mb-24">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fade}
              className="rounded-3xl overflow-hidden aspect-[4/3] group"
            >
              <img
                src="https://picsum.photos/seed/expertise1/800/600"
                alt="ML Systems"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="space-y-6"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                AI & Full-Stack
              </p>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-foreground/90 leading-tight">
                AI & Full-Stack Engineering
              </h3>
              <p className="text-base text-foreground/60 leading-relaxed">
                I build enterprise LLM solutions and full-stack platforms —
                from Generative AI backends and intelligent APIs to React and
                Next.js frontends wired to production-grade data pipelines.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li className="flex gap-2">
                  <span className="text-foreground/30">—</span>
                  LLM backends with LangChain and custom persona design
                </li>
                <li className="flex gap-2">
                  <span className="text-foreground/30">—</span>
                  MERN/MEAN stack and Django REST APIs at scale
                </li>
                <li className="flex gap-2">
                  <span className="text-foreground/30">—</span>
                  MLOps pipelines with MLflow, DVC, and TensorFlow on Azure
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Row 2: text left, image right */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="space-y-6 order-last md:order-first"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                Cloud & DevOps
              </p>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-foreground/90 leading-tight">
                Cloud, DevOps & Data
              </h3>
              <p className="text-base text-foreground/60 leading-relaxed">
                I bring platform engineering rigour to every deployment —
                container-native, automated, and built with observability
                in mind from day one.
              </p>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li className="flex gap-2">
                  <span className="text-foreground/30">—</span>
                  Azure infrastructure with Docker and Kubernetes orchestration
                </li>
                <li className="flex gap-2">
                  <span className="text-foreground/30">—</span>
                  CI/CD pipelines via GitHub Actions and Azure DevOps YAML
                </li>
                <li className="flex gap-2">
                  <span className="text-foreground/30">—</span>
                  Power BI and SQL Server integrations for data-driven systems
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fade}
              className="rounded-3xl overflow-hidden aspect-[4/3] order-first md:order-last group"
            >
              <img
                src="https://picsum.photos/seed/expertise2/800/600"
                alt="Infrastructure"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
