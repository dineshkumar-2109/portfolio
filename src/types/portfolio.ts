/** Shape of src/data/portfolio.json. Every UI component is typed against these. */

export interface FlowStep {
  id: string;
  label: string;
  detail: string;
  tags?: string[];
}

export interface Flow {
  id: string;
  title: string;
  description?: string;
  steps: FlowStep[];
}

export interface Personal {
  name: string;
  shortName: string;
  heroName: string[];
  title: string;
  location: string;
  email: string;
  phone: string;
  tagline: string[];
  focusAreas: string[];
  /** Leave both empty to hide the availability cell. */
  availability?: { status: string; detail: string };
}

export interface About {
  lead: string;
  summary: string;
  pillars: { title: string; items: string[] }[];
}

export interface ExperienceFocus {
  flow: string;
  step: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  team?: string;
  client?: string;
  start: string;
  /** null means "Present" */
  end: string | null;
  summary: string;
  technologies: string[];
  responsibilities: { text: string; focus?: ExperienceFocus }[];
  flows: Flow[];
}

export interface DashboardMeter {
  id: string;
  label: string;
  line: string;
  base: number;
  limit: number;
}

export interface DashboardSeries {
  label: string;
  labels: string[];
  values: number[];
}

export interface DashboardConfig {
  title: string;
  note: string;
  unit: string;
  capacity: number;
  lines: { id: string; label: string }[];
  meters: DashboardMeter[];
  series: Record<string, DashboardSeries>;
}

export type ProjectVisual =
  | { type: "flow"; flow: Flow }
  | { type: "dashboard"; dashboard: DashboardConfig }
  | { type: "none" };

export interface ProjectLink {
  kind: "github" | "demo" | "caseStudy" | "article";
  label: string;
  /** Empty string renders as a disabled "coming soon" link. */
  url: string;
}

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  /** Video only */
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  summary: string;
  problem: string;
  solution: string;
  features: { group: string; items: string[] }[];
  technologies: { name: string; confirmed: boolean }[];
  visual: ProjectVisual;
  architecture: { flows: Flow[] };
  links: ProjectLink[];
  /** Screenshots or demo videos from /public. Empty hides the Demo tab. */
  media?: ProjectMedia[];
  /** Design decisions and trade-offs. Empty hides the tab. */
  decisions?: { title: string; detail: string }[];
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export interface Skills {
  categories: SkillCategory[];
  relations: [string, string][];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  date: string;
  score?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  /** e.g. "Certificate", "Skill badge" */
  kind: string;
  category: string;
  level: string;
  issued: string;
  /** Empty string when the credential does not expire. */
  expires: string;
  description: string;
  /** Public verification page (e.g. Credly). Empty hides the Verify button. */
  credentialUrl: string;
  /** PDF in /public. Empty hides the View button. */
  fileUrl: string;
  /** Image preview in /public. Empty hides the thumbnail. */
  previewImage: string;
}

export interface Achievement {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  detail: string;
  /** Verification / profile links shown under the number. */
  links?: LinkItem[];
}

export interface ScalingComponent {
  id: string;
  label: string;
  /** Lane of the diagram this layer belongs to, top to bottom: front, app, data, async. */
  stage: "front" | "app" | "data" | "async";
  /** Draw the core server several times (horizontal scaling). */
  replicate?: boolean;
  solves: string;
  tradeoff: string;
}

export interface ScalingExercise {
  heading: string;
  question: string;
  intro: string;
  baseline: { label: string; detail: string };
  core: { label: string; detail: string };
  components: ScalingComponent[];
}

export interface Thinking {
  disclaimer: string;
  scaling: ScalingExercise;
}

export interface SystemNode {
  id: string;
  label: string;
  col: number;
  row: number;
  status: "applied" | "learning";
  detail: string;
}

export interface SystemDesign {
  heading: string;
  intro: string;
  legend: { applied: string; learning: string };
  nodes: SystemNode[];
  edges: [string, string][];
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface Social {
  github: LinkItem;
  linkedin: LinkItem;
  resume: LinkItem;
}

export interface Chapter {
  id: string;
  number: string;
  question: string;
}

export interface Settings {
  seo: { title: string; description: string; siteUrl: string; ogImage: string };
  showUnconfirmedTechnologies: boolean;
  lastUpdated: string;
  glance: { stack: string[] };
  chapters: Chapter[];
  sectionHeadings: { skills: string; education: string; credentials: string; credentialsIntro: string; experience: string };
  mobileNav: { label: string; target: string; icon: string }[];
}

export interface Portfolio {
  personal: Personal;
  about: About;
  experience: Experience[];
  projects: Project[];
  skills: Skills;
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  thinking: Thinking;
  systemDesign: SystemDesign;
  social: Social;
  contact: { headline: string; body: string };
  settings: Settings;
}
