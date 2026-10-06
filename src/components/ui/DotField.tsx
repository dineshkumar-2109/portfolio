"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

/** A field of dots that fills left to right once visible. One animated element, so it stays cheap. */
export function DotField({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const dots = (color: string) => ({
    backgroundImage: `radial-gradient(circle, ${color} 2.2px, transparent 2.7px)`,
    backgroundSize: "14px 14px",
  });
  return (
    <div aria-hidden="true" className={`relative h-28 w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={dots("rgba(241,242,238,0.18)")} />
      <motion.div
        className="absolute inset-y-0 left-0 w-full"
        style={dots("#F2561D")}
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.8, ease: EASE }}
      />
    </div>
  );
}
