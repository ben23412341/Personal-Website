import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";

import { achievements, type Achievement } from "@/lib/achievements";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** Pages on this site open in place; files and other sites open in a new tab. */
const opensInPlace = (href: string) =>
  href.startsWith("/") && !/\.\w+$/.test(href);

const linkClass =
  "group inline-flex items-center gap-1 text-sm font-medium text-white/75 transition-colors hover:text-white";

function ItemLink({ label, href }: { label: string; href: string }) {
  const arrow = (
    <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  );

  if (opensInPlace(href)) {
    return (
      <Link href={href} className={linkClass}>
        {label}
        {arrow}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {label}
      {arrow}
    </a>
  );
}

/**
 * A slowly turning seal, the section's one moving part and a shape used
 * nowhere else on the site. The ring of text turns (see .seal-turn in
 * globals.css) while the award mark in the middle holds still.
 */
function Seal({ className }: { className?: string }) {
  const phrase = `${siteConfig.name} · Achievements · `;

  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <svg viewBox="0 0 200 200" className="seal-turn absolute inset-0 size-full">
        <defs>
          <path
            id="achievements-seal-ring"
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
          />
        </defs>
        {/* Spaces are kept (whitespace-pre) so the trailing one survives and
            the phrase's end and start don't run together where the ring closes */}
        <text className="fill-white/55 whitespace-pre font-mono text-[13px] uppercase">
          {/* Stretched to the ring's circumference so the phrase closes up evenly */}
          <textPath
            href="#achievements-seal-ring"
            textLength={490}
            lengthAdjust="spacing"
          >
            {phrase.repeat(2)}
          </textPath>
        </text>
      </svg>

      <div className="absolute inset-[24%] grid place-items-center rounded-full border border-white/25">
        <Award strokeWidth={1.25} className="size-[38%] text-white/80" />
      </div>
    </div>
  );
}

/** Consecutive entries that share a year, in the order they are listed. */
function groupByYear(items: Achievement[]) {
  const groups: { year: string; items: Achievement[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last?.year === item.year) last.items.push(item);
    else groups.push({ year: item.year, items: [item] });
  }
  return groups;
}

/**
 * Smaller than the sections above it: no pinned runway and no detail pages,
 * just a ledger grouped by year. On wide screens the heading and seal stay
 * pinned beside the list as it scrolls. It draws no hairlines of its own,
 * because the Experience section's bottom rule sits above it and the footer's
 * top rule below.
 */
export function AchievementsSection() {
  const groups = groupByYear(achievements);

  return (
    <section id="achievements" className="relative bg-black">
      <div className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <header className="flex items-start justify-between gap-6 lg:sticky lg:top-20 lg:flex-col lg:self-start">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-white/50 sm:text-sm">
                ( 04 )&nbsp;&nbsp;ACHIEVEMENTS
              </p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.92] tracking-tight text-white">
                Wins so far.
              </h2>
            </div>

            <Seal className="size-24 shrink-0 sm:size-28 lg:size-36" />
          </header>

          <div className="border-t border-white/15">
            {groups.map((group) => (
              <div
                key={group.year}
                className="grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8"
              >
                {/* Outlined years, where every other section fills its type */}
                <h3
                  className="font-display text-4xl leading-none text-transparent sm:text-5xl"
                  style={{ WebkitTextStroke: "1px rgb(255 255 255 / 0.45)" }}
                >
                  {group.year}
                </h3>

                {/* Two columns only from 2xl: below that the longest titles
                    would wrap, and one clean column reads better */}
                <ul className="grid gap-x-10 gap-y-4 2xl:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item.title} className="min-w-0">
                      <p className="text-[15px] font-medium leading-snug text-white/90">
                        {item.title}
                      </p>

                      {(item.detail || item.links) && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                          {item.detail && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                              {item.detail}
                            </span>
                          )}
                          {item.links?.map((link) => (
                            <ItemLink key={link.href} {...link} />
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
