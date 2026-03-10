import { motion } from "framer-motion";
import Container from "../../components/layout/Container";
import { fadeUp } from "../../lib/motion";

const contactLinks = [
  {
    label: "Email",
    value: "urinrin@urinrin.com",
    href: "mailto:urinrin@urinrin.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/urinrin-ogidiama",
    href: "https://www.linkedin.com/in/urinrin-ogidiama-9544b76a/",
  },
  {
    label: "GitHub",
    value: "github.com/UrinrinO",
    href: "https://github.com/UrinrinO",
  },
];

export default function Contact() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid lg:grid-cols-[2fr_3fr] gap-8 lg:gap-16 items-start">

          {/* LEFT — info */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="space-y-10 lg:sticky lg:top-28"
          >
            <div className="space-y-5">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/50">
                Contact
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground/90 leading-tight">
                Let's build something reliable.
              </h1>
              <p className="text-base text-foreground/60 leading-relaxed">
                Have an AI problem to solve, a system to architect, or a
                platform to scale? Tell me what you're building.
              </p>
            </div>

            {/* availability badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-sm text-foreground/70">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Available for new projects
            </div>

            {/* contact links */}
            <div className="space-y-6">
              {contactLinks.map((link) => (
                <div key={link.label} className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-wide text-foreground/40">
                    {link.label}
                  </p>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-foreground/80 hover:text-foreground transition"
                  >
                    {link.value}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            custom={1}
            className="bg-foreground rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-1">
              <h2 className="font-semibold text-white/90">
                Send a message
              </h2>
              <p className="text-sm text-white/50">
                I'll get back to you within a couple of days.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wide text-white/40">
                  Name
                </label>
                <input
                  placeholder="Your name"
                  className="w-full border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition bg-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wide text-white/40">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition bg-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wide text-white/40">
                  Message
                </label>
                <textarea
                  placeholder="Tell me about your project or challenge..."
                  className="w-full border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition min-h-[140px] sm:min-h-[180px] resize-none bg-transparent"
                />
              </div>
            </div>

            <button className="relative overflow-hidden w-full px-5 py-3 rounded-full bg-white text-foreground text-sm group">
              <span className="absolute inset-0 rounded-full bg-black/[0.06] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
              <span className="relative z-10">Send Message →</span>
            </button>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
