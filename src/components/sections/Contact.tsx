import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import type { Personal, Social } from "@/types/portfolio";

export function Contact({
  headline,
  body,
  personal,
  social,
}: {
  headline: string;
  body: string;
  personal: Personal;
  social: Social;
}) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-0 bg-night py-14 text-paper md:py-24">
      <div className="mx-auto max-w-page px-5 md:px-8">
        <h2 id="contact-title" className="max-w-4xl font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
          {headline}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper/80 sm:mt-8 sm:text-xl">{body}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={social.github.url} label={social.github.label} icon="github" variant="onDark" />
          <ButtonLink href={social.linkedin.url} label={social.linkedin.label} icon="linkedin" variant="onDark" />
          <ButtonLink href={`mailto:${personal.email}`} label="Email" icon="mail" variant="onDark" />
          <ButtonLink href={social.resume.url} label={social.resume.label} icon="file" variant="onDark" />
        </div>

        <ul className="m-0 mt-14 flex list-none flex-col gap-3 border-t border-night-rule p-0 pt-6 text-paper/75 sm:flex-row sm:flex-wrap sm:gap-x-10">
          <li className="flex items-center gap-2">
            <Icon name="mail" />
            <a href={`mailto:${personal.email}`} className="underline-offset-4 hover:underline">
              {personal.email}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Icon name="phone" />
            <a href={`tel:${personal.phone.replace(/\s+/g, "")}`} className="underline-offset-4 hover:underline">
              {personal.phone}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Icon name="pin" />
            {personal.location}
          </li>
        </ul>
      </div>
    </section>
  );
}
