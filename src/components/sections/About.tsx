import type { About as AboutData, Education } from "@/types/portfolio";

export function About({ about, education, educationHeading }: { about: AboutData; education: Education[]; educationHeading: string }) {
  return (
    <div className="space-y-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="max-w-xl font-display text-3xl font-semibold leading-tight md:text-4xl">{about.lead}</p>
          <details className="group mt-6 max-w-xl">
            <summary className="inline-flex min-h-11 cursor-pointer items-center font-medium text-blue underline-offset-4 hover:underline">
              Read the full summary
            </summary>
            <p className="mt-2 text-lg leading-relaxed text-ink/85">{about.summary}</p>
          </details>
        </div>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {about.pillars.map((p) => (
            <div key={p.title} className="border-t-2 border-ink pt-3">
              <dt className="font-display text-lg font-bold">{p.title}</dt>
              <dd className="mt-2 text-muted">
                <ul className="m-0 list-none space-y-1 p-0">
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-label={educationHeading}>
        {education.map((e) => (
          <div key={e.id} className="grid gap-2 border-y border-rule py-6 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-8">
            <h3 className="font-display text-lg font-bold text-muted">{educationHeading}</h3>
            <div>
              <p className="font-display text-2xl font-bold">{e.institution}</p>
              <p className="text-ink/85">{e.degree}</p>
            </div>
            <p className="text-muted md:text-right">
              {e.date}
              {e.score && <span className="block text-ink">{e.score}</span>}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
