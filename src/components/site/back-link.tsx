"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  rememberedScroll,
  requestScrollRestore,
} from "@/components/site/smooth-scroll-provider";

/**
 * Back to the home page, landing on the exact spot the viewer left rather
 * than at the top of the section they left from — going back should undo the
 * trip, not restart it.
 *
 * The `href` anchor is the fallback, and does the right thing for anyone who
 * arrived here cold: a search result, a shared link, or no JavaScript at all.
 */
export function BackLink({
  hash,
  children,
}: {
  /** Section to fall back to, as a hash — `#work`. */
  hash: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Link
      href={`/${hash}`}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        const y = rememberedScroll("/");
        if (y === undefined) return;

        event.preventDefault();
        requestScrollRestore(y);
        router.push("/");
      }}
      className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
    >
      <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
}
