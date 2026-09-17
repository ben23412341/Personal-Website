import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { BackLink } from "@/components/site/back-link";
import { SiteHeader } from "@/components/site/site-header";
import { experiences, getExperience } from "@/lib/experience";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return experiences.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/experience/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getExperience(slug);

  if (!item) return { title: `Not found — ${siteConfig.name}` };

  return {
    title: `${item.role} — ${siteConfig.name}`,
    description: item.summary,
  };
}

function Rule() {
  return <div aria-hidden="true" className="h-px w-full bg-white/80" />;
}

export default async function ExperiencePage({
  params,
}: PageProps<"/experience/[slug]">) {
  const { slug } = await params;
  const item = getExperience(slug);

  if (!item) notFound();

  const index = experiences.findIndex((e) => e.slug === slug);
  const others = experiences.filter((e) => e.slug !== slug).slice(0, 2);

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-black">
      <SiteHeader />
      <Rule />

      <article className="flex-1">
        <div className="px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
          <BackLink hash="#experience">Back to experience</BackLink>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            ( {String(index + 1).padStart(2, "0")} ) · {item.period} ·{" "}
            {item.org}
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.85] tracking-tight text-white">
            {item.role}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {item.summary}
          </p>
        </div>

        <Rule />

        <div className="grid gap-12 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
          <div className="max-w-2xl space-y-6">
            {item.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-white/75 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <aside className="space-y-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Highlights
              </p>
              <ul className="mt-3 space-y-2">
                {item.highlights.map((line) => (
                  <li
                    key={line}
                    className="border-l border-white/20 pl-3 text-sm leading-relaxed text-white/70"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {item.stack.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  Skills learned / used
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.stack.map((tool) => (
                    <li
                      key={tool}
                      className="border border-white/15 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white/60"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.links && item.links.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  Links
                </p>
                <ul className="mt-3 space-y-2.5">
                  {item.links.map((link) => {
                    // Pages on this site open in place; anything else opens
                    // in a new tab.
                    const external = !link.href.startsWith("/");

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                          className="group inline-flex items-start gap-1.5 text-sm font-medium leading-snug text-white/80 transition-colors hover:text-white"
                        >
                          {link.label}
                          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {others.length > 0 && (
          <>
            <Rule />
            <div className="px-5 py-12 sm:px-8 sm:py-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Elsewhere on the timeline
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {others.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/experience/${other.slug}`}
                    className="group border border-white/15 p-6 transition-colors duration-300 hover:border-white/50"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                      {other.period} · {other.org}
                    </span>
                    <h2 className="mt-3 font-display text-3xl leading-none tracking-tight text-white">
                      {other.role}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {other.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
                      View
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
