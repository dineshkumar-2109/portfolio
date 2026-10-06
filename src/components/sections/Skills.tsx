"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { expand } from "@/lib/motion";
import type { Skills as SkillsData } from "@/types/portfolio";

interface Props {
  skills: SkillsData;
  /** skill name -> project / company names that use it (computed on the server from portfolio.json) */
  usage: Record<string, string[]>;
}

/** Select a skill to light up what it connects to and where it has been used. No percentages, only relationships. */
export function Skills({ skills, usage }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const related = useMemo(() => {
    const map = new Map<string, Set<string>>();
    skills.relations.forEach(([a, b]) => {
      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());
      map.get(a)!.add(b);
      map.get(b)!.add(a);
    });
    return map;
  }, [skills.relations]);

  const connected = selected ? related.get(selected) ?? new Set<string>() : null;
  const usedIn = selected ? usage[selected] ?? [] : [];

  return (
    <div>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.categories.map((cat) => (
          <div key={cat.id} role="group" aria-label={cat.label}>
            <p className="mb-3 border-b-2 border-ink pb-2 font-display text-lg font-bold">{cat.label}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {cat.items.map((item) => {
                const isSel = selected === item;
                const isLinked = !!connected?.has(item);
                const dim = selected !== null && !isSel && !isLinked;
                return (
                  <li key={item}>
                    <button
                      type="button"
                      aria-pressed={isSel}
                      onClick={() => setSelected(isSel ? null : item)}
                      className={`min-h-11 rounded-lg border px-3 py-2 transition-all duration-200 ${
                        isSel
                          ? "border-signal bg-signal font-semibold text-night"
                          : isLinked
                            ? "border-blue bg-blue text-white"
                            : "border-rule bg-panel hover:border-ink"
                      } ${dim ? "opacity-35" : ""}`}
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div aria-live="polite" className="mt-8 min-h-[4.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div key={selected} {...expand} className="overflow-hidden">
              <div className="rounded-xl border border-rule bg-panel p-5">
                <p className="font-display text-lg font-bold">{selected}</p>
                <p className="mt-1 text-ink/85">
                  {connected && connected.size > 0 ? `Connects to ${Array.from(connected).join(", ")}.` : "No linked skills mapped yet."}
                  {usedIn.length > 0 && <> Used in {Array.from(new Set(usedIn)).join(" and ")}.</>}
                </p>
              </div>
            </motion.div>
          ) : (
            <p key="hint" className="text-muted">Select a skill to see what it connects to and where I have used it.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
