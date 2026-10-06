"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { expand } from "@/lib/motion";
import type { ScalingComponent, ScalingExercise } from "@/types/portfolio";

const STAGES: ScalingComponent["stage"][] = ["front", "app", "data", "async"];

function Layer({ label, tone = "light", sub }: { label: string; tone?: "light" | "ink" | "signal"; sub?: string }) {
  const tones = {
    light: "border-rule bg-paper",
    ink: "border-ink bg-ink text-paper",
    signal: "border-signal bg-signal/10",
  } as const;
  return (
    <div className={`rounded-lg border-2 px-4 py-2.5 ${tones[tone]}`}>
      <p className="font-display font-semibold leading-tight">{label}</p>
      {sub && <p className="text-sm opacity-70">{sub}</p>}
    </div>
  );
}

export function ScalingExplorer({ exercise }: { exercise: ScalingExercise }) {
  const [enabled, setEnabled] = useState<string[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);

  const on = (id: string) => enabled.includes(id);
  const byStage = (s: ScalingComponent["stage"]) => exercise.components.filter((c) => c.stage === s && on(c.id));
  const focus = exercise.components.find((c) => c.id === focusId);
  const replicate = exercise.components.some((c) => c.replicate && on(c.id));

  function toggle(id: string) {
    setEnabled((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
    setFocusId(id);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div>
        <p className="font-display text-2xl font-bold leading-snug">&ldquo;{exercise.question}&rdquo;</p>
        <p className="mt-3 text-muted">{exercise.intro}</p>

        <div role="group" aria-label="Scaling layers" className="mt-6 flex flex-wrap gap-2">
          {exercise.components.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={on(c.id)}
              onClick={() => toggle(c.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 font-medium transition-colors ${
                on(c.id) ? "border-ink bg-ink text-paper" : "border-rule bg-panel hover:border-ink"
              }`}
            >
              {on(c.id) && <Icon name="check" size={16} />}
              {c.label}
            </button>
          ))}
          {enabled.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setEnabled([]);
                setFocusId(null);
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 font-medium text-muted hover:text-ink"
            >
              <Icon name="reset" size={16} /> Reset
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-6 min-h-[8rem]">
          <AnimatePresence mode="wait" initial={false}>
            {focus ? (
              <motion.div key={focus.id} {...expand} className="overflow-hidden">
                <div className="space-y-3 rounded-xl border border-rule bg-panel p-5">
                  <p className="font-display text-lg font-bold">
                    {focus.label} {on(focus.id) ? "" : "(removed)"}
                  </p>
                  <dl className="space-y-3">
                    <div>
                      <dt className="font-semibold">What it solves</dt>
                      <dd className="text-ink/85">{focus.solves}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">What it costs</dt>
                      <dd className="text-ink/85">{focus.tradeoff}</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            ) : (
              <p key="hint" className="text-muted">Start with one server, then add layers to see what each one changes.</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Diagram: lanes top to bottom */}
      <div className="rounded-2xl border border-rule bg-panel p-5" role="img" aria-label={`Architecture with ${enabled.length} added layers`}>
        <div className="mx-auto flex max-w-sm flex-col items-stretch gap-2">
          <Layer label={exercise.baseline.label} />
          {STAGES.map((stage) => (
            <div key={stage} className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {byStage(stage).filter((c) => !c.replicate).map((c) => (
                  <motion.div key={c.id} {...expand} className="overflow-hidden">
                    <div className="space-y-2 pt-2">
                      <Arrow />
                      <Layer label={c.label} tone="signal" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {stage === "app" && (
                <div className="space-y-2 pt-0">
                  <Arrow />
                  <div className="relative">
                    {replicate && (
                      <>
                        <div aria-hidden="true" className="absolute inset-x-3 -top-2 h-3 rounded-t-lg border-2 border-b-0 border-ink/40 bg-paper" />
                        <div aria-hidden="true" className="absolute inset-x-1.5 -top-1 h-3 rounded-t-lg border-2 border-b-0 border-ink/60 bg-paper" />
                      </>
                    )}
                    <div className="relative">
                      <Layer label={replicate ? `${exercise.core.label}s` : exercise.core.label} tone="ink" sub={replicate ? "many identical copies" : undefined} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div aria-hidden="true" className="flex justify-center">
      <span className="block h-4 w-0.5 bg-ink/40" />
    </div>
  );
}
