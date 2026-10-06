"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { DashboardConfig } from "@/types/portfolio";

const BLOCKS = 14;

function Blocks({ ratio, hot }: { ratio: number; hot?: boolean }) {
  const filled = Math.round(Math.min(Math.max(ratio, 0), 1) * BLOCKS);
  return (
    <div className="flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: BLOCKS }).map((_, i) => (
        <span key={i} className={`h-4 flex-1 rounded-[2px] transition-colors duration-300 ${i < filled ? (hot ? "bg-signal" : "bg-ok") : "bg-night-rule"}`} />
      ))}
    </div>
  );
}

/**
 * A working miniature of the PowerPulse UI, driven entirely by sample data from portfolio.json.
 * Readings drift on a timer; "Simulate abnormal usage" pushes one meter over its threshold so the alert logic is visible.
 */
export function PowerPulseDashboard({ config }: { config: DashboardConfig }) {
  const reduce = useReducedMotion();
  const rangeKeys = Object.keys(config.series);
  const [range, setRange] = useState(rangeKeys[0]);
  const [jitter, setJitter] = useState<Record<string, number>>({});
  const [spikeId, setSpikeId] = useState<string | null>(null);
  const [peak, setPeak] = useState(0);
  const spikeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drift readings. Skipped entirely for reduced motion; values stay at their sample baseline.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const next: Record<string, number> = {};
      config.meters.forEach((m) => (next[m.id] = 1 + (Math.random() - 0.5) * 0.14));
      setJitter(next);
    }, 1800);
    return () => clearInterval(id);
  }, [config.meters, reduce]);

  useEffect(() => () => {
    if (spikeTimer.current) clearTimeout(spikeTimer.current);
  }, []);

  const spikeTarget = config.meters[Math.min(3, config.meters.length - 1)];

  const loads = useMemo<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    config.meters.forEach((m) => {
      out[m.id] = spikeId === m.id ? m.limit * 1.28 : m.base * (jitter[m.id] ?? 1);
    });
    return out;
  }, [config.meters, jitter, spikeId]);

  const total = config.meters.reduce((sum, m) => sum + loads[m.id], 0);

  useEffect(() => {
    setPeak((p) => Math.max(p, total));
  }, [total]);

  const abnormal = config.meters.filter((m) => loads[m.id] > m.limit);
  const online = abnormal.length === 0;

  function toggleSpike() {
    if (spikeTimer.current) clearTimeout(spikeTimer.current);
    if (spikeId) {
      setSpikeId(null);
      return;
    }
    setSpikeId(spikeTarget.id);
    spikeTimer.current = setTimeout(() => setSpikeId(null), 9000);
  }

  const series = config.series[range];
  const maxV = Math.max(...series.values);

  return (
    <div className="overflow-hidden rounded-2xl border border-night-rule bg-night text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-night-rule px-5 py-4">
        <div className="flex items-center gap-3">
          <Icon name="zap" className="text-signal" />
          <p className="font-display text-xl font-extrabold tracking-wide">{config.title.toUpperCase()}</p>
        </div>
        <p className="flex items-center gap-2 font-data text-sm" role="status">
          <span className="text-white/60">System status</span>
          <span aria-hidden="true" className={`size-2.5 rounded-full ${online ? "bg-ok" : "bg-signal"} ${!reduce ? "animate-pulse" : ""}`} />
          <span className={online ? "text-ok" : "text-signal"}>{online ? "Online" : "Alert"}</span>
        </p>
      </div>

      <div className="grid gap-px bg-night-rule lg:grid-cols-[1.1fr_1fr]">
        {/* Left: load, lines, meters */}
        <div className="space-y-6 bg-night p-5">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 font-data text-sm">
            <span className="text-white/60">Active meters</span>
            <span className="text-lg font-medium">{config.meters.length}</span>
            <span className="text-white/60">Current load</span>
            <div>
              <Blocks ratio={total / config.capacity} hot={!online} />
              <span className="sr-only">{Math.round(total)} {config.unit}</span>
            </div>
            <span className="text-white/60">Peak load</span>
            <Blocks ratio={peak / config.capacity} />
          </div>
          <p className="font-data text-sm text-white/60">
            {Math.round(total)} {config.unit} now, {Math.round(peak)} {config.unit} peak, of {config.capacity} {config.unit} capacity
          </p>

          <div>
            <p className="mb-2 font-display font-semibold">Meters</p>
            <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-5">
              {config.meters.map((m) => {
                const v = loads[m.id];
                const over = v > m.limit;
                return (
                  <li key={m.id} className={`rounded-md border p-2 ${over ? "border-signal bg-signal/10" : "border-night-rule bg-night-2"}`}>
                    <p className="text-xs text-white/70">{m.label}</p>
                    <p className={`font-data text-base ${over ? "text-signal" : ""}`}>
                      {Math.round(v)}
                      <span className="text-xs text-white/50"> {config.unit}</span>
                    </p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-night-rule" aria-hidden="true">
                      <div className={`h-full rounded-full transition-all duration-500 ${over ? "bg-signal" : "bg-ok"}`} style={{ width: `${Math.min((v / (m.limit * 1.3)) * 100, 100)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right: alerts, chart */}
        <div className="space-y-6 bg-night p-5">
          <div>
            <p className="mb-2 font-display font-semibold">Alerts</p>
            <ul className="m-0 list-none space-y-1.5 p-0 font-data text-sm" aria-live="polite">
              {abnormal.map((m) => (
                <li key={m.id} className="flex items-start gap-2 text-signal">
                  <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
                  Abnormal consumption detected: {m.label} at {Math.round(loads[m.id])} {config.unit}, threshold {m.limit} {config.unit}
                </li>
              ))}
              {config.lines.map((line) => {
                const flagged = abnormal.some((m) => m.line === line.id);
                if (flagged) return null;
                return (
                  <li key={line.id} className="flex items-center gap-2 text-ok">
                    <Icon name="check" size={16} />
                    {line.label} normal
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={toggleSpike}
              aria-pressed={!!spikeId}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 px-3 py-2 font-medium hover:border-signal hover:text-signal"
            >
              <Icon name="alert" size={16} />
              {spikeId ? "Clear abnormal usage" : "Simulate abnormal usage"}
            </button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-display font-semibold">Consumption</p>
              <div role="group" aria-label="Chart range" className="flex gap-1">
                {rangeKeys.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={k === range}
                    onClick={() => setRange(k)}
                    className={`min-h-9 rounded-md px-3 text-sm font-medium ${k === range ? "bg-white text-night" : "text-white/70 hover:text-white"}`}
                  >
                    {config.series[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div role="img" aria-label={`${series.label} consumption chart, sample data: ${series.labels.map((l, i) => `${l} ${series.values[i]}`).join(", ")}`}>
              <div className="flex h-36 items-end gap-2 border-b border-night-rule" aria-hidden="true">
                {series.values.map((v, i) => (
                  <div key={`${range}-${i}`} className="flex h-full flex-1 items-end">
                    <motion.div
                      className="w-full rounded-t-[3px] bg-signal"
                      initial={reduce ? false : { height: "0%" }}
                      animate={{ height: `${(v / maxV) * 92}%` }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex gap-2 font-data text-xs text-white/60" aria-hidden="true">
                {series.labels.map((l) => (
                  <span key={l} className="flex-1 text-center">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-night-rule px-5 py-3 text-sm text-white/60">{config.note}</p>
    </div>
  );
}
