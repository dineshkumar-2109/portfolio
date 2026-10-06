"use client";

import { useRef, type KeyboardEvent } from "react";

interface TabItem {
  id: string;
  label: string;
}

interface Props {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  label: string;
  tone?: "light" | "dark";
}

/** WAI-ARIA tabs: roving tabindex, arrow keys, Home/End. Pair panels with `${idPrefix}-panel`. */
export function Tabs({ items, value, onChange, idPrefix, label, tone = "light" }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  }

  const active = tone === "light" ? "border-ink text-ink" : "border-signal text-white";
  const idle = tone === "light" ? "border-transparent text-muted hover:text-ink" : "border-transparent text-white/60 hover:text-white";

  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-px [scrollbar-width:none]">
      {items.map((item, i) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-11 shrink-0 whitespace-nowrap border-b-2 px-3 py-2 font-medium transition-colors ${selected ? active : idle}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
