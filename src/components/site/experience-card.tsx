"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Experience } from "@/lib/experience";
import { cn } from "@/lib/utils";

/**
 * Keeps the spotlight idea from the reference card, but tracks the pointer
 * per card rather than from a document-level listener reading viewport
 * coordinates — that version lights every card at once and, because these
 * cards sit under GSAP transforms, positions the highlight in the wrong place
 * entirely. Flat black and a hairline border instead of the glassy blur.
 */
export function ExperienceCard({
  item,
  index,
  className,
}: {
  item: Experience;
  index: number;
  className?: string;
}) {
  const handleMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mx",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--my",
      `${event.clientY - rect.top}px`,
    );
  };

  return (
    <Link
      href={`/experience/${item.slug}`}
      onPointerMove={handleMove}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden border border-white/15 p-5 transition-colors duration-300 hover:border-white/45 focus-visible:border-white focus-visible:outline-none",
        className,
      )}
    >
      {/* Surface. Starts opaque so the stacked pile reads as solid cards, and
          the section animates this down as they spread out. The default here
          is the resting value, for the unanimated layouts. */}
      <span
        data-card-fill
        aria-hidden="true"
        className="absolute inset-0 bg-[#0b0b0b]"
        style={{ opacity: 0.45 }}
      />

      {/* The stacked deck's face. Only ever seen before the cards spread:
          the section animates it out as the real body fades in, and the
          resting default here is the settled value for static layouts. */}
      <span
        data-card-stub
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
        style={{ opacity: 0 }}
      >
        <span className="font-display text-7xl leading-none tracking-tight text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>

      {/* Spotlight — only on the card actually under the pointer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.11), transparent 72%)",
        }}
      />

      <div
        data-card-body
        className="relative flex h-full flex-col"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            {item.period}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
            ({String(index + 1).padStart(2, "0")})
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl leading-[0.95] tracking-tight text-white">
          {item.role}
        </h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
          {item.org}
        </p>

        <p className="mt-3 text-[13px] leading-relaxed text-white/65">
          {item.summary}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium text-white/70 transition-colors duration-300 group-hover:text-white">
          View
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
