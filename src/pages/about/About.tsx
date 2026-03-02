import { useState } from "react";
import Container from "../../components/layout/Container";
import {
  RiBrainLine,
  RiCodeLine,
  RiCloudLine,
  RiBarChartLine,
} from "@remixicon/react";

const story = [
  {
    year: "2016",
    title: "Software Engineering Beginnings",
    body: "Started my software journey building full-stack web applications — MEAN/MERN stack projects, RESTful APIs, Django backends, and payment gateway integrations serving real clients.",
  },
  {
    year: "2018–2023",
    title: "From Developer to Lead",
    body: "Grew into lead roles heading front-end teams, architecting DevOps pipelines, designing scalable database schemas, and delivering production systems across multiple sectors.",
  },
  {
    year: "2024",
    title: "MSc in Artificial Intelligence",
    body: "Completed my master's degree at the University of South Wales. Built a computer vision car parking system and a pulse waveform-based disease classifier — winning the Best Industrial Project Award.",
  },
  {
    year: "Today",
    title: "AI & LLM Engineering",
    body: "Leading enterprise AI and LLM solution development — from Generative AI backends and MLOps pipelines on Azure to full-stack platforms built for long-term production use.",
  },
];

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
                  <span
                    className={`font-mono text-xs font-semibold ${
                      active === i ? "text-foreground/50" : "text-white/50"
                    }`}
                  >
                    {item.abbr}
                  </span>
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
                  <span
                    className={`font-mono text-xs font-semibold ${
                      active === i ? "text-foreground/50" : "text-white/50"
                    }`}
                  >
                    {item.abbr}
                  </span>
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
          className="inline-block px-6 py-3 rounded-full bg-white text-foreground text-sm hover:bg-white/90 transition"
        >
          Get in touch →
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

      {/* INTERACTIVE CAPABILITIES */}
      <section className="py-24 bg-foreground">
        <Container>
          <InteractiveCapabilities />
        </Container>
      </section>

      {/* MY BACKGROUND / STORY */}
      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-start">
            <div className="space-y-4 lg:sticky lg:top-28">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                Background
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground/90 leading-tight">
                My Story
              </h2>
              <p className="text-base text-foreground/60 leading-relaxed">
                The transitions that shaped how I build systems today — from
                full-stack development to AI engineering and team leadership.
              </p>
            </div>

            <div className="space-y-0">
              {story.map((item, i) => (
                <div key={item.title} className="flex gap-6 pb-10 relative">
                  {i < story.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-0 w-px bg-black/10" />
                  )}
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
            <div className="rounded-3xl overflow-hidden aspect-[4/3] group">
              <img
                src="https://picsum.photos/seed/expertise1/800/600"
                alt="ML Systems"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="space-y-6">
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
            </div>
          </div>

          {/* Row 2: text left, image right */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 order-last md:order-first">
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
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/3] order-first md:order-last group">
              <img
                src="https://picsum.photos/seed/expertise2/800/600"
                alt="Infrastructure"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
