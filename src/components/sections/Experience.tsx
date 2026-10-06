"use client";

import { useState } from "react";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { Tag } from "@/components/ui/Tag";
import { periodLabel } from "@/lib/portfolio";
import type { Experience as ExperienceData } from "@/types/portfolio";

function ExperienceEntry({ entry }: { entry: ExperienceData }) {
  const firstFlow = entry.flows[0];
  const [flowId, setFlowId] = useState(firstFlow?.id ?? "");
  const [stepId, setStepId] = useState(firstFlow?.steps[0]?.id ?? "");
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const flow = entry.flows.find((f) => f.id === flowId) ?? firstFlow;

  function pickFlow(id: string) {
    const f = entry.flows.find((x) => x.id === id);
    if (!f) return;
    setFlowId(id);
    setStepId(f.steps[0].id);
    setFocusIndex(null);
  }

  return (
    <article className="relative grid gap-6 pl-7 md:pl-10 lg:grid-cols-[1fr_1fr] lg:gap-10">
      {/* Timeline marker */}
      <span aria-hidden="true" className="absolute left-0 top-2 h-full w-px bg-rule" />
      <span aria-hidden="true" className="absolute -left-[5px] top-2 size-[11px] rounded-full bg-signal ring-4 ring-paper" />

      <div>
        <p className="font-medium text-muted">{periodLabel(entry.start, entry.end)}</p>
        <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{entry.company}</h3>
        <p className="mt-1 text-lg">
          {entry.role}
          {entry.team && <span className="text-muted"> in {entry.team}</span>}
          {entry.client && <span className="text-muted">, client: {entry.client}</span>}
        </p>
        <p className="mt-4 max-w-lg text-ink/85">{entry.summary}</p>

        <ul className="m-0 mt-6 list-none space-y-1 p-0">
          {entry.responsibilities.map((r, i) => {
            const linked = !!r.focus;
            const active = focusIndex === i;
            const content = (
              <span className="flex gap-3">
                <span aria-hidden="true" className={`mt-2.5 size-1.5 shrink-0 rounded-full ${active ? "bg-signal" : "bg-ink/40"}`} />
                <span>{r.text}</span>
              </span>
            );
            return (
              <li key={i}>
                {linked ? (
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setFocusIndex(i);
                      setFlowId(r.focus!.flow);
                      setStepId(r.focus!.step);
                    }}
                    className={`min-h-11 w-full rounded-lg px-3 py-2 text-left transition-colors ${active ? "bg-signal/10" : "hover:bg-ink/5"}`}
                  >
                    {content}
                  </button>
                ) : (
                  <div className="px-3 py-2">{content}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {entry.technologies.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      {flow && (
        <div className="rounded-xl border border-rule bg-panel p-4 md:p-6">
          {entry.flows.length > 1 && (
            <div role="group" aria-label="Diagrams" className="mb-5 flex flex-wrap gap-2">
              {entry.flows.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={f.id === flow.id}
                  onClick={() => pickFlow(f.id)}
                  className={`min-h-11 rounded-lg border px-3 py-2 font-medium transition-colors ${
                    f.id === flow.id ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"
                  }`}
                >
                  {f.title}
                </button>
              ))}
            </div>
          )}
          <FlowDiagram
            key={flow.id}
            flow={flow}
            activeId={stepId}
            onActiveChange={(id) => {
              setStepId(id);
              setFocusIndex(null);
            }}
          />
        </div>
      )}
    </article>
  );
}

export function Experience({ items }: { items: ExperienceData[] }) {
  return (
    <div className="space-y-12">
      {items.map((e) => (
        <ExperienceEntry key={e.id} entry={e} />
      ))}
    </div>
  );
}
