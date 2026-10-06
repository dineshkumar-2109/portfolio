import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface Props {
  href: string;
  label: string;
  icon?: string;
  variant?: "solid" | "outline" | "onDark";
  children?: ReactNode;
}

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors focus-visible:outline-offset-4";
const variants = {
  solid: "bg-ink text-paper hover:bg-blue",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  onDark: "border border-white/25 text-white hover:border-signal hover:bg-signal hover:text-night",
} as const;

/** External/internal link styled as a button. An empty href renders a clearly disabled placeholder. */
export function ButtonLink({ href, label, icon, variant = "outline" }: Props) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${base} cursor-not-allowed border border-dashed border-current opacity-60`}
        title="Link coming soon"
      >
        {icon && <Icon name={icon} />}
        {label}
        <span className="text-xs">(coming soon)</span>
      </span>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon && <Icon name={icon} />}
      {label}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
