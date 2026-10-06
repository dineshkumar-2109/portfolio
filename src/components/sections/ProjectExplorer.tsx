"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fadeIn } from "@/lib/motion";
import type { Project } from "@/types/portfolio";
import { ProjectViewer } from "./ProjectViewer";

/** Picker plus viewer. Adding an object to `projects` in portfolio.json adds a button here. */
export function ProjectExplorer({ projects, showUnconfirmed }: { projects: Project[]; showUnconfirmed: boolean }) {
  const [activeId, setActiveId] = useState(projects[0]?.id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  if (!active) return null;

  return (
    <div>
      {projects.length > 1 && (
        <div role="group" aria-label="Choose a project" className="mb-10 grid gap-3 sm:grid-cols-2">
          {projects.map((p) => {
            const on = p.id === active.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => setActiveId(p.id)}
                className={`min-h-16 rounded-xl border-2 p-4 text-left transition-colors ${
                  on ? "border-ink bg-ink text-paper" : "border-rule bg-panel hover:border-ink"
                }`}
              >
                <span className="block font-display text-xl font-bold">{p.title}</span>
                <span className={`block ${on ? "text-paper/75" : "text-muted"}`}>{p.subtitle}</span>
              </button>
            );
          })}
        </div>
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={active.id} {...fadeIn}>
          <ProjectViewer project={active} showUnconfirmed={showUnconfirmed} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
