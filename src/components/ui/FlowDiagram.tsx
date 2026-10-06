"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { expand } from "@/lib/motion";
import type { Flow } from "@/types/portfolio";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

interface Props {
  flow: Flow;
  /** Controlled active step id. Omit for uncontrolled. */
  activeId?: string;
  onActiveChange?: (id: string) => void;
}

/**
 * Vertical, keyboard-accessible stepper. Used for every "A leads to B" story on the site:
 * the InterviewAI pipeline, the MQTT migration, PowerPulse's request path.
 */
export function FlowDiagram({ flow, activeId, onActiveChange }: Props) {
  const [internal, setInternal] = useState(flow.steps[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const current = activeId ?? internal;
  const index = Math.max(
    0,
    flow.steps.findIndex((s) => s.id === current),
  );

  function select(id: string) {
    setInternal(id);
    onActiveChange?.(id);
  }

  // Reset when a different flow is shown.
  useEffect(() => {
    setPlaying(false);
    setInternal(flow.steps[0]?.id ?? "");
  }, [flow.id, flow.steps]);

  // Optional guided walk-through.
  useEffect(() => {
    if (!playing) return;
    if (index >= flow.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => select(flow.steps[index + 1].id), 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, flow.steps]);

  function togglePlay() {
    if (!playing && index >= flow.steps.length - 1) select(flow.steps[0].id);
    setPlaying((p) => !p);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold">{flow.title}</p>
          {flow.description && <p className="text-muted">{flow.description}</p>}
        </div>
        {flow.steps.length > 2 && (
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/25 px-3 py-2 font-medium hover:border-ink"
          >
            <Icon name={playing ? "pause" : "play"} />
            {playing ? "Pause" : "Walk through"}
          </button>
        )}
      </div>

      <ol className="m-0 list-none p-0">
        {flow.steps.map((step, i) => {
          const isActive = i === index;
          const reached = i <= index;
          const last = i === flow.steps.length - 1;
          return (
            <li key={step.id} className="relative pb-1 pl-9">
              {!last && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[9px] top-7 -bottom-0 w-0.5 transition-colors duration-500 ${i < index ? "bg-signal" : "bg-rule"}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[13px] grid size-5 place-items-center rounded-full border-2 bg-paper transition-colors duration-300 ${
                  reached ? "border-signal" : "border-rule"
                }`}
              >
                {isActive && <span className="size-2 rounded-full bg-signal" />}
              </span>
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={`${flow.id}-${step.id}-detail`}
                onClick={() => {
                  setPlaying(false);
                  select(step.id);
                }}
                className="flex min-h-11 w-full items-center gap-2 py-2 text-left"
              >
                <span
                  className={`font-display text-lg transition-colors md:text-xl ${isActive ? "font-bold text-ink" : "font-medium text-muted hover:text-ink"}`}
                >
                  {step.label}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="detail"
                    id={`${flow.id}-${step.id}-detail`}
                    role="region"
                    aria-label={step.label}
                    {...expand}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 pr-2">
                      <p className="max-w-xl text-ink/85">{step.detail}</p>
                      {step.tags && step.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {step.tags.map((t) => (
                            <Tag key={t}>{t}</Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
