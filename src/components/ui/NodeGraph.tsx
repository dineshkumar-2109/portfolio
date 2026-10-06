"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type KeyboardEvent } from "react";
import { expand } from "@/lib/motion";
import type { SystemDesign } from "@/types/portfolio";

const COL_W = 215;
const ROW_H = 120;
const NODE_W = 178;
const NODE_H = 64;
const PAD = 12;

function wrap(label: string, max = 20): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

/** Grid-positioned node map. Desktop: SVG. Mobile: a grouped list with the same selection state. */
export function NodeGraph({ data }: { data: SystemDesign }) {
  const [selectedId, setSelectedId] = useState<string>(data.nodes[0]?.id ?? "");
  const selected = data.nodes.find((n) => n.id === selectedId);
  const maxCol = Math.max(...data.nodes.map((n) => n.col));
  const maxRow = Math.max(...data.nodes.map((n) => n.row));
  const width = maxCol * COL_W + NODE_W + PAD * 2;
  const height = maxRow * ROW_H + NODE_H + PAD * 2;
  const pos = (id: string) => {
    const n = data.nodes.find((x) => x.id === id)!;
    return { x: PAD + n.col * COL_W, y: PAD + n.row * ROW_H };
  };

  function onKey(e: KeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedId(id);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2" aria-label="Legend">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-sm border-2 border-blue bg-blue" />
          {data.legend.applied}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-sm border-2 border-dashed border-signal-deep" />
          {data.legend.learning}
        </span>
      </div>

      {/* Desktop / tablet SVG */}
      <div className="hidden overflow-x-auto rounded-xl border border-rule bg-panel p-4 md:block">
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto h-auto w-full max-w-4xl" role="group" aria-label="System design concept map">
          {data.edges.map(([a, b]) => {
            const pa = pos(a);
            const pb = pos(b);
            const dashed = data.nodes.find((n) => n.id === a)?.status === "learning" || data.nodes.find((n) => n.id === b)?.status === "learning";
            const hot = selectedId === a || selectedId === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x + NODE_W / 2}
                y1={pa.y + NODE_H / 2}
                x2={pb.x + NODE_W / 2}
                y2={pb.y + NODE_H / 2}
                stroke={hot ? "#F2561D" : "#9AA3B2"}
                strokeWidth={hot ? 2.5 : 1.5}
                strokeDasharray={dashed ? "6 5" : undefined}
              />
            );
          })}
          {data.nodes.map((n) => {
            const p = pos(n.id);
            const isSel = n.id === selectedId;
            const applied = n.status === "applied";
            const lines = wrap(n.label);
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${n.label}. ${applied ? data.legend.applied : data.legend.learning}.`}
                onClick={() => setSelectedId(n.id)}
                onKeyDown={(e) => onKey(e, n.id)}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-signal [&:focus-visible>rect]:stroke-[3px]"
              >
                <rect
                  x={p.x}
                  y={p.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  fill={applied ? "#2340C8" : "#FAFAF7"}
                  stroke={applied ? "#2340C8" : "#B93A0B"}
                  strokeWidth={2}
                  strokeDasharray={applied ? undefined : "6 4"}
                />
                {isSel && <rect x={p.x - 4} y={p.y - 4} width={NODE_W + 8} height={NODE_H + 8} rx={13} fill="none" stroke="#F2561D" strokeWidth={2.5} />}
                <text x={p.x + NODE_W / 2} y={p.y + NODE_H / 2 - ((lines.length - 1) * 9)} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={600} fill={applied ? "#FFFFFF" : "#121826"} className="font-display">
                  {lines.map((l, i) => (
                    <tspan key={i} x={p.x + NODE_W / 2} dy={i === 0 ? 0 : 18}>
                      {l}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile list */}
      <ul className="m-0 grid list-none gap-2 p-0 md:hidden">
        {data.nodes.map((n) => {
          const applied = n.status === "applied";
          return (
            <li key={n.id}>
              <button
                type="button"
                aria-pressed={n.id === selectedId}
                onClick={() => setSelectedId(n.id)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left font-display font-semibold ${
                  applied ? "border-blue bg-blue text-white" : "border-dashed border-signal-deep bg-panel text-ink"
                } ${n.id === selectedId ? "ring-2 ring-signal ring-offset-2 ring-offset-paper" : ""}`}
              >
                {n.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-5 min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {selected && (
            <motion.div key={selected.id} {...expand} className="overflow-hidden">
              <div className="rounded-xl border border-rule bg-panel p-5">
                <p className="font-display text-lg font-bold">{selected.label}</p>
                <p className="mt-1 text-sm font-medium text-signal-deep">
                  {selected.status === "applied" ? data.legend.applied : data.legend.learning}
                </p>
                <p className="mt-2 max-w-2xl text-ink/85">{selected.detail}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
