import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { cn } from "@/lib/utils";
import { getProject, projects, statusLabel } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: `Not found — ${siteConfig.name}` };

  return {
    title: `${project.title} — ${siteConfig.name}`,
    description: project.summary,
  };
}

function Rule() {
  return <div aria-hidden="true" className="h-px w-full bg-white/80" />;
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const related = project.related
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((item) => item !== undefined);

  const Icon = project.icon;

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-black">
      <SiteHeader />
      <Rule />

      <article className="flex-1">
        {/* Title block */}
        <div className="px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to work
          </Link>

          <div className="mt-10 flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-full border border-white/40 text-white">
              <Icon className="size-4" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              {project.category} · {project.year} ·{" "}
              {statusLabel[project.status]}
            </span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.85] tracking-tight text-white">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {project.summary}
          </p>
        </div>

        <Rule />

        {/* Write-up, then skills, then links — three columns once there is
            room for them, stacked in that same order before there is. */}
        <div className="grid gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:gap-x-12 xl:gap-x-16">
          <div className="max-w-[34rem] space-y-6">
            {project.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-white/75 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right-hand column: skills and links side by side, evidence below */}
          <div className="space-y-12">
            <div className="grid gap-8 sm:grid-cols-[1.55fr_1fr] sm:gap-10">
              {project.stack.length > 0 && (
                <aside>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Skills learned / used
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((tool) => (
                      <li
                        key={tool}
                        className="border border-white/15 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white/60"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              {project.links && project.links.length > 0 && (
                <aside>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Links
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-start gap-1.5 text-sm font-medium leading-snug text-white/80 transition-colors hover:text-white"
                        >
                          {link.label}
                          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>

            {/* Two up only past two images, so a wide banner beside a tall
                portrait does not leave half a row empty. */}
            {project.images && project.images.length > 0 && (
              <ul
                className={cn(
                  "grid gap-5 lg:max-w-[60rem]",
                  project.images.length > 2 && "sm:grid-cols-2 sm:gap-6",
                )}
              >
                {project.images.map((image) => (
                  <li key={image.src}>
                    <figure>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        quality={90}
                        sizes={
                          project.images!.length > 2
                            ? "(max-width: 1024px) 50vw, 30rem"
                            : "(max-width: 1024px) 100vw, 60rem"
                        }
                        className="h-auto w-full border border-white/10"
                      />
                      {image.caption && (
                        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <>
            <Rule />
            <div className="px-5 py-12 sm:px-8 sm:py-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Related work
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/work/${item.slug}`}
                    className="group border border-white/15 p-6 transition-colors duration-300 hover:border-white/50"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                      {item.category} · {item.year}
                    </span>
                    <h2 className="mt-3 font-display text-3xl leading-none tracking-tight text-white">
                      {item.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/60">
                      {item.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
                      View project
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
