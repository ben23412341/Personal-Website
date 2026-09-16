"use client";

import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Anchor down to the next section. The app-wide Lenis provider intercepts the
 * hash link and eases the scroll, so no click handler is needed here.
 */
export function ScrollCue({
  targetId,
  label = "Scroll",
  className,
}: {
  targetId: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "group inline-flex shrink-0 items-center gap-3 text-white/60 transition-colors duration-200 hover:text-white",
        className,
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
        {label}
      </span>
      <span className="grid size-10 place-items-center rounded-full border border-white/25 transition-colors duration-200 group-hover:border-white">
        <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      </span>
    </a>
  );
}
