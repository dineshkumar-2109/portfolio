import type { ReactNode } from "react";

export function Tag({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" | "signal" }) {
  const tones = {
    light: "border-rule bg-panel text-ink",
    dark: "border-night-rule bg-night-2 text-white/85",
    signal: "border-signal/40 bg-signal/10 text-signal-deep",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm leading-none ${tones[tone]}`}>
      {children}
    </span>
  );
}
