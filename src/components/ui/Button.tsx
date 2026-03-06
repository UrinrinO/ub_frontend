import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({ children, variant = "primary" }: Props) {
  const base = "px-6 py-3 rounded-full font-medium transition duration-200";

  const styles =
    variant === "primary"
      ? "bg-foreground text-white hover:opacity-90"
      : "border border-foreground hover:bg-white hover:text-black";

  return <button className={`${base} ${styles}`}>{children}</button>;
}
