import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Container({ children }: Props) {
  return (
    <div
      className="
        w-full
        mx-auto
        px-4 sm:px-6 lg:px-8
        max-w-[1200px]
        2xl:max-w-[1400px]
        3xl:max-w-[1600px]
        h-full
      "
    >
      {children}
    </div>
  );
}
