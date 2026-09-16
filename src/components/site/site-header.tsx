"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { SocialCluster, SocialRow } from "@/components/site/social-cluster";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const { nav } = siteConfig;
  const lastIndex = nav.length - 1;

  return (
    <header className="relative z-20 shrink-0 bg-black">
      <div className="flex h-16 items-center justify-between px-5 sm:h-[72px] sm:px-8">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="transition-opacity duration-200 hover:opacity-70"
        >
          <Logo className="h-7 w-auto sm:h-8" />
        </Link>

        {/* Desktop navigation. Plain anchors: the Lenis provider intercepts
            same-page hashes and eases the scroll. */}
        <nav className="hidden items-center gap-8 lg:gap-11 md:flex">
          {nav.map((item, i) => (
            <React.Fragment key={item.href}>
              {i === lastIndex && <SocialCluster />}
              <a
                href={item.href}
                className="group relative text-[15px] font-medium text-white/85 transition-colors duration-200 hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </React.Fragment>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-9 place-items-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:border-white md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-white/15 bg-black px-5 pb-6 pt-4 md:hidden"
        >
          <nav className="flex flex-col">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 text-lg font-medium text-white/85 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <SocialRow className="pt-5" />
        </div>
      )}
    </header>
  );
}
