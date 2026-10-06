"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Chapter, Settings } from "@/types/portfolio";

interface Props {
  name: string;
  chapters: Chapter[];
  mobileNav: Settings["mobileNav"];
  resumeUrl: string;
}

/** Desktop: slim top bar that appears after the opening. Mobile: thumb-reach bottom bar for the five things recruiters want. */
export function Navigation({ name, chapters, mobileNav, resumeUrl }: Props) {
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState<string[]>([]);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 0.6));

  const watched = useMemo(
    () => Array.from(new Set([...chapters.map((c) => c.id), ...mobileNav.map((m) => m.target), "contact"])).filter((id) => id !== "resume"),
    [chapters, mobileNav],
  );

  useEffect(() => {
    const live = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? live.add(e.target.id) : live.delete(e.target.id)));
        setInView(watched.filter((id) => live.has(id)));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    watched.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [watched]);

  const activeAny = inView[inView.length - 1];
  const activeChapter = [...inView].reverse().find((id) => chapters.some((c) => c.id === id));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 hidden border-b border-rule bg-paper/90 backdrop-blur transition-[transform,visibility] duration-300 md:block ${
          visible ? "translate-y-0" : "invisible -translate-y-full"
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-14 max-w-page items-center justify-between px-8">
          <a href="#top" className="font-display text-lg font-bold">
            {name}
          </a>
          <ol className="m-0 flex list-none items-center gap-1 p-0">
            {chapters.map((c) => {
              const active = activeChapter === c.id;
              return (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    aria-current={active ? "location" : undefined}
                    className={`flex min-h-11 items-center gap-2 rounded-md px-3 transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
                  >
                    <span className={`font-data text-sm ${active ? "text-signal-deep" : ""}`}>{c.number}</span>
                    <span className="hidden font-medium lg:inline">{c.question}</span>
                  </a>
                </li>
              );
            })}
          </ol>
          <div className="flex items-center gap-2">
            <a href="#contact" className="inline-flex min-h-11 items-center rounded-md px-3 font-medium text-muted hover:text-ink">
              Contact
            </a>
            <a href={resumeUrl} className="inline-flex min-h-11 items-center rounded-lg bg-ink px-4 font-medium text-paper hover:bg-blue">
              Resume
            </a>
          </div>
        </nav>
      </header>

      <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="m-0 grid list-none grid-cols-5 p-0">
          {mobileNav.map((item) => {
            const isResume = item.target === "resume";
            const active = !isResume && activeAny === item.target;
            return (
              <li key={item.label}>
                <a
                  href={isResume ? resumeUrl : `#${item.target}`}
                  aria-current={active ? "location" : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium ${active ? "text-signal-deep" : "text-muted"}`}
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
