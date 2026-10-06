import raw from "@/data/portfolio.json";
import type { Flow, Portfolio, Project } from "@/types/portfolio";

/**
 * JSON imports widen string literals, so the cast below cannot catch a typo in a
 * discriminated union. validatePortfolio() does that at build/dev time and throws
 * a readable error pointing at the offending path.
 */
function fail(path: string, msg: string): never {
  throw new Error(`[portfolio.json] ${path}: ${msg}`);
}

function requireString(value: unknown, path: string) {
  if (typeof value !== "string" || value.trim() === "") fail(path, "expected a non-empty string");
}

function uniqueIds(items: { id: string }[], path: string) {
  const seen = new Set<string>();
  items.forEach((item, i) => {
    requireString(item.id, `${path}[${i}].id`);
    if (seen.has(item.id)) fail(`${path}[${i}].id`, `duplicate id "${item.id}"`);
    seen.add(item.id);
  });
}

function validateFlow(flow: Flow, path: string) {
  requireString(flow.id, `${path}.id`);
  requireString(flow.title, `${path}.title`);
  if (!Array.isArray(flow.steps) || flow.steps.length === 0) fail(`${path}.steps`, "needs at least one step");
  uniqueIds(flow.steps, `${path}.steps`);
}

function validateProject(p: Project, path: string) {
  requireString(p.title, `${path}.title`);
  requireString(p.summary, `${path}.summary`);
  const t = p.visual?.type;
  if (t !== "flow" && t !== "dashboard" && t !== "none") fail(`${path}.visual.type`, `unknown type "${String(t)}"`);
  if (p.visual.type === "flow") validateFlow(p.visual.flow, `${path}.visual.flow`);
  (p.media ?? []).forEach((m, i) => {
    if (m.type !== "image" && m.type !== "video") fail(`${path}.media[${i}].type`, `unknown type "${String(m.type)}"`);
    requireString(m.src, `${path}.media[${i}].src`);
    requireString(m.alt, `${path}.media[${i}].alt`);
  });
  (p.architecture?.flows ?? []).forEach((f, i) => validateFlow(f, `${path}.architecture.flows[${i}]`));
}

export function validatePortfolio(data: Portfolio): Portfolio {
  requireString(data.personal?.name, "personal.name");
  requireString(data.personal?.email, "personal.email");
  uniqueIds(data.projects, "projects");
  data.projects.forEach((p, i) => validateProject(p, `projects[${i}]`));
  uniqueIds(data.experience, "experience");
  data.experience.forEach((e, i) => {
    (e.flows ?? []).forEach((f, j) => validateFlow(f, `experience[${i}].flows[${j}]`));
    e.responsibilities.forEach((r, j) => {
      if (!r.focus) return;
      const flow = e.flows.find((f) => f.id === r.focus!.flow);
      if (!flow) fail(`experience[${i}].responsibilities[${j}].focus.flow`, `no flow "${r.focus.flow}"`);
      if (!flow.steps.some((s) => s.id === r.focus!.step))
        fail(`experience[${i}].responsibilities[${j}].focus.step`, `no step "${r.focus.step}" in flow "${flow.id}"`);
    });
  });
  data.thinking.scaling.components.forEach((c, i) => {
    if (!["front", "app", "data", "async"].includes(c.stage))
      fail(`thinking.scaling.components[${i}].stage`, `unknown stage "${c.stage}"`);
  });
  const nodeIds = new Set(data.systemDesign.nodes.map((n) => n.id));
  data.systemDesign.edges.forEach(([a, b], i) => {
    if (!nodeIds.has(a) || !nodeIds.has(b)) fail(`systemDesign.edges[${i}]`, `unknown node in [${a}, ${b}]`);
  });
  const allSkills = new Set(data.skills.categories.flatMap((c) => c.items));
  data.skills.relations.forEach(([a, b], i) => {
    if (!allSkills.has(a) || !allSkills.has(b)) fail(`skills.relations[${i}]`, `unknown skill in [${a}, ${b}]`);
  });
  return data;
}

export const portfolio: Portfolio = validatePortfolio(raw as unknown as Portfolio);

/* ---------- derived helpers (pure functions over the data) ---------- */

const norm = (s: string) => s.toLowerCase().replace(/\.js\b/g, "").replace(/\s+/g, " ").trim();

function techMatches(skill: string, tech: string) {
  const a = norm(skill);
  const b = norm(tech);
  return a === b || (a.length > 2 && b.startsWith(a)) || (b.length > 2 && a.startsWith(b));
}

/** Which projects / roles mention a skill. Only confirmed technologies count. */
export function skillUsage(data: Portfolio, skill: string): string[] {
  const hits: string[] = [];
  for (const p of data.projects) {
    if (p.technologies.some((t) => t.confirmed && techMatches(skill, t.name))) hits.push(p.title);
  }
  for (const e of data.experience) {
    if (e.technologies.some((t) => techMatches(skill, t))) hits.push(e.company);
  }
  return hits;
}

export function visibleTechnologies(project: Project, showUnconfirmed: boolean) {
  return project.technologies.filter((t) => t.confirmed || showUnconfirmed);
}

export function periodLabel(start: string, end: string | null) {
  return `${start} – ${end ?? "Present"}`;
}
