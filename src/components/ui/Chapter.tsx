"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/** One chapter of the story: big numeral, the question, then its content. */
export function Chapter({
  id,
  number,
  question,
  children,
}: {
  id: string;
  number: string;
  question: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 border-t border-rule py-12 md:py-20">
      <div className="mx-auto max-w-page px-5 md:px-8">
        <header className="mb-8 flex items-end gap-3 sm:gap-5 md:mb-10 md:gap-8">
          <span
            aria-hidden="true"
            className="font-display text-6xl font-extrabold leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_#121826] sm:text-7xl md:text-7xl"
          >
            {number}
          </span>
          <div className="overflow-hidden pb-1">
            <motion.h2
              id={`${id}-title`}
              initial={reduce ? false : { y: "105%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl"
            >
              {question}
            </motion.h2>
          </div>
        </header>
        <div className="space-y-12 md:space-y-16">{children}</div>
      </div>
    </section>
  );
}

export function SubSection({
  id,
  title,
  intro,
  children,
}: {
  id?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const hid = id ? `${id}-title` : undefined;
  return (
    <div id={id} aria-labelledby={hid} role={id ? "region" : undefined} className="scroll-mt-20">
      <h3 id={hid} className="font-display text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
        {title}
      </h3>
      {intro && <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>}
      <div className="mt-6 md:mt-8">{children}</div>
    </div>
  );
}
