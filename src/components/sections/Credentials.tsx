import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Counter } from "@/components/ui/Counter";
import { DotField } from "@/components/ui/DotField";
import { Tag } from "@/components/ui/Tag";
import type { Achievement, Certification } from "@/types/portfolio";

function CertificateCard({ c }: { c: Certification }) {
  const meta = [c.kind, c.category, c.level].filter(Boolean);
  return (
    <article className="grid overflow-hidden rounded-2xl border border-rule bg-panel md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {c.previewImage && (
        <a
          href={c.fileUrl || c.credentialUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block border-b border-rule bg-paper p-4 md:border-b-0 md:border-r"
          aria-label={`Open ${c.title} certificate`}
        >
          <Image
            src={c.previewImage}
            alt={`${c.title} certificate issued by ${c.issuer}`}
            width={990}
            height={765}
            sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 90vw"
            className="h-auto w-full rounded-md border border-rule shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>
      )}
      <div className="flex flex-col justify-between gap-6 p-6">
        <div>
          <p className="font-medium text-muted">{c.issuer}</p>
          <h4 className="mt-1 font-display text-2xl font-bold leading-tight">{c.title}</h4>
          {meta.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {meta.map((m) => (
                <Tag key={m}>{m}</Tag>
              ))}
            </div>
          )}
          {c.description && <p className="mt-4 text-ink/85">{c.description}</p>}
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-rule pt-4">
            <div>
              <dt className="text-sm text-muted">Issued</dt>
              <dd className="font-medium">{c.issued}</dd>
            </div>
            {c.expires && (
              <div>
                <dt className="text-sm text-muted">Expires</dt>
                <dd className="font-medium">{c.expires}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="flex flex-wrap gap-3">
          {c.credentialUrl && <ButtonLink href={c.credentialUrl} label="Verify on Credly" icon="check" variant="solid" />}
          {c.fileUrl && <ButtonLink href={c.fileUrl} label="View certificate" icon="file" />}
        </div>
      </div>
    </article>
  );
}

export function Credentials({ certifications, achievements }: { certifications: Certification[]; achievements: Achievement[] }) {
  return (
    <div className="space-y-8">
      {achievements.map((a) => (
        <section key={a.id} aria-label={a.label} className="grid items-center gap-6 overflow-hidden rounded-xl bg-ink p-6 text-paper md:grid-cols-[auto_1fr] md:gap-10 md:p-8">
          <p className="font-display text-7xl font-extrabold leading-none md:text-8xl">
            <Counter value={a.value} suffix={a.suffix} />
          </p>
          <div>
            <p className="font-display text-xl font-bold sm:text-2xl">{a.label}</p>
            <p className="mt-1 max-w-md text-paper/75">{a.detail}</p>
            <DotField className="mt-6" />
            {a.links && a.links.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-paper/70">Verify on</span>
                {a.links.map((l) => (
                  <ButtonLink key={l.label} href={l.url} label={l.label} icon="arrowUpRight" variant="onDark" />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="grid gap-6">
        {certifications.map((c) => (
          <CertificateCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
