import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * Nothing here is private, so everything is crawlable. The one job this file
 * has beyond that is naming the sitemap: a crawler that arrives without one
 * has to find every page by following links.
 *
 * A `public/robots.txt` would shadow this route, so there must not be one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
