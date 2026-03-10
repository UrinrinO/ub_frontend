import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({ children, variant = "primary" }: Props) {
  const base = "relative overflow-hidden px-6 py-3 rounded-full font-medium group";

  if (variant === "primary") {
    return (
      <button className={`${base} bg-foreground text-white`}>
        <span className="absolute inset-0 rounded-full bg-white/[0.12] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  return (
    <button className={`${base} border border-foreground text-foreground`}>
      <span className="absolute inset-0 rounded-full bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none" />
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">{children}</span>
    </button>
  );
}
