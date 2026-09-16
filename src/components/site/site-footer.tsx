import Link from "next/link";

import { Logo } from "@/components/site/logo";
import { SocialCluster } from "@/components/site/social-cluster";
import { siteConfig } from "@/lib/site-config";

/**
 * Mirrors the header: same height, padding and logo, with the social cluster
 * and a contact button where the nav sits up top.
 */
export function SiteFooter() {
  return (
    <footer className="relative shrink-0 bg-black">
      <div aria-hidden="true" className="h-px w-full bg-white/80" />

      <div className="flex h-16 items-center justify-between px-5 sm:h-[72px] sm:px-8">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="transition-opacity duration-200 hover:opacity-70"
        >
          <Logo className="h-7 w-auto sm:h-8" />
        </Link>

        <div className="flex items-center gap-5 sm:gap-8">
          <SocialCluster />

          <a
            href={siteConfig.socials.email}
            className="border border-white/25 px-4 py-1.5 text-[15px] font-medium text-white/85 transition-colors duration-200 hover:border-white hover:bg-white hover:text-black focus-visible:border-white focus-visible:outline-none"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
