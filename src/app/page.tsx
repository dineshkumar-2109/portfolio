import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Credentials } from "@/components/sections/Credentials";
import { Footer } from "@/components/sections/Footer";
import { Glance } from "@/components/sections/Glance";
import { Experience } from "@/components/sections/Experience";
import { Navigation } from "@/components/sections/Navigation";
import { Opening } from "@/components/sections/Opening";
import { ProjectExplorer } from "@/components/sections/ProjectExplorer";
import { ScalingExplorer } from "@/components/sections/ScalingExplorer";
import { Skills } from "@/components/sections/Skills";
import { Chapter, SubSection } from "@/components/ui/Chapter";
import { NodeGraph } from "@/components/ui/NodeGraph";
import { portfolio, skillUsage } from "@/lib/portfolio";

export default function Home() {
  const { personal, about, experience, projects, skills, education, certifications, achievements, thinking, systemDesign, social, contact, settings } = portfolio;
  const ch = (id: string) => {
    const c = settings.chapters.find((x) => x.id === id);
    if (!c) throw new Error(`[portfolio.json] settings.chapters is missing "${id}"`);
    return c;
  };
  const usage = Object.fromEntries(skills.categories.flatMap((c) => c.items).map((s) => [s, skillUsage(portfolio, s)]));
  const h = settings.sectionHeadings;

  return (
    <>
      <Navigation name={personal.shortName} chapters={settings.chapters} mobileNav={settings.mobileNav} resumeUrl={social.resume.url} />
      <main id="main">
        <Opening personal={personal} startId={settings.chapters[0].id} />
        <Glance data={portfolio} />

        <Chapter id="who" number={ch("who").number} question={ch("who").question}>
          <About about={about} education={education} educationHeading={h.education} />
        </Chapter>

        <Chapter id="build" number={ch("build").number} question={ch("build").question}>
          <ProjectExplorer projects={projects} showUnconfirmed={settings.showUnconfirmedTechnologies} />
          <SubSection id="skills" title={h.skills}>
            <Skills skills={skills} usage={usage} />
          </SubSection>
        </Chapter>

        <Chapter id="think" number={ch("think").number} question={ch("think").question}>
          <p className="-mt-6 max-w-2xl rounded-lg border border-dashed border-ink/30 px-4 py-3 text-muted md:-mt-10">{thinking.disclaimer}</p>
          <SubSection title={thinking.scaling.heading}>
            <ScalingExplorer exercise={thinking.scaling} />
          </SubSection>
          <SubSection title={systemDesign.heading} intro={systemDesign.intro}>
            <NodeGraph data={systemDesign} />
          </SubSection>
        </Chapter>

        <Chapter id="done" number={ch("done").number} question={ch("done").question}>
          <SubSection title={h.experience}>
            <Experience items={experience} />
          </SubSection>
          <SubSection title={h.credentials} intro={h.credentialsIntro}>
            <Credentials certifications={certifications} achievements={achievements} />
          </SubSection>
        </Chapter>

        <Contact headline={contact.headline} body={contact.body} personal={personal} social={social} />
        <Footer name={personal.shortName} lastUpdated={settings.lastUpdated} />
      </main>
    </>
  );
}
