import {
  AlertTriangle, ArrowDown, ArrowUpRight, Briefcase, Check, FileText, Github, Layers,
  Linkedin, Mail, MapPin, Network, Pause, Phone, Play, RotateCcw, SkipBack, SkipForward, Zap,
  type LucideIcon,
} from "lucide-react";

/** Only icons referenced from portfolio.json (or by UI controls) are bundled. */
const ICONS = {
  alert: AlertTriangle,
  arrowDown: ArrowDown,
  arrowUpRight: ArrowUpRight,
  briefcase: Briefcase,
  check: Check,
  file: FileText,
  github: Github,
  layers: Layers,
  linkedin: Linkedin,
  mail: Mail,
  pin: MapPin,
  network: Network,
  pause: Pause,
  phone: Phone,
  play: Play,
  reset: RotateCcw,
  back: SkipBack,
  forward: SkipForward,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className, size = 18 }: { name: string; className?: string; size?: number }) {
  const Cmp = (ICONS as Record<string, LucideIcon>)[name] ?? Layers;
  return <Cmp aria-hidden="true" focusable="false" className={className} size={size} strokeWidth={1.75} />;
}
