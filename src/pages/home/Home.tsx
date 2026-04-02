import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";
import Button from "../../components/ui/Button";
import HeroAudio from "./HeroAudio";

import { motion } from "framer-motion";
import { fadeUp, fade } from "../../lib/motion";

import Uri from "../../assets/images/uri.jpg";
import Uri5 from "../../assets/images/Uri5.jpeg";

const homeWorks = [
  {
    tag: "Case Study",
    title: "AI-Powered Inventory Management System",
    desc: "Generative AI platform for predictive stock management in aviation — consuming Quantum, SQL Server, and Power BI data.",
    stack: "Python • Azure • Power BI • MERN",
    img: "https://picsum.photos/seed/mlrisk/800/600",
  },
  {
    tag: "Machine Learning",
    title: "Peripheral Arterial Disease Detector",
    desc: "ML API for early disease detection using synthetically generated pulse waveform signals.",
    stack: "Python • Scikit-Learn • TensorFlow",
    img: "https://picsum.photos/seed/featurestore/800/600",
  },
  {
    tag: "DevOps",
    title: "LLM Research Platform",
    desc: "Container-orchestrated CI/CD for large language model development and persona systems.",
    stack: "Docker • Kubernetes • Node.js • GitHub Actions",
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
      {/* HERO */}
      <section className="overflow-hidden">
        {/* ── Desktop ── */}
        <div className="hidden md:flex relative h-[calc(100vh-80px)]">
          <Container>
            <div className="flex h-full">
              {/* Left: text content */}
              <div className="flex flex-col justify-center gap-10 flex-1 pr-12">
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="space-y-8"
                >
                  <h1 className="font-display font-[600] text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.96] tracking-tight">
                    Building at the{" "}
                    <span className="text-foreground/30">intersection</span> of
                    systems & intelligence.
                  </h1>
                  <p className="text-base text-foreground/60 leading-relaxed max-w-sm">
                    I design and build AI-powered software systems — from LLM
                    backends to full-stack platforms, built for production.
                  </p>
                  <div className="flex flex-wrap items-center gap-8">
                    <Link to="/projects" className="relative overflow-hidden px-6 py-3 rounded-full font-medium bg-foreground text-white group inline-flex items-center">
                      <span className="absolute inset-0 rounded-full bg-white/[0.12] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
                      <span className="relative z-10">View Projects →</span>
                    </Link>
                    <span className="text-sm text-foreground/60">
                      or{" "}
                      <a
                        href="/contact"
                        className="text-foreground underline underline-offset-2 hover:opacity-70 transition"
                      >
                        Book A Call ↗
                      </a>
                    </span>
                  </div>
                </motion.div>

                {/* Trust / stack row */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fade}
                  custom={2}
                  className="flex items-center gap-8 pt-8 border-t border-black/10"
                >
                  {["Azure", "Node.js", "Python", "Docker", "LangChain"].map(
                    (t) => (
                      <span
                        key={t}
                        className="font-mono text-sm text-foreground/40 tracking-wide"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </motion.div>

                <HeroAudio playerId="yt-audio-desktop" />
              </div>

              {/* Right: portrait with margin from right and bottom */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={fade}
                custom={1}
                className="relative w-[40%] flex-shrink-0 pt-8 pb-14 pr-8"
              >
                {/* Portrait image — rounded, fills padded area */}
                <div className="relative h-full rounded-3xl overflow-hidden">
                  <img
                    src={Uri}
                    alt="Portrait of Uri"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Floating stat card — outside overflow-hidden, bottom-right */}
                <div className="absolute bottom-10 right-4 bg-white rounded-2xl shadow-xl p-5 w-44">
                  <p className="font-display text-4xl text-foreground">9+</p>
                  <p className="text-xs text-foreground/60 mt-1 leading-snug">
                    Years building
                    <br />
                    production systems
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>

        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fade}
            className="relative h-80 overflow-hidden"
          >
            <img
              src={Uri}
              alt="Portrait of Uri"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
          <div className="px-4 pt-10 pb-16 space-y-8 text-center">
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="font-display font-[600] text-[clamp(2.2rem,8vw,3.5rem)] leading-[1.0] tracking-tight"
            >
              Building at the{" "}
              <span className="text-foreground/30">intersection</span> of
              systems & intelligence.
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="text-base text-foreground/60 leading-relaxed"
            >
              I design and build AI-powered software systems — from LLM backends
              to full-stack platforms, built for production.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/projects" className="relative overflow-hidden px-6 py-3 rounded-full font-medium bg-foreground text-white group inline-flex items-center">
                <span className="absolute inset-0 rounded-full bg-white/[0.12] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
                <span className="relative z-10">View Projects →</span>
              </Link>
              <Button variant="secondary">Book A Call →</Button>
            </motion.div>
            <div className="flex justify-center">
              <HeroAudio playerId="yt-audio-mobile" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT — warm intermediate between hero and selected works */}
      <section className="py-24 bg-foreground border-t border-white/5">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: image — above text on mobile, left on desktop; grayscale until hover */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fade}
              custom={1}
              className="rounded-3xl overflow-hidden aspect-[3/4] group order-last md:order-first"
            >
              <img
                src={Uri5}
                alt="About Uri"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>

            {/* Right: text — above image on mobile, right on desktop */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="space-y-6 order-first md:order-last"
            >
              <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                About me
              </p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] tracking-tight text-white/90">
                Engineer.
                <br />
                Builder.
                <br />
                <span className="text-white/30">Systems thinker.</span>
              </h2>
              <div className="space-y-4 max-w-md">
                <p className="text-base text-white/70 leading-relaxed">
                  I build intelligent, full-stack software systems — with 9
                  years of experience across AI engineering, backend
                  architecture, and cloud DevOps.
                </p>
                <p className="text-base text-white/60 leading-relaxed">
                  My work spans Generative AI and LLMs to scalable web platforms
                  — engineering solutions that are reliable and built to evolve.
                </p>
              </div>
              <a
                href="/about"
                className="relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-white text-foreground text-sm group"
              >
                <span className="absolute inset-0 rounded-full bg-black/[0.06] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
                <span className="relative z-10">Read more →</span>
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
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="mb-12"
          >
            <div className="grid md:grid-cols-2 gap-10 items-end">
              {/* Left: eyebrow + heading */}
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-foreground/50">
                  Intentional. Observable. Built to Last.
                </p>
                <h3 className="font-display text-4xl md:text-5xl text-foreground/90">
                  Selected Work
                </h3>
              </div>
              {/* Right: description, baseline-aligned with heading */}
              <p className="text-base text-foreground/60 leading-relaxed max-w-sm">
                Production systems at the intersection of engineering rigour and
                applied ML — built to be observable, scalable, and safe to
                evolve.
              </p>
            </div>
          </motion.div>

          {/* Bento grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
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
              className="md:col-span-2 rounded-2xl bg-stone-400 p-8 flex flex-col justify-end h-64 md:h-[360px]"
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
              className="md:col-span-3 relative rounded-2xl overflow-hidden h-64 md:h-[360px] group"
            >
              <Link to="/projects" className="absolute inset-0 z-10" aria-label="View all projects" />
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
