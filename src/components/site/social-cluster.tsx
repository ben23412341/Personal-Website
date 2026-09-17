import * as React from "react";
import { Mail } from "lucide-react";

import {
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  YoutubeIcon,
} from "@/components/site/brand-icons";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type SocialLink = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const links: SocialLink[] = [
  { href: siteConfig.socials.github, label: "GitHub", Icon: GithubIcon },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: siteConfig.socials.medium, label: "Medium", Icon: MediumIcon },
  { href: siteConfig.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: siteConfig.socials.email, label: "Email", Icon: Mail },
];

const isExternal = (href: string) => !href.startsWith("mailto:");

/** Compact badge of social links. Three across keeps five on two rows. */
export function SocialCluster({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-3 gap-1.5", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={isExternal(href) ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={label}
            className="grid size-6 shrink-0 place-items-center rounded-full border border-white/25 text-white/70 transition-colors duration-200 hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white focus-visible:outline-none"
          >
            <Icon className="size-3" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Same links in a single row — used in the mobile menu. */
export function SocialRow({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={isExternal(href) ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={label}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/25 text-white/70 transition-colors duration-200 hover:border-white hover:text-white"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
