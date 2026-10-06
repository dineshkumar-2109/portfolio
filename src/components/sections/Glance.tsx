import type { ReactNode } from "react";
import { Counter } from "@/components/ui/Counter";
import { Tag } from "@/components/ui/Tag";
import type { Portfolio } from "@/types/portfolio";

/** The ten-second read. Everything here is derived from portfolio.json, so it never drifts out of date. */
export function Glance({ data }: { data: Portfolio }) {
  const current = data.experience.find((e) => e.end === null) ?? data.experience[0];
  const dsa = data.achievements[0];
  const issuers = Array.from(new Set(data.certifications.map((c) => c.issuer).filter(Boolean)));
  const availability = data.personal.availability;
  const showAvailability = !!availability && (availability.status || availability.detail);

  const cells: { label: string; body: ReactNode }[] = [];
  if (current) {
    cells.push({
      label: "Currently",
      body: (
        <>
          <p className="font-display text-xl font-bold leading-tight">{current.role}</p>
          <p className="text-muted">
            {current.company}
            {current.client ? `, client: ${current.client}` : ""}
          </p>
        </>
      ),
    });
  }
  if (data.settings.glance.stack.length > 0) {
    cells.push({
      label: "Core stack",
      body: (
        <div className="flex flex-wrap gap-1.5">
          {data.settings.glance.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      ),
    });
  }
  if (dsa) {
    cells.push({
      label: "Problem solving",
      body: (
        <>
          <p className="font-display text-xl font-bold leading-tight">
            <Counter value={dsa.value} suffix={dsa.suffix} /> {dsa.label.replace(/^\d+\+?\s*/, "")}
          </p>
        </>
      ),
    });
  }
  if (data.certifications.length > 0) {
    cells.push({
      label: "Certified",
      body: (
        <>
          <p className="font-display text-xl font-bold leading-tight">
            {data.certifications.length} {data.certifications.length === 1 ? "credential" : "credentials"}
          </p>
          {issuers.length > 0 && <p className="text-muted">{issuers.join(", ")}</p>}
        </>
      ),
    });
  }
  if (showAvailability) {
    cells.push({
      label: "Availability",
      body: (
        <>
          {availability!.status && <p className="font-display text-xl font-bold leading-tight">{availability!.status}</p>}
          {availability!.detail && <p className="text-muted">{availability!.detail}</p>}
        </>
      ),
    });
  }

  return (
    <section aria-label="At a glance" className="border-y border-rule bg-panel">
      <dl className="mx-auto grid max-w-page gap-px bg-rule sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
        {cells.map((c) => (
          <div key={c.label} className="bg-panel px-5 py-5 md:px-8">
            <dt className="mb-1.5 text-sm font-medium text-muted">{c.label}</dt>
            <dd className="m-0">{c.body}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
