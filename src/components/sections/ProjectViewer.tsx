"use client";

import { useId, useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { visibleTechnologies } from "@/lib/portfolio";
import type { Project } from "@/types/portfolio";
import { PowerPulseDashboard } from "./PowerPulseDashboard";

const LINK_ICONS: Record<string, string> = { github: "github", demo: "arrowUpRight", caseStudy: "file", article: "file" };

function Showpiece({ project }: { project: Project }) {
  const v = project.visual;
  if (v.type === "flow") {
    return (
      <div className="rounded-xl border border-rule bg-panel p-4 md:p-6">
        <FlowDiagram flow={v.flow} />
      </div>
    );
  }
  if (v.type === "dashboard") return <PowerPulseDashboard config={v.dashboard} />;
  return null;
}

/**
 * One project, fully generated from its JSON entry. Sections with no content (for example an empty
 * "problem" or no architecture flows) are skipped, so a minimal entry still renders cleanly.
 */
export function ProjectViewer({ project, showUnconfirmed }: { project: Project; showUnconfirmed: boolean }) {
  const uid = useId();
  const techs = visibleTechnologies(project, showUnconfirmed);

  const tabs = useMemo(
    () =>
      [
        { id: "overview", label: "Overview", show: !!project.summary },
        { id: "problem", label: "Problem", show: !!project.problem },
        { id: "solution", label: "Solution", show: !!project.solution },
        { id: "features", label: "Features", show: project.features.length > 0 },
        { id: "decisions", label: "Design decisions", show: (project.decisions ?? []).length > 0 },
        { id: "demo", label: "Demo", show: (project.media ?? []).length > 0 },
        { id: "technologies", label: "Technologies", show: techs.length > 0 },
        { id: "architecture", label: "Architecture", show: project.architecture.flows.length > 0 },
        { id: "links", label: "Links", show: project.links.length > 0 },
      ].filter((t) => t.show),
    [project, techs.length],
  );
  const [tab, setTab] = useState(tabs[0]?.id ?? "overview");
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

  return (
    <article aria-labelledby={`${uid}-title`}>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <h3 id={`${uid}-title`} className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-1 text-lg text-muted md:text-xl">{project.subtitle}</p>
        </div>
        <p className="font-medium text-muted">{project.period}</p>
      </header>

      <Showpiece project={project} />

      <div className="mt-10">
        <Tabs items={tabs} value={active ?? ""} onChange={setTab} idPrefix={uid} label={`${project.title} details`} />
        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} tabIndex={0} className="border-t border-rule pt-6">
          {active === "overview" && (
            <div className="max-w-2xl space-y-5">
              <p className="text-lg leading-relaxed">{project.summary}</p>
              {techs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techs.map((t) => (
                    <Tag key={t.name}>{t.name}</Tag>
                  ))}
                </div>
              )}
            </div>
          )}
          {active === "problem" && <p className="max-w-2xl text-lg leading-relaxed">{project.problem}</p>}
          {active === "solution" && <p className="max-w-2xl text-lg leading-relaxed">{project.solution}</p>}
          {active === "features" && (
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {project.features.map((g) => (
                <div key={g.group}>
                  <p className="border-b-2 border-ink pb-2 font-display text-lg font-bold">{g.group}</p>
                  <ul className="m-0 mt-3 list-none space-y-2 p-0">
                    {g.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {active === "decisions" && (
            <dl className="grid max-w-3xl gap-6">
              {(project.decisions ?? []).map((d) => (
                <div key={d.title} className="border-l-2 border-signal pl-4">
                  <dt className="font-display text-lg font-bold">{d.title}</dt>
                  <dd className="m-0 mt-1 text-ink/85">{d.detail}</dd>
                </div>
              ))}
            </dl>
          )}
          {active === "demo" && (
            <div className="grid gap-6 md:grid-cols-2">
              {(project.media ?? []).map((m) => (
                <figure key={m.src} className="m-0">
                  {m.type === "video" ? (
                    <video controls preload="metadata" poster={m.poster} className="w-full rounded-xl border border-rule" aria-label={m.alt}>
                      <source src={m.src} />
                    </video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.src} alt={m.alt} loading="lazy" className="h-auto w-full rounded-xl border border-rule" />
                  )}
                  {m.caption && <figcaption className="mt-2 text-muted">{m.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {active === "technologies" && (
            <div className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <Tag key={t.name}>{t.name}</Tag>
              ))}
            </div>
          )}
          {active === "architecture" && (
            <div className="grid gap-8 md:grid-cols-2">
              {project.architecture.flows.map((f) => (
                <div key={f.id} className="rounded-2xl border border-rule bg-panel p-5">
                  <FlowDiagram flow={f} />
                </div>
              ))}
            </div>
          )}
          {active === "links" && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((l) => (
                <ButtonLink key={l.label} href={l.url} label={l.label} icon={LINK_ICONS[l.kind] ?? "arrowUpRight"} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
