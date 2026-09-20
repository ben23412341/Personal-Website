import type { MetadataRoute } from "next";

import { experiences } from "@/lib/experience";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

/**
 * Slugs that exist as routes but are not worth pointing a crawler at. The
 * placeholder project is a single sentence saying something is coming; asking
 * Google to index it spends the site's crawl budget on a page that answers no
 * search.
 */
const EXCLUDED_WORK = new Set(["coming-soon"]);

/**
 * Built from the same arrays the pages are, so a slug can never be listed
 * here that isn't a real route — a sitemap that points at a 404 is worse than
 * no sitemap. Adding a project or an experience adds it here too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteConfig.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((project) => !EXCLUDED_WORK.has(project.slug))
      .map((project) => ({
        url: `${siteConfig.url}/work/${project.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...experiences.map((item) => ({
      url: `${siteConfig.url}/experience/${item.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
