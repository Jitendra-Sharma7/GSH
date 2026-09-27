import type { MetadataRoute } from "next";

/**
 * The site had no robots.txt. This adds one and keeps the routes that should
 * never be crawled out of it: the JSON API, the staff panel, and the account
 * pages behind a session.
 *
 * No sitemap is advertised without a matching one being generated, so
 * `/sitemap.xml` is pointed at below: it is built from the same published rows
 * the public pages read, so it can never list a draft or a deleted record.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // JSON API: gated by proxy, and nothing here is for crawlers
          "/admin/", // staff panel
          "/auth/", // login and registration
          "/dashboard",
          "/tracker",
          "/compare",
        ],
      },
    ],
    sitemap: `${(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "")}/sitemap.xml`,
  };
}
