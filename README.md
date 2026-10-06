# Dinesh Kumar: portfolio

Next.js (App Router) + React + TypeScript + Tailwind CSS + Motion + lucide-react.
No other runtime dependencies. Fonts are self-hosted at build time via `next/font`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## The one rule: all content lives in `src/data/portfolio.json`

Components contain no portfolio content. `src/lib/portfolio.ts` loads the JSON, validates it
(duplicate ids, unknown diagram types, broken edges, bad cross-references) and throws a readable
error naming the exact path if something is wrong. Types are in `src/types/portfolio.ts`.

| To change...            | Edit in `portfolio.json`                                        |
| ----------------------- | --------------------------------------------------------------- |
| Add a project           | Append an object to `projects` (copy an existing one)           |
| Add a job               | Append to `experience` (with optional `flows` diagrams)         |
| Add a skill             | Add to a `skills.categories[].items` list (and `relations`)     |
| Add certification/award | `certifications` (drop PDF + PNG preview in `public/certificates`) / `achievements` |
| Add links               | `social.*.url`, and `projects[].links[].url`                    |
| Playground exercises    | `thinking.scaling`, `systemDesign`       |
| SEO / canonical URL     | `settings.seo` (set `siteUrl` and `ogImage` before deploying)   |

### Projects

A project entry drives `ProjectViewer`. `visual.type` is one of:

- `"flow"`: interactive stepper (InterviewAI pipeline)
- `"dashboard"`: simulated energy dashboard (PowerPulse). Uses sample data, labelled as illustrative
- `"none"`

Tabs with no content (empty `problem`, no `architecture.flows`, no `links`) are hidden automatically.
Technologies have a `confirmed` flag. Unconfirmed ones are hidden unless
`settings.showUnconfirmedTechnologies` is `true`.

### Links

`github` and `linkedin` use the URLs printed on your resume. Verify them. Any empty `url`
renders as a disabled "coming soon" button rather than a dead link. Put your resume at
`public/resume.pdf` (a PDF export of your current resume is already included).

## Structure

```
src/
  app/                 layout (fonts, SEO, JSON-LD), page composition, global CSS
  components/ui/       Chapter, FlowDiagram, NodeGraph, Tabs, Counter, Tag, ButtonLink, Icon
  components/sections/ Opening, Navigation, About, ProjectExplorer/Viewer, PowerPulseDashboard,
                       ScalingExplorer, AlgorithmLab, Skills, Experience, Credentials, Contact
  data/portfolio.json  the only content file
  lib/                 portfolio loader + validator, algorithm step generators, motion helpers
  types/portfolio.ts   interfaces for the JSON
```

## Extending later

Blog, GitHub/LeetCode stats, chatbot and case studies can each be a new top-level key in the JSON, a
type in `types/portfolio.ts`, and one new section component. `ProjectLink.kind` already has
`caseStudy` and `article` slots.

## Accessibility and performance notes

- Every interactive diagram is built from real buttons/tabs (keyboard + screen reader friendly); skip link included.
- `MotionConfig reducedMotion="user"` plus a CSS fallback honour `prefers-reduced-motion`; the dashboard stops drifting and counters show final values.
- Mobile gets a bottom bar (Projects, Experience, Skills, Resume, Contact) and list fallbacks for the system map.
- Server components render static content; only interactive sections ship client JS. No images, so no layout shift.
