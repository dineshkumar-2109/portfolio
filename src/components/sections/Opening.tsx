"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { EASE } from "@/lib/motion";
import type { Personal } from "@/types/portfolio";

/** The one orchestrated moment: the name is assembled letter by letter, then the rest settles in. */
export function Opening({ personal, startId }: { personal: Personal; startId: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.15]);

  let letterIndex = 0;

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="paper-grid relative flex min-h-[100svh] flex-col overflow-hidden">
      <motion.div style={{ y, opacity }} className="mx-auto flex w-full max-w-page flex-1 flex-col justify-center px-5 py-16 md:px-8">
        <h1 aria-label={personal.shortName} className="font-display font-extrabold uppercase leading-[0.84] tracking-tighter text-[length:clamp(3.5rem,15vw,12rem)]">
          {personal.heroName.map((word) => (
            <span key={word} aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
              {word.split("").map((ch) => {
                const i = letterIndex++;
                return (
                  <motion.span
                    key={i}
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.06 }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Measuring line, like a dimension on a drawing */}
        <div className="mt-6 flex items-center gap-4" aria-hidden="true">
          <motion.span
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            className="h-px flex-1 origin-left bg-ink"
          />
          <span className="size-2 rotate-45 bg-signal" />
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
          className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <p className="font-display text-2xl font-bold md:text-4xl">{personal.title}</p>
            <p className="mt-4 max-w-md text-lg leading-snug text-muted md:text-xl">
              {personal.tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <a
            href={`#${startId}`}
            className="group inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-lg bg-signal px-6 py-3 font-display text-lg font-bold tracking-wide text-night transition-colors hover:bg-ink hover:text-paper md:self-end"
          >
            EXPLORE
            <Icon name="arrowDown" className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </motion.div>

        <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-muted" aria-label="Focus areas">
          {personal.focusAreas.map((area, i) => (
            <motion.li
              key={area}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.5 + i * 0.12 }}
              className="flex items-center gap-2"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-blue" />
              {area}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
